const { getSalaryDashboard } = require("../lib/scope");
const {
  SlashCommandBuilder,
  MessageFlags
} = require("discord.js");

const {
  formatGold
} = require("../lib/utils");


module.exports = {

  /*
  ==================================================
  COMMAND
  ==================================================
  */

  data: new SlashCommandBuilder()

    .setName("sold_list")

    .setDescription(
      "Lihat semua item yang terjual di Thread ini"
    ),


  /*
  ==================================================
  EXECUTE
  ==================================================
  */

  async execute(
    interaction,
    {
      data
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
    CEK salaryDashboards
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
    PASTIKAN SALES ARRAY
    ==================================================
    */

    const sales =
      Array.isArray(
        dashboard.sales
      )
        ? dashboard.sales
        : [];


    /*
    ==================================================
    TIDAK ADA ITEM
    ==================================================
    */

    if (!sales.length) {

      await interaction.reply({

        content:
          "📦 Belum ada item terjual di Thread ini.",

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    AMBIL 20 ITEM TERAKHIR
    ==================================================
    */

    const recentSales =
      sales.slice(-20);


    /*
    ==================================================
    BUAT LIST
    ==================================================
    */

    const lines =
      recentSales.map(
        (sale, i) => {
          const stampers =
            sale.stampers &&
            typeof sale.stampers === "object"
              ? Object.entries(sale.stampers)
                  .filter(([, count]) => Number(count) > 0)
                  .map(([userId, count]) => `<@${userId}> × ${Number(count)}`)
                  .join(", ")
              : "";

          return (
            `### 📦 ${i + 1}. ${sale.itemName}\n` +
            `💰 **${formatGold(sale.gold)}**  •  🏷️ **${Number(sale.stamp || 0)} stamp**\n` +
            `👤 **Stamper:** ${stampers || "Belum tercatat"}\n` +
            `🆔 \`${sale.id}\``
          );
        }
      );


    /*
    ==================================================
    RESPONSE
    ==================================================
    */

    await interaction.reply({

      content:
        `📦 **SOLD ITEMS — THREAD INI**\n\n` +
        lines.join("\n\n") +
        `\n\n📊 Menampilkan ${recentSales.length} dari ${sales.length} item.`,

      flags:
        MessageFlags.Ephemeral
    });
  }
};