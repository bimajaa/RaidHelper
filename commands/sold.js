const { getSalaryDashboard } = require("../lib/scope");

const {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const {
  parseGold,
  formatGold,
  makeId,
  isDiscordAdmin
} = require("../lib/utils");


// Bulk sold dibuat bertahap:
// Modal -> pilih stamper dengan User Select.
//
// Data pending hanya hidup selama proses input
// dan tidak mengubah database sampai semua
// stamper selesai dipilih.
const pendingBulkSales = new Map();


/*
==================================================
HELPERS
==================================================
*/

function normalizeItemName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/[×x]\s*\d+\s*$/i, "")
    .replace(/\s+/g, " ")
    .trim();
}


function cleanInput(text) {
  return String(text || "")
    .replace(/^```[a-zA-Z0-9_-]*\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}


/*
==================================================
HOST / CO-HOST CHECK
==================================================
*/

function isHostOrCoHost(interaction, dashboard) {
  const isHost =
    dashboard.hostId === interaction.user.id;

  const isCoHost =
    Array.isArray(dashboard.coHostIds) &&
    dashboard.coHostIds.includes(
      interaction.user.id
    );

  return isHost || isCoHost || isDiscordAdmin(interaction);
}


async function requireHostOrCoHost(
  interaction,
  dashboard
) {
  if (
    isHostOrCoHost(
      interaction,
      dashboard
    )
  ) {
    return true;
  }

  await interaction.reply({
    content:
      "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan command `/sold` pada raid ini.",
    flags: MessageFlags.Ephemeral
  });

  return false;
}


/*
==================================================
MAKE SALE
==================================================
*/

function makeSale({
  interaction,
  itemName,
  gold,
  stamp,
  userId
}) {
  return {
    id: makeId("sale"),
    itemName,
    gold,
    stamp,

    stampers:
      stamp > 0 && userId
        ? {
            [userId]: stamp
          }
        : {},

    userId:
      userId || null,

    addedBy:
      interaction.user.id,

    createdAt:
      Date.now()
  };
}


/*
==================================================
UPDATE DROP FROM SALE
==================================================
*/

function updateDropFromSale(
  dashboard,
  sale
) {
  if (
    !Array.isArray(
      dashboard.dropItems
    )
  ) {
    dashboard.dropItems = [];
  }

  const normalized =
    normalizeItemName(
      sale.itemName
    );

  /*
  Cocokkan nama item dengan Drop List.
  */

  const dropItem =
    dashboard.dropItems.find(
      drop => {
        if (drop.sold) {
          return false;
        }

        const dropName =
          normalizeItemName(
            drop.itemName
          );

        return (
          dropName === normalized
        );
      }
    );

  if (!dropItem) {
    return null;
  }

  dropItem.sold = true;

  dropItem.saleId =
    sale.id;

  dropItem.gold =
    sale.gold;

  dropItem.stamp =
    sale.stamp;

  dropItem.stampers =
    {
      ...sale.stampers
    };

  dropItem.updatedAt =
    Date.now();

  return dropItem;
}


/*
==================================================
FIND NEXT STAMPER
==================================================
*/

function findNextStamperIndex(
  sales,
  startIndex
) {
  for (
    let i = startIndex;
    i < sales.length;
    i++
  ) {
    if (
      Number(sales[i].stamp) > 0 &&
      !sales[i].userId
    ) {
      return i;
    }
  }

  return -1;
}


/*
==================================================
STAMPER COMPONENTS
==================================================
*/

function buildStamperComponents(
  token,
  sale,
  index
) {
  const select =
    new UserSelectMenuBuilder()
      .setCustomId(
        `sold:bulk_stamper:${token}:${index}`
      )
      .setPlaceholder(
        `Pilih stamper untuk ${sale.itemName}`
      )
      .setMinValues(1)
      .setMaxValues(1);

  const cancel =
    new ButtonBuilder()
      .setCustomId(
        `sold:bulk_cancel:${token}`
      )
      .setLabel("Batal")
      .setStyle(
        ButtonStyle.Danger
      );

  return [
    new ActionRowBuilder()
      .addComponents(select),

    new ActionRowBuilder()
      .addComponents(cancel)
  ];
}


/*
==================================================
SELECTION TEXT
==================================================
*/

function buildSelectionText(
  sales,
  index
) {
  const sale =
    sales[index];

  const done =
    sales.filter(
      x => x.userId
    ).length;

  return (
    `🏷️ **Pilih Stamper — ${index + 1}/${sales.length}**\n\n` +
    `📦 **Item:** ${sale.itemName}\n` +
    `💰 **Gold:** ${formatGold(sale.gold)}\n` +
    `🏷️ **Stamp:** ${sale.stamp}\n\n` +
    `Gunakan menu di bawah untuk memilih anggota yang melakukan stamp.\n` +
    `📊 Progress: **${done}/${sales.length}** item sudah memiliki stamper.`
  );
}


/*
==================================================
FINALIZE BULK SALES
==================================================
*/

async function finalizeBulkSales(
  interaction,
  pending,
  data,
  saveData,
  updateSalaryDashboard
) {
  const dashboard =
    getSalaryDashboard(
      data,
      pending.guildId,
      pending.channelId
    );

  if (!dashboard) {

    pendingBulkSales.delete(
      pending.token
    );

    await interaction.update({
      content:
        "❌ Thread ini belum memiliki Salary Dashboard.\n\n" +
        "Jalankan `/setup` terlebih dahulu.",

      components: []
    });

    return;
  }

  /*
  Pastikan array tersedia.
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


  let dropUpdated = 0;

  const unmatchedSales = [];


  /*
  Sinkronkan setiap item bulk
  ke Drop List.
  */

  for (
    const sale of pending.sales
  ) {

    if (
      updateDropFromSale(
        dashboard,
        sale
      )
    ) {
      dropUpdated++;
    } else {
      unmatchedSales.push(
        sale
      );
    }
  }


  /*
  Simpan sales.
  */

  dashboard.sales.push(
    ...pending.sales
  );

  dashboard.updatedAt =
    Date.now();


  saveData(data);


  await updateSalaryDashboard(
    interaction.guild,
    pending.channelId
  );


  /*
  Total gold.
  */

  const totalGold =
    pending.sales.reduce(
      (sum, sale) =>
        sum + sale.gold,
      0
    );


  /*
  Total stamp.
  */

  const totalStamp =
    pending.sales.reduce(
      (sum, sale) =>
        sum + sale.stamp,
      0
    );


  /*
  Result.
  */

  const resultLines =
    pending.sales.map(
      (sale, index) =>
        `**${index + 1}. ${sale.itemName}** — ${formatGold(sale.gold)}\n` +
        `🏷️ ${sale.stamp} stamp • 👤 ${
          sale.userId
            ? `<@${sale.userId}>`
            : "Tidak ada"
        }`
    );


  pendingBulkSales.delete(
    pending.token
  );


  const payload = {

    content:
      `✅ **${pending.sales.length} item berhasil dicatat.**\n\n` +
      resultLines.join("\n\n") +
      `\n\n📦 Total Gold: **${formatGold(totalGold)}**` +
      `\n🏷️ Total Stamp: **${totalStamp}**` +
      `\n📋 Drop List Updated: **${dropUpdated}/${pending.sales.length}**` +

      (
        unmatchedSales.length
          ? `\n⚠️ Tidak ditemukan di Drop List: ${
              unmatchedSales
                .map(
                  s =>
                    `**${s.itemName}**`
                )
                .join(", ")
            }`
          : ""
      ),

    components: []
  };


  /*
  Modal submit menggunakan reply.
  Button/select menggunakan update.
  */

  if (
    interaction.isModalSubmit &&
    interaction.isModalSubmit()
  ) {

    await interaction.reply({
      ...payload,
      flags:
        MessageFlags.Ephemeral
    });

  } else {

    await interaction.update(
      payload
    );
  }
}


/*
==================================================
SHOW NEXT STAMPER
==================================================
*/

async function showNextStamper(
  interaction,
  pending,
  data,
  saveData,
  updateSalaryDashboard,
  mode = "update"
) {
  const nextIndex =
    findNextStamperIndex(
      pending.sales,
      pending.currentIndex
    );


  if (nextIndex === -1) {

    await finalizeBulkSales(
      interaction,
      pending,
      data,
      saveData,
      updateSalaryDashboard
    );

    return;
  }


  pending.currentIndex =
    nextIndex;


  const sale =
    pending.sales[nextIndex];


  const payload = {

    content:
      buildSelectionText(
        pending.sales,
        nextIndex
      ),

    components:
      buildStamperComponents(
        pending.token,
        sale,
        nextIndex
      )
  };


  if (mode === "reply") {

    await interaction.reply({
      ...payload,
      flags:
        MessageFlags.Ephemeral
    });

  } else {

    await interaction.update(
      payload
    );
  }
}


/*
==================================================
PARSE BULK SALES
==================================================
*/

function parseBulkSales(
  interaction,
  rawInput
) {
  const cleaned =
    cleanInput(rawInput);


  const lines =
    cleaned
      .split(/\r?\n/)
      .map(x => x.trim())
      .filter(Boolean);


  const MAX_ITEMS = 25;


  if (!lines.length) {

    return {
      error:
        "❌ Tidak ada item yang dimasukkan."
    };
  }


  if (
    lines.length >
    MAX_ITEMS
  ) {

    return {
      error:
        `❌ Maksimal **${MAX_ITEMS} item** dalam satu bulk sold. ` +
        `Kamu memasukkan **${lines.length} item**.`
    };
  }


  const sales = [];

  const errors = [];


  for (
    let index = 0;
    index < lines.length;
    index++
  ) {

    const parts =
      lines[index]
        .split("|")
        .map(x => x.trim());


    if (
      parts.length !== 3
    ) {

      errors.push(
        `Baris ${index + 1}: format harus **Nama | Gold | Stamp**.`
      );

      continue;
    }


    const [
      itemName,
      goldText,
      stampText
    ] = parts;


    const gold =
      parseGold(
        goldText
      );


    if (!itemName) {

      errors.push(
        `Baris ${index + 1}: nama item kosong.`
      );

      continue;
    }


    if (
      !Number.isFinite(gold) ||
      gold < 0
    ) {

      errors.push(
        `Baris ${index + 1}: gold tidak valid (**${goldText}**).`
      );

      continue;
    }


    if (
      !/^\d+$/.test(
        stampText
      )
    ) {

      errors.push(
        `Baris ${index + 1}: stamp harus angka bulat (**${stampText}**).`
      );

      continue;
    }


    const stamp =
      Number(stampText);


    sales.push(
      makeSale({
        interaction,
        itemName,
        gold,
        stamp,
        userId: null
      })
    );
  }


  if (errors.length) {

    return {

      error:
        "❌ **Bulk input dibatalkan.** Tidak ada item yang disimpan.\n\n" +
        errors
          .map(
            x => `• ${x}`
          )
          .join("\n") +
        "\n\nFormat:\n`Nama Item | Gold | Stamp`"
    };
  }


  return {
    sales
  };
}


/*
==================================================
GET DASHBOARD
==================================================
*/

function getDashboard(
  data,
  guildId,
  threadId
) {
  const dashboard =
    getSalaryDashboard(
      data,
      guildId,
      threadId
    );


  if (dashboard) {

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
  }


  return dashboard;
}


/*
==================================================
MODULE
==================================================
*/

module.exports = {

  data:
    new SlashCommandBuilder()
      .setName("sold")
      .setDescription(
        "Catat item yang berhasil terjual"
      )

      /*
      ==========================================
      SOLD ADD
      ==========================================
      */

      .addSubcommand(sub =>
        sub
          .setName("add")
          .setDescription(
            "Catat satu item yang berhasil terjual"
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
          )
      )


      /*
      ==========================================
      SOLD BULK
      ==========================================
      */

      .addSubcommand(sub =>
        sub
          .setName("bulk_add")
          .setDescription(
            "Catat banyak item sold lewat Modal lalu pilih stamper"
          )
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


    const dashboard =
      getDashboard(
        data,
        interaction.guildId,
        threadId
      );


    /*
    ==========================================
    DASHBOARD CHECK
    ==========================================
    */

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


    const sub =
      interaction.options.getSubcommand();


    /*
    ==========================================
    HOST / CO-HOST CHECK
    ==========================================
    
    Semua `/sold` hanya Host / Co-Host.
    */

    const allowed =
      await requireHostOrCoHost(
        interaction,
        dashboard
      );


    if (!allowed) {
      return;
    }


    /*
    ==========================================
    BULK ADD
    ==========================================
    */

    if (
      sub === "bulk_add"
    ) {

      const modal =
        new ModalBuilder()
          .setCustomId(
            "sold:bulk_add"
          )
          .setTitle(
            "💰 Bulk Sold Item"
          );


      const itemsInput =
        new TextInputBuilder()
          .setCustomId(
            "items"
          )
          .setLabel(
            "Daftar Sold Item"
          )
          .setPlaceholder(
            "DDNL RING ATP | 500g | 10\n" +
            "BUKU 1 | 1.2k | 0\n" +
            "FRAGMENT | 2m | 3"
          )
          .setStyle(
            TextInputStyle.Paragraph
          )
          .setRequired(true)
          .setMaxLength(4000);


      modal.addComponents(
        new ActionRowBuilder()
          .addComponents(
            itemsInput
          )
      );


      await interaction.showModal(
        modal
      );

      return;
    }


    /*
    ==========================================
    SINGLE SOLD
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
          "❌ Format gold tidak valid. Contoh: `500g`, `1.5k`, `2m`.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const sale =
      makeSale({
        interaction,
        itemName,
        gold,
        stamp,
        userId:
          user.id
      });


    const dropItem =
      updateDropFromSale(
        dashboard,
        sale
      );


    dashboard.sales.push(
      sale
    );


    dashboard.updatedAt =
      Date.now();


    saveData(data);


    await updateSalaryDashboard(
      interaction.guild,
      threadId
    );


    await interaction.reply({

      content:
        `✅ **${itemName}** berhasil dicatat.\n\n` +
        `🧵 Thread: <#${threadId}>\n` +
        `💰 Gold: **${formatGold(gold)}**\n` +
        `🏷️ Stamp: **${stamp}**\n` +
        `👤 Stamper: ${user}\n` +
        `${
          dropItem
            ? "📋 Drop list: **UPDATED**\n"
            : "⚠️ Item ini belum ada di Drop List.\n"
        }` +
        `🆔 ID: \`${sale.id}\``,

      flags:
        MessageFlags.Ephemeral
    });
  },


  /*
  ==================================================
  MODAL SUBMIT
  ==================================================
  */

  async handleModalSubmit(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard
    }
  ) {

    const dashboard =
      getDashboard(
        data,
        interaction.guildId,
        interaction.channelId
      );


    /*
    ==========================================
    DASHBOARD CHECK
    ==========================================
    */

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
    HOST / CO-HOST CHECK
    ==========================================
    
    Cek ulang ketika modal disubmit.
    Ini mencegah user bypass permission
    melalui modal.
    */

    const allowed =
      await requireHostOrCoHost(
        interaction,
        dashboard
      );


    if (!allowed) {
      return;
    }


    /*
    ==========================================
    PARSE INPUT
    ==========================================
    */

    const raw =
      interaction.fields.getTextInputValue(
        "items"
      );


    const parsed =
      parseBulkSales(
        interaction,
        raw
      );


    if (
      parsed.error
    ) {

      await interaction.reply({
        content:
          parsed.error,

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    CREATE PENDING SESSION
    ==========================================
    */

    const token =
      makeId(
        "bulk"
      );


    const pending = {

      token,

      guildId:
        interaction.guildId,

      channelId:
        interaction.channelId,

      ownerId:
        interaction.user.id,

      sales:
        parsed.sales,

      currentIndex:
        0,

      createdAt:
        Date.now()
    };


    pendingBulkSales.set(
      token,
      pending
    );


    /*
    ==========================================
    NEXT STAMPER
    ==========================================
    */

    const nextIndex =
      findNextStamperIndex(
        pending.sales,
        0
      );


    /*
    Semua item stamp 0.
    Langsung simpan.
    */

    if (
      nextIndex === -1
    ) {

      await finalizeBulkSales(
        interaction,
        pending,
        data,
        saveData,
        updateSalaryDashboard
      );

      return;
    }


    pending.currentIndex =
      nextIndex;


    await interaction.reply({

      content:
        buildSelectionText(
          pending.sales,
          nextIndex
        ),

      components:
        buildStamperComponents(
          pending.token,
          pending.sales[nextIndex],
          nextIndex
        ),

      flags:
        MessageFlags.Ephemeral
    });
  },


  /*
  ==================================================
  STAMPER SELECT
  ==================================================
  */

  async handleStamperSelect(
    interaction,
    token,
    index,
    {
      data,
      saveData,
      updateSalaryDashboard
    }
  ) {

    const pending =
      pendingBulkSales.get(
        token
      );


    if (!pending) {

      await interaction.reply({
        content:
          "❌ Sesi bulk sold sudah berakhir. Jalankan `/sold bulk_add` lagi.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    Hanya orang yang menjalankan
    bulk sold yang boleh memilih stamper.
    */

    if (
      interaction.user.id !==
      pending.ownerId
    ) {

      await interaction.reply({
        content:
          "❌ Hanya orang yang menjalankan `/sold bulk_add` atau Administrator yang dapat memilih stamper.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    CEK DASHBOARD & HOST / CO-HOST
    ==========================================
    
    Permission dicek lagi ketika tombol
    stamper digunakan.
    */

    const dashboard =
      getDashboard(
        data,
        interaction.guildId,
        interaction.channelId
      );


    if (!dashboard) {

      await interaction.reply({
        content:
          "❌ Salary Dashboard tidak ditemukan.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    if (
      !isHostOrCoHost(
        interaction,
        dashboard
      )
    ) {

      await interaction.reply({
        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat melanjutkan proses Bulk Sold.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const numericIndex =
      Number(index);


    if (
      !Number.isInteger(
        numericIndex
      ) ||
      numericIndex < 0 ||
      numericIndex >=
        pending.sales.length ||
      numericIndex !==
        pending.currentIndex
    ) {

      await interaction.reply({
        content:
          "❌ Sesi pemilihan stamper tidak valid. Jalankan `/sold bulk_add` lagi.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const selectedUserId =
      interaction.values?.[0];


    if (
      !selectedUserId
    ) {

      await interaction.reply({
        content:
          "❌ User stamper tidak ditemukan.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const sale =
      pending.sales[
        numericIndex
      ];


    sale.userId =
      selectedUserId;


    sale.stampers =
      sale.stamp > 0
        ? {
            [selectedUserId]:
              sale.stamp
          }
        : {};


    pending.currentIndex =
      numericIndex + 1;


    await showNextStamper(
      interaction,
      pending,
      data,
      saveData,
      updateSalaryDashboard,
      "update"
    );
  },


  /*
  ==================================================
  BULK CANCEL
  ==================================================
  */

  async handleBulkCancel(
    interaction,
    token
  ) {

    const pending =
      pendingBulkSales.get(
        token
      );


    if (!pending) {

      await interaction.reply({
        content:
          "❌ Sesi bulk sold sudah berakhir.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    Hanya orang yang memulai
    bulk sold yang dapat membatalkan.
    */

    if (
      interaction.user.id !==
      pending.ownerId
    ) {

      await interaction.reply({
        content:
          "❌ Hanya orang yang menjalankan `/sold bulk_add` atau Administrator yang dapat membatalkan.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    pendingBulkSales.delete(
      token
    );


    await interaction.update({

      content:
        "❌ **Bulk Sold dibatalkan.** Tidak ada item yang disimpan.",

      components: []
    });
  }
};
