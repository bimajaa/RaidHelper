const { patchChannel, patchMessage, patchInteraction, guildLanguage, t } = require("../lib/i18n");
const {
  SlashCommandBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder,
  MessageFlags
} = require("discord.js");

const {
  setParty,
  getParty,
  deleteParty,
  listGuildParties
} = require("../lib/scope");

const {
  hasPartyAdmin
} = require("../lib/utils");

const {
  RAID_NEST_OPTIONS,
  NORMAL_NEST_OPTIONS,
  MEMORIA_NEST_OPTIONS,
  getAllowedNestModes,
  getPartyRoles,
  buildPartyEmbed,
  buildPartyComponents
} = require("../lib/party");

function nestEmoji(value) {
  if (RAID_NEST_OPTIONS.includes(value)) return "🐉";
  if (MEMORIA_NEST_OPTIONS.includes(value)) return "🌀";
  return "🏰";
}

const NEST_CHOICES = [
  ...RAID_NEST_OPTIONS.map(value => ({
    name: `${nestEmoji(value)} ${value}`.slice(0, 100),
    value
  })),
  ...NORMAL_NEST_OPTIONS.map(value => ({
    name: `${nestEmoji(value)} ${value}`.slice(0, 100),
    value
  })),
  ...MEMORIA_NEST_OPTIONS.map(value => ({
    name: `${nestEmoji(value)} ${value}`.slice(0, 100),
    value
  }))
];

