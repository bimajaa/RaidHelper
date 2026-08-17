const { SlashCommandBuilder } = require("discord.js");
const { setParty } = require("../lib/scope");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("raidparty")
    .setDescription("Shortcut untuk membuat raid party")
    .addStringOption(o =>
      o.setName("name")
        .setDescription("Nama party")
        .setRequired(true)
        .setMaxLength(80)
    )
    .addStringOption(o =>
      o.setName("nest")
        .setDescription("Raid Nest")
        .setRequired(true)
        .addChoices(
          { name: "GDN Classic", value: "GDN Classic" },
          { name: "GDN HARDCORE", value: "GDN HARDCORE" },
          { name: "DDN Classic", value: "DDN Classic" },
          { name: "DDN HARDCORE", value: "DDN HARDCORE" },
          { name: "Other", value: "Other" }
        )
    ),

  async execute(interaction, { data, saveData, createPartyMessage }) {
    const party = createPartyMessage.create({
      name: interaction.options.getString("name"),
      nest: interaction.options.getString("nest"),
      maxSlots: 8,
      creatorId: interaction.user.id,
      channelId: interaction.channelId,
      guildId: interaction.guildId
    });

    setParty(data, interaction.guildId, party.id, party);
    saveData(data);

    // Global slash commands tidak selalu memiliki interaction.channel
    // di cache. Fetch berdasarkan guild + channel ID agar multi-server aman.
    const channel =
      interaction.channel ||
      await interaction.guild?.channels.fetch(interaction.channelId).catch(() => null);

    if (!channel || !channel.isTextBased?.()) {
      await interaction.reply({
        content: "❌ Bot tidak dapat mengakses channel tempat command ini dijalankan. Pastikan bot memiliki View Channel dan Send Messages.",
        ephemeral: true
      });
      return;
    }

    const message = await channel.send(
      await createPartyMessage.render(party)
    );

    party.messageId = message.id;
    party.updatedAt = Date.now();
    saveData(data);

    await interaction.reply({
      content: `✅ Raid party dibuat: **${party.name}**\nID: \`${party.id}\``,
      ephemeral: true
    });
  }
};
