const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");

const DATA_JSON = path.join(__dirname, "..", "data.json");
const DATA_DIR = path.join(__dirname, "..");
const SERVER_DB_DIR = path.join(DATA_DIR, "data", "servers");
const LEGACY_DB_FILES = [
  path.join(DATA_DIR, "data.db"),
  path.join(DATA_DIR, "data", "data.db")
];

fs.mkdirSync(SERVER_DB_DIR, { recursive: true });

const databases = new Map();
function createDefaultData() {
  return {
    settings: {
      defaultStampPrice: 4,
      salaryChannelId: null,
      salaryDashboardMessageId: null,
      stampPrice: 4,
      sellerTaxPer1000: 15,
      salaryMembers: [],
      luckyZone: {
        enabled: false,
        channelId: null,
        messageId: null,
        anchorDate: "2026-08-17",
        anchorPattern: 1,
        cycleDays: 15
      }
    },
    salaryDashboards: {},
    parties: {},
    sales: [],
    raidHistory: []
  };
}

function normalizeGuildId(guildId) {
  if (!guildId) {
    throw new Error("guildId wajib diberikan untuk database per-server.");
  }
  return String(guildId);
}

function serverDbPath(guildId) {
  const id = normalizeGuildId(guildId);
  if (!/^\d+$/.test(id)) {
    throw new Error(`Guild ID tidak valid: ${id}`);
  }
  return path.join(SERVER_DB_DIR, `${id}.db`);
}

function openDatabase(guildId) {
  const id = normalizeGuildId(guildId);
  if (databases.has(id)) return databases.get(id);

  const db = new Database(serverDbPath(id));
  db.pragma("journal_mode = WAL");
  db.pragma("busy_timeout = 5000");

  db.exec(`
    CREATE TABLE IF NOT EXISTS bot_data (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL,
      updated_at INTEGER NOT NULL
    )
  `);

  databases.set(id, db);
  return db;
}

function readLegacyData() {
  // Prefer the old SQLite database because it is the latest persistent format.
  for (const file of LEGACY_DB_FILES) {
    if (!fs.existsSync(file)) continue;

    try {
      const legacyDb = new Database(file, { readonly: true });
      const row = legacyDb.prepare("SELECT data FROM bot_data WHERE id = 1").get();
      legacyDb.close();

      if (row?.data) return JSON.parse(row.data);
    } catch (error) {
      console.warn(`⚠️ Gagal membaca legacy DB ${file}: ${error.message}`);
    }
  }

  if (fs.existsSync(DATA_JSON)) {
    try {
      return JSON.parse(fs.readFileSync(DATA_JSON, "utf8"));
    } catch (error) {
      console.warn(`⚠️ Gagal membaca data.json: ${error.message}`);
    }
  }

  return null;
}

function extractGuildData(legacy, guildId) {
  const id = normalizeGuildId(guildId);
  const data = createDefaultData();
  if (!legacy || typeof legacy !== "object") return data;

  // Settings are server-specific in the new architecture.
  if (legacy.settings && typeof legacy.settings === "object") {
    data.settings = {
      ...data.settings,
      ...legacy.settings
    };
  }

  // Keep only dashboards belonging to this guild.
  for (const [key, dashboard] of Object.entries(legacy.salaryDashboards || {})) {
    if (!dashboard) continue;
    if (String(dashboard.guildId || "") !== id) continue;

    const threadId = dashboard.threadId || (key.includes(":") ? key.split(":").pop() : key);
    data.salaryDashboards[`${id}:${threadId}`] = {
      ...dashboard,
      guildId: id,
      threadId: String(threadId)
    };
  }

  // Keep only parties belonging to this guild.
  for (const [key, party] of Object.entries(legacy.parties || {})) {
    if (!party) continue;
    if (String(party.guildId || "") !== id) continue;

    const partyId = party.id || (key.includes(":") ? key.split(":").pop() : key);
    data.parties[`${id}:${partyId}`] = {
      ...party,
      guildId: id,
      id: partyId
    };
  }

  // Sales/raidHistory are now stored inside each salary dashboard.
  // Do not copy global legacy arrays because they cannot be safely attributed
  // to a guild when they have no guildId.
  data.sales = [];
  data.raidHistory = [];

  return data;
}

function initializeGuildDatabase(guildId, db) {
  const row = db.prepare("SELECT data FROM bot_data WHERE id = 1").get();
  if (row) return;

  const legacy = readLegacyData();
  const data = extractGuildData(legacy, guildId);
  saveData(data, guildId);

  if (legacy) {
    console.log(`📦 Migrated legacy data into server DB ${guildId}.`);
  }
}

function loadData(guildId) {
  const id = normalizeGuildId(guildId);
  const db = openDatabase(id);
  initializeGuildDatabase(id, db);

  const row = db.prepare("SELECT data FROM bot_data WHERE id = 1").get();
  if (!row) {
    const data = createDefaultData();
    saveData(data, id);
    return data;
  }

  try {
    return JSON.parse(row.data);
  } catch (error) {
    console.error(`❌ Data server ${id} rusak:`, error);
    throw error;
  }
}

function saveData(data, guildId) {
  const id = normalizeGuildId(guildId);
  const db = openDatabase(id);

  const jsonText = JSON.stringify(data, null, 2);

  db.prepare(`
    INSERT INTO bot_data (id, data, updated_at)
    VALUES (1, ?, ?)
    ON CONFLICT(id)
    DO UPDATE SET
      data = excluded.data,
      updated_at = excluded.updated_at
  `).run(jsonText, Date.now());
}

function hasServerDatabase(guildId) {
  return fs.existsSync(serverDbPath(guildId));
}

function listServerIds() {
  return fs.readdirSync(SERVER_DB_DIR)
    .filter(file => /^\d+\.db$/.test(file))
    .map(file => file.slice(0, -3));
}

function closeDatabase(guildId) {
  if (guildId) {
    const id = normalizeGuildId(guildId);
    const db = databases.get(id);
    if (db?.open) db.close();
    databases.delete(id);
    return;
  }

  for (const [id, db] of databases) {
    if (db.open) db.close();
    databases.delete(id);
  }
}

module.exports = {
  loadData,
  saveData,
  closeDatabase,
  hasServerDatabase,
  listServerIds,
  serverDbPath
};
