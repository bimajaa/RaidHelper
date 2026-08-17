const { getSalaryDashboard } = require("../lib/scope");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const { formatGold, isDiscordAdmin } = require("../lib/utils");

/*
==================================================
HELPERS
==================================================
*/

/*
Cari data sold berdasarkan Sale ID
atau nama item.
*/
function findSaleForDrop(drop, sales) {
  if (!Array.isArray(sales)) {
    return null;
  }

  /*
  Prioritas 1:
  Sale ID
  */
  if (drop.saleId) {
    const saleById = sales.find(
      sale =>
        sale.saleId === drop.saleId ||
        sale.id === drop.saleId
    );

    if (saleById) {
      return saleById;
    }
  }

  /*
  Prioritas 2:
  Nama item
  */
  const itemName =
    drop.itemName ||
    drop.name;

  if (!itemName) {
    return null;
  }

  return (
    sales.find(
      sale =>
        sale.itemName === itemName
    ) || null
  );
}


/*
==================================================
FORMAT DROP LIST
==================================================
*/

function formatDropList(
  dropItems,
  sales
) {
  if (
    !Array.isArray(dropItems) ||
    !dropItems.length
  ) {
    return "📋 Belum ada Drop List.";
  }

  return dropItems
    .map((drop, index) => {

      const itemName =
        drop.itemName ||
        drop.name ||
        "Unknown Item";

      const saleId =
        drop.saleId ||
        drop.id ||
        "-";

      /*
      Cari data sold item
      */
      const sale =
        findSaleForDrop(
          drop,
          sales
        );

      /*
      Ambil jumlah stamp
      dari data sold.
      */
      const stamp =
        Number(
          sale?.stamp ??
          sale?.stamps ??
          drop.stamp ??
          drop.stamps ??
          0
        );

      /*
      Jika sudah SOLD
      */
      if (
        drop.sold ||
        sale
      ) {

        const gold =
          Number(
            sale?.gold ??
            drop.gold ??
            0
          );

        const finalSaleId =
          sale?.saleId ||
          sale?.id ||
          saleId;

        return (
          `**${index + 1}. ${itemName} (${stamp} stamp)**\n` +
          `└─ ✅ **Sold — ${formatGold(gold)}**\n`
        );
      }

      /*
      Jika BELUM SOLD
      */
      return (
        `**${index + 1}. ${itemName} (${stamp} stamp)**\n` +
        `└─ ⏳ **Belum Sold**\n```
      );
    })
    .join("\n");
}


/*
==================================================
COMMAND
==================================================
*/

