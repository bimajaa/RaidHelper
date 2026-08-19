const { patchInteraction } = require("../lib/i18n");
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

    .setName("setstampprice")

    .setDescription(
      "Atur harga 1 stamp untuk Thread ini"
    )

    .addNumberOption(o =>
      o
        .setName("price")
        .setDescription(
          "Harga stamp dalam gold"
        )
        .setMinValue(0)
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

        patchInteraction(interaction);
/*
    ==================================================
    THREAD ID
    ==================================================
    */

    const threadId =
      interaction.channelId;


    /*
    ==================================================
    PASTIKAN salaryDashboards ADA
    ==================================================
    */

    if (
      !data.salaryDashboards
    ) {

      data.salaryDashboards = {};
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
    AMBIL HARGA STAMP
    ==================================================
    */

    const price =
      interaction.options.getNumber(
        "price",
        true
      );


    /*
    ==================================================
    VALIDASI
    ==================================================
    */

    if (
      !Number.isFinite(price) ||
      price < 0
    ) {

      await interaction.reply({

        content:
          "❌ Harga stamp tidak valid.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    SIMPAN HARGA STAMP PER THREAD
    ==================================================
    */

    dashboard.stampPrice =
      price;


    /*
    ==================================================
    UPDATE TIMESTAMP
    ==================================================
    */

    dashboard.updatedAt =
      Date.now();


    /*
    ==================================================
    SAVE DATA
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
        `✅ Harga stamp Thread ini diubah menjadi **${price}g/stamp**.`,

      flags:
        MessageFlags.Ephemeral
    });
  }
};