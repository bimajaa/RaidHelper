const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  MessageFlags
} = require("discord.js");

const {
  ensureLuckyZoneSettings,
  buildLuckyZoneEmbed
} = require("../lib/luckyzone");
const { guildLanguage, t , patchInteraction} = require("../lib/i18n");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("luckyzone")
    .setDescription("Atur channel dan tampilkan jadwal LuckyZone")
    .setDescriptionLocalizations({ "en-US": "Configure the channel and display the LuckyZone schedule" })
    .addSubcommand(sub =>
      sub
        .setName("setup")
        .setDescription("Buat/atur channel khusus LuckyZone")
        .setDescriptionLocalizations({ "en-US": "Create or configure the dedicated LuckyZone channel" })
        .addChannelOption(option =>
          option
            .setName("channel")
            .setDescription("Channel khusus LuckyZone (kosongkan untuk membuat channel baru)")
            .setDescriptionLocalizations({ "en-US": "Dedicated LuckyZone channel (leave empty to create a new channel)" })
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("now")
        .setDescription("Update LuckyZone sekarang")
        .setDescriptionLocalizations({ "en-US": "Update LuckyZone now" })
    )
    .addSubcommand(sub =>
      sub
        .setName("next")
        .setDescription("Lihat LuckyZone untuk besok")
        .setDescriptionLocalizations({ "en-US": "View tomorrow's LuckyZone" })
    )
    .addSubcommand(sub =>
      sub
        .setName("disable")
        .setDescription("Matikan update otomatis LuckyZone")
        .setDescriptionLocalizations({ "en-US": "Disable automatic LuckyZone updates" })
    ),

  async execute(interaction, { data, saveData, updateLuckyZone }) {
        patchInteraction(interaction);
const lang = guildLanguage(interaction.guildId);
    const sub = interaction.options.getSubcommand();
    const settings = ensureLuckyZoneSettings(data);
    const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);

    // /luckyzone next is informational and can be used by everyone.
    // Configuration/update commands remain Administrator-only.
    if (sub !== "next" && !isAdmin) {
      await interaction.reply({
        content: t(lang, "lz_admin_only"),
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "next") {
      try {
        const { buildLuckyZoneNextEmbed } = require("../lib/luckyzone");
        const embed = buildLuckyZoneNextEmbed(new Date(), settings, interaction.guildId);
        await interaction.reply({
          embeds: [embed],
          flags: MessageFlags.Ephemeral
        });
      } catch (error) {
        console.error("❌ LuckyZone next error:", error);
        await interaction.reply({
          content: t(lang, "lz_next_error"),
          flags: MessageFlags.Ephemeral
        });
      }
      return;
    }

    if (sub === "setup") {
      let channel = interaction.options.getChannel("channel", false);

      if (!channel) {
        channel = await interaction.guild.channels.create({
          name: "🍀・lucky-zone",
          type: ChannelType.GuildText,
          topic: "LuckyZone harian — otomatis update setiap pukul 08:00 WIB.",
          permissionOverwrites: [
            {
              id: interaction.guild.roles.everyone.id,
              allow: [PermissionFlagsBits.ViewChannel],
              deny: [PermissionFlagsBits.SendMessages]
            },
            {
              id: interaction.client.user.id,
              allow: [PermissionFlagsBits.ViewChannel, PermissionFlagsBits.SendMessages, PermissionFlagsBits.EmbedLinks]
            }
          ]
        });
      }

      if (channel.type !== ChannelType.GuildText) {
        await interaction.reply({
          content: t(lang, "lz_text_channel_only"),
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const channelChanged = settings.channelId !== channel.id;
      settings.channelId = channel.id;
      settings.enabled = true;
      if (channelChanged) settings.messageId = null;
      saveData(data);

      await updateLuckyZone(interaction.guild, { force: true });

      await interaction.reply({
        content:
          `${t(lang, "lz_setup_success")}\n\n` +
          `🍀 ${lang === "en" ? "Channel" : "Channel"}: <#${channel.id}>\n` +
          `⏰ ${t(lang, "lz_auto_update")}\n` +
          `🔄 ${t(lang, "lz_pattern_active")}`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "disable") {
      settings.enabled = false;
      saveData(data);

      await interaction.reply({
        content: t(lang, "lz_disabled"),
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "now") {
      if (!settings.channelId) {
        await interaction.reply({
          content: t(lang, "lz_not_configured"),
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await updateLuckyZone(interaction.guild, { force: true });

      await interaction.reply({
        content: `${t(lang, "lz_updated")} <#${settings.channelId}>.`,
        flags: MessageFlags.Ephemeral
      });
    }
  },

  buildLuckyZoneEmbed
};
