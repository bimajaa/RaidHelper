function calculateSalary(dashboard) {
  if (!dashboard) {
    return {
      stampPrice: 0,
      totalGold: 0,
      totalStamp: 0,
      stampValue: 0,
      sellerTax: 0,
      sellerTaxPer1000: 15,
      totalPool: 0,
      memberCount: 0,
      salaryPerMember: 0,
      stampRewards: {},
      stampRewardTotal: 0,
      payouts: {},
      totalPayout: 0,
      unallocatedGold: 0,
      trackedStamp: 0,
      untrackedStamp: 0,
      untrackedStampValue: 0
    };
  }

  const sales = Array.isArray(dashboard.sales)
    ? dashboard.sales
    : [];

  const salaryMembers = Array.isArray(dashboard.salaryMembers)
    ? dashboard.salaryMembers
    : [];

  const stampPrice = Number(dashboard.stampPrice || 0);

  // Seller Tax dapat diatur per 1.000g.
  // Default lama tetap 15g / 1.000g agar data lama tidak berubah.
  const sellerTaxPer1000 = Number(
    dashboard.sellerTaxPer1000 ?? 15
  );

  const totalGold = sales.reduce(
    (sum, sale) => sum + Number(sale.gold || 0),
    0
  );

  const totalStamp = sales.reduce(
    (sum, sale) => sum + Number(sale.stamp || 0),
    0
  );

  const stampValue = totalStamp * stampPrice;

  /*
  ==================================================
  SELLER TAX
  ==================================================

  Seller Tax adalah bagian khusus untuk HOST.

  Nilainya dipotong dari Clean Salary,
  lalu ditambahkan kembali khusus ke payout Host.
  */

  const sellerTax =
    Math.floor(totalGold / 1000) * sellerTaxPer1000;

  /*
  ==================================================
  CLEAN SALARY POOL
  ==================================================

  Rumus:

  Total Gold - Stamp Value - Seller Tax
  = Clean Salary
  */

  const totalPool = Math.max(
    0,
    totalGold - stampValue - sellerTax
  );

  const memberCount =
    salaryMembers.length;

  /*
  ==================================================
  BASE SALARY
  ==================================================

  Clean Salary dibagi rata kepada semua
  salary member.

  Pembulatan dilakukan ke bawah.

  Tidak ada Salary Remainder.
  */

  const salaryPerMember =
    memberCount > 0
      ? Math.floor(totalPool / memberCount)
      : 0;

  /*
  ==================================================
  STAMP REWARD PER USER
  ==================================================

  Setiap stamper mendapat:

  jumlah stamp × harga stamp
  */

  const stampRewards = {};

  let trackedStamp = 0;

  for (const sale of sales) {
    const stampers =
      sale &&
      typeof sale.stampers === "object" &&
      sale.stampers
        ? sale.stampers
        : {};

    for (const [userId, rawCount] of Object.entries(
      stampers
    )) {
      const count = Math.max(
        0,
        Number(rawCount) || 0
      );

      if (!count) continue;

      trackedStamp += count;

      stampRewards[userId] =
        (stampRewards[userId] || 0) +
        count * stampPrice;
    }
  }

  const stampRewardTotal =
    Object.values(stampRewards)
      .reduce(
        (sum, value) =>
          sum + Number(value || 0),
        0
      );

  const untrackedStamp = Math.max(
    0,
    totalStamp - trackedStamp
  );

  const untrackedStampValue =
    untrackedStamp * stampPrice;

  /*
  ==================================================
  PAYOUT PER USER
  ==================================================

  Member biasa:

  Base Salary + Stamp Reward

  Host:

  Base Salary + Stamp Reward + Seller Tax

  Tidak ada Salary Remainder.
  */

  const payouts = {};

  for (const userId of salaryMembers) {
    const base =
      salaryPerMember;

    const stampReward =
      Number(
        stampRewards[userId] || 0
      );

    payouts[userId] =
      base + stampReward;
  }

  /*
  ==================================================
  SELLER TAX UNTUK HOST
  ==================================================

  Host mendapat Seller Tax.

  Jika Host bukan salary member,
  Host tetap menerima Seller Tax
  + stamp reward jika ada.
  */

  if (dashboard.hostId) {
    const hostId =
      dashboard.hostId;

    payouts[hostId] =
      Number(payouts[hostId] || 0) +
      sellerTax;
  }

  /*
  ==================================================
  STAMPER NON-MEMBER
  ==================================================

  Stamper yang bukan salary member
  tetap menerima Stamp Reward.
  */

  for (
    const [userId, reward]
    of Object.entries(stampRewards)
  ) {
    if (!(userId in payouts)) {
      payouts[userId] =
        Number(reward || 0);
    }
  }

  /*
  ==================================================
  TOTAL PAYOUT
  ==================================================

  Allocated Clean Salary
  + Seller Tax -> Host
  + Stamp Reward
  = Total Payout

  Tidak ada Salary Remainder.
  */

  const allocatedSalaryPool =
    salaryPerMember *
    memberCount;

  const totalPayout =
    allocatedSalaryPool +
    sellerTax +
    stampRewardTotal;

  const unallocatedGold =
    Math.max(
      0,
      totalGold - totalPayout
    );

  /*
  ==================================================
  RESULT
  ==================================================
  */

  return {
    stampPrice,

    sellerTaxPer1000,

    totalGold,

    totalStamp,

    stampValue,

    sellerTax,

    totalPool,

    memberCount,

    salaryPerMember,

    stampRewards,

    stampRewardTotal,

    payouts,

    totalPayout,

    unallocatedGold,

    trackedStamp,

    untrackedStamp,

    untrackedStampValue
  };
}

module.exports = {
  calculateSalary
};