const MODE_CHOICES = [
  { name: "🟢 Normal", value: "Normal" },
  { name: "🏛️ Classic", value: "Classic" },
  { name: "🔥 Hardcore", value: "Hardcore" },
  { name: "😈 Hell", value: "Hell" }
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("party")
    .setDescription("Party management")
    .addSubcommand(sub =>
      sub
        .setName("create")
        .setDescription("Buat party baru")
        .addStringOption(o =>
          o
            .setName("name")
            .setDescription("Nama party")
            .setRequired(true)
            .setMaxLength(80)
        )
        .addStringOption(o =>
          o
            .setName("nest")
            .setDescription("Pilih Raid / Normal / Memoria Nest")
            .setRequired(true)
            .addChoices(...NEST_CHOICES)
        )
        .addStringOption(o =>
          o
            .setName("mode")
            .setDescription("Pilih mode Nest sesuai jenis Nest")
            .setRequired(true)
            .addChoices(...MODE_CHOICES)
        )
        .addIntegerOption(o =>
          o
            .setName("slots")
            .setDescription("Jumlah slot party")
            .setMinValue(4)
            .setMaxValue(8)
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("edit")
        .setDescription("Edit judul party dan susunan Custom Job / slot")
        .addStringOption(o =>
          o
            .setName("party_id")
            .setDescription("ID party dari footer Embed (opsional)")
            .setRequired(false)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("list")
        .setDescription("Lihat party yang masih aktif")
    )
    .addSubcommand(sub =>
      sub
        .setName("delete")
        .setDescription("Hapus party")
        .addStringOption(o =>
          o
            .setName("party_id")
            .setDescription("ID party dari footer Embed")
            .setRequired(true)
        )
    ),

  async execute(
    interaction,
    { data, saveData, createPartyMessage, buildPartyListEmbed }
  ) {
    patchInteraction(interaction);
    const lang = guildLanguage(interaction.guildId);
    const sub = interaction.options.getSubcommand();

    if (sub === "create") {
      const name = interaction.options.getString("name");
      const nest = interaction.options.getString("nest");
      const mode = interaction.options.getString("mode");
      const maxSlots = interaction.options.getInteger("slots") || 8;

      const allowedModes = getAllowedNestModes(nest);

      if (!allowedModes.includes(mode)) {
        await interaction.reply({
          content:
            `❌ Mode **${mode}** tidak tersedia untuk **${nest}**.\n` +
            `Pilihan yang tersedia: **${allowedModes.join("**, **")}**.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const party = createPartyMessage.create({
        name,
        nest,
        nestMode: mode,
        maxSlots,
        creatorId: interaction.user.id,
        channelId: interaction.channelId,
        guildId: interaction.guildId
      });

      setParty(data, interaction.guildId, party.id, party);
      saveData(data);

      const channel =
        interaction.channel ||
        await interaction.guild?.channels
          .fetch(interaction.channelId)
          .catch(() => null);

      if (!channel || !channel.isTextBased?.()) {
        await interaction.reply({
          content:
            "❌ Bot tidak dapat mengakses channel tempat command ini dijalankan. Pastikan bot memiliki View Channel dan Send Messages.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      patchChannel(channel);
      const message = await channel.send({
        content: "@here",
        embeds: [
          buildPartyEmbed(
            party,
            interaction.guild
          )
        ],
        components: buildPartyComponents(party),
        allowedMentions: { parse: ["everyone"] }
      });

      party.messageId = message.id;
      party.updatedAt = Date.now();
      saveData(data);

      await interaction.reply({
        content:
          `✅ Party **${name}** berhasil dibuat.\nID: \`${party.id}\``,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "edit") {
      const requestedPartyId =
        interaction.options.getString("party_id", false)?.trim();

      let party = requestedPartyId
        ? getParty(data, interaction.guildId, requestedPartyId)
        : null;

      if (requestedPartyId && !party) {
        await interaction.reply({
          content: `❌ Party \`${requestedPartyId}\` tidak ditemukan.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (!party) {
        const parties = listGuildParties(data, interaction.guildId)
          .filter(p => p.status !== "CLOSED")
          .filter(p => p.channelId === interaction.channelId);

        if (!parties.length) {
          await interaction.reply({
            content:
              "❌ Tidak ada party aktif di channel ini. Gunakan `/party edit party_id:...` untuk memilih party tertentu.",
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        if (parties.length > 1) {
          await interaction.reply({
            content:
              "❌ Ada lebih dari satu party aktif di channel ini. Gunakan `/party edit party_id:PARTY_ID` agar party yang diedit jelas.",
            flags: MessageFlags.Ephemeral
          });
          return;
        }

        party = parties[0];
      }

      if (!hasPartyAdmin(interaction, party)) {
        await interaction.reply({
          content:
            "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat menggunakan `/party edit`.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (party.status !== "OPEN") {
        await interaction.reply({
          content:
            "🔒 Party harus dalam status **OPEN** sebelum Custom Job diubah.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const modal = new ModalBuilder()
        .setCustomId(`party:edit:${party.id}`)
        .setTitle(t(guildLanguage(interaction.guildId), "party_modal_title"));

      const titleInput = new TextInputBuilder()
        .setCustomId("title")
        .setLabel(t(guildLanguage(interaction.guildId), "party_modal_title_label"))
        .setPlaceholder(t(guildLanguage(interaction.guildId), "party_modal_title_placeholder"))
        .setStyle(TextInputStyle.Short)
        .setRequired(true)
        .setValue(String(party.name || "").slice(0, 80))
        .setMaxLength(80);

      const currentJobs = getPartyRoles(party).map(role => role.label);

      const jobsInput = new TextInputBuilder()
        .setCustomId("jobs")
        .setLabel(t(guildLanguage(interaction.guildId), "party_modal_jobs_label"))
        .setPlaceholder(
          t(guildLanguage(interaction.guildId), "party_modal_jobs_placeholder")
        )
        .setStyle(TextInputStyle.Paragraph)
        .setRequired(false)
        .setValue(currentJobs.join("\n").slice(0, 800))
        .setMaxLength(800);

      modal.addComponents(
        new ActionRowBuilder().addComponents(titleInput),
        new ActionRowBuilder().addComponents(jobsInput)
      );

      await interaction.showModal(modal);
      return;
    }

    if (sub === "list") {
      const active = listGuildParties(data, interaction.guildId)
        .filter(p => p.status !== "CLOSED");

      if (!active.length) {
        await interaction.reply({
          content: "Tidak ada party aktif.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      await interaction.reply({
        embeds: [buildPartyListEmbed(active)],
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "delete") {
      const partyId = interaction.options.getString("party_id");
      const party = getParty(data, interaction.guildId, partyId);

      if (!party) {
        await interaction.reply({
          content: "❌ Party tidak ditemukan.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (!hasPartyAdmin(interaction, party)) {
        await interaction.reply({
          content:
            "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat menghapus party.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      deleteParty(data, interaction.guildId, partyId);
      saveData(data);

      await interaction.reply({
        content: `🗑️ Party \`${partyId}\` berhasil dihapus dari database.`,
        flags: MessageFlags.Ephemeral
      });
    }
  },

  async handleModalSubmit(
    interaction,
    { data, saveData }
  ) {
    if (!interaction.customId.startsWith("party:edit:")) return;

    const partyId = interaction.customId.split(":")[2];
    const party = getParty(data, interaction.guildId, partyId);

    if (!party) {
      await interaction.reply({
        content: "❌ Party tidak ditemukan.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (!hasPartyAdmin(interaction, party)) {
      await interaction.reply({
        content:
          "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat mengedit party.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (party.status !== "OPEN") {
      await interaction.reply({
        content:
          "🔒 Party harus dalam status **OPEN** sebelum Custom Job diubah.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const title = interaction.fields
      .getTextInputValue("title")
      .trim();

    if (!title) {
      await interaction.reply({
        content: "❌ Judul party tidak boleh kosong.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    const raw = interaction.fields.getTextInputValue("jobs").trim();
    const currentJobs = getPartyRoles(party).map(role => String(role.label).trim());

    // Jika field Job/Slot dikosongkan atau tidak berubah, jangan sentuh
    // konfigurasi slot sama sekali. Ini membuat edit title-only aman.
    const normalizedCurrent = currentJobs.map(x =>
      x.toLowerCase().replace(/\s+/g, " ")
    );
    const jobs = raw
      ? raw.split(/\r?\n/).map(x => x.trim()).filter(Boolean)
      : null;

    const jobsChanged =
      Array.isArray(jobs) &&
      (jobs.length !== currentJobs.length ||
        jobs.some((job, index) => {
          return (
            job.toLowerCase().replace(/\s+/g, " ") !==
            normalizedCurrent[index]
          );
        }));

    if (jobsChanged) {
      if (jobs.length < 4) {
        await interaction.reply({
          content:
            "❌ Custom Party minimal **4 job/slot**.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (jobs.length > 8) {
        await interaction.reply({
          content:
            "❌ Custom Party maksimal **8 job/slot**.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const normalized = jobs.map(x => x.toLowerCase().replace(/\s+/g, " "));
      if (new Set(normalized).size !== normalized.length) {
        await interaction.reply({
          content:
            "❌ Tidak boleh ada job/slot yang sama lebih dari satu kali.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const currentMembers = Object.values(party.slots || {}).filter(Boolean);

      if (currentMembers.length > jobs.length) {
        await interaction.reply({
          content:
            `❌ Party sudah memiliki **${currentMembers.length} member**. Custom Job hanya menyediakan **${jobs.length} slot**. Tambahkan slot lebih banyak atau keluarkan member terlebih dahulu.`,
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const newSlots = {};
      jobs.forEach((job, index) => {
        newSlots[`custom_${index}`] = currentMembers[index] || null;
      });

      party.maxSlots = jobs.length;
      party.jobMode = "custom";
      party.customJobs = jobs;
      party.slots = newSlots;
    }

    party.name = title;
    party.updatedAt = Date.now();

    saveData(data);

    try {
      const channel = await interaction.guild.channels
        .fetch(party.channelId);
      const message = await channel.messages
        .fetch(party.messageId);

      patchMessage(message);
    await message.edit({
        embeds: [buildPartyEmbed(party, interaction.guild)],
        components: buildPartyComponents(party)
      });
    } catch (error) {
      console.error("Gagal memperbarui pesan party setelah edit job:", error);
    }

    await interaction.reply({
      content:
        `✅ **Party berhasil diperbarui.**\n\n` +
        `📝 Judul: **${title}**\n` +
        (jobsChanged
          ? `🎯 Custom Job / Slot:\n${jobs.map((job, i) => `${i + 1}. **${job}**`).join("\n")}\n\n`
          : `🎯 Job / Slot: **Tidak diubah**\n\n`) +
        `👥 Member yang sudah mengisi slot tetap dipertahankan.`,
      flags: MessageFlags.Ephemeral
    });
  }
};
