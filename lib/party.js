const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  UserSelectMenuBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder
} = require("discord.js");

const config = require("../config.json");
const { memberCount, makeId } = require("./utils");

const RAID_NEST_OPTIONS = [
  "SDN - Sea Dragon Nest",
  "GDN - Green Dragon Nest",
  "DDN - Desert Dragon Nest",
  "BDN - Black Dragon Nest",
  "RDN - Red Dragon Nest"
];

const NORMAL_NEST_OPTIONS = [
  "Manti - Manticore Nest",
  "Apo - Apocalypse Nest",
  "ABN - Archbishop Nest",
  "GN - Gigantes Nest",
  "PKN - Professor K Nest",
  "TKN - Typhoon Kim Nest",
  "Guardian - Guardian Nest",
  "Mist - Mist Nest",
  "VN - Volcano Nest",
  "ATN - Arendel Trial Nest",
  "VTN - Volcano Trial Nest"
];

// Desert Dragon Memoria 1-4 (4-man content)
const MEMORIA_NEST_OPTIONS = [
  "DDN Memoria 1 - Desert Dragon Memoria 1",
  "DDN Memoria 2 - Desert Dragon Memoria 2",
  "DDN Memoria 3 - Desert Dragon Memoria 3",
  "DDN Memoria 4 - Desert Dragon Memoria 4"
];

function isRaidNest(nest) {
  return RAID_NEST_OPTIONS.includes(String(nest || ""));
}

function isMemoriaNest(nest) {
  return MEMORIA_NEST_OPTIONS.includes(String(nest || ""));
}

function getAllowedNestModes(nest) {
  if (isRaidNest(nest)) {
    return ["Normal", "Classic", "Hardcore"];
  }

  if (isMemoriaNest(nest)) {
    return ["Normal"];
  }

  if (NORMAL_NEST_OPTIONS.includes(String(nest || ""))) {
    return ["Normal", "Hell"];
  }

  return ["Normal"];
}

