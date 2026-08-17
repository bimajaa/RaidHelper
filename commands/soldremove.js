const { getSalaryDashboard } = require("../lib/scope");
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
          "ID dari /sold_list"
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

    const threadId =
      interaction.channelId;


    /*
    ==================================================
    CEK SALARY DASHBOARDS
    ==================================================
    */

    if (
      !data.salaryDashboards
    ) {

      await interaction.reply({

        content:
          "❌ Sistem Salary Dashboard belum tersedia.",

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

        content:
          "❌ Thread ini belum memiliki Salary Dashboard.\n\n" +
          "Gunakan `/salary setup` terlebih dahulu.",

        flags:
          MessageFlags.Ephemeral
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

        content:
          "❌ Sale ID tidak ditemukan di Thread ini.\n\n" +
          "Pastikan ID berasal dari `/sold_list` pada Thread yang sama.",

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

      content:

        `🗑️ **${removed.itemName}** berhasil dihapus.\n\n` +

        `💰 Gold: **${removed.gold}**\n` +

        `🧾 Stamp: **${removed.stamp}**\n` +

        `🆔 ID: \`${removed.id}\``,

      flags:
        MessageFlags.Ephemeral
    });
  }
};