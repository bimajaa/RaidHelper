const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  MessageFlags
} = require("discord.js");
const { loadData, saveData } = require("../lib/store");
const { t, guildLanguage, patchInteraction } = require("../lib/i18n");
const { isDiscordAdmin } = require("../lib/utils");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("language")
    .setDescription("Change language")
    .setDescriptionLocalizations({ "id": "Ubah bahasa", "en-US": "Change language" })
    .addSubcommand(sub => sub
      .setName("set")
      .setDescription("Set language")
      .setDescriptionLocalizations({ "id": "Atur bahasa", "en-US": "Set language" })
      .addStringOption(option => option
        .setName("lang")
        .setDescription("Language to use")
        .setDescriptionLocalizations({ "id": "Bahasa yang digunakan", "en-US": "Language to use" })
        .setRequired(true)
        .addChoices(
          { name: "Bahasa Indonesia", value: "id", name_localizations: { "id": "Bahasa Indonesia", "en-US": "Indonesian" } },
          { name: "English", value: "en", name_localizations: { "id": "English", "en-US": "English" } }
        )
      )
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  async execute(interaction) {
        patchInteraction(interaction);

    if (!isDiscordAdmin(interaction)) {
      const currentLang = interaction.guildId ? guildLanguage(interaction.guildId) : "id";
      await interaction.reply({
        content: t(currentLang, "language_admin_only"),
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const lang = interaction.options.getString("lang");
    const data = loadData(interaction.guild.id);
    data.language = lang;
    saveData(data, interaction.guild.id);

    await interaction.reply({
      content: t(lang, "language_changed"),
      flags: MessageFlags.Ephemeral
    });
  }
};
