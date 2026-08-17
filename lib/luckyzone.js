const path = require("node:path");
const Database = require("better-sqlite3");
const { EmbedBuilder } = require("discord.js");

const DB_PATH = path.join(__dirname, "..", "data", "lucky_zone_patterns.sqlite");
const DEFAULT_ANCHOR_DATE = "2026-08-17";
const DEFAULT_ANCHOR_PATTERN = 1;
const DEFAULT_CYCLE_DAYS = 15;
const WIB_OFFSET_MS = 7 * 60 * 60 * 1000;

let db = null;

function getDb() {
  if (!db) {
    db = new Database(DB_PATH, { readonly: true, fileMustExist: true });
  }
  return db;
}

function ensureLuckyZoneSettings(data) {
  if (!data.settings || typeof data.settings !== "object") {
    data.settings = {};
  }

  if (!data.settings.luckyZone || typeof data.settings.luckyZone !== "object") {
    data.settings.luckyZone = {};
  }

  const settings = data.settings.luckyZone;

  if (!settings.anchorDate) settings.anchorDate = DEFAULT_ANCHOR_DATE;
  if (!Number.isInteger(Number(settings.anchorPattern))) settings.anchorPattern = DEFAULT_ANCHOR_PATTERN;
  if (!Number.isInteger(Number(settings.cycleDays)) || Number(settings.cycleDays) <= 0) {
    settings.cycleDays = DEFAULT_CYCLE_DAYS;
  }
  if (settings.enabled === undefined) settings.enabled = false;
  if (!Object.prototype.hasOwnProperty.call(settings, "channelId")) settings.channelId = null;
  if (!Object.prototype.hasOwnProperty.call(settings, "messageId")) settings.messageId = null;

  return settings;
}

function getJakartaParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hourCycle: "h23"
  }).formatToParts(date);

  const values = {};
  for (const part of parts) values[part.type] = part.value;

  return {
    year: Number(values.year),
    month: Number(values.month),
    day: Number(values.day),
    hour: Number(values.hour),
    minute: Number(values.minute),
    second: Number(values.second)
  };
}

function jakartaDateKey(date = new Date()) {
  const p = getJakartaParts(date);
  return `${p.year.toString().padStart(4, "0")}-${p.month.toString().padStart(2, "0")}-${p.day.toString().padStart(2, "0")}`;
}

function dateKeyToUtcMidnight(key) {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

function addDaysToDateKey(key, days) {
  const timestamp = dateKeyToUtcMidnight(key) + Number(days) * 86400000;
  const d = new Date(timestamp);
  return `${d.getUTCFullYear().toString().padStart(4, "0")}-${(d.getUTCMonth() + 1).toString().padStart(2, "0")}-${d.getUTCDate().toString().padStart(2, "0")}`;
}

function diffDateKeys(a, b) {
  return Math.floor((dateKeyToUtcMidnight(a) - dateKeyToUtcMidnight(b)) / 86400000);
}

function getLuckyZoneBusinessDateKey(date = new Date()) {
  const key = jakartaDateKey(date);
  const parts = getJakartaParts(date);

  // LuckyZone changes at 08:00 WIB. Before 08:00, the active
  // schedule is still the previous calendar day's schedule.
  if (parts.hour < 8) {
    return addDaysToDateKey(key, -1);
  }

  return key;
}

function getPatternForDate(date = new Date(), settings = {}) {
  const anchorDate = settings.anchorDate || DEFAULT_ANCHOR_DATE;
  const anchorPattern = Number(settings.anchorPattern || DEFAULT_ANCHOR_PATTERN);
  const cycleDays = Number(settings.cycleDays || DEFAULT_CYCLE_DAYS);
  const today = getLuckyZoneBusinessDateKey(date);

  const daysSinceAnchor = diffDateKeys(today, anchorDate);
  const cycleIndex = Math.floor(daysSinceAnchor / cycleDays);
  const pattern = ((anchorPattern - 1 + cycleIndex) % 3 + 3) % 3 + 1;

  return pattern;
}

function getPatternResetDateKey(date = new Date(), settings = {}) {
  const anchorDate = settings.anchorDate || DEFAULT_ANCHOR_DATE;
  const cycleDays = Number(settings.cycleDays || DEFAULT_CYCLE_DAYS);
  const today = getLuckyZoneBusinessDateKey(date);
  const daysSinceAnchor = diffDateKeys(today, anchorDate);
  const cycleIndex = Math.floor(daysSinceAnchor / cycleDays);
  const currentCycleStart = addDaysToDateKey(anchorDate, cycleIndex * cycleDays);
  return addDaysToDateKey(currentCycleStart, cycleDays);
}

function getSchedule(pattern, monthlyDate) {
  const row = getDb().prepare(`
    SELECT
      monthly_date,
      lucky_zone_1_map,
      lucky_zone_2_map
    FROM lucky_zone_schedule
    WHERE pattern_id = (SELECT id FROM patterns WHERE name = ?)
      AND monthly_date = ?
  `).get(`Pattern ${pattern}`, Number(monthlyDate));

  return row || null;
}

function getTodaySchedule(date = new Date(), settings = {}) {
  const businessDateKey = getLuckyZoneBusinessDateKey(date);
  const [year, month, day] = businessDateKey.split("-").map(Number);
  const pattern = getPatternForDate(date, settings);
  const schedule = getSchedule(pattern, day);

  if (!schedule) {
    throw new Error(`Lucky Zone data tidak ditemukan untuk Pattern ${pattern}, tanggal ${day}.`);
  }

  return {
    pattern,
    monthlyDate: day,
    businessDateKey,
    businessYear: year,
    businessMonth: month,
    businessDay: day,
    luckyZone1: schedule.lucky_zone_1_map,
    luckyZone2: schedule.lucky_zone_2_map
  };
}

function getJakartaDateTimeFor8AM(dateKey) {
  // 08:00 WIB (UTC+7) is 01:00 UTC.
  // dateKeyToUtcMidnight() returns 00:00 UTC for the same calendar date,
  // so adding 7 hours here would incorrectly produce 14:00 WIB.
  const utc = dateKeyToUtcMidnight(dateKey) + (1 * 60 * 60 * 1000);
  return new Date(utc);
}

function getNextDailyReset(date = new Date()) {
  const key = jakartaDateKey(date);
  const p = getJakartaParts(date);
  let nextKey = key;

  if (p.hour >= 8) nextKey = addDaysToDateKey(key, 1);
  return getJakartaDateTimeFor8AM(nextKey);
}

function getNextPatternReset(date = new Date(), settings = {}) {
  const resetKey = getPatternResetDateKey(date, settings);
  return getJakartaDateTimeFor8AM(resetKey);
}

function formatIndonesianDate(date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric"
  }).format(date);
}

