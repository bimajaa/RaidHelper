const {
  Client,
  GatewayIntentBits,
  Collection,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags
} = require("discord.js");

const fs = require("node:fs");
const path = require("node:path");

require("dotenv").config();

const {
  loadData,
  saveData
} = require("./lib/store");

const {
  getSalaryDashboard,
  setSalaryDashboard,
  listGuildParties,
  migrateLegacySalaryDashboards
} = require("./lib/scope");

const {
  buildSalaryEmbed
} = require("./lib/dashboard");

const {
  calculateSalary
} = require("./lib/salary");

const {
  buildPartyEmbed,
  buildPartyComponents,
  createParty
} = require("./lib/party");

const {
  handlePartyInteraction
} = require("./handlers/partyInteractions");

const {
  ensureLuckyZoneSettings,
  buildLuckyZoneEmbed
} = require("./lib/luckyzone");

const {
  patchInteraction,
  patchChannel,
  patchMessage,
  guildLanguage,
  t
} = require("./lib/i18n");


/*
==================================================
DISCORD CLIENT
==================================================
*/

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ]
});


/*
==================================================
LOAD COMMANDS
==================================================
*/

const commands = new Collection();

const commandFiles =
  fs
    .readdirSync(
      path.join(
        __dirname,
        "commands"
      )
    )
    .filter(
      file =>
        file.endsWith(".js")
    );

for (const file of commandFiles) {

  const command =
    require(
      `./commands/${file}`
    );

  if (
    command &&
    command.data &&
    command.data.name
  ) {
    commands.set(
      command.data.name,
      command
    );
  }

}


/*
==================================================
PARTY LIST EMBED
==================================================
*/

function buildPartyListEmbed(
  parties
) {

  const embed =
    new EmbedBuilder()
      .setTitle(
        "⚔️ ACTIVE RAID PARTIES"
      )
      .setColor(
        0x5865f2
      );


  for (
    const party of parties.slice(
      0,
      10
    )
  ) {

    const members =
      Object.values(
        party.slots || {}
      ).filter(
        Boolean
      ).length;


    embed.addFields({
      name:
        `${party.name} • ${party.nest}`,

      value:
        `Status: **${party.status}**\n` +
        `Members: **${members}/${party.maxSlots}**\n` +
        `Creator: <@${party.creatorId}>\n` +
        `ID: \`${party.id}\``
    });

  }


  if (!parties.length) {

    embed.setDescription(
      "Tidak ada raid party aktif."
    );

  }


  return embed;
}


/*
==================================================
UPDATE SALARY DASHBOARD
==================================================

Dashboard berdasarkan THREAD ID.

Pemanggilan:

updateSalaryDashboard(
  guild,
  threadId
)

==================================================
*/

