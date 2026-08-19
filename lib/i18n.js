/**
 * Centralized bilingual UI layer.
 *
 * Rules:
 *  - Discord/internal identifiers are NEVER translated (customId, option value,
 *    user/channel/message IDs, URLs, command names, etc.).
 *  - Visible UI strings use explicit locale keys first.
 *  - English translation uses the locale catalog only; there is no word-by-word fallback.
 */

const { byId: LOCALE_CATALOG, byKey: LOCALE_CATALOG_BY_KEY } = require("./locale_catalog");

// Strict locale mode:
// - The locale catalog is the ONLY translation source.
// - There is NO word-by-word translation fallback.
// - If a string has no exact catalog entry, it is left unchanged.
// This prevents mixed Indonesian/English (Spanglish) output.
function getLang(data) {
  return data?.language === "en" ? "en" : "id";
}

function applyVars(value, vars) {
  if (!vars || typeof value !== "string") return value;
  for (const [name, replacement] of Object.entries(vars)) {
    value = value.split(`\${${name}}`).join(String(replacement));
  }
  return value;
}

function t(lang, key, fallback, vars = null) {
  const locale = lang === "en" ? "en" : "id";
  const value = LOCALE_CATALOG_BY_KEY?.[locale]?.[key] ?? fallback ?? key;
  return applyVars(value, vars);
}


function normalizeForLocaleLookup(text) {
  return String(text).replace(/\r\n/g, "\n");
}

// Exact catalog lookup ONLY. No word replacement and no heuristic translation.
function templateToRegex(template) {
  const token = /\$\{[^}]+\}/g;
  let last = 0;
  let out = "^";
  let match;
  while ((match = token.exec(template))) {
    out += template
      .slice(last, match.index)
      .replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    out += "(.+?)";
    last = match.index + match[0].length;
  }
  out += template
    .slice(last)
    .replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$";
  return new RegExp(out, "s");
}

function applyCatalogTemplate(text) {
  const entries = require("./locale_catalog").catalog;
  for (const entry of entries) {
    if (!entry.template || typeof entry.id !== "string") continue;
    const match = templateToRegex(entry.id).exec(text);
    if (!match) continue;
    let index = 1;
    const value = entry.en.replace(/\$\{[^}]+\}/g, () => match[index++] ?? "");
    return value;
  }
  return null;
}

// Exact catalog lookup first, then catalog-defined templates.
// There is deliberately no word-by-word or heuristic translation.
function translateIdToEn(text) {
  if (typeof text !== "string" || !text) return text;
  const normalized = normalizeForLocaleLookup(text);

  // 1) Exact catalog entry.
  if (LOCALE_CATALOG[normalized] !== undefined) return LOCALE_CATALOG[normalized];

  // 2) Explicit catalog template.
  const templated = applyCatalogTemplate(normalized);
  if (templated !== null) return templated;

  // 3) Explicit catalog segments only.
  // This is still catalog-driven: no word list, no heuristic translation.
  let result = normalized;
  const segments = require("./locale_catalog").catalog
    .filter(entry => entry.segment && !entry.template && entry.id !== entry.en)
    .sort((a, b) => b.id.length - a.id.length);

  for (const entry of segments) {
    if (result.includes(entry.id)) result = result.split(entry.id).join(entry.en);
  }
  return result;
}

function translateEnToId(text) {
  if (typeof text !== "string" || !text) return text;
  const normalized = normalizeForLocaleLookup(text);
  for (const entry of require("./locale_catalog").catalog) {
    if (entry.en === normalized) return entry.id;
  }
  return text;
}

const LOCALIZED_KEYS = new Set([
  "content","title","description","name","label","placeholder","text","footer","author","fields","options","choices"
]);

function localizeValue(value, lang, key, parentKey) {
  if (typeof value === "string") {
    if (lang !== "en") return value;
    // Select/choice values are data, not UI. Never translate them.
    if (key === "value" && (parentKey === "options" || parentKey === "choices")) return value;
    if (key === "custom_id" || key === "url" || key === "emoji") return value;
    if (key !== undefined && !LOCALIZED_KEYS.has(key)) return value;
    return translateIdToEn(value);
  }
  if (Array.isArray(value)) return value.map(v => localizeValue(v, lang, key, parentKey));
  if (value && typeof value === "object") {
    if (typeof value.toJSON === "function") {
      try { return localizeValue(value.toJSON(), lang, key, parentKey); } catch { return value; }
    }
    const result = {};
    for (const [k, v] of Object.entries(value)) {
      if (/^id$/i.test(k) || /Id$/i.test(k) || k === "custom_id" || k === "url" || k === "emoji") {
        result[k] = v;
      } else {
        result[k] = localizeValue(v, lang, k, key);
      }
    }
    return result;
  }
  return value;
}

function localizePayload(payload, lang) {
  if (!payload || lang !== "en") return payload;
  if (Array.isArray(payload)) return payload.map(v => localizeValue(v, lang));
  return localizeValue(payload, lang);
}

function guildLanguage(guildId) {
  if (!guildId) return "id";
  try {
    const { loadData } = require("./store");
    return getLang(loadData(guildId));
  } catch {
    return "id";
  }
}

function patchMethod(object, methodName, guildIdResolver, localizeIndex = 0) {
  if (!object || typeof object[methodName] !== "function") return;
  const marker = `__bilingual_${methodName}`;
  if (object[marker]) return;
  const original = object[methodName];
  Object.defineProperty(object, marker, { value: true });
  object[methodName] = function (...args) {
    const guildId = typeof guildIdResolver === "function" ? guildIdResolver.call(this) : guildIdResolver;
    const lang = guildLanguage(guildId);
    if (lang === "en" && args[localizeIndex]) args[localizeIndex] = localizePayload(args[localizeIndex], lang);
    return original.apply(this, args);
  };
}

function patchInteraction(interaction) {
  const gid = () => interaction.guildId;
  for (const name of ["reply","followUp","editReply","deferReply","deferUpdate","update","showModal"]) patchMethod(interaction, name, gid, 0);
  return interaction;
}

function patchChannel(channel) {
  if (!channel) return channel;
  const gid = () => channel.guildId || channel.guild?.id;
  patchMethod(channel, "send", gid, 0);
  return channel;
}

function patchMessage(message) {
  if (!message) return message;
  const gid = () => message.guildId || message.guild?.id;
  patchMethod(message, "edit", gid, 0);
  return message;
}

module.exports = {
  getLang,
  t,
  translateIdToEn,
  translateEnToId,
  localizePayload,
  guildLanguage,
  patchInteraction,
  patchChannel,
  patchMessage
};
