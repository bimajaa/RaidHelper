require('dotenv').config();

const { REST, Routes } = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;

if (!token || !clientId) {
    console.error('❌ DISCORD_TOKEN dan CLIENT_ID wajib ada di .env');
    process.exit(1);
}

const commands = [];

const commandsPath = path.join(__dirname, 'commands');

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    try {
        const command = require(path.join(commandsPath, file));

        if (command.data) {
            commands.push(command.data.toJSON());
        } else {
            console.warn(`⚠️ ${file} tidak memiliki command.data`);
        }
    } catch (error) {
        console.error(`❌ Gagal membaca ${file}:`);
        console.error(error);
        process.exit(1);
    }
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