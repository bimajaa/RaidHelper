const { getSalaryDashboard } = require("../lib/scope");

const {
  SlashCommandBuilder,
  MessageFlags,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  EmbedBuilder
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


      await message.edit({
        embeds: [
          embed
        ]
      });


      return message;

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

  const message =
    await channel.send({
      embeds: [
        embed
      ]
    });


  dashboard.dropListMessageId =
    message.id;


  return message;
}


/*
==================================================
ADD DROP ITEMS
==================================================
*/

async function addDropItems(
  interaction,
  data,
  dashboard,
  items,
  saveData,
  updateSalaryDashboard,
  threadId,
  modeLabel = "Drop"
) {

  if (!items.length) {

    await interaction.reply({

      content:
        "❌ Tidak ada nama item yang valid.",

      flags:
        MessageFlags.Ephemeral
    });

    return;
  }


  if (items.length > 50) {

    await interaction.reply({

      content:
        "❌ Maksimal 50 item drop dalam satu command.",

      flags:
        MessageFlags.Ephemeral
    });

    return;
  }


  const added = [];
  const duplicate = [];


  /*
  ==========================================
  ADD ITEMS
  ==========================================
  */

  for (
    const itemName of items
  ) {

    const normalizedName =
      normalizeItemName(
        itemName
      );


    if (!normalizedName) {
      continue;
    }


    const exists =
      dashboard.dropItems.some(
        drop =>
          normalizeItemName(
            drop.itemName
          ) === normalizedName &&
          !drop.sold
      );


    if (exists) {

      duplicate.push(
        itemName
      );

      continue;
    }


    dashboard.dropItems.push({

      id:
        makeId("drop"),

      itemName,

      normalizedName,

      sold:
        false,

      saleId:
        null,

      gold:
        0,

      stamp:
        0,

      createdAt:
        Date.now(),

      createdBy:
        interaction.user.id,

      updatedAt:
        Date.now()
    });


    added.push(
      itemName
    );
  }


  dashboard.updatedAt =
    Date.now();


  saveData(data);


  /*
  ==========================================
  UPDATE DASHBOARD UTAMA
  ==========================================
  */

  await updateSalaryDashboard(
    interaction.guild,
    threadId
  );


  /*
  ==========================================
  UPDATE DROP LIST EMBED
  ==========================================
  */

  try {

    await updateDropListMessage(
      interaction,
      dashboard
    );

    // Persist the Drop List message ID so future updates edit
    // the same embed instead of creating a new message.
    saveData(data);

  } catch (error) {

    console.error(
      "Gagal update Drop List:",
      error
    );
  }


  /*
  ==========================================
  RESPONSE
  ==========================================
  */

  const lines = [

    `📦 **${added.length} item ${modeLabel} ditambahkan.**`,

    ...added.map(
      item =>
        `• ${item}`
    )

  ];


  if (
    duplicate.length
  ) {

    lines.push(
      "",
      `⚠️ **${duplicate.length} item dilewati karena sudah ada:**`,
      ...duplicate.map(
        item =>
          `• ${item}`
      )
    );
  }


  await interaction.reply({

    content:
      lines.join("\n"),

    flags:
      MessageFlags.Ephemeral
  });
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
                    "Satu item per baris"
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
              "bulk_add"
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
      "bulk_add"
    ) {

      const modal =
        new ModalBuilder()

          .setCustomId(
            "drop:bulk_add"
          )

          .setTitle(
            "📦 Bulk Add Drop"
          );


      const itemsInput =
        new TextInputBuilder()

          .setCustomId(
            "items"
          )

          .setLabel(
            "Daftar Item"
          )

          .setPlaceholder(
            "DDNL RING ATP\nBUKU 1\nBUKU 2\nFRAGMENT"
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


      const items =
        raw

          .split(
            /\r?\n/
          )

          .map(
            x =>
              x.trim()
          )

          .filter(
            Boolean
          );


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


      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );


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

  async handleModalSubmit(
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
    HOST / CO-HOST
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
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menambahkan Drop.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


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


    const raw =
      interaction.fields.getTextInputValue(
        "items"
      );


    const items =
      raw

        .split(
          /\r?\n/
        )

        .map(
          x =>
            x.trim()
        )

        .filter(
          Boolean
        );


    await addDropItems(

      interaction,

      data,

      dashboard,

      items,

      saveData,

      updateSalaryDashboard,

      threadId,

      "Bulk Drop"

    );
  }
};