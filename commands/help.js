const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");
const { guildLanguage, t , patchInteraction} = require("../lib/i18n");

const CATEGORY_COPY = {
  all: {
    titleKey: "help_title",
    descriptionKey: "help_description",
    footer: "footer_help",
    fields: lang => [
      { name: "⚔️ PARTY", value: [
        `\`/party create\` — ${t(lang, "help_party_create")}`,
        `\`/party edit\` — ${t(lang, "help_party_edit")}`,
        `\`/party list\` — ${t(lang, "help_party_list")}`,
        `\`/party delete\` — ${t(lang, "help_party_delete")}`
      ].join("\n") },
      { name: "💰 SALARY", value: [
        `\`/setup\` — ${t(lang, "help_salary_setup")}`,
        `\`/salary addmember\` — ${t(lang, "help_salary_addmember")}`,
        `\`/salary addcohost\` — ${t(lang, "help_salary_addcohost")}`,
        `\`/salary settax\` — ${t(lang, "help_salary_settax")}`,
        `\`/salary setchannel\` — ${t(lang, "help_salary_setchannel")}`,
        `\`/setstampprice\` — ${t(lang, "help_setstampprice")}`,
        `\`/language set lang:id|en\` — ${t(lang, "help_language_set")}`
      ].join("\n") },
      { name: "📦 DROP", value: [
        `\`/drop add\` — ${t(lang, "help_drop_add")}`,
        `\`/drop bulk\` — ${t(lang, "help_drop_bulk")}`,
        `\`/drop list\` — ${t(lang, "help_drop_list")}`,
        `\`/drop remove\` — ${t(lang, "help_drop_remove")}`,
        `\`/drop clear\` — ${t(lang, "help_drop_clear")}`
      ].join("\n") },
      { name: "💵 SOLD", value: [
        `\`/sold bulk\` — ${t(lang, "help_sold_bulk")}`,
        `\`/sold_item\` — ${t(lang, "help_sold_item")}`,
        `\`/sold_list\` — ${t(lang, "help_sold_list")}`,
        `\`/sold_remove sale_id:ID\` — ${t(lang, "help_sold_remove")}`
      ].join("\n") },
      { name: "🍀 LUCKYZONE", value: [
        `\`/luckyzone setup\` — ${t(lang, "help_lz_setup")}`,
        `\`/luckyzone now\` — ${t(lang, "help_lz_now")}`,
        `\`/luckyzone next\` — ${t(lang, "help_lz_next")}`,
        `\`/luckyzone disable\` — ${t(lang, "help_lz_disable")}`
      ].join("\n") },
      { name: "🏁 RAID", value: [
        `\`/raid_done\` — ${t(lang, "help_raid_done")}`,
        `⚠️ \`/raid_done\` ${lang === "en" ? "is only for Host / Co-Host." : "hanya untuk Host / Co-Host."}`
      ].join("\n") }
    ]
  },
  party: {
    titleKey: "help_party_title",
    descriptionKey: "help_party_description",
    footer: "footer_help",
    fields: lang => [
      { name: `➕ ${lang === "en" ? "Create Party" : "Buat Party"}`, value: `\`/party create\`\n${lang === "en" ? "Create a new party, then choose the Nest, mode, and number of slots." : "Buat party baru lalu pilih Nest, mode, dan jumlah slot."}` },
      { name: `✏️ ${lang === "en" ? "Edit Party" : "Edit Party"}`, value: `\`/party edit party_id:ID\`\n${lang === "en" ? "The Host/Creator or a Discord Administrator can edit the party title and Custom Job/Slot layout." : "Host/Creator atau **Administrator Discord** dapat mengubah **judul party** dan susunan **Custom Job/Slot**."}` },
      { name: `📋 ${lang === "en" ? "Active Parties" : "Party Aktif"}`, value: `\`/party list\`\n${lang === "en" ? "View active parties." : "Lihat daftar party yang masih aktif."}` },
      { name: `🗑️ ${lang === "en" ? "Delete Party" : "Hapus Party"}`, value: `\`/party delete party_id:ID\`\n${lang === "en" ? "Delete a party by Party ID." : "Hapus party berdasarkan Party ID."}` },
      { name: "💰 Create Salary Thread", value: lang === "en" ? "After the party is **LOCKED**, the Host can create the Salary Thread using the **Create Salary Thread** button." : "Setelah party **LOCK**, Host dapat membuat Salary Thread melalui tombol **Create Salary Thread**." }
    ]
  },
  salary: {
    titleKey: "help_salary_title",
    descriptionKey: "help_salary_description",
    footer: "footer_help",
    fields: lang => [
      { name: lang === "en" ? "👥 Members & Host" : "👥 Member & Host", value: lang === "en" ? "`/salary addmember members:@User` — Add salary member\n`/salary addcohost user:@User` — Add Co-Host" : "`/salary addmember members:@User` — Tambah salary member\n`/salary addcohost user:@User` — Tambah Co-Host" },
      { name: lang === "en" ? "⚙️ Settings" : "⚙️ Pengaturan", value: lang === "en" ? "`/setstampprice price:5` — Set stamp price\n`/salary settax tax:15` — Set Seller Tax\n`/salary setchannel channel:#salary` — Set Salary channel (Admin)\n`/language set lang:id|en` — Change the server language (Admin only)\n\n💡 Set tax to `0` if the raid does not use Seller Tax." : "`/setstampprice price:5` — Atur harga stamp\n`/salary settax tax:15` — Atur Seller Tax\n`/salary setchannel channel:#salary` — Atur channel Salary (Admin)\n`/language set lang:id|en` — Ubah bahasa server (khusus Admin)\n\n💡 Tax dapat diset `0` jika raid tidak menggunakan Seller Tax." },
      { name: lang === "en" ? "📦 Salary Flow" : "📦 Alur Salary", value: "`/setup` → `/salary addmember` → `/drop` → `/sold` → `/raid_done`" },
      { name: lang === "en" ? "🏁 Finish Raid" : "🏁 Selesaikan Raid", value: lang === "en" ? "`/raid_done`\nCalculate salary results and display Salary Result.\n\n⚠️ Only Host / Co-Host can run this command." : "`/raid_done`\nMenghitung hasil salary dan menampilkan Salary Result.\n\n⚠️ Hanya Host / Co-Host yang dapat menjalankan command ini." }
    ]
  },
  drop: {
    titleKey: "help_drop_title",
    descriptionKey: "help_drop_description",
    footer: "footer_help",
    fields: lang => [
      { name: lang === "en" ? "➕ Add Drop" : "➕ Tambah Drop", value: lang === "en" ? "`/drop add items:ITEM` — Add drop\n`/drop bulk` — Add multiple items through modal" : "`/drop add items:ITEM` — Tambah drop\n`/drop bulk` — Tambah banyak item melalui modal" },
      { name: lang === "en" ? "📋 View Drop" : "📋 Lihat Drop", value: lang === "en" ? "`/drop list` — View Drop List and sold status." : "`/drop list` — Lihat Drop List dan status sold." },
      { name: lang === "en" ? "🗑️ Remove Drop" : "🗑️ Hapus Drop", value: lang === "en" ? "`/drop remove sale_id:ID` — Remove an item by Sale ID\n`/drop clear` — Clear the entire Drop List" : "`/drop remove sale_id:ID` — Hapus item sold berdasarkan Sale ID\n`/drop clear` — Hapus semua Drop List" },
      { name: lang === "en" ? "🔄 Synchronization" : "🔄 Sinkronisasi", value: lang === "en" ? "When an item is sold, Drop List is updated so the status and Sale ID stay synchronized." : "Saat item berhasil dijual, Drop List akan diperbarui agar status dan Sale ID tetap sinkron." }
    ]
  },
  sold: {
    titleKey: "help_sold_title",
    descriptionKey: "help_sold_description",
    footer: "footer_help",
    fields: lang => [
      { name: lang === "en" ? "📦 Bulk Sold" : "📦 Bulk Sold", value: lang === "en" ? "`/sold bulk`\nEnter multiple items using:\n`Item Name | Gold | Stamp`" : "`/sold bulk`\nMasukkan banyak item dengan format:\n`Nama Item | Gold | Stamp`" },
      { name: lang === "en" ? "📋 Check Sold" : "📋 Cek Sold", value: lang === "en" ? "`/sold_list` — View the list of sold items." : "`/sold_list` — Lihat daftar item yang sudah terjual." },
      { name: "🔄 Drop List", value: lang === "en" ? "When an item name matches Drop List, its status automatically becomes **Sold** and the Sale ID is stored." : "Jika nama item cocok dengan Drop List, status drop otomatis menjadi **Sold** dan Sale ID disimpan." }
    ]
  },
  luckyzone: {
    titleKey: "lz_help_title",
    descriptionKey: "lz_help_description",
    footer: "footer_help",
    fields: lang => [
      { name: `⚙️ ${t(lang, "lz_setup")}`, value: lang === "en" ? "`/luckyzone setup` — Create a LuckyZone channel automatically\n`/luckyzone setup channel:#channel` — Use an existing channel" : "`/luckyzone setup` — Buat channel LuckyZone otomatis\n`/luckyzone setup channel:#channel` — Gunakan channel yang sudah ada" },
      { name: `🔄 ${t(lang, "lz_update")}`, value: lang === "en" ? "`/luckyzone now` — Force an update now\nEvery **08:00 WIB**, the bot sends a **new message** so LuckyZone history is preserved." : "`/luckyzone now` — Paksa update sekarang\nSetiap pukul **08:00 WIB**, bot mengirim **pesan baru** agar histori LuckyZone tetap tersimpan." },
      { name: `⏭️ ${t(lang, "help_lz_next")}`, value: lang === "en" ? "`/luckyzone next` — View tomorrow's LuckyZone schedule." : "`/luckyzone next` — Lihat jadwal LuckyZone untuk besok." },
      { name: `🛑 ${t(lang, "lz_disable")}`, value: lang === "en" ? "`/luckyzone disable` — Disable automatic LuckyZone updates." : "`/luckyzone disable` — Matikan update otomatis LuckyZone." }
    ]
  },
  raid: {
    titleKey: "help_raid_title",
    descriptionKey: "help_raid_description",
    footer: "footer_help",
    fields: lang => [
      { name: "🏁 Raid Done", value: lang === "en" ? "`/raid_done`\nFinish the raid and calculate the salary result from raid data." : "`/raid_done`\nMengakhiri raid dan menghitung hasil salary berdasarkan data raid." },
      { name: lang === "en" ? "👑 Access" : "👑 Akses", value: lang === "en" ? "Only the **Host** or **Co-Host** on the Salary Dashboard can run `/raid_done`." : "Hanya **Host** atau **Co-Host** pada Salary Dashboard yang dapat menjalankan `/raid_done`." },
      { name: lang === "en" ? "📊 Result" : "📊 Hasil", value: lang === "en" ? "Result includes Raid ID, Host/Co-Host, Total Gold, Total Stamp, Stamp Value, Seller Tax, Clean Salary, Sold Items, Drop List, and Salary per User." : "Hasil menampilkan Raid ID, Host/Co-Host, Total Gold, Total Stamp, Stamp Value, Seller Tax, Clean Salary, Sold Items, Drop List, dan Salary per User." }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Panduan menggunakan command dan fitur PEMBANTU RAID")
    .setDescriptionLocalizations({ "en-US": "Guide to using the Raid Helper commands and features" })
    .addStringOption(option => option
      .setName("kategori")
      .setDescription("Pilih kategori bantuan")
      .setDescriptionLocalizations({ "en-US": "Choose a help category" })
      .setRequired(false)
      .addChoices(
        { name: "📖 Semua Command", name_localizations: { "en-US": "📖 All Commands" }, value: "all" },
        { name: "⚔️ Party", value: "party" },
        { name: "💰 Salary", value: "salary" },
        { name: "📦 Drop", value: "drop" },
        { name: "💵 Sold", value: "sold" },
        { name: "🍀 LuckyZone", value: "luckyzone" },
        { name: "🏁 Raid", value: "raid" }
      )
    ),

  async execute(interaction) {
        patchInteraction(interaction);
const category = interaction.options.getString("kategori") || "all";
    const copy = CATEGORY_COPY[category] || CATEGORY_COPY.all;
    const lang = guildLanguage(interaction.guildId);

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(t(lang, copy.titleKey))
      .setDescription(t(lang, copy.descriptionKey))
      .addFields(copy.fields(lang))
      .setFooter({ text: t(lang, copy.footer) })
      .setTimestamp();

    await interaction.reply({ embeds: [embed], flags: MessageFlags.Ephemeral });
  }
};