function formatIndonesianDateTime(date) {
  return new Intl.DateTimeFormat("id-ID", {
    timeZone: "Asia/Jakarta",
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23"
  }).format(date).replace(/\./g, ":");
}

function toDiscordTimestamp(date) {
  return Math.floor(date.getTime() / 1000);
}

function buildLuckyZoneEmbed(now = new Date(), settings = {}) {
  const schedule = getTodaySchedule(now, settings);
  const nextDailyReset = getNextDailyReset(now);
  const nextPatternReset = getNextPatternReset(now, settings);
  const nextPattern = ((schedule.pattern) % 3) + 1;
  const nextDailyUnix = toDiscordTimestamp(nextDailyReset);
  const nextPatternUnix = toDiscordTimestamp(nextPatternReset);

  return new EmbedBuilder()
    .setColor(0x00f0a8)
    .setTitle(`🍀 LuckyZone • Daily Rotation`)
    .setDescription(
      `📅 **${formatIndonesianDate(new Date(`${schedule.businessDateKey}T00:00:00Z`))}**` +
      `\n🎯 **Pattern ${schedule.pattern}**` +
      `\n\n✨ **Lucky maps aktif hari ini**` +
      `\n🔄 Reset setiap hari pada **🕗 08:00 WIB**.`
    )
    .addFields(
      {
        name: "🟢 Lucky Zone I  •  MAP AKTIF",
        value: `> 🗺️ **${schedule.luckyZone1}**`,
        inline: false
      },
      {
        name: "🔵 Lucky Zone II  •  MAP AKTIF",
        value: `> 🗺️ **${schedule.luckyZone2}**`,
        inline: false
      },
      {
        name: "⏰ RESET LUCKYZONE",
        value: `> 🕗 **<t:${nextDailyUnix}:R>**\n> 📅 <t:${nextDailyUnix}:F>`,
        inline: false
      },
      {
        name: "🔁 RESET PATTERN",
        value: `> 🎯 Pattern **${nextPattern}**\n> 🕗 **<t:${nextPatternUnix}:R>**\n> 📅 <t:${nextPatternUnix}:F>`,
        inline: false
      }
    )
    .setFooter({ text: "PEMBANTU RAID • LuckyZone • Asia/Jakarta" });
}

module.exports = {
  DB_PATH,
  ensureLuckyZoneSettings,
  getJakartaParts,
  jakartaDateKey,
  getLuckyZoneBusinessDateKey,
  getPatternForDate,
  getTodaySchedule,
  getNextDailyReset,
  getNextPatternReset,
  formatIndonesianDate,
  formatIndonesianDateTime,
  buildLuckyZoneEmbed
};
