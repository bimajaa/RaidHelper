const {
  SlashCommandBuilder,
  EmbedBuilder,
  MessageFlags
} = require("discord.js");

const HELP = {
  all: {
    title: "📖 PEMBANTU RAID • HELP",
    description:
      "Gunakan pilihan kategori di bawah untuk melihat cara memakai fitur bot.",
    fields: [
      {
        name: "⚔️ PARTY",
        value:
          "`/party create` — Buat party\n" +
          "`/party edit` — Edit judul / Custom Job party\n" +
          "`/party list` — Lihat party aktif\n" +
          "`/party delete` — Hapus party"
      },
      {
        name: "💰 SALARY",
        value:
          "`/setup` — Buat Salary Dashboard di thread\n" +
          "`/salary addmember` — Tambah salary member\n" +
          "`/salary addcohost` — Tambah Co-Host\n" +
          "`/salary settax` — Atur Seller Tax\n" +
          "`/salary setchannel` — Atur channel Salary (Admin)\n" +
          "`/setstampprice` — Atur harga stamp"
      },
      {
        name: "📦 DROP",
        value:
          "`/drop add` — Tambah drop\n" +
          "`/drop bulk_add` — Tambah banyak drop\n" +
          "`/drop list` — Lihat Drop List\n" +
          "`/drop remove` — Hapus drop berdasarkan ID\n" +
          "`/drop clear` — Hapus semua drop"
      },
      {
        name: "💵 SOLD",
        value:
          "`/sold add` — Catat item terjual\n" +
          "`/sold bulk_add` — Catat banyak item terjual\n" +
          "`/sold_item` — Input sold item legacy\n" +
          "`/sold_list` — Lihat daftar item terjual"
      },
      {
        name: "🍀 LUCKYZONE",
        value:
          "`/luckyzone setup` — Buat/atur channel LuckyZone\n" +
          "`/luckyzone now` — Update LuckyZone sekarang\n" +
          "`/luckyzone disable` — Matikan update otomatis"
      },
      {
        name: "🏁 RAID",
        value:
          "`/raid_done` — Selesaikan raid dan hitung salary\n\n" +
          "⚠️ `/raid_done` hanya untuk Host / Co-Host."
      }
    ]
  },

  party: {
    title: "⚔️ PARTY • HELP",
    description: "Command untuk membuat dan mengelola party raid.",
    fields: [
      {
        name: "➕ Buat Party",
        value:
          "`/party create`\n" +
          "Buat party baru lalu pilih Nest, mode, dan jumlah slot."
      },
      {
        name: "✏️ Edit Party",
        value:
          "`/party edit party_id:ID`\n" +
          "Host/Creator atau **Administrator Discord** dapat mengubah **judul party** dan susunan **Custom Job/Slot**.\n\n" +
          "Atau gunakan tombol **✏️ Edit Party** langsung di dashboard party untuk mengubah judul tanpa harus mengetik Party ID."
      },
      {
        name: "📋 Party Aktif",
        value: "`/party list`\nLihat daftar party yang masih aktif."
      },
      {
        name: "🗑️ Hapus Party",
        value:
          "`/party delete party_id:ID`\nHapus party berdasarkan Party ID."
      },
      {
        name: "💰 Create Salary Thread",
        value:
          "Setelah party **LOCK**, Host dapat membuat Salary Thread melalui tombol **Create Salary Thread**."
      }
    ]
  },

  salary: {
    title: "💰 SALARY • HELP",
    description: "Command untuk mengatur dan menjalankan Salary Raid.",
    fields: [
      {
        name: "👥 Member & Host",
        value:
          "`/salary addmember members:@User` — Tambah salary member\n" +
          "`/salary addcohost user:@User` — Tambah Co-Host"
      },
      {
        name: "⚙️ Pengaturan",
        value:
          "`/setstampprice price:5` — Atur harga stamp\n" +
          "`/salary settax tax:15` — Atur Seller Tax\n" +
          "`/salary setchannel channel:#salary` — Atur channel Salary (Admin)\n\n" +
          "💡 Tax dapat diset `0` jika raid tidak menggunakan Seller Tax."
      },
      {
        name: "📦 Alur Salary",
        value:
          "`/setup` → `/salary addmember` → `/drop` → `/sold` → `/raid_done`"
      },
      {
        name: "🏁 Selesaikan Raid",
        value:
          "`/raid_done`\n" +
          "Menghitung hasil salary dan menampilkan Salary Result.\n\n" +
          "⚠️ Hanya Host / Co-Host yang dapat menjalankan command ini."
      }
    ]
  },

  drop: {
    title: "📦 DROP • HELP",
    description: "Command untuk mengelola daftar item drop raid.",
    fields: [
      {
        name: "➕ Tambah Drop",
        value:
          "`/drop add items:ITEM` — Tambah drop\n" +
          "`/drop bulk_add` — Tambah banyak item melalui modal"
      },
      {
        name: "📋 Lihat Drop",
        value: "`/drop list` — Lihat Drop List dan status sold."
      },
      {
        name: "🗑️ Hapus Drop",
        value:
          "`/drop remove sale_id:ID` — Hapus item sold berdasarkan Sale ID\n" +
          "`/drop clear` — Hapus semua Drop List"
      },
      {
        name: "🔄 Sinkronisasi",
        value:
          "Saat item berhasil dijual, Drop List akan diperbarui agar status dan Sale ID tetap sinkron."
      }
    ]
  },

  sold: {
    title: "💵 SOLD • HELP",
    description: "Command untuk mencatat item yang berhasil terjual.",
    fields: [
      {
        name: "💰 Sold Satu Item",
        value:
          "`/sold add item_name:NAMA gold:HARGA stamp:JUMLAH tag:@User`"
      },
      {
        name: "📦 Bulk Sold",
        value:
          "`/sold bulk_add`\n" +
          "Masukkan banyak item dengan format:\n" +
          "`Nama Item | Gold | Stamp`"
      },
      {
        name: "📋 Cek Sold",
        value: "`/sold_list` — Lihat daftar item yang sudah terjual."
      },
      {
        name: "🔄 Drop List",
        value:
          "Jika nama item cocok dengan Drop List, status drop otomatis menjadi **Sold** dan Sale ID disimpan."
      }
    ]
  },

  luckyzone: {
    title: "🍀 LUCKYZONE • HELP",
    description: "Jadwal LuckyZone harian yang dikirim otomatis ke satu channel khusus.",
    fields: [
      {
        name: "⚙️ Setup",
        value:
          "`/luckyzone setup` — Buat channel LuckyZone otomatis\n" +
          "`/luckyzone setup channel:#channel` — Gunakan channel yang sudah ada"
      },
      {
        name: "🔄 Update",
        value:
          "`/luckyzone now` — Paksa update sekarang\n" +
          "Setiap pukul **08:00 WIB**, bot mengirim **pesan baru** agar histori LuckyZone tetap tersimpan."
      },
      {
        name: "🛑 Disable",
        value: "`/luckyzone disable` — Matikan update otomatis LuckyZone."
      }
    ]
  },

  raid: {
    title: "🏁 RAID • HELP",
    description: "Command untuk menyelesaikan dan melihat hasil Salary Raid.",
    fields: [
      {
        name: "🏁 Raid Done",
        value:
          "`/raid_done`\n" +
          "Mengakhiri raid dan menghitung hasil salary berdasarkan data raid."
      },
      {
        name: "👑 Akses",
        value:
          "Hanya **Host** atau **Co-Host** pada Salary Dashboard yang dapat menjalankan `/raid_done`."
      },
      {
        name: "📊 Hasil",
        value:
          "Hasil menampilkan Raid ID, Host/Co-Host, Total Gold, Total Stamp, Stamp Value, Seller Tax, Clean Salary, Sold Items, Drop List, dan Salary per User."
      }
    ]
  }
};

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Panduan menggunakan command dan fitur PEMBANTU RAID")
    .addStringOption(option =>
      option
        .setName("kategori")
        .setDescription("Pilih kategori bantuan")
        .setRequired(false)
        .addChoices(
          { name: "📖 Semua Command", value: "all" },
          { name: "⚔️ Party", value: "party" },
          { name: "💰 Salary", value: "salary" },
          { name: "📦 Drop", value: "drop" },
          { name: "💵 Sold", value: "sold" },
          { name: "🍀 LuckyZone", value: "luckyzone" },
          { name: "🏁 Raid", value: "raid" }
        )
    ),

  async execute(interaction) {
    const category = interaction.options.getString("kategori") || "all";
    const help = HELP[category] || HELP.all;

    const embed = new EmbedBuilder()
      .setColor(0x5865f2)
      .setTitle(help.title)
      .setDescription(help.description)
      .addFields(help.fields)
      .setFooter({ text: "PEMBANTU RAID • Gunakan /help untuk bantuan" })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      flags: MessageFlags.Ephemeral
    });
  }
};
