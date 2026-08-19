const { patchInteraction, guildLanguage } = require("../lib/i18n");
const { buildHostGuide } = require("../lib/hostGuide");
const {
  SlashCommandBuilder,
  MessageFlags
} = require("discord.js");

const {
  getSalaryDashboard,
  setSalaryDashboard
} = require("../lib/scope");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("setup")
    .setDescription(
      "Shortcut membuat Salary Dashboard di thread ini"
    ),

  async execute(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard
    }
  ) {

        patchInteraction(interaction);
/*
    ==================================================
    CEK HARUS DI THREAD
    ==================================================
    */

    if (!interaction.channel?.isThread?.()) {
      await interaction.reply({
        content:
          "❌ `/setup` hanya bisa digunakan di dalam Thread.",
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    /*
    ==================================================
    AMBIL DASHBOARD
    ==================================================
    */

    let dashboard =
      getSalaryDashboard(
        data,
        interaction.guildId,
        interaction.channelId
      );

    /*
    ==================================================
    BUAT DASHBOARD BARU
    ==================================================
    */

    if (!dashboard) {

      dashboard = {
        threadId:
          interaction.channelId,

        threadName:
          interaction.channel.name ||
          "Salary",

        guildId:
          interaction.guildId,

        parentId:
          interaction.channel.parentId ||
          null,

        messageId:
          null,

        stampPrice:
          Number(
            data.settings?.defaultStampPrice ?? 4
          ),

        sellerTaxPer1000:
          Number(
            data.settings?.defaultSellerTaxPer1000 ?? 15
          ),

        salaryMembers:
          [],

        hostId:
          interaction.user.id,

        coHostIds:
          [],

        sales:
          [],

        dropItems:
          [],

        raidHistory:
          [],

        createdAt:
          Date.now(),

        updatedAt:
          Date.now()
      };

      setSalaryDashboard(
        data,
        interaction.guildId,
        interaction.channelId,
        dashboard
      );

    } else {

      /*
      ==================================================
      DASHBOARD SUDAH ADA
      ==================================================
      */

      if (!dashboard.hostId) {
        dashboard.hostId =
          interaction.user.id;
      }

      /*
      Pastikan array penting tersedia
      */

      if (!Array.isArray(dashboard.salaryMembers)) {
        dashboard.salaryMembers = [];
      }

      if (!Array.isArray(dashboard.coHostIds)) {
        dashboard.coHostIds = [];
      }

      if (!Array.isArray(dashboard.sales)) {
        dashboard.sales = [];
      }

      if (!Array.isArray(dashboard.dropItems)) {
        dashboard.dropItems = [];
      }

      if (!Array.isArray(dashboard.raidHistory)) {
        dashboard.raidHistory = [];
      }

      dashboard.updatedAt =
        Date.now();
    }

    /*
    ==================================================
    SIMPAN DATA
    ==================================================
    */

    saveData(data);

    /*
    ==================================================
    LOADING
    ==================================================
    */

    await interaction.reply({
      content:
        "⏳ Menyiapkan Salary Dashboard...",
      flags: MessageFlags.Ephemeral
    });

    /*
    ==================================================
    UPDATE DASHBOARD
    ==================================================
    */

    const message =
      await updateSalaryDashboard(
        interaction.guild,
        interaction.channelId
      );

    /*
    ==================================================
    PANDUAN RAID
    ==================================================
    */

    if (message) {

      await interaction.editReply({
        content: buildHostGuide(
          dashboard,
          { creatorId: dashboard.hostId },
          guildLanguage(interaction.guildId)
        )
      });

    } else {

      await interaction.editReply({
        content:
          "❌ **Dashboard gagal dibuat.**\n\n" +
          "Pastikan bot bisa mengirim pesan di thread ini."
      });
    }
  }
};