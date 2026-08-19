require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const { translateIdToEn, translateEnToId } = require('./lib/i18n');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
    console.error('❌ DISCORD_TOKEN dan CLIENT_ID wajib ada di .env');
    process.exit(1);
}

const commands = [];

function localizeCommandNode(node) {
    if (!node || typeof node !== 'object') return node;

    if (typeof node.description === 'string') {
        node.description_localizations = {
            id: translateEnToId(node.description).slice(0, 100),
            "en-US": translateIdToEn(node.description).slice(0, 100)
        };
    }

    // Discord allows localized choice names and option/subcommand descriptions.
    if (Array.isArray(node.choices)) {
        for (const choice of node.choices) {
            if (typeof choice.name === 'string') {
                choice.name_localizations = {
                    id: translateEnToId(choice.name).slice(0, 100),
                    "en-US": translateIdToEn(choice.name).slice(0, 100)
                };
            }
        }
    }

    for (const key of ['options']) {
        if (Array.isArray(node[key])) {
            node[key].forEach(localizeCommandNode);
        }
    }

    return node;
}

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));

        if (command.data) {
            commands.push(localizeCommandNode(command.data.toJSON()));
        } else {
            console.warn(`⚠️ ${file} tidak memiliki command.data`);
        }
    } catch (error) {
        console.error(`❌ Gagal membaca ${file}:`);
        console.error(error);
        process.exit(1);
    }
}


function validateCommands(commandList) {
    const errors = [];
    for (const command of commandList) {
        if (!command.description) errors.push(`${command.name}: missing description`);
        if (command.description_localizations?.["en-US"] === undefined) errors.push(`${command.name}: missing en-US description localization`);
        for (const option of command.options || []) {
            if ((option.type === 1 || option.type === 2) && !option.description) errors.push(`${command.name}.${option.name}: missing description`);
            if ((option.type === 1 || option.type === 2) && option.description_localizations?.["en-US"] === undefined) errors.push(`${command.name}.${option.name}: missing en-US description localization`);
            for (const choice of option.choices || []) {
                if (!choice.name_localizations?.["en-US"]) errors.push(`${command.name}.${option.name}.${choice.name}: missing en-US choice localization`);
            }
        }
    }
    if (errors.length) {
        console.error('❌ Command localization validation failed:');
        for (const error of errors) console.error(` - ${error}`);
        process.exit(1);
    }
    console.log(`✅ Command localization validation passed: ${commandList.length} command(s).`);
}

if (process.argv.includes('--check')) {
    validateCommands(commands);
    process.exit(0);
}

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log(`🔄 Registering ${commands.length} GLOBAL command(s)...`);

        await rest.put(
            Routes.applicationCommands(clientId),
            {
                body: commands
            }
        );

        console.log('✅ Global slash commands registered!');
        console.log(`📋 Total commands: ${commands.length}`);
        console.log('🌍 Commands tersedia di semua server tempat bot di-install.');
        console.log('⏳ Command global dapat membutuhkan waktu untuk muncul di Discord.');
    } catch (error) {
        console.error('❌ Gagal register global slash commands:');
        console.error(error);
        process.exit(1);
    }
})();