function getJobEmoji(roleId, label) {
  const key = String(roleId || label || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

  if (key === "mt" || key.includes("tank")) return "🛡️";
  if (key === "pr" || key === "healer" || key.includes("priest")) return "❤️";
  if (key === "ice" || key.includes("ice")) return "❄️";
  if (key === "acro" || key.includes("acro")) return "🏹";
  if (key === "sm" || key.includes("sm")) return "⚡";
  if (key === "dps" || key.includes("dps")) return "⚔️";
  if (key.includes("fu") || key.includes("dancer")) return "💃";
  if (key.includes("mc") || key.includes("ds") || key.includes("se")) return "🔥";
  if (key === "kali" || key.includes("kali")) return "🌙";

  return "⚔️";
}

function isNormalNest(nest) {
  return NORMAL_NEST_OPTIONS.includes(String(nest || ""));
}

/**
 * Menentukan layout party berdasarkan jenis Nest.
 * Normal Nest / Memoria = 4 slot + template 4 slot.
 * Raid Nest = 8 slot + template raid.
 */
function getNestPartyLayout(nest) {
  if (isNormalNest(nest) || isMemoriaNest(nest)) {
    return {
      maxSlots: 4,
      jobMode: "template",
      customJobs: null
    };
  }

  if (isRaidNest(nest)) {
    return {
      maxSlots: 8,
      jobMode: "template",
      customJobs: null
    };
  }

  return {
    maxSlots: 8,
    jobMode: "template",
    customJobs: null
  };
}

function getNormalPartyRoles() {
  return [
    { id: "normal_mt", label: "MT", emoji: "🛡️" },
    { id: "normal_healer", label: "HEALER", emoji: "❤️" },
    { id: "normal_dps1", label: "DPS", emoji: "⚔️" },
    { id: "normal_dps2", label: "DPS", emoji: "⚔️" }
  ];
}

function getPartyRoles(party) {
  if (
    party &&
    party.jobMode === "custom" &&
    Array.isArray(party.customJobs) &&
    party.customJobs.length
  ) {
    return party.customJobs.map((label, index) => {
      const cleanLabel = String(label).trim().slice(0, 80);

      return {
        id: `custom_${index}`,
        label: cleanLabel,
        emoji: getJobEmoji(`custom_${index}`, cleanLabel)
      };
    });
  }

  // Party 4 slot atau Normal Nest menggunakan template 4-slot
  // dan pemilihan job dilakukan melalui dropdown.
  if (
    party &&
    (Number(party.maxSlots) === 4 || isNormalNest(party.nest))
  ) {
    return getNormalPartyRoles();
  }

  return config.partyRoles
    .slice(0, Number(party?.maxSlots || 8))
    .map(role => {
      const copy = { ...role };

      if (copy.id === "PR") {
        copy.label = "HEALER";
      }

      copy.emoji = getJobEmoji(copy.id, copy.label);

      return copy;
    });
}

function getPartyRole(party, roleId) {
  return getPartyRoles(party).find(role => role.id === roleId) || null;
}

function roleName(roleId, party = null) {
  return (
    getPartyRole(party, roleId)?.label ||
    config.partyRoles.find(r => r.id === roleId)?.label ||
    roleId
  );
}

function roleEmoji(roleId, party = null) {
  return (
    getPartyRole(party, roleId)?.emoji ||
    config.partyRoles.find(r => r.id === roleId)?.emoji ||
    "•"
  );
}

function statusText(status) {
  if (status === "OPEN") return "OPEN";
  if (status === "LOCKED") return "LOCKED";
  return "CLOSED";
}

function buildPartyEmbed(party, guild) {
  const roles = getPartyRoles(party);

  const lines = roles.map(role => {
    const userId = party.slots?.[role.id];
    return `${role.emoji || "⚔️"} **${role.label}** : ${userId ? `<@${userId}>` : "Empty"}`;
  });

  const creator = `<@${party.creatorId}>`;
  const notes = config.partyNotes.map(x => x).join("\n");
  const jobMode = party.jobMode === "custom" ? "Custom Job" : "Template";

  return new EmbedBuilder()
    .setColor(
      party.status === "OPEN"
        ? 0x2ecc71
        : party.status === "LOCKED"
          ? 0xf1c40f
          : 0xe74c3c
    )
    .setTitle(`⚔️ ${party.name} (${party.maxSlots} Slot)`)
    .setDescription(lines.join("\n"))
    .addFields({
      name: "────────────────────",
      value:
        `**Creator:** ${creator}\n` +
        `**Status:** ${statusText(party.status)}\n` +
        `**Members:** ${memberCount(party)}/${party.maxSlots}\n` +
        `**Nest:** ${party.nest}${party.nestMode ? ` • **${party.nestMode}**` : ""}\n` +
        `**Job Mode:** ${jobMode}\n\n` +
        notes
    })
    .setFooter({ text: `Party ID: ${party.id}` })
    .setTimestamp(party.updatedAt || party.createdAt);
}

function disabledPartyButtons(party) {
  return party.status === "CLOSED";
}

function buildPartyComponents(party) {
  const closed = disabledPartyButtons(party);
  const roles = getPartyRoles(party);
  const roleRows = [];

  /*
  ==================================================
  SLOT / JOB SELECTOR
  ==================================================
  Semua party sekarang menggunakan dropdown untuk
  memilih slot/job, baik 4 slot maupun 8 slot.
  ==================================================
  */

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`party:role_select:${party.id}`)
    .setPlaceholder("🎯 Pilih slot / job yang ingin diambil")
    .setMinValues(1)
    .setMaxValues(1)
    .setDisabled(closed);

  for (const role of roles) {
    const occupied = Boolean(party.slots?.[role.id]);

    menu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(
          `${role.label}${occupied ? " • Filled" : ""}`.slice(0, 100)
        )
        .setDescription(
          occupied
            ? `❌ Slot sudah diisi`
            : `✅ Pilih slot ${role.label}`
        )
        .setValue(role.id)
        .setEmoji(role.emoji || getJobEmoji(role.id, role.label))
        .setDefault(false)
    );
  }

  roleRows.push(
    new ActionRowBuilder().addComponents(menu)
  );

  const salaryCreated = Boolean(party.salaryThreadId);
  const salaryReady = party.status === "LOCKED";

  const management = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`party:close:${party.id}`)
      .setLabel("Close Party")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:lock:${party.id}`)
      .setLabel(party.status === "LOCKED" ? "Unlock" : "Lock")
      .setEmoji("🔒")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:salary:${party.id}`)
      .setLabel(salaryCreated ? "Salary Thread ✓" : "Create Salary Thread")
      .setEmoji("💰")
      .setStyle(ButtonStyle.Success)
      .setDisabled(closed || !salaryReady || salaryCreated),

    new ButtonBuilder()
      .setCustomId(`party:notify:${party.id}`)
      .setLabel("Notify")
      .setEmoji("📢")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:leave:${party.id}`)
      .setLabel("Leave")
      .setEmoji("🚪")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(closed)
  );

  const utility = new ActionRowBuilder().addComponents(
    new ButtonBuilder()
      .setCustomId(`party:add:${party.id}`)
      .setLabel("Add Member")
      .setEmoji("➕")
      .setStyle(ButtonStyle.Success)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:kick:${party.id}`)
      .setLabel("Kick")
      .setEmoji("🚪")
      .setStyle(ButtonStyle.Danger)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:swap:${party.id}`)
      .setLabel("Swap")
      .setEmoji("🔄")
      .setStyle(ButtonStyle.Primary)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:nest:${party.id}`)
      .setLabel("SET NEST")
      .setEmoji("🎯")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(closed),

    new ButtonBuilder()
      .setCustomId(`party:edit:${party.id}`)
      .setLabel("Edit Party")
      .setEmoji("✏️")
      .setStyle(ButtonStyle.Secondary)
      .setDisabled(closed)
  );

  return [...roleRows, management, utility];
}

