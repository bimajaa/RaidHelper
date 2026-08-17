const { getSalaryDashboard } = require("../lib/scope");
const {
  SlashCommandBuilder,
  MessageFlags
} = require("discord.js");

const {
  parseGold,
  formatGold,
  makeId,
  isDiscordAdmin
} = require("../lib/utils");


/*
==================================================
HELPER
==================================================
*/

function normalizeItemName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/*
==================================================
HOST / CO-HOST CHECK
==================================================
*/

function isHostOrCoHost(
  interaction,
  dashboard
) {
  const isHost =
    dashboard.hostId ===
    interaction.user.id;

  const isCoHost =
    Array.isArray(
      dashboard.coHostIds
    ) &&
    dashboard.coHostIds.includes(
      interaction.user.id
    );

  return isHost || isCoHost || isDiscordAdmin(interaction);
}


/*
==================================================
COMMAND
==================================================
*/

module.exports = {

  data:
    new SlashCommandBuilder()
      .setName("sold_item")
      .setDescription(
        "Input satu item yang berhasil dijual (legacy)"
      )

      .addStringOption(o =>
        o
          .setName("item_name")
          .setDescription(
            "Nama item"
          )
          .setRequired(true)
          .setMaxLength(100)
      )

      .addStringOption(o =>
        o
          .setName("gold")
          .setDescription(
            "Harga jual, contoh 500g / 1.5k / 2m"
          )
          .setRequired(true)
      )

      .addIntegerOption(o =>
        o
          .setName("stamp")
          .setDescription(
            "Jumlah stamp"
          )
          .setMinValue(0)
          .setRequired(true)
      )

      .addUserOption(o =>
        o
          .setName("tag")
          .setDescription(
            "Orang yang melakukan stamp"
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

    const threadId =
      interaction.channelId;


    /*
    ==========================================
    DASHBOARD
    ==========================================
    */

    if (!data.salaryDashboards) {
      data.salaryDashboards = {};
    }


    const dashboard =
      getSalaryDashboard(
        data,
        interaction.guildId,
        threadId
      );


    if (!dashboard) {

      await interaction.reply({
        content:
          "❌ Thread ini belum memiliki Salary Dashboard.\n\n" +
          "Jalankan `/setup` terlebih dahulu.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    NORMALIZE DATA
    ==========================================
    */

    if (
      !Array.isArray(
        dashboard.sales
      )
    ) {
      dashboard.sales = [];
    }


    if (
      !Array.isArray(
        dashboard.dropItems
      )
    ) {
      dashboard.dropItems = [];
    }


    if (
      !Array.isArray(
        dashboard.coHostIds
      )
    ) {
      dashboard.coHostIds = [];
    }


    /*
    ==========================================
    HOST / CO-HOST ONLY
    ==========================================
    */

    const isAllowed =
      isHostOrCoHost(
        interaction,
        dashboard
      );


    if (!isAllowed) {

      await interaction.reply({
        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan `/sold_item` pada raid ini.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    INPUT
    ==========================================
    */

    const itemName =
      interaction.options.getString(
        "item_name",
        true
      );


    const goldText =
      interaction.options.getString(
        "gold",
        true
      );


    const stamp =
      interaction.options.getInteger(
        "stamp",
        false
      ) || 0;


    const user =
      interaction.options.getUser(
        "tag",
        true
      );


    /*
    ==========================================
    PARSE GOLD
    ==========================================
    */

    const gold =
      parseGold(
        goldText
      );


    if (
      !Number.isFinite(gold) ||
      gold < 0
    ) {

      await interaction.reply({
        content:
          "❌ Format gold tidak valid.\n\n" +
          "Contoh:\n" +
          "`500g`\n" +
          "`1.5k`\n" +
          "`2m`",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    CREATE SALE
    ==========================================
    */

    const sale = {

      id:
        makeId("sale"),

      itemName,

      gold,

      stamp,

      stampers:
        stamp > 0
          ? {
              [user.id]:
                stamp
            }
          : {},

      userId:
        user.id,

      addedBy:
        interaction.user.id,

      createdAt:
        Date.now()
    };


    /*
    ==========================================
    SYNC DROP LIST
    ==========================================
    */

    const dropItem =
      dashboard.dropItems.find(
        drop =>
          !drop.sold &&
          normalizeItemName(
            drop.itemName
          ) ===
          normalizeItemName(
            itemName
          )
      );


    if (dropItem) {

      dropItem.sold =
        true;

      dropItem.saleId =
        sale.id;

      dropItem.gold =
        gold;

      dropItem.stamp =
        stamp;

      dropItem.stampers =
        {
          ...sale.stampers
        };

      dropItem.updatedAt =
        Date.now();
    }


    /*
    ==========================================
    SAVE SALE
    ==========================================
    */

    dashboard.sales.push(
      sale
    );

    dashboard.updatedAt =
      Date.now();


    saveData(data);


    /*
    ==========================================
    UPDATE DASHBOARD
    ==========================================
    */

    await updateSalaryDashboard(
      interaction.guild,
      threadId
    );


    /*
    ==========================================
    RESULT
    ==========================================
    */

    await interaction.reply({

      content:
        `✅ **${itemName}** berhasil dicatat.\n\n` +

        `💰 Gold: **${formatGold(gold)}**\n` +

        `🏷️ Stamp: **${stamp}**\n` +

        `👤 Stamper: ${user}\n` +

        (
          dropItem
            ? "📋 Drop List: **UPDATED**\n"
            : "⚠️ Item ini belum ada di Drop List.\n"
        ) +

        `🆔 Sale ID: \`${sale.id}\``,

      flags:
        MessageFlags.Ephemeral
    });
  }
};