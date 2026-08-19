const { patchInteraction } = require("../lib/i18n");
const {
  SlashCommandBuilder,
  MessageFlags,
  PermissionFlagsBits,
  ChannelType
} = require("discord.js");

const {
  getSalaryDashboard,
  setSalaryDashboard
} = require("../lib/scope");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("salary")
    .setDescription("Salary dashboard management")

    // ==========================================
    // SET SALARY CHANNEL
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("setchannel")
        .setDescription("Tentukan channel tempat Salary Thread dibuat")
        .addChannelOption(o =>
          o
            .setName("channel")
            .setDescription("Text/Announcement/Forum channel untuk Salary")
            .addChannelTypes(
              ChannelType.GuildText,
              ChannelType.GuildAnnouncement,
              ChannelType.GuildForum
            )
            .setRequired(true)
        )
    )

    // ==========================================
    // SETUP
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("setup")
        .setDescription("Buat/update dashboard salary di thread ini")
    )

    // ==========================================
    // ADD MEMBER
    // ==========================================
    // ==========================================
    // SET SELLER TAX
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("settax")
        .setDescription("Atur Seller Tax per 1.000g untuk Thread ini")
        .addIntegerOption(o =>
          o
            .setName("tax")
            .setDescription("Tax dalam gold untuk setiap 1.000g total gold")
            .setMinValue(0)
            .setMaxValue(100000)
            .setRequired(true)
        )
    )

    // ==========================================
    // ADD MEMBER
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("addmember")
        .setDescription("Tambahkan member ke pembagian salary")
        .addStringOption(o =>
          o
            .setName("members")
            .setDescription("Tag satu atau beberapa member (opsional)")
            .setRequired(false)
        )
    )

    // ==========================================
    // REMOVE MEMBER
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("removemember")
        .setDescription("Hapus beberapa member dari pembagian salary")
        .addStringOption(o =>
          o
            .setName("members")
            .setDescription("Tag satu atau beberapa member")
            .setRequired(true)
        )
    )

    // ==========================================
    // LIST MEMBERS
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("members")
        .setDescription("Lihat member salary di thread ini")
    )

    // ==========================================
    // RESET
    // ==========================================
    .addSubcommand(sub =>
      sub
        .setName("reset")
        .setDescription("Reset semua data salary di thread ini")
    )

    .addSubcommand(sub =>
      sub
        .setName("sethost")
        .setDescription("Atur Host untuk raid ini")
        .addUserOption(o =>
          o
            .setName("user")
            .setDescription("Member yang menjadi Host")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("addcohost")
        .setDescription("Tambahkan Co-Host")
        .addUserOption(o =>
          o
            .setName("user")
            .setDescription("Member yang menjadi Co-Host")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("removecohost")
        .setDescription("Hapus Co-Host")
        .addUserOption(o =>
          o
            .setName("user")
            .setDescription("Co-Host yang ingin dihapus")
            .setRequired(true)
        )
    )

    .addSubcommand(sub =>
      sub
        .setName("stamp")
        .setDescription("Catat user yang melakukan stamp pada item")
        .addStringOption(o =>
          o
            .setName("sale_id")
            .setDescription("ID item dari /sold_list")
            .setRequired(true)
        )
        .addIntegerOption(o =>
          o
            .setName("count")
            .setDescription("Jumlah stamp yang dilakukan")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(false)
        )
    ),

  async execute(
    interaction,
    {
      data,
      saveData,
      updateSalaryDashboard,
      buildSalarySummary
    }
  ) {

        patchInteraction(interaction);
const sub =
      interaction.options.getSubcommand();

    /*
    ==================================================
    SET SALARY CHANNEL
    ==================================================
    */

    if (sub === "setchannel") {
      const isAdmin =
        interaction.memberPermissions?.has(
          PermissionFlagsBits.Administrator
        );

      if (!isAdmin) {
        await interaction.reply({
          content:
            "❌ Hanya member dengan permission **Administrator** yang dapat menggunakan `/salary setchannel`.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const channel =
        interaction.options.getChannel("channel", true);

      if (
        ![
          ChannelType.GuildText,
          ChannelType.GuildAnnouncement,
          ChannelType.GuildForum
        ].includes(channel.type)
      ) {
        await interaction.reply({
          content:
            "❌ Pilih **Text Channel, Announcement Channel, atau Forum Channel**.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (!data.settings || typeof data.settings !== "object") {
        data.settings = {};
      }

      data.settings.salaryChannelId = channel.id;
      saveData(data);

      await interaction.reply({
        content:
          `✅ **Salary Channel berhasil disetting.**\n\n` +
          `📋 Channel: <#${channel.id}>\n` +
          `💡 Sekarang Host/Co-Host dapat menekan tombol **💰 Create Salary Thread** pada party.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    THREAD ID
    ==================================================
    */

    const threadId =
      interaction.channelId;

    /*
    ==================================================
    PASTIKAN SALARY DASHBOARDS ADA
    ==================================================
    */

    if (!data.salaryDashboards) {
      data.salaryDashboards = {};
    }

    /*
    ==================================================
    SETUP
    ==================================================
    */

    if (sub === "setup") {

      /*
      Salary Dashboard harus dibuat melalui
      tombol Create Salary Thread pada Party.
      */

      const existingDashboard =
        getSalaryDashboard(
          data,
          interaction.guildId,
          threadId
        );

      if (!existingDashboard) {
        await interaction.reply({
          content:
            "❌ Salary Dashboard belum dibuat.\n\n" +
            "Gunakan tombol **💰 Create Salary Thread** pada Party terlebih dahulu.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      /*
      Salary dashboard hanya digunakan
      di dalam Thread.
      */

      if (!interaction.channel?.isThread?.()) {

        await interaction.reply({
          content:
            "❌ Command `/salary setup` hanya dapat digunakan di dalam Thread.\n\n" +
            "Buat Thread terlebih dahulu, kemudian jalankan command ini.",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      /*
      Ambil dashboard Thread.
      */

      let dashboard =
        getSalaryDashboard(
          data,
          interaction.guildId,
          threadId
        );

      if (!dashboard) {
        await interaction.reply({
          content:
            "❌ Salary Dashboard belum tersedia di Thread ini.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      /*
      Pastikan data lama tetap valid.
      */

      if (!Array.isArray(dashboard.salaryMembers)) {
        dashboard.salaryMembers = [];
      }

      if (!Array.isArray(dashboard.sales)) {
        dashboard.sales = [];
      }

      if (!Array.isArray(dashboard.dropItems)) {
        dashboard.dropItems = [];
      }

      if (!Array.isArray(dashboard.raidHistory)) {
        dashboard.raidHistory = [];
      }

      if (!Array.isArray(dashboard.coHostIds)) {
        dashboard.coHostIds = [];
      }

      if (
        dashboard.stampPrice === undefined ||
        dashboard.stampPrice === null
      ) {
        dashboard.stampPrice =
          Number(
            data.settings?.defaultStampPrice ??
            data.settings?.stampPrice ??
            4
          );
      }

      if (
        dashboard.sellerTaxPer1000 === undefined ||
        dashboard.sellerTaxPer1000 === null
      ) {
        dashboard.sellerTaxPer1000 =
          Number(
            data.settings?.defaultSellerTaxPer1000 ??
            data.settings?.sellerTaxPer1000 ??
            15
          );
      }

      dashboard.threadId = threadId;
      dashboard.threadName =
        interaction.channel.name || "Salary";
      dashboard.guildId = interaction.guildId;
      dashboard.parentId =
        interaction.channel.parentId || null;
      dashboard.updatedAt = Date.now();

      setSalaryDashboard(
        data,
        interaction.guildId,
        threadId,
        dashboard
      );

      /*
      Simpan data.
      */

      saveData(data);

      await interaction.reply({
        content:
          "⏳ Membuat/update dashboard salary...",
        flags: MessageFlags.Ephemeral
      });

      /*
      Update dashboard.
      */

      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );

      await interaction.editReply({
        content:
          "✅ **Salary Dashboard berhasil dibuat!**\n\n" +
          `🧵 Thread: <#${threadId}>\n` +
          `👑 Host: ${dashboard.hostId ? `<@${dashboard.hostId}>` : "Belum ditentukan"}\n` +
          `👥 Salary Member: ${dashboard.salaryMembers.length}\n` +
          `💰 Stamp Price: ${dashboard.stampPrice}g\n` +
          `🏦 Seller Tax: ${dashboard.sellerTaxPer1000}g / 1.000g\n\n` +

          "━━━━━━━━━━━━━━━━━━━━\n" +
          "📖 **PANDUAN RAID**\n" +
          "━━━━━━━━━━━━━━━━━━━━\n\n" +

          "👥 **1. Tambahkan Member**\n" +
          "`/salary addmember members:@User`\n\n" +

          "🤝 **2. Tambahkan Co-Host**\n" +
          "`/salary addcohost user:@User`\n\n" +

          "🏷️ **3. Atur Harga Stamp**\n" +
          "`/setstampprice price:5`\n\n" +

          "🏦 **4. Atur Seller Tax**\n" +
          "`/salary settax tax:15` _(15g per 1.000g)_\n\n" +

          "📦 **5. Tambahkan Drop**\n" +
          "`/drop add`\n" +
          "`/drop bulk`\n\n" +

          "💰 **6. Input Barang yang Terjual**\n" +
          "`/sold_item`\n\n" +

          "📋 **7. Cek Barang Terjual**\n" +
          "`/sold_list`\n\n" +

          "🏁 **8. Selesaikan Raid**\n" +
          "`/raid_done`\n\n" +

          "⚠️ `/raid_done` hanya dapat digunakan oleh **Host / Co-Host**.\n\n" +
          "💡 **Alur:**\n" +
          "Thread → Setup → Member → Drop → Sold → Raid Done"
      });

      return;
    }

    /*
    ==================================================
    SET SELLER TAX
    ==================================================
    */

    if (sub === "settax") {
      const dashboard = getSalaryDashboard(
        data,
        interaction.guildId,
        threadId
      );

      if (!dashboard) {
        await interaction.reply({
          content:
            "❌ Thread ini belum memiliki Salary Dashboard.\n\nGunakan tombol **💰 Create Salary Thread** pada Party terlebih dahulu.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (!Array.isArray(dashboard.coHostIds)) {
        dashboard.coHostIds = [];
      }

      const isHost = dashboard.hostId === interaction.user.id;
      const isCoHost = dashboard.coHostIds.includes(interaction.user.id);
      const isAdmin = interaction.memberPermissions?.has(
        PermissionFlagsBits.Administrator
      );

      if (!isHost && !isCoHost && !isAdmin) {
        await interaction.reply({
          content:
            "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat mengubah Seller Tax.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      const tax = interaction.options.getInteger("tax", true);

      if (!Number.isInteger(tax) || tax < 0) {
        await interaction.reply({
          content: "❌ Nilai Seller Tax tidak valid.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      dashboard.sellerTaxPer1000 = tax;
      dashboard.updatedAt = Date.now();
      saveData(data);

      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );

      await interaction.reply({
        content:
          `✅ Seller Tax diubah menjadi **${tax}g / 1.000g** untuk Thread ini.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    AMBIL DASHBOARD THREAD
    ==================================================
    */

    const dashboard =
      getSalaryDashboard(
        data,
        interaction.guildId,
        threadId
      );

    /*
    Semua command selain setup
    membutuhkan dashboard.
    */

    if (!dashboard) {

      await interaction.reply({
        content:
          "❌ Thread ini belum memiliki Salary Dashboard.\n\n" +
          "Gunakan tombol **💰 Create Salary Thread** pada Party terlebih dahulu.",
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    /*
    ==================================================
    HOST / CO-HOST ACCESS
    ==================================================
    */

    if (!Array.isArray(dashboard.coHostIds)) {
      dashboard.coHostIds = [];
    }

    const isHost =
      dashboard.hostId === interaction.user.id;

    const isCoHost =
      dashboard.coHostIds.includes(interaction.user.id);

    const isAdmin =
      interaction.memberPermissions?.has(
        PermissionFlagsBits.Administrator
      );

    if (!isHost && !isCoHost && !isAdmin) {
      await interaction.reply({
        content:
          "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan command `/salary` di Thread ini.",
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    VALIDASI DATA DASHBOARD
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
        dashboard.raidHistory
      )
    ) {
      dashboard.raidHistory = [];
    }

    if (!Array.isArray(dashboard.coHostIds)) {
      dashboard.coHostIds = [];
    }

    if (dashboard.hostId === undefined) {
      dashboard.hostId = null;
    }

    /*
    ==================================================
    HOST / CO-HOST
    ==================================================
    */

    if (sub === "sethost") {
      const user = interaction.options.getUser("user", true);

      dashboard.hostId = user.id;
      dashboard.updatedAt = Date.now();
      saveData(data);

      await updateSalaryDashboard(interaction.guild, threadId);

      await interaction.reply({
        content: `👑 Host raid ini sekarang ${user}.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "addcohost") {
      const user = interaction.options.getUser("user", true);

      if (!dashboard.coHostIds.includes(user.id)) {
        dashboard.coHostIds.push(user.id);
      }

      dashboard.updatedAt = Date.now();
      saveData(data);

      await updateSalaryDashboard(interaction.guild, threadId);

      await interaction.reply({
        content: `🤝 ${user} ditambahkan sebagai Co-Host.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    if (sub === "removecohost") {
      const user = interaction.options.getUser("user", true);
      const existed = dashboard.coHostIds.includes(user.id);

      dashboard.coHostIds = dashboard.coHostIds.filter(
        id => id !== user.id
      );

      dashboard.updatedAt = Date.now();
      saveData(data);

      await updateSalaryDashboard(interaction.guild, threadId);

      await interaction.reply({
        content: existed
          ? `✅ ${user} dihapus dari Co-Host.`
          : `⚠️ ${user} tidak sedang menjadi Co-Host.`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    STAMP ITEM
    ==================================================
    */

    if (sub === "stamp") {
      const saleId = interaction.options.getString("sale_id", true);
      const count = interaction.options.getInteger("count") || 1;

      const sale = dashboard.sales.find(item => item.id === saleId);

      if (!sale) {
        await interaction.reply({
          content:
            `❌ Item dengan Sale ID \`${saleId}\` tidak ditemukan.\n\n` +
            "Gunakan `/sold_list` untuk melihat ID item.",
          flags: MessageFlags.Ephemeral
        });
        return;
      }

      if (!sale.stampers || typeof sale.stampers !== "object" || Array.isArray(sale.stampers)) {
        sale.stampers = {};
      }

      const userId = interaction.user.id;
      sale.stamp = Number(sale.stamp || 0) + count;
      sale.stampers[userId] = Number(sale.stampers[userId] || 0) + count;
      sale.updatedAt = Date.now();
      dashboard.updatedAt = Date.now();

      saveData(data);
      await updateSalaryDashboard(interaction.guild, threadId);

      await interaction.reply({
        content:
          `🏷️ **Stamp berhasil dicatat.**\n\n` +
          `📦 Item: **${sale.itemName}**\n` +
          `🏷️ Stamp kamu: **+${count}**\n` +
          `🏷️ Total stamp item: **${sale.stamp}**\n` +
          `💵 Reward kamu: **${count * Number(dashboard.stampPrice || 0)}g**`,
        flags: MessageFlags.Ephemeral
      });
      return;
    }

    /*
    ==================================================
    ADD MEMBER
    ==================================================
    */

    if (sub === "addmember") {

      /*
      Ambil input manual.

      Contoh:
      /salary addmember members:@Bima @Denny
      */

      let input =
        interaction.options.getString(
          "members",
          false
        );

      let sourceMessage = null;

      /*
      ==================================================
      MODE OTOMATIS
      ==================================================

      Jika members tidak diisi,
      bot mencari pesan terbaru dari user
      yang menjalankan command dan memiliki
      mention member.
      */

      if (!input) {

        /*
        Pastikan command dijalankan
        di dalam Thread.
        */

        if (
          !interaction.channel?.isThread?.()
        ) {

          await interaction.reply({
            content:
              "❌ Mode otomatis `/salary addmember` hanya dapat digunakan di dalam Thread.\n\n" +
              "Buat Thread lalu tag member di dalamnya.",
            flags: MessageFlags.Ephemeral
          });

          return;
        }

        /*
        Ambil 50 pesan terakhir.
        */

        const recentMessages =
          await interaction.channel.messages
            .fetch({
              limit: 50
            })
            .catch(() => null);

        /*
        Jika gagal membaca pesan.
        */

        if (!recentMessages) {

          await interaction.reply({
            content:
              "❌ Saya tidak dapat membaca pesan di Thread ini.",
            flags: MessageFlags.Ephemeral
          });

          return;
        }

        /*
        Cari pesan terbaru dari user
        yang menjalankan command.

        Pesan tersebut harus memiliki
        minimal 1 mention user.
        */

        sourceMessage =
          recentMessages.find(
            message =>
              !message.author.bot &&
              message.author.id ===
                interaction.user.id &&
              message.mentions.users.size > 0
          ) || null;

        /*
        Tidak ditemukan pesan tag.
        */

        if (!sourceMessage) {

          await interaction.reply({
            content:
              "❌ Saya tidak menemukan pesan tag member dari kamu di Thread ini.\n\n" +
              "Gunakan alur:\n\n" +
              "1️⃣ Kirim pesan seperti:\n" +
              "`@Bima @Denny @Agung`\n\n" +
              "2️⃣ Kemudian jalankan:\n" +
              "`/salary addmember`\n\n" +
              "Atau gunakan cara manual:\n" +
              "`/salary addmember members:@Bima @Denny`",
            flags: MessageFlags.Ephemeral
          });

          return;
        }

        /*
        Ambil user ID langsung dari
        structured mentions Discord.
        */

        const mentionedIds =
          [
            ...sourceMessage.mentions.users.keys()
          ];

        /*
        Ubah mention menjadi format
        yang sama dengan input manual.
        */

        input =
          mentionedIds
            .map(
              id => `<@${id}>`
            )
            .join(" ");
      }

      /*
      ==================================================
      PARSE USER ID
      ==================================================
      */

      const matches = [
        ...input.matchAll(
          /<@!?(\d+)>/g
        )
      ];

      const userIds =
        matches.map(
          match => match[1]
        );

      /*
      Tidak ada mention valid.
      */

      if (!userIds.length) {

        await interaction.reply({
          content:
            "❌ Tidak ada mention user yang valid.\n\n" +
            "Contoh:\n" +
            "`/salary addmember members:@Bima @Andi @Denny`",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      /*
      ==================================================
      HILANGKAN DUPLIKAT
      ==================================================
      */

      const uniqueUserIds =
        [
          ...new Set(userIds)
        ];

      /*
      ==================================================
      TAMBAHKAN MEMBER
      ==================================================
      */

      const added = [];

      const alreadyExists = [];

      for (
        const userId of uniqueUserIds
      ) {

        if (
          dashboard.salaryMembers.includes(
            userId
          )
        ) {

          alreadyExists.push(
            userId
          );

        } else {

          dashboard.salaryMembers.push(
            userId
          );

          added.push(
            userId
          );
        }
      }

      /*
      Update timestamp.
      */

      dashboard.updatedAt =
        Date.now();

      /*
      Simpan data.
      */

      saveData(data);

      /*
      Update Salary Dashboard.
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

      let message =
        "💰 **SALARY MEMBER UPDATE**\n\n";

      /*
      Jika menggunakan mode otomatis,
      tampilkan sumber pesan.
      */

      if (sourceMessage) {

        message +=
          `📌 **Member diambil dari pesan:**\n` +
          `https://discord.com/channels/${interaction.guildId}/${threadId}/${sourceMessage.id}\n\n`;
      }

      /*
      Member baru.
      */

      if (
        added.length > 0
      ) {

        message +=
          "✅ **Ditambahkan ke Member List:**\n";

        message +=
          added
            .map(
              id => `• <@${id}>`
            )
            .join("\n");

        message += "\n\n";
      }

      /*
      Member yang sudah ada.
      */

      if (
        alreadyExists.length > 0
      ) {

        message +=
          "⚠️ **Sudah terdaftar:**\n";

        message +=
          alreadyExists
            .map(
              id => `• <@${id}>`
            )
            .join("\n");

        message += "\n\n";
      }

      /*
      Total member.
      */

      message +=
        `👥 **Total Salary Member:** ${dashboard.salaryMembers.length}`;

      /*
      Kirim response.
      */

      await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    /*
    ==================================================
    REMOVE MEMBER
    ==================================================
    */

    if (sub === "removemember") {

      const input =
        interaction.options.getString(
          "members",
          true
        );

      /*
      Ambil semua mention.
      */

      const matches = [
        ...input.matchAll(
          /<@!?(\d+)>/g
        )
      ];

      const userIds =
        matches.map(
          match => match[1]
        );

      if (!userIds.length) {

        await interaction.reply({
          content:
            "❌ Tidak ada mention user yang valid.\n\n" +
            "Contoh:\n" +
            "`/salary removemember members:@Bima @Andi`",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      /*
      Hilangkan duplikat.
      */

      const uniqueUserIds =
        [
          ...new Set(userIds)
        ];

      const removed = [];

      const notFound = [];

      /*
      Hapus member.
      */

      for (
        const userId of uniqueUserIds
      ) {

        if (
          dashboard.salaryMembers.includes(
            userId
          )
        ) {

          dashboard.salaryMembers =
            dashboard.salaryMembers.filter(
              id => id !== userId
            );

          removed.push(
            userId
          );

        } else {

          notFound.push(
            userId
          );
        }
      }

      /*
      Update timestamp.
      */

      dashboard.updatedAt =
        Date.now();

      saveData(data);

      /*
      Update dashboard.
      */

      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );

      /*
      Response.
      */

      let message =
        "💰 **SALARY MEMBER UPDATE**\n\n";

      if (
        removed.length > 0
      ) {

        message +=
          "✅ **Dihapus:**\n";

        message +=
          removed
            .map(
              id => `• <@${id}>`
            )
            .join("\n");

        message += "\n\n";
      }

      if (
        notFound.length > 0
      ) {

        message +=
          "⚠️ **Tidak terdaftar:**\n";

        message +=
          notFound
            .map(
              id => `• <@${id}>`
            )
            .join("\n");

        message += "\n\n";
      }

      message +=
        `👥 **Total Salary Member:** ${dashboard.salaryMembers.length}`;

      await interaction.reply({
        content: message,
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    /*
    ==================================================
    LIST MEMBERS
    ==================================================
    */

    if (sub === "members") {

      const members =
        dashboard.salaryMembers;

      if (!members.length) {

        await interaction.reply({
          content:
            "❌ Belum ada salary member di Thread ini.",
          flags: MessageFlags.Ephemeral
        });

        return;
      }

      const memberList =
        members
          .map(
            (id, index) =>
              `${index + 1}. <@${id}>`
          )
          .join("\n");

      await interaction.reply({
        content:
          "💰 **SALARY MEMBERS**\n\n" +
          memberList +
          "\n\n" +
          `👥 **Total:** ${members.length}`,
        flags: MessageFlags.Ephemeral
      });

      return;
    }

    /*
    ==================================================
    RESET
    ==================================================
    */

    if (sub === "reset") {

      /*
      Hanya reset data Thread ini.
      */

      dashboard.sales = [];

      dashboard.salaryMembers = [];

      dashboard.hostId = null;

      dashboard.coHostIds = [];

      dashboard.raidHistory = [];

      dashboard.updatedAt =
        Date.now();

      saveData(data);

      /*
      Update dashboard.
      */

      await updateSalaryDashboard(
        interaction.guild,
        threadId
      );

      await interaction.reply({
        content:
          "⚠️ Semua data sold item, salary member, dan raid history pada Thread ini sudah di-reset.",
        flags: MessageFlags.Ephemeral
      });

      return;
    }
  }
};