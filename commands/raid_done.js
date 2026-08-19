const { getSalaryDashboard } = require("../lib/scope");

const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags,
  userMention
} = require("discord.js");

const { formatGold, isDiscordAdmin } = require("../lib/utils");
const { guildLanguage, t , patchInteraction} = require("../lib/i18n");

/*
==================================================
HELPERS
==================================================
*/

/*
==================================================
DISCORD USER MENTION HELPER
==================================================
*/
function formatUserMention(userId) {
  const id = String(userId || "").replace(/\D/g, "");
  return /^\d{17,20}$/.test(id) ? userMention(id) : `@${id || "unknown"}`;
}


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
  sales,
  lang = "id"
) {
  if (
    !Array.isArray(dropItems) ||
    !dropItems.length
  ) {
    return lang === "en" ? "No drops recorded yet." : "📋 Belum ada Drop List.";
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
          `└─ ✅ **${t(lang, "drop_status_sold")} — ${formatGold(gold)}**\n`
        );
      }

      /*
      Jika BELUM SOLD
      */
      return (
        `**${index + 1}. ${itemName} (${stamp} stamp)**\n` +
        `└─ ⏳ **${t(lang, "drop_status_not_sold")}**\n```
      );
    })
    .join("\n");
}


/*
==================================================
BUILD RAID RESULT EMBEDS
==================================================
*/
function buildRaidResultEmbeds({
  dashboard,
  summary,
  raidId,
  lang
}) {
  const hostText = dashboard.hostId
    ? `<@!${dashboard.hostId}>`
    : t(lang, "not_set");

  const coHostText = dashboard.coHostIds?.length
    ? dashboard.coHostIds.map(id => formatUserMention(id)).join(", ")
    : t(lang, "none");

  const dropItems = Array.isArray(dashboard.dropItems)
    ? dashboard.dropItems
    : Array.isArray(dashboard.drops)
      ? dashboard.drops
      : [];

  const sales = Array.isArray(dashboard.sales) ? dashboard.sales : [];
  const itemCount = sales.length;
  const salaryMembers = Array.isArray(dashboard.salaryMembers)
    ? dashboard.salaryMembers
    : [];

  const getSoldItemLines = () => {
    const soldDrops = dropItems.filter(drop => findSaleForDrop(drop, sales) || drop.sold);

    // Fallback: if a sold record exists without a matching drop record,
    // still show it in the final Salary Result.
    const matchedSaleIds = new Set(
      soldDrops
        .map(drop => findSaleForDrop(drop, sales))
        .filter(Boolean)
        .map(sale => sale.saleId || sale.id)
        .filter(Boolean)
    );

    const unmatchedSales = sales.filter(sale => {
      const id = sale.saleId || sale.id;
      return id ? !matchedSaleIds.has(id) : false;
    });

    const lines = soldDrops.map((drop, index) => {
      const sale = findSaleForDrop(drop, sales);
      const itemName = drop.itemName || drop.name || t(lang, "unknown_item");
      const stamp = Number(sale?.stamp ?? sale?.stamps ?? drop.stamp ?? drop.stamps ?? 0);
      const gold = Number(sale?.gold ?? drop.gold ?? 0);
      return `**${index + 1}. ${itemName}** — ${formatGold(gold)} • ${stamp} stamp`;
    });

    unmatchedSales.forEach((sale, offset) => {
      const itemName = sale.itemName || sale.name || t(lang, "unknown_item");
      const stamp = Number(sale.stamp ?? sale.stamps ?? 0);
      const gold = Number(sale.gold ?? 0);
      lines.push(`**${soldDrops.length + offset + 1}. ${itemName}** — ${formatGold(gold)} • ${stamp} stamp`);
    });

    return lines;
  };

  const soldItemLines = getSoldItemLines();
  const soldItemFields = [];
  if (soldItemLines.length) {
    let chunk = [];
    let chunkLength = 0;
    for (const line of soldItemLines) {
      const nextLength = chunkLength + line.length + (chunk.length ? 1 : 0);
      if (chunk.length && nextLength > 1024) {
        soldItemFields.push(chunk.join("\n"));
        chunk = [];
        chunkLength = 0;
      }
      chunk.push(line);
      chunkLength += line.length + (chunk.length > 1 ? 1 : 0);
    }
    if (chunk.length) soldItemFields.push(chunk.join("\n"));
  } else {
    soldItemFields.push(t(lang, "raid_done_no_sold_items"));
  }


  /*
  ==================================================
  EMBED 1 — SALARY RESULT
  ==================================================
  */
  const salaryResultEmbed = new EmbedBuilder()
    .setColor(0x2ecc71)
    .setTitle(`💰 ${t(lang, "salary_result_title")}`)
    .setDescription(
      `🆔 **${t(lang, "raid_id")}:** \`${raidId}\`  •  ` +
      `👑 **${t(lang, "host")}:** ${hostText}  •  ` +
      `🤝 **${t(lang, "cohost")}:** ${coHostText}`
    )
    .addFields(
      {
        name: `💰 ${t(lang, "total_gold")}`,
        value: `**${formatGold(summary.totalGold)}**`,
        inline: true
      },
      {
        name: `🧹 ${t(lang, "clean_salary")}`,
        value: `**${formatGold(summary.totalPool)}**`,
        inline: true
      },
      {
        name: `💵 ${t(lang, "dashboard_salary_per_member")}`,
        value: `**${formatGold(summary.salaryPerMember)}**`,
        inline: true
      },
      {
        name: `💸 ${t(lang, "dashboard_total_payout")}`,
        value: `**${formatGold(summary.totalPayout)}**`,
        inline: true
      },
      {
        name: `🏷️ ${t(lang, "total_stamp")}`,
        value: `**${summary.totalStamp}**`,
        inline: true
      },
      {
        name: `💵 ${t(lang, "stamp_value")}`,
        value: `**${formatGold(summary.stampValue)}**`,
        inline: true
      },
      {
        name: `🏦 ${t(lang, "seller_tax")}`,
        value: `**${formatGold(summary.sellerTax)}**`,
        inline: true
      },
      {
        name: `👥 ${t(lang, "members")}`,
        value: `**${summary.memberCount}**`,
        inline: true
      },
      {
        name: `📦 ${t(lang, "raid_done_sold_items")}`,
        value: `**${itemCount}**`,
        inline: true
      },
      {
        name: `📐 ${t(lang, "raid_done_remainder")}`,
        value: `**${formatGold(summary.unallocatedGold)}**`,
        inline: true
      },
      ...soldItemFields.map((value, index) => ({
        name: `📋 ${t(lang, "raid_done_sold_items_list")}${soldItemFields.length > 1 ? ` ${index + 1}` : ""}`,
        value,
        inline: false
      }))
    )
    .setFooter({
      text: `${t(lang, "bot_name")} • ${t(lang, "salary_result_title")} • ${raidId}`
    })
    .setTimestamp();

  /*
  ==================================================
  EMBED 2 — SALARY / USER MEMBER
  ==================================================
  */
  const salaryLines = salaryMembers.map((userId, index) => {
    const baseSalary = Number(summary.salaryPerMember || 0);
    const stampReward = Number(summary.stampRewards?.[userId] || 0);
    const sellerTax = dashboard.hostId === userId
      ? Number(summary.sellerTax || 0)
      : 0;
    const total = Number(
      summary.payouts?.[userId] ?? (baseSalary + stampReward + sellerTax)
    );

    const details = [
      `💵 ${t(lang, "raid_done_base_salary")}: ${formatGold(baseSalary)}`,
      `🏷️ ${t(lang, "dashboard_stamp_reward")}: ${formatGold(stampReward)}`
    ];

    if (sellerTax > 0) {
      details.push(
        `🏦 ${t(lang, "seller_tax")}: ${formatGold(sellerTax)}`
      );
    }

    return (
      `${index + 1}. <@${userId}> → **${formatGold(total)}**\n` +
      `　${details.join(" • ")}\n` +
      `　💰 **${t(lang, "raid_done_total_salary")}: ${formatGold(total)}**`
    );
  });

  let salaryDescription =
    `${summary.memberCount} ${t(lang, "members")}  •  ` +
    `${t(lang, "dashboard_salary_per_member")}: **${formatGold(summary.salaryPerMember)}**  •  ` +
    `${t(lang, "dashboard_total_payout")}: **${formatGold(summary.totalPayout)}**`;

  if (salaryLines.length) {
    const memberText = salaryLines.join("\n\n");
    const maxDescriptionLength = 4096;
    const available = maxDescriptionLength - salaryDescription.length - 2;

    if (memberText.length <= available) {
      salaryDescription += `\n\n${memberText}`;
    } else {
      salaryDescription += `\n\n${memberText.slice(0, Math.max(0, available - 40))}\n…`;
    }
  } else {
    salaryDescription += `\n\n${t(lang, "raid_done_no_salary_members")}`;
  }

  const salaryMemberEmbed = new EmbedBuilder()
    .setColor(0x3498db)
    .setTitle(`👥 ${t(lang, "raid_done_salary_members_title")}`)
    .setDescription(salaryDescription);

  const nonMemberPayouts = Object.entries(summary.payouts || {})
    .filter(([userId, amount]) => !salaryMembers.includes(userId) && Number(amount) > 0);

  if (nonMemberPayouts.length) {
    const otherStampersText = nonMemberPayouts
      .map(([userId, amount]) =>
        `• <@${userId}> → **${formatGold(amount)}**`
      )
      .join("\n");

    salaryMemberEmbed.addFields({
      name: `🏷️ ${t(lang, "raid_done_other_stampers")}`,
      value: otherStampersText.slice(0, 1024),
      inline: false
    });
  }

  salaryMemberEmbed
    .setFooter({
      text: `${t(lang, "bot_name")} • ${t(lang, "raid_done_salary_members_title")} • ${raidId}`
    })
    .setTimestamp();

  /*
  ==================================================
  EMBED 3 — FORMULA
  ==================================================
  */
  const baseRemainder = summary.memberCount > 0
    ? Math.max(0, summary.totalPool - (summary.salaryPerMember * summary.memberCount))
    : 0;

  const formulaEmbed = new EmbedBuilder()
    .setColor(0x9b59b6)
    .setTitle(`🧮 ${t(lang, "formula")}`)
    .setDescription(t(lang, "raid_done_formula_description"))
    .addFields(
      {
        name: `1️⃣ ${t(lang, "clean_salary")}`,
        value:
          `${formatGold(summary.totalGold)} − ${formatGold(summary.stampValue)} − ${formatGold(summary.sellerTax)}\n` +
          `= **${formatGold(summary.totalPool)}**`,
        inline: true
      },
      {
        name: `2️⃣ ${t(lang, "dashboard_salary_per_member")}`,
        value:
          `${formatGold(summary.totalPool)} ÷ ${summary.memberCount}\n` +
          `= **${formatGold(summary.salaryPerMember)}**`,
        inline: true
      },
      {
        name: `3️⃣ ${t(lang, "dashboard_stamp_reward")}`,
        value:
          `${summary.totalStamp} × ${formatGold(summary.stampPrice)}\n` +
          `= **${formatGold(summary.stampValue)}**`,
        inline: true
      },
      {
        name: `4️⃣ ${t(lang, "seller_tax")}`,
        value:
          `⌊${formatGold(summary.totalGold)} ÷ 1,000⌋ × ${formatGold(summary.sellerTaxPer1000)}\n` +
          `= **${formatGold(summary.sellerTax)}**`,
        inline: true
      },
      {
        name: `5️⃣ ${t(lang, "dashboard_total_payout")}`,
        value:
          `(${formatGold(summary.salaryPerMember)} × ${summary.memberCount}) + ${formatGold(summary.stampRewardTotal)} + ${formatGold(summary.sellerTax)}\n` +
          `= **${formatGold(summary.totalPayout)}**`,
        inline: true
      },
      {
        name: `6️⃣ ${t(lang, "raid_done_check")}`,
        value:
          `💰 ${formatGold(summary.totalGold)}  =  💸 ${formatGold(summary.totalPayout)}\n` +
          `📐 ${t(lang, "raid_done_remainder")}: **${formatGold(summary.unallocatedGold)}**\n` +
          `⚠️ ${t(lang, "raid_done_untracked_stamp")}: **${summary.untrackedStamp}**`,
        inline: true
      }
    )
    .addFields({
      name: `📌 ${t(lang, "raid_done_distribution_note")}`,
      value: t(lang, "raid_done_distribution_note_text"),
      inline: false
    })
    .setFooter({
      text: `${t(lang, "bot_name")} • ${t(lang, "formula")} • ${raidId}`
    })
    .setTimestamp();

  return [salaryResultEmbed, salaryMemberEmbed, formulaEmbed];
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

        patchInteraction(interaction);
const threadId =
      interaction.channelId;

    const lang = guildLanguage(interaction.guildId);


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
          `${t(lang, "raid_dashboard_missing")}\n\n` +
          t(lang, "use_salary_setup"),

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
          t(lang, "raid_access_denied"),

        flags:
          MessageFlags.Ephemeral
      });

      return;
    }


    /*
    ==================================================
    PASTIKAN SEMUA DROP SUDAH SOLD
    ==================================================

    `/raid_done` hanya boleh dijalankan setelah semua item
    yang tercatat di Drop List sudah benar-benar terjual.
    Item yang belum sold harus diselesaikan lewat `/sold`
    terlebih dahulu.
    */

    const dropItemsForCompletion =
      Array.isArray(dashboard.dropItems)
        ? dashboard.dropItems
        : [];

    const unsoldItems =
      dropItemsForCompletion.filter(
        drop => !drop.sold
      );

    if (unsoldItems.length > 0) {
      const unsoldNames = unsoldItems
        .map((drop, index) =>
          `• **${drop.itemName || t(lang, "unknown_item")}**`
        )
        .join("\n");

      await interaction.reply({
        content:
          t(lang, "raid_done_unsold_items", null, {
            count: unsoldItems.length,
            items: unsoldNames
          }),
        flags: MessageFlags.Ephemeral
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
          `${t(lang, "salary_member_required")}\n\n` +
          t(lang, "use_salary_addmember"),

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


    /*
    ==================================================
    RAID RESULT STATE
    ==================================================

    Run pertama membuat satu hasil raid.
    Run berikutnya untuk raid yang sama hanya memperbarui
    history/result yang sama dan meng-edit message lama.
    */
    const existingRaid =
      dashboard.raidDone && typeof dashboard.raidDone === "object"
        ? dashboard.raidDone
        : null;

    const raidId =
      existingRaid?.raidId ||
      `raid-${Date.now()}`;

    const raidRecord = {
      id: raidId,
      completedAt: Date.now(),
      completedBy: interaction.user.id,
      hostId: dashboard.hostId || null,
      coHostIds: [...dashboard.coHostIds],
      memberIds: [...dashboard.salaryMembers],
      totalGold: summary.totalGold,
      totalStamp: summary.totalStamp,
      stampValue: summary.stampValue,
      sellerTax: summary.sellerTax,
      totalPool: summary.totalPool,
      salaryPerMember: summary.salaryPerMember,
      stampRewards: summary.stampRewards,
      stampRewardTotal: summary.stampRewardTotal,
      payouts: summary.payouts,
      totalPayout: summary.totalPayout,
      saleCount: dashboard.sales.length
    };

    const existingHistoryIndex = dashboard.raidHistory.findIndex(
      history => history?.id === raidId
    );

    if (existingHistoryIndex >= 0) {
      dashboard.raidHistory[existingHistoryIndex] = raidRecord;
    } else {
      dashboard.raidHistory.push(raidRecord);
    }

    dashboard.raidDone = {
      ...(existingRaid || {}),
      raidId,
      completedAt: raidRecord.completedAt,
      completedBy: interaction.user.id
    };

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


    const embeds = buildRaidResultEmbeds({
      dashboard,
      summary,
      raidId,
      lang
    });

    /*
    ==================================================
    EDIT EXISTING RESULT MESSAGE / CREATE ONCE
    ==================================================
    */
    let resultMessage = null;

    // Keep explicit user IDs allowed for any mention markup that Discord parses from message content.
    // Embed text uses Discord user mention syntax generated by discord.js userMention().
    const allowedUserMentions = [
      dashboard.hostId,
      ...(Array.isArray(dashboard.coHostIds) ? dashboard.coHostIds : []),
      ...(Array.isArray(dashboard.salaryMembers) ? dashboard.salaryMembers : []),
      ...Object.keys(summary.payouts || {})
    ].filter(Boolean);

    const allowedMentions = {
      users: [...new Set(allowedUserMentions)]
    };

    if (dashboard.raidDone?.messageId) {
      try {
        const channel =
          interaction.channel?.isTextBased?.()
            ? interaction.channel
            : await interaction.guild.channels.fetch(threadId);

        resultMessage = await channel.messages.fetch(
          dashboard.raidDone.messageId
        );

        await resultMessage.edit({
          embeds,
          components: [],
          allowedMentions
        });
      } catch (error) {
        console.warn(
          `⚠️ Raid result message ${dashboard.raidDone.messageId} tidak dapat diedit: ${error.message}`
        );
        resultMessage = null;
      }
    }

    if (!resultMessage) {
      resultMessage = await interaction.channel.send({
        embeds,
        components: [],
        allowedMentions
      });

      dashboard.raidDone.messageId = resultMessage.id;
    }

    dashboard.raidDone.channelId = interaction.channelId;
    dashboard.raidDone.updatedAt = Date.now();

    saveData(data);

    await interaction.reply({
      content: t(
        lang,
        existingRaid ? "raid_done_updated" : "raid_done_completed"
      ),
      flags: MessageFlags.Ephemeral
    });
  }
};