async function updateSalaryDashboard(
  guild,
  threadId
) {

  if (!guild) {

    console.error(
      "❌ updateSalaryDashboard: guild tidak diberikan."
    );

    return null;
  }


  /*
  ================================================
  LOAD DATA
  ================================================
  */

  const data =
    loadData(guild.id);

  migrateLegacySalaryDashboards(data);


  /*
  ================================================
  PASTIKAN salaryDashboards ADA
  ================================================
  */

  if (!data.salaryDashboards) {

    data.salaryDashboards = {};

    saveData(
      data,
      guild.id
    );

  }


  /*
  ================================================
  THREAD ID WAJIB ADA
  ================================================
  */

  if (!threadId) {

    console.error(
      "❌ updateSalaryDashboard: threadId tidak diberikan."
    );

    return null;
  }


  /*
  ================================================
  AMBIL DASHBOARD THREAD
  ================================================
  */

  const dashboard =
    getSalaryDashboard(
      data,
      guild.id,
      threadId
    );


  /*
  ================================================
  DASHBOARD TIDAK ADA
  ================================================
  */

  if (!dashboard) {

    console.error(
      `❌ Salary dashboard untuk Thread ${threadId} tidak ditemukan.`
    );

    return null;
  }


  /*
  ================================================
  FETCH THREAD
  ================================================
  */

  const thread =
    await guild.channels
      .fetch(threadId)
      .catch(
        () => null
      );

  patchChannel(thread);


  /*
  ================================================
  THREAD TIDAK DITEMUKAN
  ================================================
  */

  if (!thread) {

    console.error(
      `❌ Thread ${threadId} tidak ditemukan.`
    );

    return null;
  }


  /*
  ================================================
  CEK TEXT BASED
  ================================================
  */

  if (!thread.isTextBased()) {

    console.error(
      `❌ Thread ${threadId} bukan text-based channel.`
    );

    return null;
  }


  /*
  ================================================
  BUILD EMBED
  ================================================
  */

  const payload = {
    embeds: [
      buildSalaryEmbed(
        dashboard,
        guild.id
      )
    ],
    components: [
      new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId(`party:hostguide:${dashboard.partyId || "none"}:${threadId}`)
          .setLabel(t(guildLanguage(guild.id), "guide_button"))
          .setEmoji("📖")
          .setStyle(ButtonStyle.Secondary)
      )
    ]
  };


  /*
  ================================================
  AMBIL MESSAGE DASHBOARD
  ================================================
  */

  let message = null;


  if (
    dashboard.messageId
  ) {

    message =
      await thread.messages
        .fetch(
          dashboard.messageId
        )
        .catch(
          () => null
        );

    patchMessage(message);

  }


  /*
  ================================================
  EDIT DASHBOARD LAMA
  ================================================
  */

  if (message) {

    try {

      await message.edit(
        payload
      );

      dashboard.updatedAt =
        Date.now();

      saveData(
        data,
        guild.id
      );

      return message;

    } catch (error) {

      // Message can disappear between fetch() and edit().
      // Treat it exactly like a missing dashboard message and recreate it.
      console.warn(
        `⚠️ Salary Dashboard message ${dashboard.messageId} tidak bisa diedit; membuat ulang.`
      );

      dashboard.messageId =
        null;

      message =
        null;
    }
  }


  /*
  ================================================
  DASHBOARD BELUM ADA / MESSAGE TERHAPUS
  ================================================
  */

  try {

    message =
      await thread.send(
        payload
      );

  } catch (error) {

    console.error(
      "❌ Gagal membuat ulang Salary Dashboard:",
      error
    );

    // Keep the ID empty so the next update will retry cleanly.
    dashboard.messageId =
      null;

    saveData(
      data,
      guild.id
    );

    throw error;
  }

  patchMessage(message);


  /*
  ================================================
  SIMPAN MESSAGE ID BARU
  ================================================
  */

  dashboard.messageId =
    message.id;

  dashboard.updatedAt =
    Date.now();


  saveData(
    data,
    guild.id
  );


  return message;
}


/*
==================================================
CONTEXT
==================================================
*/

async function updateLuckyZone(guild, options = {}) {
  if (!guild) return null;

  const data = loadData(guild.id);
  const settings = ensureLuckyZoneSettings(data);

  if (!settings.enabled || !settings.channelId) {
    return null;
  }

  const channel = await guild.channels.fetch(settings.channelId).catch(() => null);
  patchChannel(channel);
  if (!channel || !channel.isTextBased()) {
    console.error(`❌ LuckyZone channel ${settings.channelId} tidak ditemukan.`);
    return null;
  }

  const now = new Date();
  const embed = buildLuckyZoneEmbed(now, settings, guild.id);

  // LuckyZone menggunakan pesan BARU setiap kali reset harian.
  // Tidak lagi mengedit pesan lama, sehingga histori rotasi tetap terlihat.
  const schedule = require('./lib/luckyzone').getTodaySchedule(now, settings);
  const force = options.force === true;

  // Untuk scheduler, cegah duplikasi pada menit yang sama / restart bot.
  // Untuk setup dan /luckyzone now, force=true sehingga selalu membuat pesan baru.
  if (!force && settings.lastPublishedBusinessDate === schedule.businessDateKey) {
    return null;
  }

  const payload = {
    content: '🍀 **LuckyZone Reset!** LuckyZone hari ini sudah diperbarui.',
    embeds: [embed],
    allowedMentions: { parse: [] }
  };

  const message = await channel.send(payload);

  settings.messageId = message.id;
  settings.lastPublishedBusinessDate = schedule.businessDateKey;
  settings.updatedAt = Date.now();
  saveData(data, guild.id);
  return message;
}

