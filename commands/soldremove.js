const { getSalaryDashboard } = require("../lib/scope");
const { guildLanguage, t, patchInteraction } = require("../lib/i18n");
const { isDiscordAdmin } = require("../lib/utils");
const {
  SlashCommandBuilder,
  MessageFlags
} = require("discord.js");


module.exports = {

  /*
  ==================================================
  COMMAND
  ==================================================
  */

  data: new SlashCommandBuilder()

    .setName("sold_remove")

    .setDescription(
      "Hapus item yang salah input dari Thread ini"
    )

    .addStringOption(o =>
      o
        .setName("sale_id")
        .setDescription(
          "Sale ID dari /sold_list"
        )
        .setRequired(true)
    ),


  /*
  ==================================================
  EXECUTE
  ==================================================
  */

  async execute(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard
    }
  ) {

    /*
    ==================================================
    THREAD ID
    ==================================================
    */

    patchInteraction(interaction);
    const lang = guildLanguage(interaction.guildId);
    const threadId = interaction.channelId;


    /*
    ==================================================
    CEK SALARY DASHBOARDS
    ==================================================
    */

    if (
      !data.salaryDashboards
    ) {

      await interaction.reply({

        content: t(lang, "sold_remove_dashboard_missing"),

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    AMBIL DASHBOARD THREAD
    ==================================================
    */

    const dashboard = getSalaryDashboard(data, interaction.guildId, threadId);


    /*
    ==================================================
    THREAD BELUM SETUP
    ==================================================
    */

    if (!dashboard) {

      await interaction.reply({
        content: t(lang, "sold_remove_setup"),
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    const isHost = dashboard.hostId === interaction.user.id;
    const isCoHost = Array.isArray(dashboard.coHostIds) && dashboard.coHostIds.includes(interaction.user.id);

    if (!isHost && !isCoHost && !isDiscordAdmin(interaction)) {
      await interaction.reply({
        content: lang === "en"
          ? "❌ Only **Host**, **Co-Host**, or **Administrator** can remove a sold item."
          : "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menghapus sold item.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    PASTIKAN SALES ARRAY ADA
    ==================================================
    */

    if (
      !Array.isArray(
        dashboard.sales
      )
    ) {

      dashboard.sales = [];
    }


    /*
    ==================================================
    AMBIL SALE ID
    ==================================================
    */

    const saleId =
      interaction.options.getString(
        "sale_id",
        true
      );


    /*
    ==================================================
    CARI ITEM
    ==================================================
    */

    const index =
      dashboard.sales.findIndex(
        sale =>
          sale.id === saleId
      );


    /*
    ==================================================
    ITEM TIDAK DITEMUKAN
    ==================================================
    */

    if (index === -1) {

      await interaction.reply({

        content: t(lang, "sold_remove_not_found"),

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    HAPUS ITEM
    ==================================================
    */

    const [
      removed
    ] =
      dashboard.sales.splice(
        index,
        1
      );


    /*
    ==================================================
    SINKRONKAN DROP LIST
    ==================================================
    */

    if (Array.isArray(dashboard.dropItems)) {
      const drop = dashboard.dropItems.find(
        item => item.saleId === removed.id
      );

      if (drop) {
        drop.sold = false;
        drop.saleId = null;
        drop.gold = 0;
        drop.stamp = 0;
        drop.stampers = {};
        drop.updatedAt = Date.now();
      }
    }

    /*
    ==================================================
    UPDATE TIMESTAMP
    ==================================================
    */

    dashboard.updatedAt =
      Date.now();


    /*
    ==================================================
    SAVE
    ==================================================
    */

    saveData(
      data
    );


    /*
    ==================================================
    UPDATE DASHBOARD
    ==================================================
    */

    await updateSalaryDashboard(
      interaction.guild,
      threadId
    );


    /*
    ==================================================
    RESPONSE
    ==================================================
    */

    await interaction.reply({

      content: t(lang, "sold_remove_success", "", {
        itemName: removed.itemName,
        gold: removed.gold,
        stamp: removed.stamp,
        id: removed.id
      }),

      flags:
        MessageFlags.Ephemeral
    });
  }
};