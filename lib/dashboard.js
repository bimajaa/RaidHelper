const { EmbedBuilder } = require("discord.js");
const { formatGold } = require("./utils");
const { calculateSalary } = require("./salary");

function limitField(text, max = 1000) {
  if (text.length <= max) return text;
  return text.slice(0, max - 35) + "\n... (lanjut di /sold_list)";
}

function formatStampers(sale, limit = 8) {
  const stampers = sale && typeof sale.stampers === "object" && sale.stampers
    ? sale.stampers
    : {};

  const entries = Object.entries(stampers)
    .filter(([, count]) => Number(count) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  if (!entries.length) {
    return "Belum tercatat";
  }

  const lines = entries.slice(0, limit).map(
    ([userId, count]) => `• <@${userId}> × **${Number(count)}**`
  );

  if (entries.length > limit) {
    lines.push(`• ... +${entries.length - limit} stamper lainnya`);
  }

  return lines.join("\n");
}

function buildItemsSummary(sales, stampPrice, limit = 8) {
  if (!sales.length) {
    return "Belum ada item terjual.";
  }

  const recent = sales.slice(-limit).reverse();

  const lines = recent.map((sale, index) => {
    const stampCount = Number(sale.stamp || 0);
    const stampValue = stampCount * Number(stampPrice || 0);
    const stampers = formatStampers(sale, 5)
      .replace(/\n/g, " | ");

    return (
      `**${index + 1}. ${sale.itemName}** — ${formatGold(sale.gold)}\n` +
      `🏷️ ${stampCount} stamp • 💵 ${formatGold(stampValue)} • 👤 ${stampers}`
    );
  });

  if (sales.length > limit) {
    lines.push(`\n_...dan ${sales.length - limit} item lainnya. Gunakan /sold_list untuk melihat daftar lengkap._`);
  }

  return limitField(lines.join("\n\n"));
}

function buildStampSummary(stampRewards) {
  const entries = Object.entries(stampRewards || {})
    .filter(([, value]) => Number(value) > 0)
    .sort((a, b) => Number(b[1]) - Number(a[1]));

  if (!entries.length) {
    return "Belum ada stamp yang tercatat per user.";
  }

  const lines = entries.slice(0, 15).map(([userId, reward]) => {
    const count = reward;
    return `• <@${userId}> — **${formatGold(count)}**`;
  });

  if (entries.length > 15) {
    lines.push(`• ... +${entries.length - 15} user lainnya`);
  }

  return limitField(lines.join("\n"));
}

function buildSalaryEmbed(dashboard) {
  if (!dashboard) {
    return new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle("💰 RAID DASHBOARD")
      .setDescription("❌ Salary dashboard tidak ditemukan.")
      .setTimestamp();
  }

  if (!Array.isArray(dashboard.sales)) dashboard.sales = [];
  if (!Array.isArray(dashboard.salaryMembers)) dashboard.salaryMembers = [];
  if (!Array.isArray(dashboard.coHostIds)) dashboard.coHostIds = [];
  if (!dashboard.hostId) dashboard.hostId = null;

  const summary = calculateSalary(dashboard);

  const memberList = dashboard.salaryMembers.length > 0
    ? limitField(dashboard.salaryMembers.map(id => `<@${id}>`).join(", "))
    : "Belum ada member";

  const hostText = dashboard.hostId
    ? `<@${dashboard.hostId}>`
    : "Belum ditentukan";

  const coHostText = dashboard.coHostIds.length > 0
    ? dashboard.coHostIds.map(id => `<@${id}>`).join(", ")
    : "Belum ada Co-Host";

  const trackedNote = summary.untrackedStamp > 0
    ? `\n⚠️ **${summary.untrackedStamp}** stamp belum memiliki stamper.`
    : "";

  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle("💰 RAID DASHBOARD")
    .addFields(
      {
        name: "💰 Total Gold",
        value: formatGold(summary.totalGold),
        inline: true
      },
      {
        name: "👥 Members",
        value: `${summary.memberCount}`,
        inline: true
      },
      {
        name: "📦 Total Items Sold",
        value: `${dashboard.sales.length}`,
        inline: true
      },
      {
        name: "🧾 Stamp Price",
        value: `${formatGold(summary.stampPrice)} / stamp`,
        inline: true
      },
      {
        name: "🧾 Total Stamp",
        value: `${summary.totalStamp}`,
        inline: true
      },
      {
        name: "💵 Stamp Value",
        value: formatGold(summary.stampValue),
        inline: true
      },
      {
        name: "🏦 Seller Tax",
        value:
          `${formatGold(summary.sellerTaxPer1000)} / 1.000g`,
        inline: true
      },
      {
        name: "💵 Clean Salary",
        value: formatGold(summary.totalPool),
        inline: true
      },
      {
        name: "👑 Host",
        value: hostText,
        inline: true
      },
      {
        name: "🤝 Co-Host",
        value: coHostText,
        inline: true
      },
      {
        name: "👥 Member List",
        value: memberList
      },
      {
        name: "💵 Salary Summary",
        value:
          `Total Pool: **${formatGold(summary.totalPool)}**\n` +
          `Salary / Member: **${formatGold(summary.salaryPerMember)}**\n` +
          `🏷️ Stamp Reward: **${formatGold(summary.stampRewardTotal)}**\n` +
          `💰 Total Payout: **${formatGold(summary.totalPayout)}**` +
          trackedNote
      },
      {
        name: "📦 Barang & Siapa yang Stamp",
        value: buildItemsSummary(dashboard.sales, summary.stampPrice)
      },
      {
        name: "🏷️ Stamp Reward per User",
        value: buildStampSummary(summary.stampRewards)
      },
    )
    .setFooter({
      text: "PEMBANTU RAID • Party → Drop → Sold → Salary"
    })
    .setTimestamp();
}

module.exports = {
  buildSalaryEmbed
};
