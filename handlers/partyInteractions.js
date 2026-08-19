const { buildHostGuide } = require("../lib/hostGuide");

const { guildLanguage, t } = require("../lib/i18n");
const { patchChannel, patchMessage, patchInteraction } = require("../lib/i18n");
const {
  PermissionFlagsBits,
  ChannelType,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  ActionRowBuilder
} = require("discord.js");

const {
  buildPartyEmbed,
  buildPartyComponents,
  buildUserSelect,
  buildRoleSelect,
  buildKickSelect,
  buildSwapSelect,
  buildNestSelect,
  buildNestModeSelect,
  isNormalNest,
  isMemoriaNest,
  isRaidNest,
  getNestPartyLayout,
  getPartyRoles,
  roleName,
  roleEmoji
} = require("../lib/party");

const {
  hasPartyAdmin,
  memberCount
} = require("../lib/utils");

const {
  calculateSalary
} = require("../lib/salary");

const {
  getParty,
  getSalaryDashboard: getScopedSalaryDashboard,
  setSalaryDashboard
} = require("../lib/scope");


/*
==================================================
REFRESH PARTY
==================================================
*/

async function refreshParty(interaction, party) {
  patchInteraction(interaction);
  party.updatedAt = Date.now();

  try {
    const channel =
      await interaction.guild.channels.fetch(
        party.channelId
      );

    const message =
      await channel.messages.fetch(
        party.messageId
      );

    patchMessage(message);
    await message.edit({
      content: "@here",
      embeds: [
        buildPartyEmbed(
          party,
          interaction.guild
        )
      ],
      components:
        buildPartyComponents(party),
      allowedMentions: { parse: ["everyone"] }
    });

    return true;

  } catch (error) {

    console.error(
      "Gagal refresh party:",
      error.message
    );

    return false;
  }
}


/*
==================================================
GET / CREATE SALARY DASHBOARD
==================================================
*/

function getSalaryDashboard(
  data,
  threadId,
  interaction
) {

  /*
  Pastikan object salaryDashboards tersedia
  */

  if (!data.salaryDashboards) {
    data.salaryDashboards = {};
  }

  /*
  Ambil dashboard berdasarkan Thread ID
  */

  let dashboard = getScopedSalaryDashboard(data, interaction.guildId, threadId);

  /*
  Jika belum ada dashboard,
  buat otomatis.

  Ini berguna apabila Raid Finish ditekan
  sebelum /salary setup.
  */

  if (!dashboard) {

    dashboard = {
      threadId,

      threadName:
        interaction.channel?.name ||
        "Salary",

      guildId:
        interaction.guildId,

      parentId:
        interaction.channel?.parentId ||
        null,

      messageId: null,

      stampPrice:
        Number(
          data.settings?.defaultStampPrice ??
          data.settings?.stampPrice ??
          3
        ),

      salaryMembers: [],

      hostId: interaction.user.id,
      coHostIds: [],

      sales: [],

      raidHistory: [],

      createdAt: Date.now(),

      updatedAt: Date.now()
    };

    setSalaryDashboard(data, interaction.guildId, threadId, dashboard);
  }

  /*
  Pastikan semua array tersedia
  */

  if (!Array.isArray(dashboard.salaryMembers)) {
    dashboard.salaryMembers = [];
  }

  if (!Array.isArray(dashboard.sales)) {
    dashboard.sales = [];
  }

  if (!Array.isArray(dashboard.raidHistory)) {
    dashboard.raidHistory = [];
  }

  return dashboard;
}


/*
==================================================
HOST GUIDE
==================================================
*/

function buildSalaryHostGuide(dashboard, party, lang = "id") {
  return buildHostGuide(dashboard, party, lang);
}


/*
==================================================
CREATE SALARY THREAD / FORUM POST
==================================================
*/

