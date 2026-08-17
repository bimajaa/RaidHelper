# PEMBANTU RAID

Bot Discord untuk mengelola **party** dan **salary raid** Dragon Nest: dari pembuatan party, pencatatan drop & item terjual, sampai perhitungan pembagian gold otomatis.

## ✨ Fitur

- ⚔️ **Party** — buat party raid dengan slot job (MT/PR/DPS/dll), tombol join/kick/swap, lock/unlock.
- 💰 **Salary Dashboard** — dashboard otomatis per-thread untuk melacak drop, item terjual, dan gaji tiap member.
- 📦 **Drop & Sold** — catat item drop dan item yang terjual (satuan maupun bulk/banyak sekaligus).
- 🏁 **Raid Done** — hitung otomatis pembagian gold ke semua salary member (support Seller Tax & harga stamp).
- 🍀 **LuckyZone** — jadwal LuckyZone harian otomatis ke channel tertentu.
- 🛡️ **Role Host/Co-Host & Administrator** — kontrol akses siapa yang boleh menjalankan command penting.

## 📋 Requirement

- [Node.js](https://nodejs.org) 18.17 ke atas (disarankan 20+)
- Aplikasi Bot Discord (dari [Discord Developer Portal](https://discord.com/developers/applications))
- Akses invite bot ke server Discord tujuan

## 🚀 Quick Start

```bash
# 1. Install dependency
npm install

# 2. Siapkan file .env
cp .env.example .env
# lalu isi DISCORD_TOKEN, CLIENT_ID, dan GUILD_ID di file .env

# 3. Daftarkan slash command ke server
npm run deploy

# 4. Jalankan bot
npm start
```

Panduan lengkap step-by-step (invite bot, isi `.env`, permission, sampai cara pakai semua command) ada di **[PANDUAN.md](PANDUAN.md)**.

## 🗂️ Struktur Project

```text
RaidHelper/
├── commands/       # Semua slash command (/party, /salary, /drop, /sold, dst)
├── handlers/       # Handler interaksi tombol & menu Discord
├── lib/            # Logic inti: database, party, salary, luckyzone
├── data/           # Database SQLite per-server (dibuat otomatis, jangan di-commit)
├── config.json     # Konfigurasi nest, role party, harga stamp default
├── index.js        # Entry point bot
└── deploy-commands.js  # Script untuk mendaftarkan slash command
```

## ⚙️ Deploy di VPS (PM2)

```bash
npm install -g pm2
npm install
npm run deploy
pm2 start index.js --name pembantu-raid
pm2 save
pm2 startup
```

## 🔒 Catatan Keamanan

- **Jangan pernah** commit file `.env` — file ini berisi token bot Discord kamu.
- Folder `data/` berisi database per-server (data guild asli) — sudah otomatis diabaikan lewat `.gitignore`, jangan dihapus dari sana.

## 📄 Lisensi

Gunakan dan modifikasi bebas untuk keperluan komunitas/guild kamu sendiri.
