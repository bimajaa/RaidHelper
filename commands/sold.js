const { getSalaryDashboard } = require("../lib/scope");
const { t, guildLanguage , patchInteraction} = require("../lib/i18n");

const {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  UserSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle,
  StringSelectMenuBuilder
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
const BULK_SOLD_MODAL_BATCH_SIZE = 5;

function truncateModalLabel(value, max = 45) {
  const text = String(value || "").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function truncateTextInputPlaceholder(value, max = 100) {
  const text = String(value || "");
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function buildBulkGoldModal(interaction, pending, batchIndex) {
  const start = batchIndex * BULK_SOLD_MODAL_BATCH_SIZE;
  const batchItems = pending.itemNames.slice(
    start,
    start + BULK_SOLD_MODAL_BATCH_SIZE
  );

  const language = guildLanguage(interaction.guildId);
  const modal = new ModalBuilder()
    .setCustomId(`sold:bulk_gold:${pending.token}:${batchIndex}`)
    .setTitle(
      t(language, "modal_bulk_sold_title")
    );

  for (let offset = 0; offset < batchItems.length; offset++) {
    const absoluteIndex = start + offset;
    const itemName = batchItems[offset];

    const input = new TextInputBuilder()
      .setCustomId(`gold:${pending.token}:${absoluteIndex}`)
      .setLabel(truncateModalLabel(itemName))
      .setPlaceholder(
        truncateTextInputPlaceholder(
          t(language, "modal_bulk_sold_gold_placeholder")
        )
      )
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setMaxLength(100);

    modal.addComponents(
      new ActionRowBuilder().addComponents(input)
    );
  }

  return modal;
}


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


/*
==================================================
MAKE SALE
==================================================
*/

function makeSale({
  interaction,
  itemName,
  gold,
  drop
}) {
  const stamp = Number(drop?.stamp || 0);
  const stampers =
    drop && typeof drop.stampers === "object" && drop.stampers
      ? { ...drop.stampers }
      : {};

  return {
    id: makeId("sale"),
    itemName: drop?.itemName || itemName,
    gold,
    stamp,
    stampers,
    userId: drop?.stamperId || Object.keys(stampers)[0] || null,
    addedBy: interaction.user.id,
    createdAt: Date.now()
  };
}

function findUnsoldDrop(dashboard, itemName) {
  if (!Array.isArray(dashboard.dropItems)) dashboard.dropItems = [];

  const normalized = normalizeItemName(itemName);
  return dashboard.dropItems.find(
    drop => !drop.sold && normalizeItemName(drop.itemName) === normalized
  ) || null;
}

function updateDropFromSale(dashboard, sale, dropItem = null) {
  const drop = dropItem || findUnsoldDrop(dashboard, sale.itemName);
  if (!drop) return null;

  drop.sold = true;
  drop.saleId = sale.id;
  drop.gold = sale.gold;
  drop.updatedAt = Date.now();

  sale.stamp = Number(drop.stamp || 0);
  sale.stampers = { ...(drop.stampers || {}) };
  sale.userId = drop.stamperId || Object.keys(sale.stampers)[0] || null;

  return drop;
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
BULK SOLD ITEM SELECTION
==================================================
*/

function buildBulkSoldSelectionText(pending, language) {
  const lines = pending.dropItems.map((item, index) =>
    `${index + 1}. ${item.itemName}`
  );

  return t(
    language,
    "sold_bulk_select_text",
    null,
    { items: lines.join("\n") }
  );
}

function buildBulkSoldSelectionComponents(pending, language) {
  const select = new StringSelectMenuBuilder()
    .setCustomId(`sold:bulk_select:${pending.token}`)
    .setPlaceholder(t(language, "sold_bulk_select_placeholder"))
    .setMinValues(1)
    .setMaxValues(Math.min(25, pending.dropItems.length))
    .addOptions(
      pending.dropItems.map((item, index) => ({
        label: truncateModalLabel(item.itemName, 100),
        value: String(index),
        description: t(language, "sold_bulk_select_option_description")
      }))
    );

  const cancel = new ButtonBuilder()
    .setCustomId(`sold:bulk_cancel:${pending.token}`)
    .setLabel(t(language, "sold_bulk_cancel_label"))
    .setStyle(ButtonStyle.Danger);

  return [
    new ActionRowBuilder().addComponents(select),
    new ActionRowBuilder().addComponents(cancel)
  ];
}

async function handleBulkSoldSelection(
  interaction,
  token,
  selectedValues,
  { data, saveData, updateSalaryDashboard }
) {
  const pending = pendingBulkSales.get(token);
  const language = guildLanguage(interaction.guildId);

  if (!pending) {
    await interaction.reply({
      content: t(language, "sold_bulk_expired"),
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  if (pending.ownerId !== interaction.user.id) {
    await interaction.reply({
      content: t(language, "sold_bulk_select_denied"),
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  const indexes = [...new Set((selectedValues || []).map(Number))]
    .filter(index => Number.isInteger(index) && index >= 0 && index < pending.dropItems.length);

  if (!indexes.length) {
    await interaction.reply({
      content: t(language, "sold_bulk_select_min_one"),
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  const selectedItems = indexes.map(index => pending.dropItems[index]);
  pending.selectedIndexes = indexes;
  pending.itemNames = selectedItems.map(item => item.itemName);
  pending.stage = "gold";
  pending.batchIndex = 0;

  // Respond immediately to the component interaction. Discord.js supports
  // showModal() on StringSelectMenuInteraction, so do not defer/update first.
  await interaction.showModal(buildBulkGoldModal(interaction, pending, 0));
}

/*
==================================================
STAMPER COMPONENTS
==================================================
*/

function buildStamperComponents(
  token,
  sale,
  index,
  language
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
      .setLabel(t(language, "sold_bulk_cancel_label"))
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
  index,
  language
) {
  const sale = sales[index];
  const done = sales.filter(x => x.userId).length;

  return t(language, "sold_bulk_stamper_text", null, {
    index: index + 1,
    total: sales.length,
    item: sale.itemName,
    gold: formatGold(sale.gold),
    stamp: sale.stamp,
    done
  });
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

  // Keep the Drop List embed synchronized immediately after bulk sold.
  try {
    const dropCommand = require("./drop");
    if (typeof dropCommand.updateDropListMessage === "function") {
      await dropCommand.updateDropListMessage(interaction, dashboard);
    }
  } catch (error) {
    console.warn(
      "Drop List embed tidak berhasil di-refresh setelah bulk sold:",
      error
    );
  }


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

  const language = guildLanguage(interaction.guildId);
  const resultLines = pending.sales.map((sale, index) =>
    t(language, "sold_bulk_result_item", null, {
      index: index + 1,
      item: sale.itemName,
      gold: formatGold(sale.gold),
      stamp: sale.stamp,
      user: sale.userId ? `<@${sale.userId}>` : t(language, "sold_bulk_no_stamper")
    })
  );


  pendingBulkSales.delete(
    pending.token
  );


  const payload = {

    content: t(language, "sold_bulk_result", null, {
      count: pending.sales.length,
      items: resultLines.join("\n\n"),
      totalGold: formatGold(totalGold),
      totalStamp,
      dropUpdated,
      unmatchedText: unmatchedSales.length
        ? t(language, "sold_bulk_unmatched_prefix") + unmatchedSales.map(s => `**${s.itemName}**`).join(", ")
        : ""
    }),

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


  const language = guildLanguage(interaction.guildId);
  const payload = {
    content: buildSelectionText(pending.sales, nextIndex, language),
    components: buildStamperComponents(pending.token, sale, nextIndex, language)
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

function parseBulkSales(interaction, rawInput) {
  const cleaned = cleanInput(rawInput);
  const lines = cleaned.split(/\r?\n/).map(x => x.trim()).filter(Boolean);

  if (!lines.length) return { error: "❌ Tidak ada item yang dimasukkan." };
  if (lines.length > 25) {
    return {
      error:
        `❌ Maksimal **25 item** dalam satu bulk sold. Kamu memasukkan **${lines.length} item**.`
    };
  }

  const sales = [];
  const errors = [];

  for (let index = 0; index < lines.length; index++) {
    const parts = lines[index].split("|").map(x => x.trim());

    if (parts.length !== 2) {
      errors.push(`Baris ${index + 1}: format harus **Nama Item | Gold**.`);
      continue;
    }

    const [itemName, goldText] = parts;
    const gold = parseGold(goldText);

    if (!itemName) {
      errors.push(`Baris ${index + 1}: nama item kosong.`);
      continue;
    }

    if (!Number.isFinite(gold) || gold < 0) {
      errors.push(`Baris ${index + 1}: gold tidak valid (**${goldText}**).`);
      continue;
    }

    sales.push({
      id: makeId("sale"),
      itemName,
      gold,
      stamp: 0,
      stampers: {},
      userId: null,
      addedBy: interaction.user.id,
      createdAt: Date.now()
    });
  }

  if (errors.length) {
    return {
      error:
        "❌ **Bulk Sold dibatalkan.** Tidak ada item yang disimpan.\n\n" +
        errors.map(x => `• ${x}`).join("\n") +
        "\n\nFormat:\n`Nama Item | Gold`"
    };
  }

  return { sales };
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
        "Catat item yang terjual dari Drop List lewat Bulk Add"
      )

      /*
      ==========================================
      SOLD BULK ADD ONLY
      ==========================================
      */

      .addSubcommand(sub =>
        sub
          .setName("bulk")
          .setDescription(
            "Catat banyak item dari Drop List lewat Modal"
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

        patchInteraction(interaction);
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

    // `/sold` hanya boleh digunakan setelah minimal satu item
    // dimasukkan melalui `/drop add` atau `/drop bulk`.
    // Ini mencegah sold dibuat tanpa sumber Drop List.
    const hasDropData =
      Array.isArray(dashboard.dropItems) &&
      dashboard.dropItems.length > 0;

    if (!hasDropData) {
      const language = guildLanguage(interaction.guildId);
      await interaction.reply({
        content: t(
          language,
          "sold_requires_drop_data"
        ),
        flags: MessageFlags.Ephemeral
      });
      return;
    }


    /*
    ==========================================
    BULK ADD ONLY
    ==========================================
    */

    const unsoldDrops = dashboard.dropItems
      .filter(drop => !drop.sold)
      .slice(0, 25);

    if (!unsoldDrops.length) {
      await interaction.reply({
        content: "❌ Tidak ada item yang belum Sold di Drop List.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const token = makeId("bulk_sold");
    const pending = {
      token,
      ownerId: interaction.user.id,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      dropItems: unsoldDrops.map((drop, index) => ({
        index,
        itemName: drop.itemName,
        dropId: drop.id || null
      })),
      selectedIndexes: [],
      itemNames: [],
      sales: [],
      batchIndex: 0,
      stage: "select",
      createdAt: Date.now()
    };

    pendingBulkSales.set(token, pending);

    try {
      const language = guildLanguage(interaction.guildId);
      await interaction.reply({
        content: buildBulkSoldSelectionText(pending, language),
        components: buildBulkSoldSelectionComponents(pending, language),
        flags: MessageFlags.Ephemeral
      });
    } catch (error) {
      pendingBulkSales.delete(token);
      throw error;
    }
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
    const customId = String(interaction.customId || "");
    const match = customId.match(/^sold:bulk_gold:([^:]+):(\d+)$/);

    if (!match) {
      await interaction.reply({
        content: "❌ Sesi Bulk Sold tidak valid. Jalankan `/sold bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const [, token, batchText] = match;
    const batchIndex = Number(batchText);
    const pending = pendingBulkSales.get(token);

    if (!pending) {
      await interaction.reply({
        content: "❌ Sesi Bulk Sold sudah berakhir. Jalankan `/sold bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (pending.ownerId !== interaction.user.id) {
      await interaction.reply({
        content: "❌ Hanya orang yang menjalankan `/sold bulk` yang dapat mengisi Gold.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (pending.stage !== "gold") {
      await interaction.reply({
        content: "❌ Tahap Bulk Sold tidak valid. Jalankan `/sold bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (batchIndex !== pending.batchIndex) {
      await interaction.reply({
        content: "❌ Urutan modal Bulk Sold tidak valid. Jalankan `/sold bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const dashboard = getDashboard(
      data,
      interaction.guildId,
      interaction.channelId
    );

    if (!dashboard) {
      pendingBulkSales.delete(token);
      await interaction.reply({
        content: "❌ Thread ini belum memiliki Salary Dashboard.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (!isHostOrCoHost(interaction, dashboard)) {
      pendingBulkSales.delete(token);
      await interaction.reply({
        content: "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan `/sold`.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const start = batchIndex * BULK_SOLD_MODAL_BATCH_SIZE;
    const batchItems = pending.itemNames.slice(
      start,
      start + BULK_SOLD_MODAL_BATCH_SIZE
    );

    const sales = [];
    const errors = [];

    for (let offset = 0; offset < batchItems.length; offset++) {
      const absoluteIndex = start + offset;
      const inputId = `gold:${token}:${absoluteIndex}`;
      const goldText = interaction.fields.getTextInputValue(inputId).trim();
      const gold = parseGold(goldText);

      if (!Number.isFinite(gold) || gold < 0) {
        errors.push(
          `**${batchItems[offset]}**: gold tidak valid (**${goldText || "kosong"}**).`
        );
        continue;
      }

      const dropItem = findUnsoldDrop(dashboard, batchItems[offset]);

      if (!dropItem) {
        errors.push(
          `**${batchItems[offset]}**: item tidak ditemukan di Drop List atau sudah Sold.`
        );
        continue;
      }

      sales.push(
        makeSale({
          interaction,
          itemName: batchItems[offset],
          gold,
          drop: dropItem
        })
      );
    }

    if (errors.length) {
      await interaction.reply({
        content:
          "❌ **Bulk Sold dibatalkan untuk batch ini.** Periksa nilai berikut dan jalankan `/sold bulk` lagi jika perlu.\n\n" +
          errors.map(x => `• ${x}`).join("\n"),
        flags: MessageFlags.Ephemeral
      });
      pendingBulkSales.delete(token);
      return;
    }

    pending.sales.push(...sales);

    const nextBatch = batchIndex + 1;
    const hasNextBatch =
      nextBatch * BULK_SOLD_MODAL_BATCH_SIZE < pending.itemNames.length;

    if (hasNextBatch) {
      pending.batchIndex = nextBatch;
      await interaction.showModal(
        buildBulkGoldModal(interaction, pending, nextBatch)
      );
      return;
    }

    await finalizeBulkSales(
      interaction,
      pending,
      data,
      saveData,
      updateSalaryDashboard
    );
  },

  /*
  ==================================================
  STAMPER SELECT
  ==================================================
  */

  async handleBulkSoldSelection(
    interaction,
    token,
    selectedValues,
    context
  ) {
    return handleBulkSoldSelection(
      interaction,
      token,
      selectedValues,
      context
    );
  },

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
          "❌ Sesi bulk sold sudah berakhir. Jalankan `/sold bulk` lagi.",

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
          "❌ Hanya orang yang menjalankan `/sold bulk` atau Administrator yang dapat memilih stamper.",

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
          "❌ Sesi pemilihan stamper tidak valid. Jalankan `/sold bulk` lagi.",

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

    const language = guildLanguage(interaction.guildId);
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
        content: t(language, "sold_bulk_cancel_denied"),

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    pendingBulkSales.delete(
      token
    );


    await interaction.update({

      content: t(language, "sold_bulk_cancelled"),

      components: []
    });
  }
};
