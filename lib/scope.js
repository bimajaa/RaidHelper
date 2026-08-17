/*
==================================================
MULTI-SERVER DATA SCOPE
==================================================

Discord channel/thread IDs are globally unique, but we still
store and validate guildId explicitly so data can never be
used from another server accidentally.
*/

function salaryKey(guildId, threadId) {
  return `${String(guildId)}:${String(threadId)}`;
}

function partyKey(guildId, partyId) {
  return `${String(guildId)}:${String(partyId)}`;
}

function ensureCollections(data) {
  if (!data.salaryDashboards || typeof data.salaryDashboards !== "object") {
    data.salaryDashboards = {};
  }
  if (!data.parties || typeof data.parties !== "object") {
    data.parties = {};
  }
}

function getSalaryDashboard(data, guildId, threadId) {
  ensureCollections(data);

  const key = salaryKey(guildId, threadId);
  let dashboard = data.salaryDashboards[key];

  // Backward compatibility with the previous threadId-only format.
  if (!dashboard && data.salaryDashboards[threadId]) {
    const legacy = data.salaryDashboards[threadId];
    if (!legacy.guildId || String(legacy.guildId) === String(guildId)) {
      dashboard = legacy;
      dashboard.guildId = String(guildId);
      data.salaryDashboards[key] = dashboard;
      delete data.salaryDashboards[threadId];
    }
  }

  if (dashboard && String(dashboard.guildId) !== String(guildId)) {
    return null;
  }

  return dashboard || null;
}

function setSalaryDashboard(data, guildId, threadId, dashboard) {
  ensureCollections(data);
  dashboard.guildId = String(guildId);
  dashboard.threadId = String(threadId);
  data.salaryDashboards[salaryKey(guildId, threadId)] = dashboard;
  return dashboard;
}

function getParty(data, guildId, partyId) {
  ensureCollections(data);

  const key = partyKey(guildId, partyId);
  let party = data.parties[key];

  // Backward compatibility for legacy party IDs.
  if (!party && data.parties[partyId]) {
    const legacy = data.parties[partyId];
    // Legacy party records without guildId are intentionally ignored until
    // startup migration resolves their channel -> guild relationship.
    if (!legacy.guildId) return null;
    if (String(legacy.guildId) !== String(guildId)) return null;
    party = legacy;
    data.parties[key] = party;
    delete data.parties[partyId];
  }

  if (party && String(party.guildId) !== String(guildId)) {
    return null;
  }

  return party || null;
}

function setParty(data, guildId, partyId, party) {
  ensureCollections(data);
  party.guildId = String(guildId);
  data.parties[partyKey(guildId, partyId)] = party;
  return party;
}

function deleteParty(data, guildId, partyId) {
  ensureCollections(data);
  const key = partyKey(guildId, partyId);
  const existed = Boolean(data.parties[key]);
  delete data.parties[key];
  if (data.parties[partyId]?.guildId === String(guildId)) {
    delete data.parties[partyId];
  }
  return existed;
}

function listGuildParties(data, guildId) {
  ensureCollections(data);
  return Object.values(data.parties).filter(p => {
    return p && String(p.guildId || "") === String(guildId);
  });
}

function migrateLegacySalaryDashboards(data) {
  ensureCollections(data);
  const entries = Object.entries(data.salaryDashboards);

  for (const [key, dashboard] of entries) {
    if (!dashboard || !dashboard.guildId || key.includes(":")) continue;

    const newKey = salaryKey(dashboard.guildId, dashboard.threadId || key);
    data.salaryDashboards[newKey] = dashboard;
    delete data.salaryDashboards[key];
  }
}

module.exports = {
  salaryKey,
  partyKey,
  ensureCollections,
  getSalaryDashboard,
  setSalaryDashboard,
  getParty,
  setParty,
  deleteParty,
  listGuildParties,
  migrateLegacySalaryDashboards
};
