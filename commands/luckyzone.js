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

module.exports = {
  data: new SlashCommandBuilder()
    .setName("luckyzone")
    .setDescription("Atur channel dan tampilkan jadwal LuckyZone")
    .addSubcommand(sub =>
      sub
        .setName("setup")
        .setDescription("Buat/atur channel khusus LuckyZone")
        .addChannelOption(option =>
          option
            .setName("channel")
            .setDescription("Channel khusus LuckyZone (kosongkan untuk membuat channel baru)")
            .addChannelTypes(ChannelType.GuildText)
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("now")
        .setDescription("Update LuckyZone sekarang")
    )
    .addSubcommand(sub =>
      sub
        .setName("disable")
        .setDescription("Matikan update otomatis LuckyZone")
    ),

  async execute(interaction, { data, saveData, updateLuckyZone }) {
    const sub = interaction.options.getSubcommand();
    const settings = ensureLuckyZoneSettings(data);
    const isAdmin = interaction.memberPermissions?.has(PermissionFlagsBits.Administrator);

    if (!isAdmin) {
      await interaction.reply({
        content: "❌ Hanya member dengan permission **Administrator** yang dapat mengatur LuckyZone.",
        flags: MessageFlags.Ephemeral
      });
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
          content: "❌ LuckyZone harus menggunakan **Text Channel**.",
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
          `✅ **LuckyZone Channel berhasil disetting.**\n\n` +
          `🍀 Channel: <#${channel.id}>\n` +
          `⏰ Update otomatis: **08:00 WIB setiap hari**\n` +
          `🔄 Pattern aktif: mengikuti jadwal Pattern 1/2/3.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "disable") {
      settings.enabled = false;
      saveData(data);

      await interaction.reply({
        content: "✅ Update otomatis LuckyZone dimatikan.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "now") {
      if (!settings.channelId) {
        await interaction.reply({
          content: "❌ LuckyZone belum disetting. Jalankan `/luckyzone setup` terlebih dahulu.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await updateLuckyZone(interaction.guild, { force: true });

      await interaction.reply({
        content: `✅ LuckyZone diperbarui di <#${settings.channelId}>.`,
        flags: MessageFlags.Ephemeral
      });
    }
  },

  buildLuckyZoneEmbed
};
