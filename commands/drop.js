const { patchChannel, patchMessage, t, guildLanguage , patchInteraction} = require("../lib/i18n");
const { getSalaryDashboard } = require("../lib/scope");

const {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder,
  UserSelectMenuBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const {
  makeId,
  formatGold,
  isDiscordAdmin
} = require("../lib/utils");


/*
==================================================
HELPERS
==================================================
*/

function normalizeItemName(name) {
  return String(name || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function truncateTextInputPlaceholder(value, max = 100) {
  const text = String(value || "");
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

function truncateSelectPlaceholder(value, max = 150) {
  const text = String(value || "");
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
}

const pendingBulkDrops = new Map();
const BULK_DROP_MAX_ITEMS = 25;


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
FORMAT DROP
==================================================
*/

function formatDropList(
  dropItems
) {
  if (
    !Array.isArray(dropItems) ||
    !dropItems.length
  ) {
    return "📋 **Belum ada Drop List.**";
  }

  return dropItems
    .map((drop, index) => {

      const itemName =
        drop.itemName ||
        drop.name ||
        "Unknown Item";

      const stamp =
        Number(drop.stamp || 0);

      const saleId =
        drop.saleId ||
        drop.id ||
        "-";


      /*
      SOLD
      */

      if (drop.sold) {

        return (
          `**${index + 1}. ${itemName} (${stamp} stamp)**\n` +
          `└ ✅ **Sold** — ${formatGold(drop.gold || 0)}\n` +
          `└ 👤 Stamper: ${drop.stamperId ? `<@${drop.stamperId}>` : "Tidak ada"}\n` +
          `└ 🆔 Sale ID: \`${saleId}\``
        );
      }


      /*
      BELUM SOLD
      */

      return (
        `**${index + 1}. ${itemName} (${stamp} stamp)**\n` +
        `└ ⏳ **Belum Sold**\n` +
        `└ 🆔 Drop ID: \`${saleId}\``
      );
    })
    .join("\n\n");
}


/*
==================================================
DROP EMBED
==================================================
*/

function createDropEmbed(
  dashboard
) {

  const dropItems =
    Array.isArray(
      dashboard.dropItems
    )
      ? dashboard.dropItems
      : [];


  const soldItems =
    dropItems.filter(
      drop => drop.sold
    );


  const soldGold =
    soldItems.reduce(
      (total, drop) =>
        total +
        Number(drop.gold || 0),
      0
    );


  const totalStamp =
    dropItems.reduce(
      (total, drop) =>
        total +
        Number(drop.stamp || 0),
      0
    );


  const description =
    formatDropList(
      dropItems
    );


  return new EmbedBuilder()

    .setColor(
      0xf1c40f
    )

    .setTitle(
      "📦 DROP LIST"
    )

    .setDescription(
      description.length > 4000
        ? description.substring(
            0,
            3990
          ) + "..."
        : description
    )

    .addFields({

      name:
        "📊 Progress",

      value:
        `**${soldItems.length}/${dropItems.length} Sold**\n` +
        `💰 Sold Gold: **${formatGold(soldGold)}**\n` +
        `🏷️ Total Stamp: **${totalStamp}**`,

      inline:
        false
    })

    .setFooter({

      text:
        "PEMBANTU RAID • Drop List"

    })

    .setTimestamp();
}


/*
==================================================
UPDATE DROP EMBED
==================================================
*/

async function updateDropListMessage(
  interaction,
  dashboard
) {

  const channel =
    interaction.channel;


  const embed =
    createDropEmbed(
      dashboard
    );


  /*
  ==========================================
  JIKA SUDAH ADA MESSAGE
  ==========================================
  */

  if (
    dashboard.dropListMessageId
  ) {

    try {

      const message =
        await channel.messages.fetch(
          dashboard.dropListMessageId
        );


      patchMessage(message);

      try {

        await message.edit({
          embeds: [
            embed
          ]
        });

        dashboard.updatedAt =
          Date.now();

        return message;

      } catch (error) {

        /*
        Message bisa terhapus tepat setelah fetch().
        Anggap message hilang dan buat ulang.
        */

        dashboard.dropListMessageId =
          null;
      }

    } catch (error) {

      /*
      Message sudah dihapus
      atau tidak bisa ditemukan.
      Kita buat message baru.
      */

      dashboard.dropListMessageId =
        null;
    }
  }


  /*
  ==========================================
  CREATE MESSAGE BARU
  ==========================================
  */

  patchChannel(channel);

  if (!channel || !channel.isTextBased()) {
    throw new Error("Drop List channel tidak valid atau bukan text-based channel.");
  }

  let message;

  try {

    message =
      await channel.send({
        embeds: [
          embed
        ]
      });

  } catch (error) {

    dashboard.dropListMessageId =
      null;

    throw error;
  }

  patchMessage(message);

  dashboard.dropListMessageId =
    message.id;

  dashboard.updatedAt =
    Date.now();

  return message;
}


/*
==================================================
ADD DROP ITEMS
==================================================
*/

async function resolveStamperId(guild, stamperText) {
  const value = String(stamperText || "").trim();

  if (!value) return null;

  // Exact Discord mention copied/pasted from chat.
  const mention = value.match(/^<@!?(\d+)>$/);
  if (mention) return mention[1];

  // Allow a raw Discord user ID as a fallback.
  const numericId = value.match(/^(\d+)$/);
  if (numericId) return numericId[1];

  // Discord TextInput fields do not provide mention autocomplete.
  // Resolve a typed @username / @display-name against guild members instead.
  const query = value.replace(/^@/, "").trim().toLowerCase();
  if (!query || !guild) return null;

  const cached = guild.members.cache.find(member => {
    const username = String(member.user?.username || "").toLowerCase();
    const globalName = String(member.user?.globalName || "").toLowerCase();
    const displayName = String(member.displayName || "").toLowerCase();

    return (
      username === query ||
      globalName === query ||
      displayName === query
    );
  });

  if (cached) return cached.id;

  // Search the guild when the member is not currently cached.
  try {
    const results = await guild.members.search({
      query,
      limit: 10
    });

    const exact = results.find(member => {
      const username = String(member.user?.username || "").toLowerCase();
      const globalName = String(member.user?.globalName || "").toLowerCase();
      const displayName = String(member.displayName || "").toLowerCase();

      return (
        username === query ||
        globalName === query ||
        displayName === query
      );
    });

    return exact?.id || null;
  } catch (error) {
    console.error("Gagal mencari stamper:", error);
    return null;
  }
}

async function parseDropInput(raw, guild) {
  const lines = String(raw || "")
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);

  const drops = [];
  const errors = [];

  for (let index = 0; index < lines.length; index++) {
    const parts = lines[index].split("|").map(x => x.trim());

    if (parts.length !== 3) {
      errors.push(
        `Baris ${index + 1}: format harus **Nama Item | Stamp | @User**.`
      );
      continue;
    }

    const [itemName, stampText, stamperText] = parts;

    if (!itemName) {
      errors.push(`Baris ${index + 1}: nama item kosong.`);
      continue;
    }

    if (!/^\d+$/.test(stampText)) {
      errors.push(
        `Baris ${index + 1}: stamp harus angka bulat (**${stampText}**).`
      );
      continue;
    }

    const stamp = Number(stampText);
    const isEmptyStamper =
      ["-", "none", "tidak ada"].includes(
        stamperText.toLowerCase()
      );

    const stamperId = isEmptyStamper
      ? null
      : await resolveStamperId(guild, stamperText);

    if (stamp > 0 && !stamperId) {
      errors.push(
        `Baris ${index + 1}: **${stamperText}** tidak ditemukan. ` +
        `Di modal, ketik **@username**, **@display-name**, atau paste mention Discord.`
      );
      continue;
    }

    if (
      stamp === 0 &&
      !stamperId &&
      !isEmptyStamper
    ) {
      errors.push(
        `Baris ${index + 1}: stamper **${stamperText}** tidak ditemukan. ` +
        `Gunakan **-** jika stamp 0.`
      );
      continue;
    }

    drops.push({
      itemName,
      stamp,
      stamperId
    });
  }

  return { drops, errors };
}

async function addDropItems(
  interaction,
  data,
  dashboard,
  items,
  saveData,
  updateSalaryDashboard,
  threadId,
  modeLabel = "Drop",
  responseMode = "reply"
) {
  if (!items.length) {
    await interaction.reply({
      content: "❌ Tidak ada data drop yang valid.",
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  if (items.length > 50) {
    await interaction.reply({
      content: "❌ Maksimal 50 item drop dalam satu command.",
      flags: MessageFlags.Ephemeral
    });
    return;
  }

  const added = [];
  const duplicate = [];

  for (const entry of items) {
    const itemName = entry.itemName;
    const normalizedName = normalizeItemName(itemName);
    if (!normalizedName) continue;

    const exists = dashboard.dropItems.some(
      drop => normalizeItemName(drop.itemName) === normalizedName && !drop.sold
    );

    if (exists) {
      duplicate.push(itemName);
      continue;
    }

    const stamp = Number(entry.stamp || 0);
    const stamperId = entry.stamperId || null;

    dashboard.dropItems.push({
      id: makeId("drop"),
      itemName,
      normalizedName,
      sold: false,
      saleId: null,
      gold: 0,
      stamp,
      stampers: stamp > 0 && stamperId ? { [stamperId]: stamp } : {},
      stamperId,
      createdAt: Date.now(),
      createdBy: interaction.user.id,
      updatedAt: Date.now()
    });

    added.push({ itemName, stamp, stamperId });
  }

  dashboard.updatedAt = Date.now();
  saveData(data);

  try {
    await updateDropListMessage(interaction, dashboard);
    saveData(data);
  } catch (error) {
    console.error("Gagal update Drop List:", error);
  }

  const lines = [
    `📦 **${added.length} item ${modeLabel} ditambahkan.**`,
    ...added.map(item =>
      `• **${item.itemName}** — 🏷️ ${item.stamp} stamp` +
      (item.stamperId ? ` • 👤 <@${item.stamperId}>` : "")
    )
  ];

  if (duplicate.length) {
    lines.push(
      "",
      `⚠️ **${duplicate.length} item dilewati karena masih ada di Drop List:**`,
      ...duplicate.map(item => `• ${item}`)
    );
  }

  const payload = {
    content: lines.join("\n"),
    components: []
  };

  if (responseMode === "update") {
    await interaction.update(payload);
  } else {
    await interaction.reply({
      ...payload,
      flags: MessageFlags.Ephemeral
    });
  }
}

function parseBulkDropInput(rawInput) {
  const lines = String(rawInput || "")
    .split(/\r?\n/)
    .map(x => x.trim())
    .filter(Boolean);

  if (!lines.length) return { error: "❌ Tidak ada item yang dimasukkan." };

  if (lines.length > BULK_DROP_MAX_ITEMS) {
    return {
      error:
        `❌ Maksimal **${BULK_DROP_MAX_ITEMS} item** dalam satu bulk drop. Kamu memasukkan **${lines.length} item**.`
    };
  }

  const items = [];
  const errors = [];

  for (let index = 0; index < lines.length; index++) {
    const parts = lines[index].split("|").map(x => x.trim());

    if (parts.length !== 2) {
      errors.push(`Baris ${index + 1}: format harus **Nama Item | Stamp**.`);
      continue;
    }

    const [itemName, stampText] = parts;

    if (!itemName) {
      errors.push(`Baris ${index + 1}: nama item kosong.`);
      continue;
    }

    if (!/^\d+$/.test(stampText)) {
      errors.push(`Baris ${index + 1}: stamp harus angka bulat (**${stampText}**).`);
      continue;
    }

    items.push({
      itemName,
      stamp: Number(stampText),
      stamperId: null
    });
  }

  if (errors.length) {
    return {
      error:
        "❌ **Bulk Drop dibatalkan.** Tidak ada item yang disimpan.\n\n" +
        errors.map(x => `• ${x}`).join("\n") +
        "\n\nFormat:\n`Nama Item | Stamp`"
    };
  }

  return { items };
}

function findNextDropStamperIndex(items, startIndex) {
  for (let i = startIndex; i < items.length; i++) {
    if (Number(items[i].stamp) > 0 && !items[i].stamperId) return i;
  }
  return -1;
}

function buildDropStamperComponents(token, item, index) {
  const select = new UserSelectMenuBuilder()
    .setCustomId(`drop:bulk_stamper:${token}:${index}`)
    .setPlaceholder(truncateSelectPlaceholder(`Pilih stamper untuk ${item.itemName}`))
    .setMinValues(1)
    .setMaxValues(1);

  const cancel = new ButtonBuilder()
    .setCustomId(`drop:bulk_cancel:${token}`)
    .setLabel("Batal")
    .setStyle(ButtonStyle.Danger);

  return [
    new ActionRowBuilder().addComponents(select),
    new ActionRowBuilder().addComponents(cancel)
  ];
}

function buildDropStamperSelectionText(pending, index) {
  const item = pending.items[index];
  const completed = pending.items.filter(
    x => Number(x.stamp) === 0 || x.stamperId
  ).length;

  return (
    `🏷️ **Pilih Stamper — ${index + 1}/${pending.items.length}**\n\n` +
    `📦 **Item:** ${item.itemName}\n` +
    `🏷️ **Stamp:** ${item.stamp}\n\n` +
    `Gunakan menu di bawah untuk memilih anggota yang melakukan stamp.\n` +
    `📊 Progress: **${completed}/${pending.items.length}** item siap.`
  );
}


/*
==================================================
COMMAND
==================================================
*/

module.exports = {

  data:

    new SlashCommandBuilder()

      .setName(
        "drop"
      )

      .setDescription(
        "Kelola daftar drop item raid"
      )


      /*
      ==========================================
      ADD
      ==========================================
      */

      .addSubcommand(
        sub =>
          sub

            .setName(
              "add"
            )

            .setDescription(
              "Tambahkan daftar item drop ke dashboard"
            )

            .addStringOption(
              o =>
                o

                  .setName(
                    "items"
                  )

                  .setDescription(
                    "Format: Nama Item | Stamp | @Stamper (satu item per baris)"
                  )

                  .setRequired(
                    true
                  )

                  .setMaxLength(
                    4000
                  )
            )
      )


      /*
      ==========================================
      BULK ADD
      ==========================================
      */

      .addSubcommand(
        sub =>
          sub

            .setName(
              "bulk"
            )

            .setDescription(
              "Tambahkan banyak item drop sekaligus lewat form"
            )
      )


      /*
      ==========================================
      LIST
      ==========================================
      */

      .addSubcommand(
        sub =>
          sub

            .setName(
              "list"
            )

            .setDescription(
              "Update / tampilkan Drop List embed"
            )
      )


      /*
      ==========================================
      REMOVE
      ==========================================
      */

      .addSubcommand(
        sub =>
          sub

            .setName(
              "remove"
            )

            .setDescription(
              "Hapus satu drop berdasarkan Sale ID"
            )

            .addStringOption(
              o =>
                o

                  .setName(
                    "sale_id"
                  )

                  .setDescription(
                    "Sale ID yang tampil di Drop List"
                  )

                  .setRequired(
                    true
                  )
            )
      )


      /*
      ==========================================
      CLEAR
      ==========================================
      */

      .addSubcommand(
        sub =>
          sub

            .setName(
              "clear"
            )

            .setDescription(
              "Hapus semua daftar drop pada Thread ini"
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


    /*
    ==========================================
    GET DASHBOARD
    ==========================================
    */

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
          "Gunakan `/setup` terlebih dahulu.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==========================================
    NORMALIZE
    ==========================================
    */

    if (
      !Array.isArray(
        dashboard.dropItems
      )
    ) {

      dashboard.dropItems =
        [];
    }


    if (
      !Array.isArray(
        dashboard.sales
      )
    ) {

      dashboard.sales =
        [];
    }


    if (
      !Array.isArray(
        dashboard.coHostIds
      )
    ) {

      dashboard.coHostIds =
        [];
    }


    /*
    ==========================================
    HOST / CO-HOST ONLY
    ==========================================
    */

    if (
      !isHostOrCoHost(
        interaction,
        dashboard
      )
    ) {

      await interaction.reply({

        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan command Drop pada raid ini.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const sub =
      interaction.options.getSubcommand();


    /*
    ==========================================
    BULK ADD
    ==========================================
    */

    if (
      sub ===
      "bulk"
    ) {

      const modal =
        new ModalBuilder()

          .setCustomId(
            "drop:bulk"
          )

          .setTitle(
            t(guildLanguage(interaction.guildId), "modal_bulk_drop_title")
          );


      const itemsInput =
        new TextInputBuilder()

          .setCustomId(
            "items"
          )

          .setLabel(
            t(
              guildLanguage(interaction.guildId),
              "modal_bulk_drop_label"
            )
          )

          .setPlaceholder(
            truncateTextInputPlaceholder(
              t(
                guildLanguage(interaction.guildId),
                "modal_bulk_drop_placeholder"
              )
            )
          )

          .setStyle(
            TextInputStyle.Paragraph
          )

          .setRequired(
            true
          )

          .setMaxLength(
            4000
          );


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
    ADD
    ==========================================
    */

    if (
      sub ===
      "add"
    ) {

      const raw =
        interaction.options.getString(
          "items",
          false
        );


      if (
        !raw ||
        !raw.trim()
      ) {

        await interaction.reply({

          content:
            "❌ Nama item belum diisi.",

          flags:
            MessageFlags.Ephemeral
        });

        return;
      }


      const parsed = await parseDropInput(raw, interaction.guild);

      if (parsed.errors.length) {
        await interaction.reply({
          content:
            "❌ **Drop dibatalkan.** Tidak ada item yang disimpan.\n\n" +
            parsed.errors.map(x => `• ${x}`).join("\n") +
            "\n\nFormat:\n`Nama Item | Stamp | @Stamper`",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const items = parsed.drops;


      await addDropItems(

        interaction,

        data,

        dashboard,

        items,

        saveData,

        updateSalaryDashboard,

        threadId,

        "Drop"

      );


      return;
    }


    /*
    ==========================================
    LIST
    ==========================================
    */

    if (
      sub ===
      "list"
    ) {

      try {

        await updateDropListMessage(
          interaction,
          dashboard
        );

        saveData(data);


        await interaction.reply({

          content:
            "✅ Drop List embed berhasil diperbarui.",

          flags:
            MessageFlags.Ephemeral
        });

      } catch (error) {

        console.error(
          "Drop List error:",
          error
        );


        await interaction.reply({

          content:
            "❌ Gagal membuat Drop List embed. Pastikan bot memiliki izin mengirim dan mengedit pesan di Thread.",

          flags:
            MessageFlags.Ephemeral
        });
      }


      return;
    }


    /*
    ==========================================
    REMOVE
    ==========================================
    */

    if (
      sub ===
      "remove"
    ) {

      const saleId =
        interaction.options
          .getString(
            "sale_id",
            true
          )
          .trim();


      const dropIndex =
        dashboard.dropItems.findIndex(

          drop =>
            drop.sold &&
            drop.saleId ===
            saleId

        );


      if (
        dropIndex ===
        -1
      ) {

        await interaction.reply({

          content:
            `❌ Sale ID \`${saleId}\` tidak ditemukan di Drop List Thread ini.`,

          flags:
            MessageFlags.Ephemeral
        });

        return;
      }


      const [
        removedDrop
      ] =
        dashboard.dropItems.splice(
          dropIndex,
          1
        );


      /*
      HAPUS SALE TERKAIT
      */

      const saleIndex =
        dashboard.sales.findIndex(

          sale =>
            sale.id ===
            saleId

        );


      let removedSale =
        null;


      if (
        saleIndex !==
        -1
      ) {

        [
          removedSale
        ] =
          dashboard.sales.splice(
            saleIndex,
            1
          );
      }


      dashboard.updatedAt =
        Date.now();


      saveData(data);


      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );


      /*
      UPDATE DROP LIST EMBED
      */

      try {

        await updateDropListMessage(
          interaction,
          dashboard
        );

        // Persist the Drop List message ID after edit/create.
        saveData(data);

      } catch (
        error
      ) {

        console.error(
          "Drop List update error:",
          error
        );
      }


      await interaction.reply({

        content:

          `🗑️ **Drop berhasil dihapus.**\n\n` +

          `📦 Item: **${removedDrop.itemName}**\n` +

          `🆔 Sale ID: \`${saleId}\`\n` +

          `💰 Gold: **${formatGold(
            removedDrop.gold ||
            removedSale?.gold ||
            0
          )}**\n` +

          `🏷️ Stamp: **${Number(
            removedDrop.stamp ||
            removedSale?.stamp ||
            0
          )}**\n\n` +

          (
            removedSale

              ? "✅ Data Sold juga dihapus agar salary tetap sinkron."

              : "⚠️ Data Sold dengan ID tersebut tidak ditemukan."
          ),

        flags:
          MessageFlags.Ephemeral
      });


      return;
    }


    /*
    ==========================================
    CLEAR
    ==========================================
    */

    if (
      sub ===
      "clear"
    ) {

      dashboard.dropItems =
        [];


      dashboard.updatedAt =
        Date.now();


      saveData(data);


      /*
      UPDATE EMBED
      */

      try {

        await updateDropListMessage(
          interaction,
          dashboard
        );

        // Persist the Drop List message ID after edit/create.
        saveData(data);

      } catch (
        error
      ) {

        console.error(
          "Drop List clear update error:",
          error
        );
      }


      await interaction.reply({

        content:
          "🗑️ Semua daftar drop pada Thread ini sudah dihapus.",

        flags:
          MessageFlags.Ephemeral
      });


      return;
    }
  },


  /*
  ==================================================
  MODAL SUBMIT
  ==================================================
  */

  updateDropListMessage,

  async handleModalSubmit(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard
    }
  ) {
    const threadId = interaction.channelId;
    const dashboard = getSalaryDashboard(
      data,
      interaction.guildId,
      threadId
    );

    if (!dashboard) {
      await interaction.reply({
        content:
          "❌ Thread ini belum memiliki Salary Dashboard.\n\n" +
          "Gunakan `/setup` terlebih dahulu.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (!isHostOrCoHost(interaction, dashboard)) {
      await interaction.reply({
        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menambahkan Drop.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (!Array.isArray(dashboard.dropItems)) dashboard.dropItems = [];
    if (!Array.isArray(dashboard.sales)) dashboard.sales = [];

    const raw = interaction.fields.getTextInputValue("items");
    const parsed = parseBulkDropInput(raw);

    if (parsed.error) {
      await interaction.reply({
        content: parsed.error,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const token = makeId("bulk_drop");
    const pending = {
      token,
      ownerId: interaction.user.id,
      guildId: interaction.guildId,
      channelId: interaction.channelId,
      items: parsed.items,
      currentIndex: 0,
      createdAt: Date.now()
    };

    pendingBulkDrops.set(token, pending);

    const nextIndex = findNextDropStamperIndex(pending.items, 0);

    if (nextIndex === -1) {
      pendingBulkDrops.delete(token);
      await addDropItems(
        interaction,
        data,
        dashboard,
        pending.items,
        saveData,
        updateSalaryDashboard,
        threadId,
        "Bulk Drop"
      );
      return;
    }

    pending.currentIndex = nextIndex;

    await interaction.reply({
      content: buildDropStamperSelectionText(pending, nextIndex),
      components: buildDropStamperComponents(
        pending.token,
        pending.items[nextIndex],
        nextIndex
      ),
      flags: MessageFlags.Ephemeral
    });
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
    const pending = pendingBulkDrops.get(token);

    if (!pending) {
      await interaction.reply({
        content: "❌ Sesi bulk drop sudah berakhir. Jalankan `/drop bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (pending.ownerId !== interaction.user.id) {
      await interaction.reply({
        content: "❌ Hanya orang yang menjalankan `/drop bulk` yang dapat memilih stamper.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const itemIndex = Number(index);
    if (!Number.isInteger(itemIndex) || itemIndex !== pending.currentIndex) {
      await interaction.reply({
        content: "❌ Urutan pemilihan stamper tidak valid. Jalankan `/drop bulk` lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const selectedUserId = interaction.values?.[0];
    const item = pending.items[itemIndex];

    if (!item || !selectedUserId) {
      await interaction.reply({
        content: "❌ User stamper tidak ditemukan. Silakan pilih lagi.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    item.stamperId = selectedUserId;

    const nextIndex = findNextDropStamperIndex(
      pending.items,
      itemIndex + 1
    );

    if (nextIndex === -1) {
      const dashboard = getSalaryDashboard(
        data,
        interaction.guildId,
        interaction.channelId
      );

      if (!dashboard) {
        pendingBulkDrops.delete(token);
        await interaction.update({
          content: "❌ Thread ini belum memiliki Salary Dashboard.",
          components: []
        });
        return;
      }

      if (!isHostOrCoHost(interaction, dashboard)) {
        pendingBulkDrops.delete(token);
        await interaction.update({
          content:
            "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menambahkan Drop.",
          components: []
        });
        return;
      }

      pendingBulkDrops.delete(token);

      await addDropItems(
        interaction,
        data,
        dashboard,
        pending.items,
        saveData,
        updateSalaryDashboard,
        interaction.channelId,
        "Bulk Drop",
        "update"
      );
      return;
    }

    pending.currentIndex = nextIndex;

    await interaction.update({
      content: buildDropStamperSelectionText(pending, nextIndex),
      components: buildDropStamperComponents(
        pending.token,
        pending.items[nextIndex],
        nextIndex
      )
    });
  },

  async handleBulkCancel(interaction, token) {
    const pending = pendingBulkDrops.get(token);

    if (!pending) {
      await interaction.reply({
        content: "❌ Sesi bulk drop sudah berakhir.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (pending.ownerId !== interaction.user.id) {
      await interaction.reply({
        content:
          "❌ Hanya orang yang menjalankan `/drop bulk` yang dapat membatalkan sesi ini.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    pendingBulkDrops.delete(token);

    await interaction.update({
      content: "❌ **Bulk Drop dibatalkan.** Tidak ada item yang disimpan.",
      components: []
    });
  }
};