module.exports = {

  data: new SlashCommandBuilder()
    .setName("raid_done")
    .setDescription(
      "Hitung dan tutup hasil salary raid saat ini"
    ),

  async execute(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard,
      calculateSalary
    }
  ) {

    const threadId =
      interaction.channelId;


    /*
    ==================================================
    AMBIL DASHBOARD
    ==================================================
    */

    if (
      !data.salaryDashboards ||
      !getSalaryDashboard(
        data,
        interaction.guildId,
        threadId
      )
    ) {

      await interaction.reply({
        content:
          "❌ Salary dashboard untuk Thread ini belum dibuat.\n\n" +
          "Gunakan `/salary setup` terlebih dahulu.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    const dashboard =
      getSalaryDashboard(
        data,
        interaction.guildId,
        threadId
      );


    /*
    ==================================================
    NORMALISASI DATA
    ==================================================
    */

    if (
      !Array.isArray(
        dashboard.salaryMembers
      )
    ) {
      dashboard.salaryMembers = [];
    }

    if (
      !Array.isArray(
        dashboard.sales
      )
    ) {
      dashboard.sales = [];
    }

    if (
      !Array.isArray(
        dashboard.coHostIds
      )
    ) {
      dashboard.coHostIds = [];
    }


    /*
    ==================================================
    HOST / CO-HOST ACCESS
    ==================================================
    */

    const isHost =
      dashboard.hostId ===
      interaction.user.id;

    const isCoHost =
      dashboard.coHostIds.includes(
        interaction.user.id
      );

    if (
      !isHost &&
      !isCoHost &&
      !isDiscordAdmin(interaction)
    ) {

      await interaction.reply({
        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menjalankan `/raid_done` pada raid ini.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    HITUNG SALARY
    ==================================================
    */

    const summary =
      calculateSalary(
        dashboard
      );


    if (
      !summary.memberCount
    ) {

      await interaction.reply({
        content:
          "❌ Belum ada salary member.\n\n" +
          "Gunakan `/salary addmember` terlebih dahulu.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    RAID HISTORY
    ==================================================
    */

    if (
      !Array.isArray(
        dashboard.raidHistory
      )
    ) {
      dashboard.raidHistory = [];
    }


    const raidId =
      `raid-${Date.now()}`;


    dashboard.raidHistory.push({

      id:
        raidId,

      completedAt:
        Date.now(),

      completedBy:
        interaction.user.id,

      hostId:
        dashboard.hostId ||
        null,

      coHostIds:
        [
          ...dashboard.coHostIds
        ],

      memberIds:
        [
          ...dashboard.salaryMembers
        ],

      totalGold:
        summary.totalGold,

      totalStamp:
        summary.totalStamp,

      stampValue:
        summary.stampValue,

      sellerTax:
        summary.sellerTax,

      totalPool:
        summary.totalPool,

      salaryPerMember:
        summary.salaryPerMember,

      stampRewards:
        summary.stampRewards,

      stampRewardTotal:
        summary.stampRewardTotal,

      payouts:
        summary.payouts,

      totalPayout:
        summary.totalPayout,

      saleCount:
        dashboard.sales.length
    });


    saveData(data);


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
    HOST / CO-HOST TEXT
    ==================================================
    */

    const hostText =
      dashboard.hostId
        ? `<@${dashboard.hostId}>`
        : "Belum ditentukan";


    const coHostText =
      dashboard.coHostIds.length
        ? dashboard.coHostIds
            .map(
              id =>
                `<@${id}>`
            )
            .join(", ")
        : "Tidak ada";


    /*
    ==================================================
    DROP LIST
    ==================================================
    */

    const dropItems =
      Array.isArray(
        dashboard.dropItems
      )
        ? dashboard.dropItems

        : Array.isArray(
            dashboard.drops
          )
          ? dashboard.drops

          : [];


    const dropList =
      formatDropList(
        dropItems,
        dashboard.sales
      );


    /*
    ==================================================
    EMBED 1
    RAID RESULT
    ==================================================
    */

    const raidEmbed =
      new EmbedBuilder()
        .setColor(
          0x2ecc71
        )

        .setTitle(
          "🏁 RAID RESULT"
        )

        .setDescription(
          `🆔 **Raid ID:** \`${raidId}\`\n` +
          `👑 **Host:** ${hostText}\n` +
          `🤝 **Co-Host:** ${coHostText}`
        )

        .addFields(

          /*
          TOTAL GOLD
          */

          {
            name:
              "💰 Total Gold",

            value:
              `**${formatGold(
                summary.totalGold
              )}**`,

            inline:
              true
          },


          /*
          TOTAL STAMP
          */

          {
            name:
              "🏷️ Total Stamp",

            value:
              `**${summary.totalStamp}**`,

            inline:
              true
          },


          /*
          STAMP VALUE
          */

          {
            name:
              "💵 Stamp Value",

            value:
              `**${formatGold(
                summary.stampValue
              )}**`,

            inline:
              true
          },


          /*
          SELLER TAX
          */

          {
            name:
              "🏦 Seller Tax",

            value:
              `**${formatGold(
                summary.sellerTax
              )}**`,

            inline:
              true
          },


          /*
          CLEAN SALARY
          */

          {
            name:
              "💵 Clean Salary",

            value:
              `**${formatGold(
                summary.totalPool
              )}**`,

            inline:
              true
          },


          /*
          SOLD ITEMS
          */

          // {
          //   name:
          //     "📦 Sold Items",

          //   value:
          //     `**${dashboard.sales.length} item**`,

          //   inline:
          //     true
          // },


          /*
          MEMBERS
          */

          {
            name:
              "👥 Members",

            value:
              `**${summary.memberCount} member**`,

            inline:
              true
          },


          /*
          DROP LIST
          */

          {
            name:
              "📋 Drop List",

            value:
              dropList.length > 1024
                ? dropList.substring(
                    0,
                    1020
                  ) + "..."
                : dropList,

            inline:
              false
          }
        )

        .setFooter({
          text:
            "PEMBANTU RAID • Raid Finish"
        })

        .setTimestamp();


    /*
    ==================================================
    EMBED 2
    SALARY RESULT
    ==================================================
    */

    const salaryLines = [];


    for (
      const userId
      of dashboard.salaryMembers
    ) {

      /*
      Base salary
      */

      const baseSalary =
        Number(
          summary.salaryPerMember ||
          0
        );


      /*
      Stamp reward
      */

      const stampReward =
        Number(
          summary
            .stampRewards
            ?.[
              userId
            ] ||
          0
        );


      /*
      Host mendapatkan Seller Tax
      */

      const isSalaryHost =
        dashboard.hostId ===
        userId;


      const sellerTax =
        isSalaryHost
          ? Number(
              summary.sellerTax ||
              0
            )
          : 0;


      /*
      Total salary user
      */

      const total =
        Number(
          summary
            .payouts
            ?.[
              userId
            ] ||

          (
            baseSalary +
            stampReward +
            sellerTax
          )
        );


      /*
      Detail salary
      */

      const details = [
        "base"
      ];


      if (
        stampReward > 0
      ) {

        details.push(
          `Stamp ${formatGold(
            stampReward
          )}`
        );
      }


      if (
        sellerTax > 0
      ) {

        details.push(
          `Tax ${formatGold(
            sellerTax
          )}`
        );
      }


      salaryLines.push(

        `👤 <@${userId}> → ` +
        `**${formatGold(
          total
        )}** ` +
        `(${details.join(
          " + "
        )})`
      );
    }


    /*
    ==================================================
    EMBED SALARY
    ==================================================
    */

    const salaryEmbed =
      new EmbedBuilder()

        .setColor(
          0x3498db
        )

        .setTitle(
          "💰 SALARY RESULT"
        )

        .setDescription(
          salaryLines.length
            ? salaryLines.join(
                "\n"
              )
            : "Belum ada salary member."
        )

        .addFields({

          name:
            "🧮 Formula",

          value:
            `Total Gold - Stamp Value - Seller Tax = Clean Salary\n` +
            `Clean Salary ÷ ${summary.memberCount} member = ` +
            `**${formatGold(
              summary.salaryPerMember
            )} / member**`
        })

        .setFooter({
          text:
            "PEMBANTU RAID • Salary Final"
        })

        .setTimestamp();


    /*
    ==================================================
    KIRIM HANYA 2 EMBED
    ==================================================
    */

    await interaction.reply({

      embeds: [
        raidEmbed,
        salaryEmbed
      ]
    });
  }
};