function buildUserSelect(customId, placeholder, maxValues = 1) {
  return new ActionRowBuilder().addComponents(
    new UserSelectMenuBuilder()
      .setCustomId(customId)
      .setPlaceholder(placeholder)
      .setMinValues(1)
      .setMaxValues(maxValues)
  );
}

function buildRoleSelect(partyId, userId, party = null) {
  const roles = getPartyRoles(party).filter(role => {
    // Saat Add Member, hanya tampilkan slot yang masih kosong.
    // Ini juga mencegah slot yang sudah terisi muncul di dropdown.
    return party?.slots?.[role.id] == null;
  });

  if (!roles.length) {
    return null;
  }

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`party:addrole:${partyId}:${userId}`)
    .setPlaceholder("Pilih slot yang masih kosong")
    .setMinValues(1)
    .setMaxValues(1);

  for (const role of roles) {
    menu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(role.label.slice(0, 100))
        .setDescription(`Masukkan member ke ${role.label}`.slice(0, 100))
        .setValue(role.id)
        .setEmoji(role.emoji || getJobEmoji(role.id, role.label))
    );
  }

  return new ActionRowBuilder().addComponents(menu);
}

function buildKickSelect(party) {
  const options = Object.entries(party.slots || {})
    .filter(([, userId]) => userId)
    .map(([roleId, userId]) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(`${roleName(roleId, party)} - ${userId}`.slice(0, 100))
        .setDescription(`Keluarkan <@${userId}> dari party`.slice(0, 100))
        .setValue(roleId)
    );

  if (!options.length) return null;

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`party:kickselect:${party.id}`)
      .setPlaceholder("Pilih slot yang ingin di-kick")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(options)
  );
}

function buildSwapSelect(party) {
  const options = Object.entries(party.slots || {}).map(
    ([roleId, userId]) =>
      new StringSelectMenuOptionBuilder()
        .setLabel(
          `${roleName(roleId, party)} ${userId ? "• Filled" : "• Empty"}`.slice(0, 100)
        )
        .setDescription(
          userId ? `User: ${userId}` : "Slot kosong"
        )
        .setValue(roleId)
  );

  return new ActionRowBuilder().addComponents(
    new StringSelectMenuBuilder()
      .setCustomId(`party:swapselect:${party.id}`)
      .setPlaceholder("Pilih 2 slot untuk ditukar")
      .setMinValues(2)
      .setMaxValues(2)
      .addOptions(options)
  );
}