async function createSalaryThreadForParty(
  interaction,
  party,
  data,
  saveData,
  updateSalaryDashboard
) {
  if (!data.settings || typeof data.settings !== "object") {
    data.settings = {};
  }

  const salaryChannelId = data.settings.salaryChannelId;

  if (!salaryChannelId) {
    await interaction.reply({
      content:
        "❌ Salary Channel belum disetting.\n\n" +
        "Jalankan `/salary setchannel channel:#salary` terlebih dahulu.",
      ephemeral: true
    });
    return;
  }

  if (party.salaryThreadId) {
    const existing = await interaction.guild.channels
      .fetch(party.salaryThreadId)
      .catch(() => null);

    if (existing) {
      await interaction.reply({
        content:
          `⚠️ Salary Thread untuk party ini sudah ada: <#${party.salaryThreadId}>`,
        ephemeral: true
      });
      return;
    }

    // Thread lama sudah tidak ada, izinkan membuat ulang.
    party.salaryThreadId = null;
  }

  const salaryChannel = await interaction.guild.channels
    .fetch(salaryChannelId)
    .catch(() => null);

  if (!salaryChannel) {
    await interaction.reply({
      content:
        "❌ Salary Channel tidak ditemukan. Gunakan `/salary setchannel` untuk mengaturnya kembali.",
      ephemeral: true
    });
    return;
  }

  const allowedTypes = [
    ChannelType.GuildText,
    ChannelType.GuildAnnouncement,
    ChannelType.GuildForum
  ];

  if (!allowedTypes.includes(salaryChannel.type)) {
    await interaction.reply({
      content:
        "❌ Channel Salary harus berupa **Text Channel, Announcement Channel, atau Forum Channel**.",
      ephemeral: true
    });
    return;
  }

  const threadName = `${party.name} • Salary`;
  let thread;

  try {
    if (salaryChannel.type === ChannelType.GuildForum) {
      thread = await salaryChannel.threads.create({
        name: threadName.slice(0, 100),
        message: {
          content:
            `💰 **Salary Thread — ${party.name}**\n` +
            `👑 Host: <@${party.creatorId}>\n` +
            `🏰 Raid Nest: **${party.nest}**`
        },
        reason: `Create Salary Thread for ${party.name}`
      });
    } else {
      thread = await salaryChannel.threads.create({
        name: threadName.slice(0, 100),
        type: ChannelType.PublicThread,
        autoArchiveDuration: 1440,
        reason: `Create Salary Thread for ${party.name}`
      });
    }
  } catch (error) {
    console.error("Gagal membuat Salary Thread:", error);

    await interaction.reply({
      content:
        "❌ Gagal membuat Salary Thread. Pastikan bot memiliki permission **View Channel, Send Messages, Create Public Threads** dan akses ke channel Salary.",
      ephemeral: true
    });
    return;
  }

  const starterMessage =
    salaryChannel.type === ChannelType.GuildForum
      ? await thread.fetchStarterMessage().catch(() => null)
      : null;

  const partyMembers = Object.values(party.slots || {})
    .filter(Boolean);

  if (!partyMembers.length) {
    await thread.delete().catch(() => null);
    await interaction.reply({
      content:
        "❌ Belum ada member yang mengisi slot party. Salary Thread tidak dibuat.",
      ephemeral: true
    });
    return;
  }

  const dashboard = {
    threadId: thread.id,
    threadName: thread.name || threadName,
    guildId: interaction.guildId,
    parentId: salaryChannel.id,
    messageId: starterMessage?.id || null,
    stampPrice: Number(
      data.settings?.defaultStampPrice ??
      data.settings?.stampPrice ??
      4
    ),
    salaryMembers: [...new Set(partyMembers)],
    hostId: party.creatorId,
    coHostIds: [],
    sales: [],
    dropItems: [],
    raidHistory: [],
    partyId: party.id,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  setSalaryDashboard(
    data,
    interaction.guildId,
    thread.id,
    dashboard
  );

  party.salaryThreadId = thread.id;
  party.salaryChannelId = salaryChannel.id;
  party.updatedAt = Date.now();

  saveData(data);

  const memberMentions = [...new Set(partyMembers)]
    .map(id => `<@${id}>`)
    .join(", ");

  patchChannel(thread);
    await thread.send({
    content:
      `👥 **Salary Member:** ${memberMentions}`
  }).catch(() => null);

  await updateSalaryDashboard(
    interaction.guild,
    thread.id
  );

  await refreshParty(
    interaction,
    party
  );

  await interaction.reply({
    content:
      `✅ **Salary Thread berhasil dibuat!**\n\n` +
      `📋 Channel: <#${salaryChannel.id}>\n` +
      `🧵 Thread: <#${thread.id}>`,
    ephemeral: true
  });
}


/*
==================================================
PARTY INTERACTION
==================================================
*/

async function handlePartyInteraction(
  interaction,
  ctx
) {

  // Localize every interaction response/components for this guild.
  patchInteraction(interaction);
  const lang = guildLanguage(interaction.guildId);

  const {
    data,
    saveData,
    updateSalaryDashboard
  } = ctx;

  /*
  ==================================================
  PARTY DATA
  ==================================================
  */

  const parts =
    interaction.customId.split(":");

  const action =
    parts[1];

  const partyId =
    parts[2];

  // Host Guide berasal dari tombol di Salary Dashboard.
  // Respon dibuat ephemeral agar hanya Host yang menekan tombol yang melihatnya.
  if (action === "hostguide") {
    const lang = guildLanguage(interaction.guildId);
    const threadId = parts[3];
    const dashboard = getScopedSalaryDashboard(
      data,
      interaction.guildId,
      threadId
    );

    if (!dashboard) {
      await interaction.reply({
        content: lang === "en" ? "❌ Salary Dashboard not found." : "❌ Salary Dashboard tidak ditemukan.",
        ephemeral: true
      });
      return;
    }

    const isDiscordAdmin = Boolean(
      interaction.memberPermissions?.has("Administrator")
    );
    const isHost = dashboard.hostId === interaction.user.id;
    const isCoHost = Array.isArray(dashboard.coHostIds) &&
      dashboard.coHostIds.includes(interaction.user.id);

    if (!isHost && !isCoHost && !isDiscordAdmin) {
      await interaction.reply({
        content: t(lang, "guide_host_only"),
        ephemeral: true
      });
      return;
    }

    const party = getParty(
      data,
      interaction.guildId,
      partyId
    );

    const guide = buildSalaryHostGuide(dashboard, party, lang);

    await interaction.reply({
      content: guide,
      ephemeral: true,
      allowedMentions: { users: [interaction.user.id] }
    });
    return;
  }

  const party =
    getParty(data, interaction.guildId, partyId);


  /*
  ==================================================
  EDIT PARTY BUTTON
  ==================================================
  */

  if (
    interaction.isButton() &&
    action === "edit"
  ) {

    if (!party) {
      await interaction.reply({
        content: t(lang, "party_not_found"),
        ephemeral: true
      });
      return;
    }

    if (!hasPartyAdmin(interaction, party)) {
      await interaction.reply({
        content:
          t(lang, "party_edit_denied"),
        ephemeral: true
      });
      return;
    }

    if (party.status !== "OPEN") {
      await interaction.reply({
        content:
          t(lang, "party_edit_open_required"),
        ephemeral: true
      });
      return;
    }

    const modal = new ModalBuilder()
      .setCustomId(`party:edit:${party.id}`)
      .setTitle(t(lang, "party_modal_title"));

    const titleInput = new TextInputBuilder()
      .setCustomId("title")
      .setLabel(t(lang, "party_modal_title_label"))
      .setPlaceholder(t(lang, "party_modal_title_placeholder"))
      .setStyle(TextInputStyle.Short)
      .setRequired(true)
      .setValue(String(party.name || "").slice(0, 80))
      .setMaxLength(80);

    const currentJobs = getPartyRoles(party).map(role => role.label);

    const jobsInput = new TextInputBuilder()
      .setCustomId("jobs")
      .setLabel(t(lang, "party_modal_jobs_label"))
      .setPlaceholder(t(lang, "party_modal_jobs_placeholder"))
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


  /*
  ==================================================
  PARTY TIDAK DITEMUKAN
  ==================================================
  */

  if (!party) {

    await interaction.reply({
      content:
        t(lang, "party_not_found"),
      ephemeral: true
    });

    return;
  }


  /*
  ==================================================
  ROLE DROPDOWN
  ==================================================
  */

  if (
    interaction.isStringSelectMenu() &&
    action === "role_select"
  ) {
    const roleId = interaction.values?.[0];

    if (party.status !== "OPEN") {
      await interaction.reply({
        content: t(lang, "party_locked_closed"),
        ephemeral: true
      });
      return;
    }

    if (!(roleId in party.slots)) {
      await interaction.reply({
        content: t(lang, "party_slot_unavailable"),
        ephemeral: true
      });
      return;
    }

    if (party.slots[roleId]) {
      await interaction.reply({
        content:
          t(lang, "party_slot_occupied", null, { role: roleName(roleId, party), userId: party.slots[roleId] }),
        ephemeral: true
      });
      return;
    }

    const currentSlot =
      Object.entries(party.slots || {}).find(
        ([, id]) => id === interaction.user.id
      );

    if (currentSlot) {
      await interaction.reply({
        content:
          t(lang, "party_already_in_slot", null, { role: roleName(currentSlot[0], party) }),
        ephemeral: true
      });
      return;
    }

    if (memberCount(party) >= party.maxSlots) {
      await interaction.reply({
        content: t(lang, "party_full"),
        ephemeral: true
      });
      return;
    }

    party.slots[roleId] = interaction.user.id;
    saveData(data);

    await refreshParty(interaction, party);

    await interaction.reply({
      content:
        t(lang, "party_joined_slot", null, { role: roleName(roleId, party) }),
      ephemeral: true
    });
    return;
  }

  /*
  ==================================================
  BUTTON
  ==================================================
  */

  if (interaction.isButton()) {


    /*
    ================================================
    ROLE
    ================================================
    */

    if (action === "role") {

      const roleId =
        parts[3];

      if (party.status !== "OPEN") {

        await interaction.reply({
          content:
            t(lang, "party_locked_closed"),
          ephemeral: true
        });

        return;
      }

      if (!(roleId in party.slots)) {

        await interaction.reply({
          content:
            t(lang, "party_slot_unavailable"),
          ephemeral: true
        });

        return;
      }

      if (party.slots[roleId]) {

        await interaction.reply({
          content:
            t(lang, "party_slot_occupied", null, { role: roleId, userId: party.slots[roleId] }),
          ephemeral: true
        });

        return;
      }

      const currentSlot =
        Object.entries(
          party.slots
        ).find(
          ([, id]) =>
            id === interaction.user.id
        );

      if (currentSlot) {

        await interaction.reply({
          content:
            t(lang, "party_already_in_slot", null, { role: currentSlot[0] }),
          ephemeral: true
        });

        return;
      }

      if (
        memberCount(party) >=
        party.maxSlots
      ) {

        await interaction.reply({
          content:
            t(lang, "party_full"),
          ephemeral: true
        });

        return;
      }

      party.slots[roleId] =
        interaction.user.id;

      saveData(data);

      await refreshParty(
        interaction,
        party
      );

      await interaction.reply({
        content:
          t(lang, "party_joined_slot", null, { role: roleId }),
        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    LEAVE
    ================================================
    */

    if (action === "leave") {

      const slot =
        Object.entries(
          party.slots
        ).find(
          ([, id]) =>
            id === interaction.user.id
        )?.[0];

      if (!slot) {

        await interaction.reply({
          content:
            t(lang, "party_not_in_party"),
          ephemeral: true
        });

        return;
      }

      if (
        interaction.user.id ===
        party.creatorId
      ) {

        await interaction.reply({
          content:
            t(lang, "party_creator_cannot_leave"),
          ephemeral: true
        });

        return;
      }

      party.slots[slot] =
        null;

      saveData(data);

      await refreshParty(
        interaction,
        party
      );

      await interaction.reply({
        content:
          t(lang, "party_left_slot", null, { role: slot }),
        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    NOTIFY @HERE
    ================================================
    */

    if (action === "notify") {

      // Notify is intentionally restricted to the Party Creator/Host
      // or a Discord Administrator. Co-Hosts must not be able to notify.
      const canNotify = hasPartyAdmin(interaction, party);

      if (!canNotify) {
        await interaction.reply({
          content:
            t(lang, "party_notify_denied"),
          ephemeral: true
        });
        return;
      }

      if (party.status === "CLOSED") {
        await interaction.reply({
          content: t(lang, "party_closed"),
          ephemeral: true
        });
        return;
      }

      const slots = Object.entries(party.slots || {});
      const emptySlots = slots.filter(([, userId]) => !userId);
      const isFull = emptySlots.length === 0;

      let notificationText;

      if (isFull) {
        const memberIds = [
          ...new Set(
            slots
              .map(([, userId]) => userId)
              .filter(Boolean)
          )
        ];

        const memberMentions = memberIds.length
          ? memberIds.map(id => `<@${id}>`).join(" ")
          : "Tidak ada member.";

        notificationText =
          `@here\n` +
          `📢 **${t(lang, "party_notification_full")}**\n\n` +
          `⚔️ **${party.name}**\n` +
          `🏰 **${party.nest}**\n\n` +
          `👥 **Member:** ${memberMentions}\n\n` +
          `🎉 ${t(lang, "party_notification_full_text")}`;
      } else {
        const emptyLines = emptySlots
          .map(([roleId]) =>
            `${roleEmoji(roleId, party)} **${roleName(roleId, party)}**`
          )
          .join("\n");

        notificationText =
          `@here\n` +
          `📢 **${t(lang, "party_notification_title")}**\n\n` +
          `⚔️ **${party.name}**\n` +
          `🏰 **${party.nest}**\n\n` +
          `🟢 **${t(lang, "party_notification_available")}:**\n${emptyLines}\n\n` +
          `${t(lang, "party_notification_join_text")}`;
      }

      try {
        // Party Notify memakai SATU pesan yang disimpan di party.notifyMessageId.
        // Notifikasi pertama akan @here, sedangkan update berikutnya hanya mengedit
        // pesan yang sama tanpa mengirim ping baru agar channel tidak menjadi spam.
        const channel =
          interaction.channel ||
          await interaction.guild?.channels
            .fetch(party.channelId)
            .catch(() => null);

        if (!channel || !channel.isTextBased?.()) {
          throw new Error("Party notification channel tidak tersedia.");
        }

        let notificationMessage = null;
        let isExistingNotification = false;

        if (party.notifyMessageId) {
          try {
            notificationMessage = await channel.messages.fetch(
              party.notifyMessageId
            );

            if (notificationMessage.author?.id === interaction.client.user.id) {
              isExistingNotification = true;
            } else {
              notificationMessage = null;
            }
          } catch (_) {
            // Pesan sudah dihapus/tidak dapat diakses. Buat pesan notification baru.
            notificationMessage = null;
          }
        }

        if (isExistingNotification && notificationMessage) {
          // Jangan kirim @here atau user mention lagi ketika mengedit.
          const updateText = notificationText
            .replace(/^@here\n?/, "");

          await notificationMessage.edit({
            content: updateText,
            allowedMentions: { parse: [] }
          });
        } else {
          // Pesan pertama tetap mengirim @here agar party members mendapat notifikasi.
          notificationMessage = await channel.send({
            content: notificationText,
            allowedMentions: { parse: ["everyone", "users"] }
          });

          party.notifyMessageId = notificationMessage.id;
          party.updatedAt = Date.now();
          saveData(data);
        }

        await interaction.reply({
          content: t(lang, "party_notification_sent"),
          ephemeral: true
        });
      } catch (error) {
        console.error("Gagal mengirim/memperbarui party notification:", error);
        await interaction.reply({
          content: t(lang, "party_notification_failed"),
          ephemeral: true
        });
      }

      return;
    }


    /*
    ================================================
    CREATE SALARY THREAD
    ================================================
    */

    if (action === "salary") {

      if (!hasPartyAdmin(interaction, party)) {
        await interaction.reply({
          content:
            t(lang, "party_salary_denied"),
          ephemeral: true
        });
        return;
      }

      if (party.status === "CLOSED") {
        await interaction.reply({
          content:
            t(lang, "party_closed"),
          ephemeral: true
        });
        return;
      }

      if (party.status !== "LOCKED") {
        await interaction.reply({
          content:
            t(lang, "party_lock_required_salary"),
          ephemeral: true
        });
        return;
      }

      await createSalaryThreadForParty(
        interaction,
        party,
        data,
        saveData,
        updateSalaryDashboard
      );

      return;
    }


    /*
    ================================================
    LOCK
    ================================================
    */

    if (action === "lock") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_lock_denied"),
          ephemeral: true
        });

        return;
      }

      if (
        party.status ===
        "CLOSED"
      ) {

        await interaction.reply({
          content:
            t(lang, "party_closed"),
          ephemeral: true
        });

        return;
      }

      party.status =
        party.status === "LOCKED"
          ? "OPEN"
          : "LOCKED";

      saveData(data);

      await refreshParty(
        interaction,
        party
      );

      await interaction.reply({
        content:
          party.status === "LOCKED"
            ? "🔒 Party dikunci."
            : "🔓 Party dibuka kembali.",
        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    CLOSE
    ================================================
    */

    if (action === "close") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_close_denied"),
          ephemeral: true
        });

        return;
      }

      party.status =
        "CLOSED";

      saveData(data);

      await refreshParty(
        interaction,
        party
      );

      await interaction.reply({
        content:
          "🔴 Party ditutup.",
        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    ADD MEMBER
    ================================================
    */

    if (action === "add") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_add_denied"),
          ephemeral: true
        });

        return;
      }

      if (
        party.status !==
        "OPEN"
      ) {

        await interaction.reply({
          content:
            t(lang, "party_unlock_required"),
          ephemeral: true
        });

        return;
      }

      await interaction.reply({
        content:
          t(lang, "party_select_member"),

        components: [
          buildUserSelect(
            `party:adduser:${party.id}`,
            t(lang, "party_select_one_member")
          )
        ],

        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    KICK
    ================================================
    */

    if (action === "kick") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_kick_denied"),
          ephemeral: true
        });

        return;
      }

      const row =
        buildKickSelect(
          party,
          lang
        );

      if (!row) {

        await interaction.reply({
          content:
            t(lang, "party_no_member_kick"),
          ephemeral: true
        });

        return;
      }

      await interaction.reply({
        content:
          "Pilih slot/member yang ingin dikeluarkan:",

        components: [
          row
        ],

        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    SWAP
    ================================================
    */

    if (action === "swap") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_swap_denied"),
          ephemeral: true
        });

        return;
      }

      await interaction.reply({
        content:
          "Pilih **2 slot** yang ingin ditukar:",

        components: [
          buildSwapSelect(
            party,
            lang
          )
        ],

        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    NEST
    ================================================
    */

    if (action === "nest") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_set_nest_denied"),
          ephemeral: true
        });

        return;
      }

      await interaction.reply({
        content:
          "Pilih Raid Nest:",

        components: [
          buildNestSelect(
            party.id,
            lang
          )
        ],

        ephemeral: true
      });

      return;
    }


    /*
    ================================================
    RAID FINISH
    ================================================
    */

    if (action === "finish") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_raid_finish_denied"),
          ephemeral: true
        });

        return;
      }


      /*
      ==================================================
      THREAD ID
      ==================================================

      Party message berada di Thread tertentu.
      Salary juga harus memakai Thread tersebut.
      */

      const threadId =
        interaction.channelId;


      /*
      ==================================================
      AMBIL SALARY DASHBOARD THREAD
      ==================================================
      */

      const dashboard =
        getSalaryDashboard(
          data,
          threadId,
          interaction
        );


      /*
      ==================================================
      MEMBER PARTY
      ==================================================
      */

      const members =
        Object.values(
          party.slots
        ).filter(Boolean);


      /*
      ==================================================
      SINKRONKAN MEMBER PARTY KE SALARY
      ==================================================

      Hanya member party ini yang ditambahkan.

      Tidak lagi menggunakan:

      data.settings.salaryMembers
      */

      const addedMembers = [];

      for (const id of members) {

        if (
          !dashboard.salaryMembers.includes(
            id
          )
        ) {

          dashboard.salaryMembers.push(
            id
          );

          addedMembers.push(id);
        }
      }


      /*
      ==================================================
      TUTUP PARTY
      ==================================================
      */

      party.status =
        "CLOSED";


      /*
      ==================================================
      HITUNG SALARY THREAD INI
      ==================================================
      */

      const summary =
        calculateSalary(
          dashboard
        );


      /*
      ==================================================
      RAID HISTORY
      ==================================================
      */

      dashboard.raidHistory.push({
        id:
          `raid-${Date.now()}`,

        threadId,

        partyId:
          party.id,

        partyName:
          party.name,

        nest:
          party.nest,

        completedAt:
          Date.now(),

        memberIds:
          [...members],

        saleCount:
          dashboard.sales.length,

        totalGold:
          summary.totalGold,

        totalStamp:
          summary.totalStamp,

        stampValue:
          summary.stampValue,

        sellerTax:
          summary.sellerTax,

        totalPool:
          summary.totalPool,

        salaryPerMember:
          summary.salaryPerMember,

        salaryRemainder:
          summary.salaryRemainder,

        stampRewards:
          summary.stampRewards,

        stampRewardTotal:
          summary.stampRewardTotal,

        totalPayout:
          summary.totalPayout
      });


      /*
      ==================================================
      UPDATE DASHBOARD
      ==================================================
      */

      dashboard.updatedAt =
        Date.now();


      /*
      ==================================================
      SAVE
      ==================================================
      */

      saveData(data);


      /*
      ==================================================
      REFRESH PARTY
      ==================================================
      */

      await refreshParty(
        interaction,
        party
      );


      /*
      ==================================================
      UPDATE SALARY DASHBOARD
      ==================================================
      */

      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );


      /*
      ==================================================
      RESPONSE
      ==================================================
      */

      await interaction.reply({
        content:

          `🏁 **${party.name}** selesai.\n\n` +

          `🧵 Salary Dashboard: <#${threadId}>\n` +

          `${t(lang, "party_finish_member_sync", null, { count: members.length })}\n` +

          `💰 ${t(lang, "party_finish_total_gold")}: **${summary.totalGold.toLocaleString("en-US")}g**\n` +
          `🧾 ${t(lang, "party_finish_stamp_value")}: **${summary.stampValue.toLocaleString("en-US")}g**\n` +
          `🏦 ${t(lang, "party_finish_seller_tax")}: **${summary.sellerTax.toLocaleString("en-US")}g**\n` +
          `💵 ${t(lang, "party_finish_clean_salary")}: **${summary.totalPool.toLocaleString("en-US")}g**\n` +
          `🏷️ ${t(lang, "party_finish_stamp_reward")}: **${summary.stampRewardTotal.toLocaleString("en-US")}g**\n` +
          `💵 ${t(lang, "party_finish_salary_member")}: **${summary.salaryPerMember.toLocaleString("en-US")}g**\n` +
          `💰 ${t(lang, "party_finish_total_payout")}: **${summary.totalPayout.toLocaleString("en-US")}g**`,

        ephemeral: true
      });

      return;
    }
  }


  /*
  ==================================================
  USER SELECT MENU
  ==================================================
  */

  if (interaction.isUserSelectMenu()) {

    if (action === "adduser") {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.reply({
          content:
            t(lang, "party_no_access"),
          ephemeral: true
        });

        return;
      }

      const userId =
        interaction.values[0];


      if (
        party.status !==
        "OPEN"
      ) {

        await interaction.reply({
          content:
            "🔒 Party sedang terkunci.",
          ephemeral: true
        });

        return;
      }


      if (
        party.maxSlots <=
        memberCount(party)
      ) {

        await interaction.reply({
          content:
            t(lang, "party_full"),
          ephemeral: true
        });

        return;
      }


      if (
        Object.values(
          party.slots
        ).includes(userId)
      ) {

        await interaction.reply({
          content:
            "❌ User tersebut sudah ada di party.",
          ephemeral: true
        });

        return;
      }


      const roleSelect = buildRoleSelect(
        party.id,
        userId,
        party,
        lang
      );

      if (!roleSelect) {
        await interaction.update({
          content: t(lang, "party_no_empty_slots"),
          components: []
        });
        return;
      }

      await interaction.update({
        content: t(lang, "party_select_empty_for_user", null, { userId }),
        components: [roleSelect]
      });

      return;
    }
  }


  /*
  ==================================================
  STRING SELECT MENU
  ==================================================
  */

  if (interaction.isStringSelectMenu()) {


    /*
    ================================================
    ADD ROLE
    ================================================
    */

    if (action === "addrole") {

      const userId =
        parts[3];

      const roleId =
        interaction.values[0];


      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.update({
          content:
            t(lang, "party_no_access"),
          components: []
        });

        return;
      }


      if (
        !(roleId in party.slots)
      ) {

        await interaction.update({
          content:
            "❌ Slot tidak tersedia.",
          components: []
        });

        return;
      }


      if (
        party.slots[roleId]
      ) {

        await interaction.update({
          content:
            t(lang, "party_slot_occupied", null, { role: roleId, userId: party.slots[roleId] }),
          components: []
        });

        return;
      }


      if (
        Object.values(
          party.slots
        ).includes(userId)
      ) {

        await interaction.update({
          content:
            t(lang, "party_user_already_party"),
          components: []
        });

        return;
      }


      party.slots[roleId] =
        userId;

      saveData(data);

      await refreshParty(
        interaction,
        party
      );


      await interaction.update({
        content:
          t(lang, "party_joined_user_slot", null, { userId, role: roleId }),

        components: []
      });

      return;
    }


    /*
    ================================================
    KICK SELECT
    ================================================
    */

    if (
      action ===
      "kickselect"
    ) {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.update({
          content:
            t(lang, "party_no_access"),
          components: []
        });

        return;
      }


      const roleId =
        interaction.values[0];

      const userId =
        party.slots[roleId];


      if (!userId) {

        await interaction.update({
          content:
            t(lang, "party_slot_empty_now"),
          components: []
        });

        return;
      }


      party.slots[roleId] =
        null;

      saveData(data);

      await refreshParty(
        interaction,
        party
      );


      await interaction.update({
        content:
          t(lang, "party_removed_user_slot", null, { userId, role: roleId }),

        components: []
      });

      return;
    }


    /*
    ================================================
    SWAP
    ================================================
    */

    if (
      action ===
      "swapselect"
    ) {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.update({
          content:
            t(lang, "party_no_access"),
          components: []
        });

        return;
      }


      const [
        a,
        b
      ] =
        interaction.values;


      [
        party.slots[a],
        party.slots[b]
      ] =
        [
          party.slots[b],
          party.slots[a]
        ];


      saveData(data);

      await refreshParty(
        interaction,
        party
      );


      await interaction.update({
        content:
          t(lang, "party_swapped_slots", null, { a, b }),

        components: []
      });

      return;
    }


    /*
    ================================================
    NEST SELECT
    ================================================
    */

    if (
      action ===
      "nestselect"
    ) {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.update({
          content:
            t(lang, "party_no_access"),
          components: []
        });

        return;
      }


      const selectedNest = interaction.values[0];

      await interaction.update({
        content:
          t(lang, "party_nest_selected", null, { nest: selectedNest }),
        components: [
          buildNestModeSelect(
            party.id,
            selectedNest,
            lang
          )
        ]
      });

      return;
    }

    /*
    ================================================
    NEST MODE SELECT
    ================================================
    */

    if (
      action ===
      "nestmode"
    ) {

      if (
        !hasPartyAdmin(
          interaction,
          party
        )
      ) {

        await interaction.update({
          content:
            t(lang, "party_no_access"),
          components: []
        });

        return;
      }

      const selectedMode = interaction.values[0];
      const selectedNest = party.nest;

      // Ambil nest yang sedang dipilih dari message sebelumnya.
      // Untuk menjaga flow dua tahap, customId mode hanya membawa partyId,
      // sehingga nest disimpan sementara pada interaction message metadata
      // tidak tersedia. Karena itu gunakan komponen placeholder untuk membaca
      // pilihan terakhir dari state party bila ada, atau minta pilih ulang.
      const nestFromMessage = interaction.message?.content
        ?.match(/🏰 \*\*(.+?)\*\* dipilih/)?.[1];

      const finalNest = nestFromMessage || selectedNest;

      if (!finalNest) {
        await interaction.update({
          content: t(lang, "party_nest_not_determined"),
          components: [buildNestSelect(party.id, lang)]
        });
        return;
      }

      // Ubah layout party otomatis berdasarkan jenis Nest.
      // Normal Nest / Memoria -> 4 slot + template 4 slot.
      // Raid Nest -> 8 slot + template raid.
      const layout = getNestPartyLayout(finalNest);

      const currentMembers = Object.values(party.slots || {})
        .filter(Boolean);

      if (currentMembers.length > layout.maxSlots) {
        await interaction.update({
          content:
            `❌ Tidak bisa mengubah ke **${finalNest}** karena party saat ini memiliki **${currentMembers.length} member**.\n\n` +
            t(lang, "party_nest_max_slots", null, { maxSlots: layout.maxSlots }),
          components: [buildNestSelect(party.id, lang)]
        });
        return;
      }

      party.nest = finalNest;
      party.nestMode = selectedMode;
      party.maxSlots = layout.maxSlots;
      party.jobMode = layout.jobMode;
      party.customJobs = layout.customJobs;

      // Rebuild slot berdasarkan template baru sambil mempertahankan
      // member yang sudah mengisi party. Member dimasukkan berurutan
      // ke slot template baru agar tidak hilang ketika mode berganti.
      const newRoles = getPartyRoles(party);
      const newSlots = {};

      for (const role of newRoles) {
        newSlots[role.id] = null;
      }

      currentMembers.forEach((userId, index) => {
        if (newRoles[index]) {
          newSlots[newRoles[index].id] = userId;
        }
      });

      party.slots = newSlots;

      saveData(data);

      await refreshParty(
        interaction,
        party
      );

      await interaction.update({
        content:
          t(lang, "party_nest_changed", null, { nest: party.nest, mode: party.nestMode }),
        components: []
      });

      return;
    }
  }
}


module.exports = {
  handlePartyInteraction,
  refreshParty
};