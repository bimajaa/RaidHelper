const { EmbedBuilder } = require("discord.js");
const { formatGold } = require("./utils");
const { calculateSalary } = require("./salary");
const { guildLanguage, t } = require("./i18n");

function limitField(text, lang = "id", max = 1024) {
  if (text.length <= max) return text;
  return text.slice(0, max - 40) + `\n… (${t(lang, "dashboard_open_sold_list", "lanjut di /sold_list")})`;
}

function buildMemberList(ids, lang = "id", max = 20) {
  if (!ids.length) return t(lang, "dashboard_no_members", "_Belum ada member salary._");

  const visible = ids.slice(0, max)
    .map((id, i) => `**${i + 1}.** <@${id}>`)
    .join("\n");

  const extra = ids.length > max
    ? `\n_${t(lang, "dashboard_more_members", "+${count} member lainnya", { count: ids.length - max })}_`
    : "";

  return limitField(visible + extra, lang);
}

function buildCoHostList(ids, lang = "id") {
  if (!ids.length) return t(lang, "dashboard_no_cohost", "— Tidak ada —");
  return limitField(ids.map(id => `<@${id}>`).join(", "), lang);
}

function buildOverview(dashboard, summary, lang = "id") {
  const sold = dashboard.sales.length;
  const members = summary.memberCount;
  const stamp = summary.totalStamp;
  const tracked = summary.trackedStamp;

  const lines = [
    `💰 **${t(lang, "dashboard_total_gold", "Total Gold")}:** ${formatGold(summary.totalGold)}`,
    `🏷️ **${t(lang, "dashboard_total_stamp", "Total Stamp")}:** ${stamp}`,
    `💵 **${t(lang, "dashboard_stamp_value", "Stamp Value")}:** ${formatGold(summary.stampValue)}`,
    `📦 **${t(lang, "dashboard_total_items_sold", "Total Items Sold")}:** ${sold}`,
    `👥 **${t(lang, "dashboard_members", "Members")}:** ${members}`,
    "",
    `👤 **${t(lang, "dashboard_salary_per_member", "Salary / Member")}:** ${formatGold(summary.salaryPerMember)}  •  💰 **${t(lang, "dashboard_total_payout", "Total Payout")}:** ${formatGold(summary.totalPayout)}`
  ];

  if (tracked < stamp) {
    lines.push(
      `⚠️ ${t(lang, "dashboard_stamp_unrecorded", "${count} stamp belum tercatat", { count: stamp - tracked })}`
    );
  }

  return lines.join("\n");
}

function buildRecentSales(sales, stampPrice, lang = "id", limit = 3) {
  if (!sales.length) return t(lang, "dashboard_no_sold_items", "_Belum ada item yang terjual._");

  const recent = sales.slice(-limit).reverse();

  const lines = recent.map((sale, index) => {
    const stampCount = Number(sale.stamp || 0);
    const stampValue = stampCount * Number(stampPrice || 0);
    const stampText = t(lang, "dashboard_stamp_unit", "${count} stamp", { count: stampCount });

    return t(
      lang,
      "dashboard_sold_item_format",
      "**${number}. ${item}** — 💰 ${gold}  •  🏷️ ${stamp}",
      {
        number: index + 1,
        item: sale.itemName,
        gold: formatGold(sale.gold),
        stamp: stampText
      }
    ) + (stampValue > 0 ? ` (${formatGold(stampValue)})` : "");
  });

  if (sales.length > limit) {
    lines.push(
      `\n_${t(lang, "dashboard_more_items", "+${count} item lainnya — gunakan /sold_list", { count: sales.length - limit })}_`
    );
  }

  return limitField(lines.join("\n"), lang);
}

function buildSalaryEmbed(dashboard, guildId = null) {
  const lang = guildLanguage(guildId);

  if (!dashboard) {
    return new EmbedBuilder()
      .setColor(0xe74c3c)
      .setTitle(`💰 ${t(lang, "dashboard_title", "Raid Dashboard")}`)
      .setDescription(t(lang, "dashboard_not_found", "Salary dashboard not found."))
      .setTimestamp();
  }

  if (!Array.isArray(dashboard.sales)) dashboard.sales = [];
  if (!Array.isArray(dashboard.salaryMembers)) dashboard.salaryMembers = [];
  if (!Array.isArray(dashboard.coHostIds)) dashboard.coHostIds = [];
  if (!dashboard.hostId) dashboard.hostId = null;

  const summary = calculateSalary(dashboard);

  const hostText = dashboard.hostId
    ? `<@${dashboard.hostId}>`
    : t(lang, "dashboard_host_not_set", "Belum ditentukan");

  const coHostText = buildCoHostList(dashboard.coHostIds, lang);

  const statusText = dashboard.sales.length
    ? t(lang, "dashboard_status_tracking", "🟢 Data raid sedang dicatat")
    : t(lang, "dashboard_status_waiting", "🟡 Menunggu item terjual");

  const configuration = [
    `👑 **${t(lang, "dashboard_host", "Host")}:** ${hostText}`,
    `🤝 **${t(lang, "dashboard_cohost", "Co-Host")}:** ${coHostText}`,
    `🏷️ **${t(lang, "dashboard_stamp_price", "Stamp Price")}:** ${t(lang, "dashboard_stamp_price_format", "${value}/stamp", { value: formatGold(summary.stampPrice) })}`,
    `🏦 **${t(lang, "dashboard_seller_tax", "Seller Tax")}:** ${t(lang, "dashboard_seller_tax_format", "${value}/1.000g", { value: formatGold(summary.sellerTaxPer1000) })}`
  ].join("\n");

  const title = t(lang, "dashboard_title", "Raid Dashboard");
  const threadName = dashboard.threadName || t(lang, "dashboard_thread_name", "Salary Thread");

  return new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`💰 ${title}`)
    .setDescription(`${statusText}\n🧵 ${threadName}`)
    .addFields(
      {
        name: `📊 ${t(lang, "dashboard_overview_section", "Ringkasan")}`,
        value: buildOverview(dashboard, summary, lang),
        inline: false
      },
      {
        name: `⚙️ ${t(lang, "dashboard_configuration_section", "Konfigurasi")}`,
        value: configuration,
        inline: false
      },
      {
        name: `👥 ${t(lang, "dashboard_salary_members_section", "Salary Members")} • ${summary.memberCount}`,
        value: buildMemberList(dashboard.salaryMembers, lang),
        inline: false
      },
      {
        name: `📦 ${t(lang, "dashboard_recent_sold_section", "Preview Item Terjual")}`,
        value: buildRecentSales(dashboard.sales, summary.stampPrice, lang, 3),
        inline: false
      }
    )
    .setFooter({ text: t(lang, "bot_name", "Raid Helper") })
    .setTimestamp();
}

module.exports = { buildSalaryEmbed };
