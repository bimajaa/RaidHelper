const { t } = require("./i18n");

function buildHostGuide(dashboard, party, lang = "id") {
  const hostId = dashboard?.hostId || party?.creatorId || "0";
  return (
    `📖 **${t(lang, "guide_title")}**\n` +
    `👑 ${t(lang, "dashboard_host")}: <@${hostId}>\n\n` +
    `1️⃣ **${t(lang, "guide_step1")}**\n` +
    `\`/setstampprice price:5\`\n\n` +
    `2️⃣ **${t(lang, "guide_step2")}**\n` +
    `\`/salary settax tax:15\`\n` +
    `💡 ${t(lang, "guide_tax_tip")}\n\n` +
    `3️⃣ **${t(lang, "guide_step3")}**\n` +
    `\`/salary addcohost user:@User\`\n\n` +
    `4️⃣ **${t(lang, "guide_step4")}**\n` +
    `\`/drop add\`\n` +
    `\`/drop bulk\`\n\n` +
    `5️⃣ **${t(lang, "guide_step5")}**\n` +
    `\`/sold bulk\`\n\n` +
    `6️⃣ **${t(lang, "guide_step6")}**\n` +
    `\`/drop list\`\n` +
    `\`/sold_list\`\n\n` +
    `7️⃣ **${t(lang, "guide_step7")}**\n` +
    `\`/sold_remove sale_id:ID\`\n` +
    `💡 ${t(lang, "guide_remove_sold_tip")}\n\n` +
    `8️⃣ **${t(lang, "guide_step8")}**\n` +
    `\`/raid_done\`\n\n` +
    `⚠️ \`/raid_done\` ${t(lang, "guide_warning")}\n\n` +
    `💡 **${t(lang, "guide_workflow")}**`
  );
}
module.exports = { buildHostGuide };