function buildNestSelect(partyId) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(`party:nestselect:${partyId}`)
    .setPlaceholder("🏰 Pilih Nest");

  const groups = [
    {
      label: "🐉 RAID NEST",
      description: "Sea / Green / Desert / Black / Red Dragon",
      options: RAID_NEST_OPTIONS
    },
    {
      label: "🏰 NORMAL NEST",
      description: "Normal Nest dengan mode Normal / Hell",
      options: NORMAL_NEST_OPTIONS
    },
    {
      label: "🐉 MEMORIA",
      description: "Desert Dragon Memoria 1-4",
      options: MEMORIA_NEST_OPTIONS
    }
  ];

  for (const group of groups) {
    for (const nest of group.options) {
      menu.addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel(String(nest).slice(0, 100))
          .setDescription(`${group.label} • ${group.description}`.slice(0, 100))
          .setValue(String(nest).slice(0, 100))
      );
    }
  }

  return new ActionRowBuilder().addComponents(menu);
}

function buildNestModeSelect(partyId, nest) {
  const modes = getAllowedNestModes(nest);

  const menu = new StringSelectMenuBuilder()
    .setCustomId(`party:nestmode:${partyId}`)
    .setPlaceholder(`⚙️ Pilih Mode • ${nest}`.slice(0, 150));

  for (const mode of modes) {
    const emoji =
      mode === "Hardcore" ? "🔥" :
      mode === "Hell" ? "😈" :
      mode === "Classic" ? "🏛️" : "🟢";

    menu.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(mode)
        .setDescription(`${nest} • Mode ${mode}`.slice(0, 100))
        .setValue(mode)
        .setEmoji(emoji)
    );
  }

  return new ActionRowBuilder().addComponents(menu);
}

function createParty({ name, nest, nestMode = null, maxSlots, creatorId, channelId, messageId = null }) {
  const slots = {};
  const effectiveMaxSlots =
    (isNormalNest(nest) || isMemoriaNest(nest))
      ? 4
      : Number(maxSlots || 8);

  const roles =
    (effectiveMaxSlots === 4 || isNormalNest(nest) || isMemoriaNest(nest))
      ? getNormalPartyRoles()
      : config.partyRoles.slice(0, effectiveMaxSlots);

  for (const role of roles) slots[role.id] = null;

  return {
    id: makeId("party"),
    name,
    nest,
    nestMode: nestMode || getAllowedNestModes(nest)[0],
    maxSlots: effectiveMaxSlots,
    creatorId,
    channelId,
    creatorId,
    channelId,
    messageId,
    status: "OPEN",
    jobMode: "template",
    customJobs: null,
    slots,
    salaryThreadId: null,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}


function getNestModeOptions(nestType) {
  const type = String(nestType || "").toLowerCase();

  if (type === "raid" || type === "raid_nest") {
    return [
      { label: "🟢 Normal", value: "normal" },
      { label: "🏛️ Classic", value: "classic" },
      { label: "🔥 Hardcore", value: "hardcore" }
    ];
  }

  return [
    { label: "🟢 Normal", value: "normal" },
    { label: "😈 Hell", value: "hell" }
  ];
}

module.exports = {
  RAID_NEST_OPTIONS,
  NORMAL_NEST_OPTIONS,
  MEMORIA_NEST_OPTIONS,
  isRaidNest,
  isMemoriaNest,
  getAllowedNestModes,
  isNormalNest,
  getNestPartyLayout,
  getPartyRoles,
  buildPartyEmbed,
  buildPartyComponents,
  buildUserSelect,
  buildRoleSelect,
  buildKickSelect,
  buildSwapSelect,
  buildNestSelect,
  buildNestModeSelect,
  createParty,
  roleName,
  roleEmoji,
  statusText
};