function getJakartaMinuteKey(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = {};
  for (const part of parts) values[part.type] = part.value;
  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}`;
}

let luckyZoneSchedulerRunning = false;

async function runLuckyZoneScheduler() {
  if (luckyZoneSchedulerRunning) return;
  luckyZoneSchedulerRunning = true;

  try {
    const now = new Date();
    const minuteKey = getJakartaMinuteKey(now);

    for (const guild of client.guilds.cache.values()) {
      const data = loadData(guild.id);
      const settings = ensureLuckyZoneSettings(data);

      if (!settings.enabled || !settings.channelId) continue;

      // Cek berdasarkan business date LuckyZone, bukan hanya menit 08:00.
      // Ini membuat reset tetap terkirim jika bot sempat offline saat tepat 08:00.
      const { getTodaySchedule } = require('./lib/luckyzone');
      const schedule = getTodaySchedule(now, settings);

      if (settings.lastPublishedBusinessDate !== schedule.businessDateKey) {
        await updateLuckyZone(guild);
      }

      // Simpan menit scheduler untuk kompatibilitas data lama.
      const latestData = loadData(guild.id);
      const latestSettings = ensureLuckyZoneSettings(latestData);
      latestSettings.lastSchedulerMinute = minuteKey;
      saveData(latestData, guild.id);
    }
  } catch (error) {
    console.error("❌ LuckyZone scheduler error:", error);
  } finally {
    luckyZoneSchedulerRunning = false;
  }
}

function createContext(
  guildId
) {

  const data =
    loadData(
      guildId
    );


  const guildSaveData =
    value =>
      saveData(
        value,
        guildId
      );


  return {

    data,

    saveData:
      guildSaveData,

    updateSalaryDashboard,

    calculateSalary,

    buildSalarySummary:
      calculateSalary,

    updateLuckyZone,

    createPartyMessage: {

      create:
        createParty,

      render:
        async party => ({
          embeds: [
            buildPartyEmbed(
              party
            )
          ],

          components:
            buildPartyComponents(
              party
            )
        })

    },

    buildPartyListEmbed,

    listGuildParties:
      value =>
        listGuildParties(
          value,
          guildId
        )

  };
}


/*
==================================================
BOT READY
==================================================
*/

client.once(
  "clientReady",
  async () => {

    /*
    ==============================================
    INITIALIZE DATABASE PER SERVER
    ==============================================
    */

    for (
      const guild of
      client.guilds.cache.values()
    ) {

      try {

        loadData(
          guild.id
        );

      } catch (error) {

        console.error(
          `❌ Gagal menyiapkan database server ${guild.id}:`,
          error
        );

      }

    }


    console.log(
      `✅ Logged in as ${client.user.tag}`
    );


    console.log(
      `📦 Loaded ${commands.size} slash command(s).`
    );

    // Refresh configured LuckyZone channels on startup.
    for (const guild of client.guilds.cache.values()) {
      try {
        const data = loadData(guild.id);
        const settings = ensureLuckyZoneSettings(data);
        if (settings.enabled && settings.channelId) {
          await updateLuckyZone(guild);
        }
      } catch (error) {
        console.error(`❌ Gagal update LuckyZone saat startup (${guild.id}):`, error.message);
      }
    }

    // 1-minute scheduler; actual reset is always 08:00 WIB.
    setInterval(runLuckyZoneScheduler, 60 * 1000);
    runLuckyZoneScheduler();

  }
);


/*
==================================================
DASHBOARD / DROP LIST MESSAGE DELETE RECOVERY
==================================================
*/

client.on(
  "messageDelete",
  async message => {

    try {

      if (!message?.guildId || !message?.id) {
        return;
      }

      const data =
        loadData(message.guildId);

      let changed = false;

      for (const dashboard of Object.values(data.salaryDashboards || {})) {

        if (!dashboard) continue;

        if (
          String(dashboard.guildId || "") !==
          String(message.guildId)
        ) {
          continue;
        }

        if (
          dashboard.messageId &&
          String(dashboard.messageId) ===
          String(message.id)
        ) {

          dashboard.messageId =
            null;

          dashboard.updatedAt =
            Date.now();

          changed = true;
        }

        if (
          dashboard.dropListMessageId &&
          String(dashboard.dropListMessageId) ===
          String(message.id)
        ) {

          dashboard.dropListMessageId =
            null;

          dashboard.updatedAt =
            Date.now();

          changed = true;
        }
      }

      if (changed) {

        saveData(
          data,
          message.guildId
        );

        console.log(
          `♻️ Message dashboard/drop list ${message.id} dihapus; ID lama di-reset agar bisa dibuat ulang.`
        );
      }

    } catch (error) {

      console.error(
        "❌ Gagal menangani penghapusan dashboard/drop list:",
        error
      );
    }
  }
);


/*
==================================================
INTERACTION CREATE
==================================================
*/

client.on(
  "interactionCreate",
  async interaction => {

    patchInteraction(interaction);

    try {

      /*
      ============================================
      MODAL SUBMIT
      ============================================
      */

      if (
        interaction.isModalSubmit()
      ) {

        /*
        ------------------------------------------
        PARTY EDIT MODAL
        ------------------------------------------
        */

        if (
          interaction.customId &&
          interaction.customId.startsWith("party:edit:")
        ) {

          if (!interaction.guildId) {
            await interaction.reply({
              content: "❌ Modal party hanya dapat digunakan di server Discord.",
              ephemeral: true
            });
            return;
          }

          const partyCommand = commands.get("party");

          if (
            !partyCommand ||
            typeof partyCommand.handleModalSubmit !== "function"
          ) {
            await interaction.reply({
              content: "❌ Handler Edit Party tidak ditemukan.",
              ephemeral: true
            });
            return;
          }

          await partyCommand.handleModalSubmit(
            interaction,
            createContext(interaction.guildId)
          );
          return;
        }

        /*
        ------------------------------------------
        DROP BULK ADD
        ------------------------------------------
        */

        if (
          interaction.customId ===
          "drop:bulk"
        ) {

          /*
          ----------------------------------------
          PASTIKAN DI SERVER
          ----------------------------------------
          */

          if (
            !interaction.guildId
          ) {

            await interaction.reply({

              content:
                "❌ Modal ini hanya dapat digunakan di server Discord.",

              ephemeral:
                true

            });

            return;
          }


          /*
          ----------------------------------------
          AMBIL COMMAND DROP
          ----------------------------------------
          */

          const command =
            commands.get(
              "drop"
            );


          /*
          ----------------------------------------
          VALIDASI HANDLER MODAL
          ----------------------------------------
          */

          if (
            !command ||
            typeof command.handleModalSubmit !==
              "function"
          ) {

            console.error(
              "❌ Handler drop.handleModalSubmit tidak ditemukan."
            );


            await interaction.reply({

              content:
                "❌ Handler `/drop bulk` tidak ditemukan di bot.",

              ephemeral:
                true

            });

            return;
          }


          /*
          ----------------------------------------
          CREATE SERVER CONTEXT
          ----------------------------------------
          */

          const context =
            createContext(
              interaction.guildId
            );


          /*
          ----------------------------------------
          JALANKAN HANDLER MODAL
          ----------------------------------------
          */

          await command.handleModalSubmit(
            interaction,
            context
          );


          return;
        }


        /*
        ------------------------------------------
        SOLD BULK ADD
        ------------------------------------------
        */

        if (interaction.customId?.startsWith("sold:bulk_gold:")) {

          if (!interaction.guildId) {
            await interaction.reply({
              content: "❌ Modal ini hanya dapat digunakan di server Discord.",
              ephemeral: true
            });
            return;
          }

          const command = commands.get("sold");

          if (!command || typeof command.handleModalSubmit !== "function") {
            console.error("❌ Handler sold.handleModalSubmit tidak ditemukan.");
            await interaction.reply({
              content: "❌ Handler `/sold bulk` tidak ditemukan di bot.",
              ephemeral: true
            });
            return;
          }

          const context = createContext(interaction.guildId);
          await command.handleModalSubmit(interaction, context);
          return;
        }


        /*
        ------------------------------------------
        PARTY EDIT MODAL
        ------------------------------------------
        */

        if (interaction.customId?.startsWith("party:edit:") || interaction.customId?.startsWith("party:edittitle:")) {
          if (!interaction.guildId) {
            await interaction.reply({
              content: "❌ Modal ini hanya dapat digunakan di server Discord.",
              ephemeral: true
            });
            return;
          }

          const command = commands.get("party");

          if (!command || typeof command.handleModalSubmit !== "function") {
            await interaction.reply({
              content: "❌ Handler `/party edit` tidak ditemukan di bot.",
              ephemeral: true
            });
            return;
          }

          const context = createContext(interaction.guildId);
          await command.handleModalSubmit(interaction, context);
          return;
        }


        /*
        ------------------------------------------
        MODAL TIDAK DIKENAL
        ------------------------------------------
        */

        console.warn(
          `⚠️ Modal tidak dikenal: ${interaction.customId}`
        );

        return;
      }


      /*
      ============================================
      SOLD BULK — USER SELECT / CANCEL
      ============================================
      */

      if (interaction.isUserSelectMenu()) {
        if (interaction.customId && interaction.customId.startsWith("drop:bulk_stamper:")) {
          if (!interaction.guildId) return;

          const parts = interaction.customId.split(":");
          const token = parts[2];
          const index = parts[3];
          const command = commands.get("drop");

          if (!command || typeof command.handleStamperSelect !== "function") {
            await interaction.reply({
              content: "❌ Handler pemilihan stamper Drop tidak ditemukan.",
              ephemeral: true
            });
            return;
          }

          await command.handleStamperSelect(
            interaction,
            token,
            index,
            createContext(interaction.guildId)
          );
          return;
        }

        if (interaction.customId && interaction.customId.startsWith("sold:bulk_stamper:")) {
          if (!interaction.guildId) return;

          const parts = interaction.customId.split(":");
          const token = parts[2];
          const index = parts[3];
          const command = commands.get("sold");

          if (!command || typeof command.handleStamperSelect !== "function") {
            await interaction.reply({
              content: "❌ Handler pemilihan stamper tidak ditemukan.",
              ephemeral: true
            });
            return;
          }

          await command.handleStamperSelect(
            interaction,
            token,
            index,
            createContext(interaction.guildId)
          );
          return;
        }
      }

      /*
      ============================================
      SOLD BULK — ITEM SELECT MENU
      ============================================
      */

      if (interaction.isStringSelectMenu() && interaction.customId?.startsWith("sold:bulk_select:")) {
        if (!interaction.guildId) return;

        const token = interaction.customId.split(":")[2];
        const command = commands.get("sold");
        const language = guildLanguage(interaction.guildId);

        if (!command || typeof command.handleBulkSoldSelection !== "function") {
          await interaction.reply({
            content: t(language, "sold_bulk_handler_missing"),
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        try {
          await command.handleBulkSoldSelection(
            interaction,
            token,
            interaction.values || [],
            createContext(interaction.guildId)
          );
        } catch (error) {
          console.error("❌ Error handler sold:bulk_select:", error);
          if (!interaction.replied && !interaction.deferred) {
            await interaction.reply({
              content: t(language, "sold_bulk_handler_error"),
              flags: MessageFlags.Ephemeral
            }).catch(() => {});
          }
        }
        return;
      }


      if (interaction.isButton()) {
        if (interaction.customId && interaction.customId.startsWith("drop:bulk_cancel:")) {
          if (!interaction.guildId) return;

          const token = interaction.customId.split(":")[2];
          const command = commands.get("drop");

          if (!command || typeof command.handleBulkCancel !== "function") {
            await interaction.reply({
              content: "❌ Handler pembatalan bulk Drop tidak ditemukan.",
              ephemeral: true
            });
            return;
          }

          await command.handleBulkCancel(interaction, token);
          return;
        }

        if (interaction.customId && interaction.customId.startsWith("sold:bulk_cancel:")) {
          if (!interaction.guildId) return;

          const token = interaction.customId.split(":")[2];
          const command = commands.get("sold");

          if (!command || typeof command.handleBulkCancel !== "function") {
            await interaction.reply({
              content: "❌ Handler pembatalan bulk sold tidak ditemukan.",
              ephemeral: true
            });
            return;
          }

          await command.handleBulkCancel(interaction, token);
          return;
        }
      }




      /*
      ============================================
      PARTY BUTTON / SELECT MENU
      ============================================
      */

      if (
        interaction.isButton() ||
        interaction.isUserSelectMenu() ||
        interaction.isStringSelectMenu()
      ) {

        /*
        ------------------------------------------
        HANYA PARTY INTERACTION
        ------------------------------------------
        */

        if (
          interaction.customId &&
          interaction.customId.startsWith(
            "party:"
          )
        ) {

          if (
            !interaction.guildId
          ) {

            return;
          }


          const context =
            createContext(
              interaction.guildId
            );


          await handlePartyInteraction(
            interaction,
            context
          );

        }


        return;
      }


      /*
      ============================================
      SLASH COMMAND
      ============================================
      */

      if (
        !interaction.isChatInputCommand()
      ) {

        return;
      }


      /*
      ============================================
      FIND COMMAND
      ============================================
      */

      const command =
        commands.get(
          interaction.commandName
        );


      if (!command) {

        if (
          interaction.replied ||
          interaction.deferred
        ) {

          await interaction.followUp({

            content:
              "❌ Command tidak ditemukan.",

            ephemeral:
              true

          });

        } else {

          await interaction.reply({

            content:
              "❌ Command tidak ditemukan.",

            ephemeral:
              true

          });

        }

        return;
      }


      /*
      ============================================
      COMMAND HANYA UNTUK SERVER
      ============================================
      */

      if (
        !interaction.guildId
      ) {

        await interaction.reply({

          content:
            "❌ Command ini hanya dapat digunakan di server Discord.",

          ephemeral:
            true

        });

        return;
      }


      /*
      ============================================
      CREATE SERVER CONTEXT
      ============================================
      */

      const context =
        createContext(
          interaction.guildId
        );


      /*
      ============================================
      EXECUTE COMMAND
      ============================================
      */

      if (
        typeof command.execute !==
        "function"
      ) {

        throw new Error(
          `Command /${interaction.commandName} tidak memiliki execute()`
        );

      }


      await command.execute(
        interaction,
        context
      );

    } catch (error) {

      /*
      ============================================
      LOG ERROR
      ============================================
      */

      console.error(
        "Interaction error:",
        error
      );


      /*
      ============================================
      ERROR RESPONSE
      ============================================
      */

      const message = {

        content:
          "❌ Terjadi error saat menjalankan command/interaksi.",

        ephemeral:
          true

      };


      /*
      ============================================
      JIKA SUDAH REPLY / DEFERRED
      ============================================
      */

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        await interaction
          .followUp(
            message
          )
          .catch(
            () => {}
          );

      } else {

        await interaction
          .reply(
            message
          )
          .catch(
            () => {}
          );

      }

    }

  }
);


/*
==================================================
UNHANDLED REJECTION
==================================================
*/

process.on(
  "unhandledRejection",
  error => {

    console.error(
      "Unhandled rejection:",
      error
    );

  }
);


/*
==================================================
UNCAUGHT EXCEPTION
==================================================
*/

process.on(
  "uncaughtException",
  error => {

    console.error(
      "Uncaught exception:",
      error
    );

  }
);


/*
==================================================
LOGIN
==================================================
*/

if (
  !process.env.DISCORD_TOKEN
) {

  console.error(
    "❌ DISCORD_TOKEN tidak ditemukan di .env"
  );

  process.exit(
    1
  );

}


client.login(
  process.env.DISCORD_TOKEN
);