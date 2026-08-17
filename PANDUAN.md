# 📖 Panduan Lengkap PEMBANTU RAID

Panduan ini menjelaskan cara pasang bot dari nol sampai cara pakai semua fitur, dengan bahasa yang simple.

---

## 1. Buat Aplikasi Bot di Discord

1. Buka [Discord Developer Portal](https://discord.com/developers/applications).
2. Klik **New Application**, beri nama bebas (misal `PembantuRaid`).
3. Masuk ke tab **Bot** → klik **Reset Token** → salin token yang muncul (ini `DISCORD_TOKEN`).
4. Di halaman **General Information**, salin **Application ID** (ini `CLIENT_ID`).
5. Aktifkan server Discord kamu di mode Developer (Discord App → Settings → Advanced → Developer Mode), lalu klik kanan nama server → **Copy Server ID** (ini `GUILD_ID`).

## 2. Invite Bot ke Server

1. Masih di Developer Portal, buka tab **OAuth2 → URL Generator**.
2. Centang scope: `bot` dan `applications.commands`.
3. Centang permission berikut:
   - View Channels
   - Send Messages
   - Embed Links
   - Read Message History
   - Use Slash Commands
   - Create Public Threads & Send Messages in Threads *(untuk fitur Salary Thread)*
4. Buka URL yang dihasilkan di browser, pilih server kamu, klik **Authorize**.

> Bot ini **tidak** butuh Message Content Intent, jadi tidak perlu diaktifkan.

## 3. Install & Konfigurasi

```bash
npm install
cp .env.example .env
```

Buka file `.env`, isi tiga baris berikut dengan data dari Langkah 1:

```env
DISCORD_TOKEN=token_bot_kamu
CLIENT_ID=application_id_kamu
GUILD_ID=server_id_kamu
```

## 4. Daftarkan Slash Command & Jalankan Bot

```bash
npm run deploy   # daftarkan semua command ke server
npm start        # jalankan bot
```

Jika berhasil, bot akan online di server Discord kamu dan semua command `/...` sudah bisa dipakai.

> ⚠️ Jalankan `npm run deploy` lagi **setiap kali** ada command baru atau perubahan pada command yang sudah ada.

---

## 5. Alur Kerja Raid (Ringkasan)

Urutan pakai bot dari mulai raid sampai bagi gaji:

```text
/party create          → buat party & isi slot
/salary setchannel     → (sekali saja) tentukan channel salary
tombol "Create Salary Thread" di party → buat dashboard salary
/salary addmember      → daftarkan siapa saja yang dapat gaji
/salary addcohost      → (opsional) tambah Co-Host
/setstampprice         → atur harga stamp
/salary settax         → (opsional) atur seller tax
/drop add / bulk_add   → catat item hasil drop raid
/sold add / bulk_add   → catat item yang laku terjual
/raid_done             → hitung & bagikan gaji ke semua member
```

---

## 6. Panduan Fitur Party

### Buat Party
```text
/party create
```
Isi nama party, pilih Nest, mode, dan jumlah slot. Ada juga shortcut `/raidparty name:... `.

### Tombol di Party Dashboard
| Tombol | Fungsi |
|---|---|
| MT / PR / MC / DPS / dst | Klik untuk mengisi slot job kosong dengan diri sendiri |
| Add Member | Creator/Admin menambahkan member ke slot tertentu |
| Kick / Swap | Creator/Admin mengeluarkan atau menukar posisi member |
| Lock / Unlock | Mengunci party agar slot tidak bisa diubah lagi |
| Leave | Member keluar dari slotnya sendiri (Creator tidak bisa Leave, pakai Close) |
| SET NEST | Ubah Nest/mode party |
| Create Salary Thread | Buat dashboard salary untuk party ini (hanya Creator/Admin) |

### Kelola Party
```text
/party edit party_id:ID     → ubah judul & susunan job
/party list                 → lihat semua party aktif
/party delete party_id:ID   → hapus party
```

---

## 7. Panduan Salary Dashboard

### Setup Awal (sekali per server)
```text
/salary setchannel channel:#salary
```
Khusus untuk user dengan permission **Manage Server**. Ini menentukan di channel/forum mana thread salary akan dibuat.

### Buat Dashboard
Setelah party dibuat, klik tombol **Create Salary Thread** pada party (atau pakai `/setup` di dalam thread untuk shortcut). Bot akan membuat satu pesan Embed yang otomatis ter-update terus.

### Atur Host & Member
```text
/salary addmember members:@User     → tambahkan penerima gaji
/salary addcohost user:@User        → tambahkan Co-Host (bisa bantu kelola dashboard)
```
User yang menjalankan setup dashboard otomatis menjadi **Host**.

### Atur Harga
```text
/setstampprice price:5        → harga gold per 1 stamp
/salary settax tax:15         → seller tax (gold per 1.000g hasil jual), isi 0 jika tidak ada tax
```

### Lihat Member
```text
/salary members
```

---

## 8. Panduan Drop & Sold

### Drop List (barang hasil raid, sebelum terjual)
```text
/drop add items:NamaItem
/drop bulk_add                 → input banyak item lewat form (satu baris = satu item)
/drop list                     → lihat semua drop & status (belum/sudah terjual)
/drop remove sale_id:ID
/drop clear                    → hapus semua drop
```

### Sold (barang yang sudah laku dijual)
```text
/sold add item_name:Nama gold:500g stamp:20 tag:@Penjual
```
Format gold yang didukung: `500g`, `1.5k`, `2m`, `1b`.

Bulk (banyak sekaligus):
```text
/sold bulk_add
```
Muncul form, isi satu baris per item dengan format:
```text
Nama Item | Gold | Stamp
```
Contoh:
```text
DDNL RING ATP | 500g | 10
BUKU 1 | 1.2k | 0
FRAGMENT | 2m | 3
```
Setelah submit, bot akan minta kamu memilih **stamper** (siapa yang stamp) untuk tiap item yang punya stamp > 0, satu per satu lewat menu pilih user.

Lihat daftar item terjual:
```text
/sold_list
```

> 💡 Jika nama item di `/sold` sama dengan yang ada di Drop List, statusnya otomatis berubah jadi **Sold** dan saling terhubung.

---

## 9. Selesaikan Raid & Hitung Gaji

```text
/raid_done
```
Hanya bisa dijalankan oleh **Host**, **Co-Host**, atau **Administrator**. Bot akan menghitung:

```text
Total Gold dari Sold Items
+ (Total Stamp × Harga Stamp)
− Seller Tax (jika diatur)
= Total Salary Pool

Total Salary Pool ÷ Jumlah Salary Member
= Salary per Member
```

Hasilnya ditampilkan lengkap: Raid ID, Host/Co-Host, Total Gold, Total Stamp, Sold Items, Drop List, dan pembagian gaji tiap user.

---

## 10. LuckyZone (Opsional)

```text
/luckyzone setup                    → buat channel khusus jadwal LuckyZone
/luckyzone setup channel:#channel   → pakai channel yang sudah ada
/luckyzone now                      → paksa update sekarang
/luckyzone disable                  → matikan update otomatis
```
Bot mengirim update jadwal LuckyZone otomatis setiap pukul **08:00 WIB**.

---

## 11. Hak Akses (Permission)

| Aksi | Siapa yang bisa |
|---|---|
| Command umum party (join slot, leave) | Semua member |
| Kelola party (kick, add, lock, edit, nest) | Creator party atau **Administrator** |
| Command `/salary`, `/drop`, `/sold`, `/raid_done` | Host / Co-Host dashboard atau **Administrator** |
| `/salary setchannel` | Khusus user dengan permission **Manage Server** |

---

## 12. Bantuan Cepat di Discord

Bot punya command bawaan untuk lihat semua panduan langsung di Discord:
```text
/help
/help kategori:party
/help kategori:salary
/help kategori:drop
/help kategori:sold
/help kategori:luckyzone
/help kategori:raid
```

---

## 13. Troubleshooting

| Masalah | Solusi |
|---|---|
| Slash command tidak muncul di Discord | Jalankan `npm run deploy` lagi, tunggu beberapa menit, atau restart Discord |
| Bot tidak online | Cek `.env` sudah terisi benar, lihat error di terminal saat `npm start` |
| Error "Guild ID tidak valid" | Pastikan `GUILD_ID` di `.env` benar dan bot sudah join server tersebut |
| Data hilang setelah update | Jangan hapus folder `data/`, itu tempat database per-server disimpan |
| Tombol "Create Salary Thread" tidak muncul | Pastikan `/salary setchannel` sudah pernah dijalankan di server tersebut |

---

## 14. Deploy Permanen (PM2)

Agar bot tetap jalan meski terminal ditutup:
```bash
npm install -g pm2
pm2 start index.js --name pembantu-raid
pm2 save
pm2 startup
```
Restart setelah update kode:
```bash
pm2 restart pembantu-raid
```
