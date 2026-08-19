/**
 * Phase 6 — All Features Strict Locale Catalog
 * Every user-facing translation comes from this catalog.
 * No word-by-word or heuristic translation is used.
 */
const catalog = [
  {
    "key": "ui_001",
    "id": "❌ DISCORD_TOKEN dan CLIENT_ID wajib ada di .env",
    "en": "❌ DISCORD_TOKEN dan CLIENT_ID wajib ada di .env"
  },
  {
    "key": "ui_002",
    "id": "⚠️ ${file} tidak memiliki command.data",
    "en": "⚠️ ${file} not memiliki command.data"
  },
  {
    "key": "ui_003",
    "id": "❌ Gagal membaca ${file}:",
    "en": "❌ Failed membaca ${file}:"
  },
  {
    "key": "ui_004",
    "id": "${command.name}: missing description",
    "en": "${command.name}: missing description"
  },
  {
    "key": "ui_005",
    "id": "${command.name}: missing en-US description localization",
    "en": "${command.name}: missing en-US description localization"
  },
  {
    "key": "ui_006",
    "id": "${command.name}.${option.name}: missing description",
    "en": "${command.name}.${option.name}: missing description"
  },
  {
    "key": "ui_007",
    "id": "${command.name}.${option.name}: missing en-US description localization",
    "en": "${command.name}.${option.name}: missing en-US description localization"
  },
  {
    "key": "ui_008",
    "id": "${command.name}.${option.name}.${choice.name}: missing en-US choice localization",
    "en": "${command.name}.${option.name}.${choice.name}: missing en-US choice localization"
  },
  {
    "key": "ui_009",
    "id": "❌ Command localization validation failed:",
    "en": "❌ command localization validation failed:"
  },
  {
    "key": "ui_010",
    "id": "✅ Command localization validation passed: ${commandList.length} command(s).",
    "en": "✅ command localization validation passed: ${commandList.length} command(s)."
  },
  {
    "key": "ui_011",
    "id": "🔄 Registering ${commands.length} GLOBAL command(s)...",
    "en": "🔄 Registering ${commands.length} GLOBAL command(s)..."
  },
  {
    "key": "ui_012",
    "id": "✅ Global slash commands registered!",
    "en": "✅ Global slash commands registered!"
  },
  {
    "key": "ui_013",
    "id": "📋 Total commands: ${commands.length}",
    "en": "📋 Total commands: ${commands.length}"
  },
  {
    "key": "ui_014",
    "id": "🌍 Commands tersedia di semua server tempat bot di-install.",
    "en": "🌍 Commands tersedia di semua server tempat bot di-install."
  },
  {
    "key": "ui_015",
    "id": "⏳ Command global dapat membutuhkan waktu untuk muncul di Discord.",
    "en": "⏳ Global commands may take some time to appear in Discord."
  },
  {
    "key": "ui_016",
    "id": "❌ Gagal register global slash commands:",
    "en": "❌ Failed register global slash commands:"
  },
  {
    "key": "ui_017",
    "id": "./lib/salary",
    "en": "./lib/salary"
  },
  {
    "key": "ui_018",
    "id": "./lib/party",
    "en": "./lib/party"
  },
  {
    "key": "ui_019",
    "id": "./lib/luckyzone",
    "en": "./lib/luckyzone"
  },
  {
    "key": "ui_020",
    "id": "⚔️ ACTIVE RAID PARTIES",
    "en": "⚔️ ACTIVE RAID PARTIES"
  },
  {
    "key": "ui_021",
    "id": "${party.name} • ${party.nest}",
    "en": "${party.name} • ${party.nest}"
  },
  {
    "key": "ui_022",
    "id": "Status: **${party.status}**\n",
    "en": "Status: **${party.status}**\n"
  },
  {
    "key": "ui_023",
    "id": "Members: **${members}/${party.maxSlots}**\n",
    "en": "Members: **${members}/${party.maxSlots}**\n"
  },
  {
    "key": "ui_024",
    "id": "Creator: <@${party.creatorId}>\n",
    "en": "Creator: <@${party.creatorId}>\n"
  },
  {
    "key": "ui_025",
    "id": "ID: \\`${party.id}\\`",
    "en": "ID: \\`${party.id}\\`"
  },
  {
    "key": "ui_026",
    "id": "Tidak ada raid party aktif.",
    "en": "No active raid parties."
  },
  {
    "key": "ui_027",
    "id": "❌ updateSalaryDashboard: guild tidak diberikan.",
    "en": "❌ updateSalaryDashboard: guild was not provided."
  },
  {
    "key": "ui_028",
    "id": "❌ updateSalaryDashboard: threadId tidak diberikan.",
    "en": "❌ updateSalaryDashboard: threadId was not provided."
  },
  {
    "key": "ui_029",
    "id": "❌ Salary dashboard untuk Thread ${threadId} tidak ditemukan.",
    "en": "❌ Salary dashboard for Thread ${threadId} not found."
  },
  {
    "key": "ui_030",
    "id": "❌ Thread ${threadId} tidak ditemukan.",
    "en": "❌ Thread ${threadId} not found."
  },
  {
    "key": "ui_031",
    "id": "❌ Thread ${threadId} bukan text-based channel.",
    "en": "❌ Thread ${threadId} bukan text-based channel."
  },
  {
    "key": "ui_032",
    "id": "party:hostguide:${dashboard.partyId || \"none\"}:${threadId}",
    "en": "party:hostguide:${dashboard.partyId || \"none\"}:${threadId}"
  },
  {
    "key": "ui_033",
    "id": "❌ LuckyZone channel ${settings.channelId} tidak ditemukan.",
    "en": "❌ LuckyZone channel ${settings.channelId} was not found."
  },
  {
    "key": "ui_034",
    "id": "🍀 **LuckyZone Reset!** LuckyZone hari ini sudah diperbarui.",
    "en": "🍀 **LuckyZone Reset!** Today's LuckyZone has been updated."
  },
  {
    "key": "ui_035",
    "id": "❌ LuckyZone scheduler error:",
    "en": "❌ LuckyZone scheduler error:"
  },
  {
    "key": "ui_036",
    "id": "❌ Gagal menyiapkan database server ${guild.id}:",
    "en": "❌ Failed menyiapkan database server ${guild.id}:"
  },
  {
    "key": "ui_037",
    "id": "✅ Logged in as ${client.user.tag}",
    "en": "✅ Logged in as ${client.user.tag}"
  },
  {
    "key": "ui_038",
    "id": "📦 Loaded ${commands.size} slash command(s).",
    "en": "📦 Loaded ${commands.size} slash command(s)."
  },
  {
    "key": "ui_039",
    "id": "❌ Gagal update LuckyZone saat startup (${guild.id}):",
    "en": "❌ Failed update LuckyZone saat startup (${guild.id}):"
  },
  {
    "key": "ui_040",
    "id": "party:edit:",
    "en": "party:edit:"
  },
  {
    "key": "ui_041",
    "id": "❌ Modal party hanya dapat digunakan di server Discord.",
    "en": "❌ Party modals can only be used in a Discord server."
  },
  {
    "key": "ui_042",
    "id": "party",
    "en": "party"
  },
  {
    "key": "ui_043",
    "id": "❌ Handler Edit Party tidak ditemukan.",
    "en": "❌ Edit Party handler not found."
  },
  {
    "key": "ui_044",
    "id": "drop:bulk",
    "en": "drop:bulk"
  },
  {
    "key": "ui_045",
    "id": "❌ Modal ini hanya dapat digunakan di server Discord.",
    "en": "❌ This modal can only be used in a Discord server."
  },
  {
    "key": "ui_046",
    "id": "drop",
    "en": "drop"
  },
  {
    "key": "ui_047",
    "id": "❌ Handler drop.handleModalSubmit tidak ditemukan.",
    "en": "❌ drop.handleModalSubmit handler not found."
  },
  {
    "key": "ui_048",
    "id": "❌ Handler `/drop bulk` tidak ditemukan di bot.",
    "en": "❌ Handler for `/drop bulk` was not found in the bot."
  },
  {
    "key": "ui_049",
    "id": "sold:bulk",
    "en": "sold:bulk"
  },
  {
    "key": "ui_050",
    "id": "sold",
    "en": "sold"
  },
  {
    "key": "ui_051",
    "id": "❌ Handler sold.handleModalSubmit tidak ditemukan.",
    "en": "❌ Handler sold.handleModalSubmit not found."
  },
  {
    "key": "ui_052",
    "id": "❌ Handler `/sold bulk` tidak ditemukan di bot.",
    "en": "❌ Handler `/sold bulk` not found di bot."
  },
  {
    "key": "ui_053",
    "id": "party:edittitle:",
    "en": "party:edittitle:"
  },
  {
    "key": "ui_054",
    "id": "❌ Handler `/party edit` tidak ditemukan di bot.",
    "en": "❌ Handler for `/party edit` was not found in the bot."
  },
  {
    "key": "ui_055",
    "id": "⚠️ Modal tidak dikenal: ${interaction.customId}",
    "en": "⚠️ Modal not dikenal: ${interaction.customId}"
  },
  {
    "key": "ui_056",
    "id": "sold:bulk_stamper:",
    "en": "sold:bulk_stamper:"
  },
  {
    "key": "ui_057",
    "id": "❌ Handler pemilihan stamper tidak ditemukan.",
    "en": "❌ Handler pemilihan stamper not found."
  },
  {
    "key": "ui_058",
    "id": "sold:bulk_cancel:",
    "en": "sold:bulk_cancel:"
  },
  {
    "key": "ui_059",
    "id": "❌ Handler pembatalan bulk sold tidak ditemukan.",
    "en": "❌ Handler pembatalan bulk sold not found."
  },
  {
    "key": "ui_060",
    "id": "party:",
    "en": "party:"
  },
  {
    "key": "ui_061",
    "id": "❌ Command tidak ditemukan.",
    "en": "❌ Command not found."
  },
  {
    "key": "ui_062",
    "id": "❌ Command ini hanya dapat digunakan di server Discord.",
    "en": "❌ This command can only be used in a Discord server."
  },
  {
    "key": "ui_063",
    "id": "Command /${interaction.commandName} tidak memiliki execute()",
    "en": "command /${interaction.commandName} not memiliki execute()"
  },
  {
    "key": "ui_064",
    "id": "❌ Terjadi error saat menjalankan command/interaksi.",
    "en": "❌ An error occurred while running the command/interaction."
  },
  {
    "key": "ui_065",
    "id": "❌ DISCORD_TOKEN tidak ditemukan di .env",
    "en": "❌ DISCORD_TOKEN not found di .env"
  },
  {
    "key": "ui_066",
    "id": "../lib/party",
    "en": "../lib/party"
  },
  {
    "key": "ui_067",
    "id": "../lib/salary",
    "en": "../lib/salary"
  },
  {
    "key": "ui_068",
    "id": "Gagal refresh party:",
    "en": "Failed to refresh party:"
  },
  {
    "key": "ui_069",
    "id": "Salary",
    "en": "Salary"
  },
  {
    "key": "ui_070",
    "id": "📖 **${t(lang, \"guide_title\")}**\n",
    "en": "📖 **${t(lang, \"guide_title\")}**\n"
  },
  {
    "key": "ui_071",
    "id": "👑 Host: <@${hostId}>\n\n",
    "en": "👑 Host: <@${hostId}>\n\n"
  },
  {
    "key": "ui_072",
    "id": "1️⃣ **${t(lang, \"guide_step1\")}**\n",
    "en": "1️⃣ **${t(lang, \"guide_step1\")}**\n"
  },
  {
    "key": "ui_073",
    "id": "2️⃣ **${t(lang, \"guide_step2\")}**\n",
    "en": "2️⃣ **${t(lang, \"guide_step2\")}**\n"
  },
  {
    "key": "ui_074",
    "id": "\\`/salary settax tax:15\\`\n",
    "en": "\\`/salary settax tax:15\\`\n"
  },
  {
    "key": "ui_075",
    "id": "💡 ${t(lang, \"guide_tax_tip\")}\n\n",
    "en": "💡 ${t(lang, \"guide_tax_tip\")}\n\n"
  },
  {
    "key": "ui_076",
    "id": "3️⃣ **${t(lang, \"guide_step3\")}**\n",
    "en": "3️⃣ **${t(lang, \"guide_step3\")}**\n"
  },
  {
    "key": "ui_077",
    "id": "\\`/salary addcohost user:@User\\`\n\n",
    "en": "\\`/salary addcohost user:@User\\`\n\n"
  },
  {
    "key": "ui_078",
    "id": "4️⃣ **${t(lang, \"guide_step4\")}**\n",
    "en": "4️⃣ **${t(lang, \"guide_step4\")}**\n"
  },
  {
    "key": "ui_079",
    "id": "\\`/drop add\\`\n",
    "en": "\\`/drop add\\`\n"
  },
  {
    "key": "ui_080",
    "id": "\\`/drop bulk\\`\n\n",
    "en": "\\`/drop bulk\\`\n\n"
  },
  {
    "key": "ui_081",
    "id": "5️⃣ **${t(lang, \"guide_step5\")}**\n",
    "en": "5️⃣ **${t(lang, \"guide_step5\")}**\n"
  },
  {
    "key": "ui_082",
    "id": "6️⃣ **${t(lang, \"guide_step6\")}**\n",
    "en": "6️⃣ **${t(lang, \"guide_step6\")}**\n"
  },
  {
    "key": "ui_083",
    "id": "\\`/drop list\\`\n",
    "en": "\\`/drop list\\`\n"
  },
  {
    "key": "ui_084",
    "id": "7️⃣ **${t(lang, \"guide_step7\")}**\n",
    "en": "7️⃣ **${t(lang, \"guide_step7\")}**\n"
  },
  {
    "key": "ui_085",
    "id": "⚠️ \\`/raid_done\\` ${en ? \"\" : \"hanya dapat digunakan oleh \"}**Host / Co-Host**${en ? \" can only be used by **Host / Co-Host**.\" : \".\"}\n\n",
    "en": "⚠️ `/raid_done` can only be used by **Host / Co-Host**.\n\n"
  },
  {
    "key": "ui_086",
    "id": "💡 **${t(lang, \"guide_workflow\")}**",
    "en": "💡 **${t(lang, \"guide_workflow\")}**"
  },
  {
    "key": "ui_087",
    "id": "❌ Salary Channel belum disetting.\n\n",
    "en": "❌ Salary Channel has not been configured yet.\n\n"
  },
  {
    "key": "ui_088",
    "id": "Jalankan `/salary setchannel channel:#salary` terlebih dahulu.",
    "en": "Run `/salary setchannel channel:#salary` first."
  },
  {
    "key": "ui_089",
    "id": "⚠️ Salary Thread untuk party ini sudah ada: <#${party.salaryThreadId}>",
    "en": "⚠️ A Salary Thread for this party already exists: <#${party.salaryThreadId}>"
  },
  {
    "key": "ui_090",
    "id": "❌ Salary Channel tidak ditemukan. Gunakan `/salary setchannel` untuk mengaturnya kembali.",
    "en": "❌ Salary Channel was not found. Use `/salary setchannel` to configure it again."
  },
  {
    "key": "ui_091",
    "id": "❌ Channel Salary harus berupa **Text Channel, Announcement Channel, atau Forum Channel**.",
    "en": "❌ Channel Salary harus berupa **Text Channel, Announcement Channel, atau Forum Channel**."
  },
  {
    "key": "ui_092",
    "id": "${party.name} • Salary",
    "en": "${party.name} • Salary"
  },
  {
    "key": "ui_093",
    "id": "💰 **Salary Thread — ${party.name}**\n",
    "en": "💰 **Salary Thread — ${party.name}**\n"
  },
  {
    "key": "ui_094",
    "id": "👑 Host: <@${party.creatorId}>\n",
    "en": "👑 Host: <@${party.creatorId}>\n"
  },
  {
    "key": "ui_095",
    "id": "🏰 Raid Nest: **${party.nest}**",
    "en": "🏰 Raid Nest: **${party.nest}**"
  },
  {
    "key": "ui_096",
    "id": "Create Salary Thread for ${party.name}",
    "en": "Create Salary Thread for ${party.name}"
  },
  {
    "key": "ui_097",
    "id": "Gagal membuat Salary Thread:",
    "en": "Failed to create Salary Thread:"
  },
  {
    "key": "ui_098",
    "id": "❌ Gagal membuat Salary Thread. Pastikan bot memiliki permission **View Channel, Send Messages, Create Public Threads** dan akses ke channel Salary.",
    "en": "❌ Failed to create Salary Thread. Make sure the bot has **View Channel, Send Messages, Create Public Threads** permissions and access to the Salary channel."
  },
  {
    "key": "ui_099",
    "id": "❌ Belum ada member yang mengisi slot party. Salary Thread tidak dibuat.",
    "en": "❌ No members have filled the party slots. The Salary Thread was not created."
  },
  {
    "key": "ui_100",
    "id": "👥 **Salary Member:** ${memberMentions}",
    "en": "👥 **Salary Member:** ${memberMentions}"
  },
  {
    "key": "ui_101",
    "id": "✅ **Salary Thread berhasil dibuat!**\n\n",
    "en": "✅ **Salary Thread created successfully!**\n\n"
  },
  {
    "key": "ui_102",
    "id": "📋 Channel: <#${salaryChannel.id}>\n",
    "en": "📋 Channel: <#${salaryChannel.id}>\n"
  },
  {
    "key": "ui_103",
    "id": "🧵 Thread: <#${thread.id}>",
    "en": "🧵 Thread: <#${thread.id}>"
  },
  {
    "key": "ui_104",
    "id": "❌ Salary Dashboard not found.",
    "en": "❌ Salary Dashboard not found."
  },
  {
    "key": "ui_105",
    "id": "❌ Salary Dashboard tidak ditemukan.",
    "en": "❌ Salary Dashboard not found."
  },
  {
    "key": "ui_106",
    "id": "❌ **The Host Guide can only be viewed by the Host.**",
    "en": "❌ **The Host Guide can only be viewed by the Host.**"
  },
  {
    "key": "ui_107",
    "id": "❌ **Host Guide hanya dapat dilihat oleh Host.**",
    "en": "❌ **Host Guide hanya dapat dilihat oleh Host.**"
  },
  {
    "key": "ui_108",
    "id": "❌ Party sudah tidak ditemukan.",
    "en": "❌ Party was not found."
  },
  {
    "key": "ui_109",
    "id": "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat mengedit party.",
    "en": "❌ Only the **Host/Party Creator** or **Discord Administrator** can edit the party."
  },
  {
    "key": "ui_110",
    "id": "🔒 Party harus dalam status **OPEN** sebelum diedit.",
    "en": "🔒 The party must be **OPEN** before it can be edited."
  },
  {
    "key": "ui_111",
    "id": "party:edit:${party.id}",
    "en": "party:edit:${party.id}"
  },
  {
    "key": "ui_112",
    "id": "✏️ Edit Party",
    "en": "✏️ Edit Party"
  },
  {
    "key": "ui_113",
    "id": "title",
    "en": "title"
  },
  {
    "key": "ui_114",
    "id": "Judul / Nama Party",
    "en": "Party Title / Name"
  },
  {
    "key": "ui_115",
    "id": "Contoh: SDN Hardcore • Need DPS",
    "en": "Example: SDN Hardcore • Need DPS"
  },
  {
    "key": "ui_116",
    "id": "Job / Slot (kosong = pertahankan)",
    "en": "Jobs / Slots (leave empty to keep current)"
  },
  {
    "key": "ui_117",
    "id": "🔒 Party sedang terkunci/ditutup.",
    "en": "🔒 The party is locked/closed."
  },
  {
    "key": "ui_118",
    "id": "❌ Slot tersebut tidak tersedia.",
    "en": "❌ That slot is not available."
  },
  {
    "key": "ui_119",
    "id": "❌ Slot **${roleName(roleId, party)}** sudah diisi <@${party.slots[roleId]}>.",
    "en": "❌ Slot **${role}** is already filled by <@${userId}>."
  },
  {
    "key": "ui_120",
    "id": "❌ Kamu sudah berada di slot **${roleName(currentSlot[0], party)}**. Keluar dulu jika ingin pindah slot.",
    "en": "❌ You are already in slot **${role}**. Leave your current slot first if you want to switch."
  },
  {
    "key": "ui_121",
    "id": "❌ Party sudah penuh.",
    "en": "❌ The party is full."
  },
  {
    "key": "ui_122",
    "id": "✅ Kamu masuk ke slot **${roleName(roleId, party)}**.",
    "en": "✅ You joined slot **${role}**."
  },
  {
    "key": "ui_123",
    "id": "role",
    "en": "role"
  },
  {
    "key": "ui_124",
    "id": "❌ Slot **${roleId}** sudah diisi <@${party.slots[roleId]}>.",
    "en": "❌ Slot **${role}** is already filled by <@${userId}>."
  },
  {
    "key": "ui_125",
    "id": "❌ Kamu sudah berada di slot **${currentSlot[0]}**. Keluar dulu jika ingin pindah slot.",
    "en": "❌ You are already in slot **${role}**. Leave your current slot first if you want to switch."
  },
  {
    "key": "ui_126",
    "id": "✅ Kamu masuk ke slot **${roleId}**.",
    "en": "✅ You joined slot **${role}**."
  },
  {
    "key": "ui_127",
    "id": "❌ Kamu tidak ada di party ini.",
    "en": "❌ You are not in this party."
  },
  {
    "key": "ui_128",
    "id": "❌ Creator tidak dapat Leave. Gunakan **Close Party** atau `/party delete`.",
    "en": "❌ The creator cannot Leave. Use **Close Party** or `/party delete`."
  },
  {
    "key": "ui_129",
    "id": "🚪 Kamu keluar dari slot **${slot}**.",
    "en": "🚪 You left slot **${role}**."
  },
  {
    "key": "ui_130",
    "id": "❌ Hanya **Host, Co-Host, atau Administrator Discord** yang dapat menggunakan tombol Notify.",
    "en": "❌ Only the **Host, Co-Host, or Discord Administrator** can use the Notify button."
  },
  {
    "key": "ui_131",
    "id": "❌ Party sudah ditutup.",
    "en": "❌ The party has been closed."
  },
  {
    "key": "ui_132",
    "id": "Tidak ada member.",
    "en": "No members."
  },
  {
    "key": "ui_133",
    "id": "📢 **PARTY FULL!**\n\n",
    "en": "📢 **PARTY FULL!**\n\n"
  },
  {
    "key": "ui_134",
    "id": "⚔️ **${party.name}**\n",
    "en": "⚔️ **${party.name}**\n"
  },
  {
    "key": "ui_135",
    "id": "🏰 **${party.nest}**\n\n",
    "en": "🏰 **${party.nest}**\n\n"
  },
  {
    "key": "ui_136",
    "id": "👥 **Member:** ${memberMentions}\n\n",
    "en": "👥 **Member:** ${memberMentions}\n\n"
  },
  {
    "key": "ui_137",
    "id": "🎉 Semua slot party sudah terisi. Silakan bersiap untuk raid!",
    "en": "🎉 All party slots are filled. Please get ready for the raid!"
  },
  {
    "key": "ui_138",
    "id": "${roleEmoji(roleId, party)} **${roleName(roleId, party)}**",
    "en": "${roleEmoji(roleId, party)} **${roleName(roleId, party)}**"
  },
  {
    "key": "ui_139",
    "id": "📢 **PARTY NOTIFICATION**\n\n",
    "en": "📢 **PARTY NOTIFICATION**\n\n"
  },
  {
    "key": "ui_140",
    "id": "🟢 **Slot yang masih tersedia:**\n${emptyLines}\n\n",
    "en": "🟢 **Available slots:**\n${emptyLines}\n\n"
  },
  {
    "key": "ui_141",
    "id": "Silakan klik tombol slot untuk join!",
    "en": "Click a slot button to join!"
  },
  {
    "key": "ui_142",
    "id": "📢 **@here berhasil dinotifikasi.**",
    "en": "📢 **@here successfully dinotifikasi.**"
  },
  {
    "key": "ui_143",
    "id": "Gagal mengirim party notification:",
    "en": "Failed to send party notification:"
  },
  {
    "key": "ui_144",
    "id": "❌ Gagal mengirim @here. Pastikan bot memiliki permission **Mention @everyone, Send Messages, dan Embed Links**.",
    "en": "❌ Failed to send @here. Make sure the bot has **Mention @everyone, Send Messages, and Embed Links** permissions."
  },
  {
    "key": "ui_145",
    "id": "salary",
    "en": "salary"
  },
  {
    "key": "ui_146",
    "id": "❌ Hanya creator/admin party yang dapat membuat Salary Thread.",
    "en": "❌ Only the party creator/admin can create the Salary Thread."
  },
  {
    "key": "ui_147",
    "id": "🔒 **Party harus di-Lock terlebih dahulu** sebelum membuat Salary Thread.",
    "en": "🔒 **The party must be locked first** before creating a Salary Thread."
  },
  {
    "key": "ui_148",
    "id": "❌ Hanya creator/admin yang boleh Lock.",
    "en": "❌ Only the creator/admin can lock the party."
  },
  {
    "key": "ui_149",
    "id": "🔒 Party dikunci.",
    "en": "🔒 Party locked."
  },
  {
    "key": "ui_150",
    "id": "🔓 Party dibuka kembali.",
    "en": "🔓 Party unlocked."
  },
  {
    "key": "ui_151",
    "id": "❌ Hanya creator/admin yang boleh Close.",
    "en": "❌ Only creator/admin that boleh Close."
  },
  {
    "key": "ui_152",
    "id": "🔴 Party ditutup.",
    "en": "🔴 Party closed."
  },
  {
    "key": "ui_153",
    "id": "❌ Hanya creator/admin yang boleh Add Member.",
    "en": "❌ Only the creator/admin can Add Member."
  },
  {
    "key": "ui_154",
    "id": "🔒 Unlock party terlebih dahulu.",
    "en": "🔒 Unlock the party first."
  },
  {
    "key": "ui_155",
    "id": "Pilih member yang ingin dimasukkan:",
    "en": "Select the member to add:"
  },
  {
    "key": "ui_156",
    "id": "party:adduser:${party.id}",
    "en": "party:adduser:${party.id}"
  },
  {
    "key": "ui_157",
    "id": "Pilih 1 member",
    "en": "Select 1 member"
  },
  {
    "key": "ui_158",
    "id": "❌ Hanya creator/admin yang boleh Kick.",
    "en": "❌ Only the creator/admin can Kick."
  },
  {
    "key": "ui_159",
    "id": "❌ Belum ada member untuk di-kick.",
    "en": "❌ There are no members to kick."
  },
  {
    "key": "ui_160",
    "id": "Pilih slot/member yang ingin dikeluarkan:",
    "en": "Select the slot/member to remove:"
  },
  {
    "key": "ui_161",
    "id": "❌ Hanya creator/admin yang boleh Swap.",
    "en": "❌ Only the creator/admin can Swap."
  },
  {
    "key": "ui_162",
    "id": "Pilih **2 slot** yang ingin ditukar:",
    "en": "Select **2 slots** to swap:"
  },
  {
    "key": "ui_163",
    "id": "❌ Hanya creator/admin yang boleh SET NEST.",
    "en": "❌ Only the creator/admin can set the Nest."
  },
  {
    "key": "ui_164",
    "id": "Pilih Raid Nest:",
    "en": "Select Raid Nest:"
  },
  {
    "key": "ui_165",
    "id": "❌ Hanya creator/admin yang boleh Raid Finish.",
    "en": "❌ Only the creator/admin can finish the raid."
  },
  {
    "key": "ui_166",
    "id": "raid-${Date.now()}",
    "en": "raid-${Date.now()}"
  },
  {
    "key": "ui_167",
    "id": "🏁 **${party.name}** selesai.\n\n",
    "en": "🏁 **${party.name}** selesai.\n\n"
  },
  {
    "key": "ui_168",
    "id": "🧵 Salary Dashboard: <#${threadId}>\n",
    "en": "🧵 Salary Dashboard: <#${threadId}>\n"
  },
  {
    "key": "ui_169",
    "id": "👥 ${members.length} member disinkronkan ke Salary.\n",
    "en": "👥 ${members.length} member disinkronkan ke Salary.\n"
  },
  {
    "key": "ui_170",
    "id": "💰 Total Gold saat ini: **${summary.totalGold.toLocaleString(\"en-US\")}g**\n",
    "en": "💰 Total Gold saat ini: **${summary.totalGold.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_171",
    "id": "🧾 Stamp Value: **${summary.stampValue.toLocaleString(\"en-US\")}g**\n",
    "en": "🧾 Stamp Value: **${summary.stampValue.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_172",
    "id": "🏦 Seller Tax: **${summary.sellerTax.toLocaleString(\"en-US\")}g**\n",
    "en": "🏦 Seller Tax: **${summary.sellerTax.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_173",
    "id": "💵 Clean Salary: **${summary.totalPool.toLocaleString(\"en-US\")}g**\n",
    "en": "💵 Clean Salary: **${summary.totalPool.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_174",
    "id": "🏷️ Stamp Reward: **${summary.stampRewardTotal.toLocaleString(\"en-US\")}g**\n",
    "en": "🏷️ Stamp Reward: **${summary.stampRewardTotal.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_175",
    "id": "💵 Salary/member: **${summary.salaryPerMember.toLocaleString(\"en-US\")}g**\n",
    "en": "💵 Salary/member: **${summary.salaryPerMember.toLocaleString(\"en-US\")}g**\n"
  },
  {
    "key": "ui_176",
    "id": "💰 Total Payout: **${summary.totalPayout.toLocaleString(\"en-US\")}g**",
    "en": "💰 Total Payout: **${summary.totalPayout.toLocaleString(\"en-US\")}g**"
  },
  {
    "key": "ui_177",
    "id": "❌ Tidak punya akses.",
    "en": "❌ You do not have access."
  },
  {
    "key": "ui_178",
    "id": "🔒 Party sedang terkunci.",
    "en": "🔒 Party sedang terkunci."
  },
  {
    "key": "ui_179",
    "id": "❌ User tersebut sudah ada di party.",
    "en": "❌ That user is already in the party."
  },
  {
    "key": "ui_180",
    "id": "❌ Tidak ada slot yang masih kosong.",
    "en": "❌ There are no available slots."
  },
  {
    "key": "ui_181",
    "id": "Pilih slot yang masih kosong untuk <@${userId}>:",
    "en": "Select an available slot for <@${userId}>:"
  },
  {
    "key": "ui_182",
    "id": "❌ Slot tidak tersedia.",
    "en": "❌ Slot is not available."
  },
  {
    "key": "ui_183",
    "id": "❌ Slot **${roleId}** sudah terisi.",
    "en": "❌ Slot **${roleId}** is already occupied."
  },
  {
    "key": "ui_184",
    "id": "❌ User sudah ada di party.",
    "en": "❌ That user is already in the party."
  },
  {
    "key": "ui_185",
    "id": "✅ <@${userId}> masuk ke **${roleId}**.",
    "en": "✅ <@${userId}> joined **${role}**."
  },
  {
    "key": "ui_186",
    "id": "❌ Slot sudah kosong.",
    "en": "❌ The slot is already empty."
  },
  {
    "key": "ui_187",
    "id": "🚪 <@${userId}> dikeluarkan dari **${roleId}**.",
    "en": "🚪 <@${userId}> was removed from **${role}**."
  },
  {
    "key": "ui_188",
    "id": "🔄 Slot **${a}** dan **${b}** berhasil ditukar.",
    "en": "🔄 Slots **${a}** and **${b}** were swapped successfully."
  },
  {
    "key": "ui_189",
    "id": "🏰 **${selectedNest}** dipilih.\n\n",
    "en": "🏰 **${selectedNest}** selected.\n\n"
  },
  {
    "key": "ui_190",
    "id": "Sekarang pilih mode Nest:",
    "en": "Now select the Nest mode:"
  },
  {
    "key": "ui_191",
    "id": "❌ Nest tidak dapat ditentukan. Silakan pilih Nest kembali.",
    "en": "❌ The Nest could not be determined. Please select the Nest again."
  },
  {
    "key": "ui_192",
    "id": "❌ Tidak bisa mengubah ke **${finalNest}** karena party saat ini memiliki **${currentMembers.length} member**.\n\n",
    "en": "❌ Cannot change to **${finalNest}** because the party currently has **${currentMembers.length} members**.\n\n"
  },
  {
    "key": "ui_193",
    "id": "Nest ini menggunakan maksimal **${layout.maxSlots} slot**. Keluarkan member terlebih dahulu, lalu coba SET NEST lagi.",
    "en": "This Nest allows a maximum of **${layout.maxSlots} slots**. Remove members first, then try SET NEST again."
  },
  {
    "key": "ui_194",
    "id": "🎯 Nest diubah menjadi **${party.nest}** — **${party.nestMode}**.",
    "en": "🎯 Nest changed to **${nest}** — **${mode}**."
  },
  {
    "key": "ui_195",
    "id": "${role.emoji || \"⚔️\"} **${role.label}** : ${userId ? ",
    "en": "${role.emoji || \"⚔️\"} **${role.label}** : ${userId ? "
  },
  {
    "key": "ui_196",
    "id": "<@${party.creatorId}>",
    "en": "<@${party.creatorId}>"
  },
  {
    "key": "ui_197",
    "id": "⚔️ ${party.name} (${party.maxSlots} Slot)",
    "en": "⚔️ ${party.name} (${party.maxSlots} Slot)"
  },
  {
    "key": "ui_198",
    "id": "**Status:** ${statusText(party.status)}\n",
    "en": "**Status:** ${statusText(party.status)}\n"
  },
  {
    "key": "ui_199",
    "id": "**Members:** ${memberCount(party)}/${party.maxSlots}\n",
    "en": "**Members:** ${memberCount(party)}/${party.maxSlots}\n"
  },
  {
    "key": "ui_200",
    "id": "**Nest:** ${party.nest}${party.nestMode ? ",
    "en": "**Nest:** ${party.nest}${party.nestMode ? "
  },
  {
    "key": "ui_201",
    "id": "Party ID: ${party.id}",
    "en": "Party ID: ${party.id}"
  },
  {
    "key": "ui_202",
    "id": "party:role_select:${party.id}",
    "en": "party:role_select:${party.id}"
  },
  {
    "key": "ui_203",
    "id": "🎯 Pilih slot / job yang ingin diambil",
    "en": "🎯 Select the slot / job you want to take"
  },
  {
    "key": "ui_204",
    "id": "${role.label}${occupied ? \" • Filled\" : \"\"}",
    "en": "${role.label}${occupied ? \" • Filled\" : \"\"}"
  },
  {
    "key": "ui_205",
    "id": "❌ Slot sudah diisi",
    "en": "❌ Slot is already filled"
  },
  {
    "key": "ui_206",
    "id": "✅ Pilih slot ${role.label}",
    "en": "✅ Select slot ${role.label}"
  },
  {
    "key": "ui_207",
    "id": "party:close:${party.id}",
    "en": "party:close:${party.id}"
  },
  {
    "key": "ui_208",
    "id": "Close Party",
    "en": "Close Party"
  },
  {
    "key": "ui_209",
    "id": "party:lock:${party.id}",
    "en": "party:lock:${party.id}"
  },
  {
    "key": "ui_210",
    "id": "party:salary:${party.id}",
    "en": "party:salary:${party.id}"
  },
  {
    "key": "ui_211",
    "id": "Salary Thread ✓",
    "en": "Salary Thread ✓"
  },
  {
    "key": "ui_212",
    "id": "Create Salary Thread",
    "en": "Create Salary Thread"
  },
  {
    "key": "ui_213",
    "id": "party:notify:${party.id}",
    "en": "party:notify:${party.id}"
  },
  {
    "key": "ui_214",
    "id": "party:leave:${party.id}",
    "en": "party:leave:${party.id}"
  },
  {
    "key": "ui_215",
    "id": "party:add:${party.id}",
    "en": "party:add:${party.id}"
  },
  {
    "key": "ui_216",
    "id": "Add Member",
    "en": "Add Member"
  },
  {
    "key": "ui_217",
    "id": "party:kick:${party.id}",
    "en": "party:kick:${party.id}"
  },
  {
    "key": "ui_218",
    "id": "party:swap:${party.id}",
    "en": "party:swap:${party.id}"
  },
  {
    "key": "ui_219",
    "id": "party:nest:${party.id}",
    "en": "party:nest:${party.id}"
  },
  {
    "key": "ui_220",
    "id": "Edit Party",
    "en": "Edit Party"
  },
  {
    "key": "ui_221",
    "id": "party:addrole:${partyId}:${userId}",
    "en": "party:addrole:${partyId}:${userId}"
  },
  {
    "key": "ui_222",
    "id": "Pilih slot yang masih kosong",
    "en": "Select an available slot"
  },
  {
    "key": "ui_223",
    "id": "Masukkan member ke ${role.label}",
    "en": "Add the member to ${role.label}"
  },
  {
    "key": "ui_224",
    "id": "${roleName(roleId, party)} - ${userId}",
    "en": "${roleName(roleId, party)} - ${userId}"
  },
  {
    "key": "ui_225",
    "id": "Keluarkan <@${userId}> dari party",
    "en": "Remove <@${userId}> from the party"
  },
  {
    "key": "ui_226",
    "id": "party:kickselect:${party.id}",
    "en": "party:kickselect:${party.id}"
  },
  {
    "key": "ui_227",
    "id": "Pilih slot yang ingin di-kick",
    "en": "Select the slot to kick"
  },
  {
    "key": "ui_228",
    "id": "${roleName(roleId, party)} ${userId ? \"• Filled\" : \"• Empty\"}",
    "en": "${roleName(roleId, party)} ${userId ? \"• Filled\" : \"• Empty\"}"
  },
  {
    "key": "ui_229",
    "id": "Slot kosong",
    "en": "Empty slot"
  },
  {
    "key": "ui_230",
    "id": "party:swapselect:${party.id}",
    "en": "party:swapselect:${party.id}"
  },
  {
    "key": "ui_231",
    "id": "Pilih 2 slot untuk ditukar",
    "en": "Select 2 slots to swap"
  },
  {
    "key": "ui_232",
    "id": "party:nestselect:${partyId}",
    "en": "party:nestselect:${partyId}"
  },
  {
    "key": "ui_233",
    "id": "🏰 Pilih Nest",
    "en": "🏰 Select Nest"
  },
  {
    "key": "ui_234",
    "id": "🐉 RAID NEST",
    "en": "🐉 RAID NEST"
  },
  {
    "key": "ui_235",
    "id": "🏰 NORMAL NEST",
    "en": "🏰 NORMAL NEST"
  },
  {
    "key": "ui_236",
    "id": "Normal Nest dengan mode Normal / Hell",
    "en": "Normal Nest with Normal / Hell modes"
  },
  {
    "key": "ui_237",
    "id": "🐉 MEMORIA",
    "en": "🐉 MEMORIA"
  },
  {
    "key": "ui_238",
    "id": "${group.label} • ${group.description}",
    "en": "${group.label} • ${group.description}"
  },
  {
    "key": "ui_239",
    "id": "party:nestmode:${partyId}",
    "en": "party:nestmode:${partyId}"
  },
  {
    "key": "ui_240",
    "id": "⚙️ Pilih Mode • ${nest}",
    "en": "⚙️ Select Mode • ${nest}"
  },
  {
    "key": "ui_241",
    "id": "${nest} • Mode ${mode}",
    "en": "${nest} • Mode ${mode}"
  },
  {
    "key": "ui_242",
    "id": "raid",
    "en": "raid"
  },
  {
    "key": "ui_243",
    "id": "🟢 Normal",
    "en": "🟢 Normal"
  },
  {
    "key": "ui_244",
    "id": "🏛️ Classic",
    "en": "🏛️ Classic"
  },
  {
    "key": "ui_245",
    "id": "🔥 Hardcore",
    "en": "🔥 Hardcore"
  },
  {
    "key": "ui_246",
    "id": "😈 Hell",
    "en": "😈 Hell"
  },
  {
    "key": "ui_247",
    "id": "Raid Helper",
    "en": "Raid Helper"
  },
  {
    "key": "ui_248",
    "id": "Only for Host / Co-Host.",
    "en": "Only for Host / Co-Host."
  },
  {
    "key": "ui_249",
    "id": "Raid Helper • Use /help for assistance",
    "en": "Raid Helper • Use /help for assistance"
  },
  {
    "key": "ui_250",
    "id": "Raid Helper • Raid Finish",
    "en": "Raid Helper • Raid Finish"
  },
  {
    "key": "ui_251",
    "id": "Raid Helper • Salary Final",
    "en": "Raid Helper • Salary Final"
  },
  {
    "key": "ui_252",
    "id": "Raid Helper • LuckyZone • Asia/Jakarta",
    "en": "Raid Helper • LuckyZone • Asia/Jakarta"
  },
  {
    "key": "ui_253",
    "id": "LuckyZone • Daily Rotation",
    "en": "LuckyZone • Daily Rotation"
  },
  {
    "key": "ui_254",
    "id": "RESET LUCKYZONE",
    "en": "RESET LUCKYZONE"
  },
  {
    "key": "ui_255",
    "id": "🍀 LUCKYZONE • HELP",
    "en": "🍀 LUCKYZONE • HELP"
  },
  {
    "key": "ui_256",
    "id": "Daily LuckyZone schedule automatically posted to one dedicated channel.",
    "en": "Daily LuckyZone schedule automatically posted to one dedicated channel."
  },
  {
    "key": "ui_257",
    "id": "Create or configure the dedicated LuckyZone channel",
    "en": "Create or configure the dedicated LuckyZone channel"
  },
  {
    "key": "ui_258",
    "id": "Update LuckyZone now",
    "en": "Update LuckyZone now"
  },
  {
    "key": "ui_259",
    "id": "Disable automatic LuckyZone updates",
    "en": "Disable automatic LuckyZone updates"
  },
  {
    "key": "ui_260",
    "id": "❌ Only members with **Administrator** permission can configure LuckyZone.",
    "en": "❌ Only members with **Administrator** permission can configure LuckyZone."
  },
  {
    "key": "ui_261",
    "id": "❌ LuckyZone must use a **Text Channel**.",
    "en": "❌ LuckyZone must use a **Text Channel**."
  },
  {
    "key": "ui_262",
    "id": "✅ **LuckyZone channel configured successfully.**",
    "en": "✅ **LuckyZone channel configured successfully.**"
  },
  {
    "key": "ui_263",
    "id": "✅ Automatic LuckyZone updates disabled.",
    "en": "✅ Automatic LuckyZone updates disabled."
  },
  {
    "key": "ui_264",
    "id": "❌ LuckyZone has not been configured. Run `/luckyzone setup` first.",
    "en": "❌ LuckyZone has not been configured. Run `/luckyzone setup` first."
  },
  {
    "key": "ui_265",
    "id": "✅ LuckyZone updated in",
    "en": "✅ LuckyZone updated in"
  },
  {
    "key": "ui_266",
    "id": "🍀 **LuckyZone Reset!** Today's LuckyZone has been updated.",
    "en": "🍀 **LuckyZone Reset!** Today's LuckyZone has been updated."
  },
  {
    "key": "ui_267",
    "id": "Drop List",
    "en": "Drop List"
  },
  {
    "key": "ui_268",
    "id": "Sold",
    "en": "Sold"
  },
  {
    "key": "ui_269",
    "id": "Not Sold",
    "en": "Not Sold"
  },
  {
    "key": "ui_270",
    "id": "Unknown Item",
    "en": "Unknown Item"
  },
  {
    "key": "ui_271",
    "id": "Raid Result",
    "en": "Raid Result"
  },
  {
    "key": "ui_272",
    "id": "Salary Result",
    "en": "Salary Result"
  },
  {
    "key": "ui_273",
    "id": "Total Stamp",
    "en": "Total Stamp"
  },
  {
    "key": "ui_274",
    "id": "Stamp Value",
    "en": "Stamp Value"
  },
  {
    "key": "ui_275",
    "id": "Clean Salary",
    "en": "Clean Salary"
  },
  {
    "key": "ui_276",
    "id": "Host",
    "en": "Host"
  },
  {
    "key": "ui_277",
    "id": "Co-Host",
    "en": "Co-Host"
  },
  {
    "key": "ui_278",
    "id": "Raid ID",
    "en": "Raid ID"
  },
  {
    "key": "ui_279",
    "id": "No salary members yet.",
    "en": "No salary members yet."
  },
  {
    "key": "ui_280",
    "id": "❌ The Salary Dashboard for this thread has not been created.",
    "en": "❌ The Salary Dashboard for this thread has not been created."
  },
  {
    "key": "ui_281",
    "id": "Use `/salary setup` first.",
    "en": "Use `/salary setup` first."
  },
  {
    "key": "ui_282",
    "id": "❌ Only **Host**, **Co-Host**, or **Administrator** can run `/raid_done` for this raid.",
    "en": "❌ Only **Host**, **Co-Host**, or **Administrator** can run `/raid_done` for this raid."
  },
  {
    "key": "ui_283",
    "id": "❌ No salary members yet.",
    "en": "❌ No salary members yet."
  },
  {
    "key": "ui_284",
    "id": "Use `/salary addmember` first.",
    "en": "Use `/salary addmember` first."
  },
  {
    "key": "ui_285",
    "id": "Host Guide — Raid Salary",
    "en": "Host Guide — Raid Salary"
  },
  {
    "key": "ui_286",
    "id": "Host Guide",
    "en": "Host Guide"
  },
  {
    "key": "ui_287",
    "id": "Set Stamp Price",
    "en": "Set Stamp Price"
  },
  {
    "key": "ui_288",
    "id": "Use 0 if the raid has no Seller Tax.",
    "en": "Use 0 if the raid has no Seller Tax."
  },
  {
    "key": "ui_289",
    "id": "Add Co-host",
    "en": "Add Co-host"
  },
  {
    "key": "ui_290",
    "id": "Input Sold Items",
    "en": "Input Sold Items"
  },
  {
    "key": "ui_291",
    "id": "Check Drops / Sold Items",
    "en": "Check Drops / Sold Items"
  },
  {
    "key": "ui_292",
    "id": "Finish Raid",
    "en": "Finish Raid"
  },
  {
    "key": "ui_293",
    "id": "can only be used by Host / Co-host.",
    "en": "can only be used by Host / Co-host."
  },
  {
    "key": "ui_294",
    "id": "Workflow: Thread → Drop → Sold → Raid Done",
    "en": "Workflow: Thread → Drop → Sold → Raid Done"
  },
  {
    "key": "ui_295",
    "id": "Create a party",
    "en": "Create a party"
  },
  {
    "key": "ui_296",
    "id": "Edit title / Custom party roles",
    "en": "Edit title / Custom party roles"
  },
  {
    "key": "ui_297",
    "id": "Delete a party",
    "en": "Delete a party"
  },
  {
    "key": "ui_298",
    "id": "Create Salary Dashboard in thread",
    "en": "Create Salary Dashboard in thread"
  },
  {
    "key": "ui_299",
    "id": "Add salary member",
    "en": "Add salary member"
  },
  {
    "key": "ui_300",
    "id": "Add Co-Host",
    "en": "Add Co-Host"
  },
  {
    "key": "ui_301",
    "id": "Set Salary channel (Admin)",
    "en": "Set Salary channel (Admin)"
  },
  {
    "key": "ui_302",
    "id": "Set stamp price",
    "en": "Set stamp price"
  },
  {
    "key": "ui_303",
    "id": "Add drop",
    "en": "Add drop"
  },
  {
    "key": "ui_304",
    "id": "View Drop List",
    "en": "View Drop List"
  },
  {
    "key": "ui_305",
    "id": "Remove drop by ID",
    "en": "Remove drop by ID"
  },
  {
    "key": "ui_306",
    "id": "Log sold item",
    "en": "Log sold item"
  },
  {
    "key": "ui_307",
    "id": "Bulk log sold items",
    "en": "Bulk log sold items"
  },
  {
    "key": "ui_308",
    "id": "Input sold item (legacy)",
    "en": "Input sold item (legacy)"
  },
  {
    "key": "ui_309",
    "id": "View sold items list",
    "en": "View sold items list"
  },
  {
    "key": "ui_310",
    "id": "Setup LuckyZone channel",
    "en": "Setup LuckyZone channel"
  },
  {
    "key": "ui_311",
    "id": "Finish raid and calculate salary",
    "en": "Finish raid and calculate salary"
  },
  {
    "key": "ui_312",
    "id": "⚔️ PARTY • HELP",
    "en": "⚔️ PARTY • HELP"
  },
  {
    "key": "ui_313",
    "id": "Commands for creating and managing raid parties.",
    "en": "Commands for creating and managing raid parties."
  },
  {
    "key": "ui_314",
    "id": "💰 SALARY • HELP",
    "en": "💰 SALARY • HELP"
  },
  {
    "key": "ui_315",
    "id": "Commands for configuring and running Salary Raid.",
    "en": "Commands for configuring and running Salary Raid."
  },
  {
    "key": "ui_316",
    "id": "📦 DROP • HELP",
    "en": "📦 DROP • HELP"
  },
  {
    "key": "ui_317",
    "id": "Commands for managing raid drop items.",
    "en": "Commands for managing raid drop items."
  },
  {
    "key": "ui_318",
    "id": "💵 SOLD • HELP",
    "en": "💵 SOLD • HELP"
  },
  {
    "key": "ui_319",
    "id": "Commands for logging sold items.",
    "en": "Commands for logging sold items."
  },
  {
    "key": "ui_320",
    "id": "🏁 RAID • HELP",
    "en": "🏁 RAID • HELP"
  },
  {
    "key": "ui_321",
    "id": "Commands for finishing and viewing Salary Raid results.",
    "en": "Commands for finishing and viewing Salary Raid results."
  },
  {
    "key": "ui_322",
    "id": "❌ You do not have permission.",
    "en": "❌ You do not have permission."
  },
  {
    "key": "ui_323",
    "id": "❌ Command not found.",
    "en": "❌ Command not found."
  },
  {
    "key": "ui_324",
    "id": "❌ This command can only be used in a Discord server.",
    "en": "❌ This command can only be used in a Discord server."
  },
  {
    "key": "ui_325",
    "id": "❌ This modal can only be used in a Discord server.",
    "en": "❌ This modal can only be used in a Discord server."
  },
  {
    "key": "ui_326",
    "id": "❌ An error occurred while running the command/interaction.",
    "en": "❌ An error occurred while running the command/interaction."
  },
  {
    "key": "ui_327",
    "id": "Hanya untuk Host / Co-Host.",
    "en": "Only for Host / Co-Host."
  },
  {
    "key": "ui_328",
    "id": "PEMBANTU RAID • Gunakan /help untuk bantuan",
    "en": "Raid Helper • Use /help for assistance"
  },
  {
    "key": "ui_329",
    "id": "PEMBANTU RAID • Raid Finish",
    "en": "Raid Helper • Raid Finish"
  },
  {
    "key": "ui_330",
    "id": "PEMBANTU RAID • Salary Final",
    "en": "Raid Helper • Salary Final"
  },
  {
    "key": "ui_331",
    "id": "PEMBANTU RAID • LuckyZone • Asia/Jakarta",
    "en": "Raid Helper • LuckyZone • Asia/Jakarta"
  },
  {
    "key": "ui_332",
    "id": "LuckyZone • Rotasi Harian",
    "en": "LuckyZone • Daily Rotation"
  },
  {
    "key": "ui_333",
    "id": "Map Lucky yang aktif hari ini",
    "en": "Active Lucky maps today"
  },
  {
    "key": "ui_334",
    "id": "Jadwal LuckyZone harian yang dikirim otomatis ke satu channel khusus.",
    "en": "Daily LuckyZone schedule automatically posted to one dedicated channel."
  },
  {
    "key": "ui_335",
    "id": "Buat/atur channel khusus LuckyZone",
    "en": "Create or configure the dedicated LuckyZone channel"
  },
  {
    "key": "party_select_slot",
    "id": "🎯 Pilih slot / job yang ingin diambil",
    "en": "🎯 Select the slot / job you want to take"
  },
  {
    "key": "party_slot_filled",
    "id": "❌ Slot sudah diisi",
    "en": "❌ Slot is already filled"
  },
  {
    "key": "party_select_role",
    "id": "Pilih slot ${role.label}",
    "en": "✅ Select slot ${role.label}"
  },
  {
    "key": "party_available_slot",
    "id": "Pilih slot yang masih kosong",
    "en": "Select an available slot"
  },
  {
    "key": "party_add_member_to_role",
    "id": "Masukkan member ke ${role.label}",
    "en": "Add the member to ${role.label}"
  },
  {
    "key": "party_remove_member",
    "id": "Keluarkan <@${userId}> dari party",
    "en": "Remove <@${userId}> from the party"
  },
  {
    "key": "party_kick_slot",
    "id": "Pilih slot yang ingin dikeluarkan",
    "en": "Select the slot to kick"
  },
  {
    "key": "party_empty_slot",
    "id": "Slot kosong",
    "en": "Empty slot"
  },
  {
    "key": "party_swap_slots",
    "id": "Pilih 2 slot untuk ditukar",
    "en": "Select 2 slots to swap"
  },
  {
    "key": "party_select_nest",
    "id": "🏰 Pilih Nest",
    "en": "🏰 Select Nest"
  },
  {
    "key": "party_select_mode",
    "id": "⚙️ Pilih Mode • ${nest}",
    "en": "⚙️ Select Mode • ${nest}"
  },
  {
    "key": "party_button_close",
    "id": "Tutup Party",
    "en": "Close Party"
  },
  {
    "key": "party_button_lock",
    "id": "Kunci",
    "en": "Lock"
  },
  {
    "key": "party_button_unlock",
    "id": "Buka Kunci",
    "en": "Unlock"
  },
  {
    "key": "party_button_salary",
    "id": "Buat Salary Thread",
    "en": "Create Salary Thread"
  },
  {
    "key": "party_button_salary_created",
    "id": "Salary Thread ✓",
    "en": "Salary Thread ✓"
  },
  {
    "key": "party_button_notify",
    "id": "Notifikasi",
    "en": "Notify"
  },
  {
    "key": "party_button_leave",
    "id": "Keluar",
    "en": "Leave"
  },
  {
    "key": "party_button_add",
    "id": "Tambah Member",
    "en": "Add Member"
  },
  {
    "key": "party_button_kick",
    "id": "Keluarkan",
    "en": "Kick"
  },
  {
    "key": "party_button_swap",
    "id": "Tukar",
    "en": "Swap"
  },
  {
    "key": "party_button_set_nest",
    "id": "Atur Nest",
    "en": "Set Nest"
  },
  {
    "key": "party_button_edit",
    "id": "Edit Party",
    "en": "Edit Party"
  },
  {
    "key": "party_slot_filled_label",
    "id": "Terisi",
    "en": "Filled"
  },
  {
    "key": "party_slot_empty_label",
    "id": "Kosong",
    "en": "Empty"
  },
  {
    "key": "party_user_label",
    "id": "User: ${userId}",
    "en": "User: ${userId}"
  },
  {
    "key": "party_notification_title",
    "id": "Notifikasi Party",
    "en": "Party Notification"
  },
  {
    "key": "party_notification_full",
    "id": "Party Penuh!",
    "en": "Party Full!"
  },
  {
    "key": "party_notification_available",
    "id": "Slot Tersedia",
    "en": "Available Slots"
  },
  {
    "key": "party_notification_full_text",
    "id": "Semua slot party sudah terisi. Silakan bersiap untuk raid!",
    "en": "All party slots are filled. Please get ready for the raid!"
  },
  {
    "key": "party_notification_join_text",
    "id": "Silakan klik tombol slot untuk join!",
    "en": "Click a slot button to join!"
  },
  {
    "key": "party_notification_sent",
    "id": "📢 **Notifikasi @here berhasil dikirim.**",
    "en": "📢 **@here notification sent successfully.**"
  },
  {
    "key": "party_select_empty_for_user",
    "id": "Pilih slot yang masih kosong untuk <@${userId}>:",
    "en": "Select an available slot for <@${userId}>:"
  },
  {
    "key": "party_no_empty_slots",
    "id": "❌ Tidak ada slot yang masih kosong.",
    "en": "❌ There are no available slots."
  },
  {
    "key": "dashboard_title",
    "id": "Raid Dashboard",
    "en": "Raid Dashboard"
  },
  {
    "key": "dashboard_total_gold",
    "id": "Total Gold",
    "en": "Total Gold"
  },
  {
    "key": "dashboard_members",
    "id": "Members",
    "en": "Members"
  },
  {
    "key": "dashboard_total_items_sold",
    "id": "Total Items Sold",
    "en": "Total Items Sold"
  },
  {
    "key": "dashboard_stamp_price",
    "id": "Stamp Price",
    "en": "Stamp Price"
  },
  {
    "key": "dashboard_total_stamp",
    "id": "Total Stamp",
    "en": "Total Stamp"
  },
  {
    "key": "dashboard_stamp_value",
    "id": "Stamp Value",
    "en": "Stamp Value"
  },
  {
    "key": "dashboard_seller_tax",
    "id": "Seller Tax",
    "en": "Seller Tax"
  },
  {
    "key": "dashboard_clean_salary",
    "id": "Clean Salary",
    "en": "Clean Salary"
  },
  {
    "key": "dashboard_host",
    "id": "Host",
    "en": "Host"
  },
  {
    "key": "dashboard_cohost",
    "id": "Co-Host",
    "en": "Co-Host"
  },
  {
    "key": "dashboard_member_list",
    "id": "Member List",
    "en": "Member List"
  },
  {
    "key": "dashboard_salary_summary",
    "id": "Salary Summary",
    "en": "Salary Summary"
  },
  {
    "key": "dashboard_total_pool",
    "id": "Total Pool",
    "en": "Total Pool"
  },
  {
    "key": "dashboard_salary_per_member",
    "id": "Salary / Member",
    "en": "Salary / Member"
  },
  {
    "key": "dashboard_stamp_reward",
    "id": "Stamp Reward",
    "en": "Stamp Reward"
  },
  {
    "key": "dashboard_total_payout",
    "id": "Total Payout",
    "en": "Total Payout"
  },
  {
    "key": "dashboard_items_stampers",
    "id": "Barang & Siapa yang Stamp",
    "en": "Items & Stampers"
  },
  {
    "key": "dashboard_stamp_reward_per_user",
    "id": "Stamp Reward per User",
    "en": "Stamp Reward per User"
  },
  {
    "key": "guide_step7",
    "id": "Hapus Sold yang Salah Input",
    "en": "Remove Incorrect Sold Item"
  },
  {
    "key": "guide_step8",
    "id": "Selesaikan Raid",
    "en": "Finish Raid"
  },
  {
    "key": "guide_remove_sold_tip",
    "id": "Jika item sold salah input, hapus dengan `/sold_remove sale_id:ID` sebelum raid diselesaikan.",
    "en": "If a sold item was entered incorrectly, remove it with `/sold_remove sale_id:ID` before finishing the raid."
  },
  {
    "key": "sold_remove_title",
    "id": "Hapus Sold yang Salah Input",
    "en": "Remove Incorrect Sold Item"
  },
  {
    "key": "sold_remove_sale_id",
    "id": "ID dari /sold_list",
    "en": "Sale ID from /sold_list"
  },
  {
    "key": "sold_remove_dashboard_missing",
    "id": "❌ Sistem Salary Dashboard belum tersedia.",
    "en": "❌ The Salary Dashboard is not available for this thread."
  },
  {
    "key": "sold_remove_setup",
    "id": "❌ Thread ini belum memiliki Salary Dashboard.\n\nGunakan `/salary setup` terlebih dahulu.",
    "en": "❌ This thread does not have a Salary Dashboard yet.\n\nUse `/salary setup` first."
  },
  {
    "key": "sold_remove_not_found",
    "id": "❌ Sale ID tidak ditemukan di Thread ini.\n\nPastikan ID berasal dari `/sold_list` pada Thread yang sama.",
    "en": "❌ Sale ID was not found in this thread.\n\nMake sure the ID comes from `/sold_list` in the same thread."
  },
  {
    "key": "party_title_slot",
    "id": "Slot",
    "en": "Slot"
  },
  {
    "key": "party_creator",
    "id": "Pembuat",
    "en": "Creator"
  },
  {
    "key": "party_status",
    "id": "Status",
    "en": "Status"
  },
  {
    "key": "party_members",
    "id": "Member",
    "en": "Members"
  },
  {
    "key": "party_nest",
    "id": "Nest",
    "en": "Nest"
  },
  {
    "key": "party_job_mode",
    "id": "Mode Job",
    "en": "Job Mode"
  },
  {
    "key": "party_template",
    "id": "Template",
    "en": "Template"
  },
  {
    "key": "party_custom",
    "id": "Custom",
    "en": "Custom"
  },
  {
    "key": "party_notes",
    "id": "Catatan",
    "en": "Notes"
  },
  {
    "key": "party_status_open",
    "id": "Terbuka",
    "en": "Open"
  },
  {
    "key": "party_status_locked",
    "id": "Terkunci",
    "en": "Locked"
  },
  {
    "key": "party_status_closed",
    "id": "Ditutup",
    "en": "Closed"
  },
  {
    "key": "party_empty",
    "id": "Kosong",
    "en": "Empty"
  },
  {
    "key": "party_creator_cannot_leave",
    "id": "❌ Creator tidak dapat keluar. Gunakan **Tutup Party** atau `/party delete`.",
    "en": "❌ The creator cannot leave. Use **Close Party** or `/party delete`."
  },
  {
    "key": "party_notify_denied",
    "id": "❌ Hanya **Host/Creator Party atau Administrator Discord** yang dapat menggunakan tombol Notify.",
    "en": "❌ Only the **Party Host/Creator or a Discord Administrator** can use the Notify button."
  },
  {
    "key": "party_salary_denied",
    "id": "❌ Hanya creator/admin party yang dapat membuat Salary Thread.",
    "en": "❌ Only the party creator/admin can create the Salary Thread."
  },
  {
    "key": "party_lock_required_salary",
    "id": "🔒 **Party harus dikunci terlebih dahulu** sebelum membuat Salary Thread.",
    "en": "🔒 **The party must be locked first** before creating the Salary Thread."
  },
  {
    "key": "party_lock_denied",
    "id": "❌ Hanya creator/admin yang dapat mengunci party.",
    "en": "❌ Only the creator/admin can lock the party."
  },
  {
    "key": "party_close_denied",
    "id": "❌ Hanya creator/admin yang dapat menutup party.",
    "en": "❌ Only the creator/admin can close the party."
  },
  {
    "key": "party_add_denied",
    "id": "❌ Hanya creator/admin yang dapat menambah member.",
    "en": "❌ Only the creator/admin can add members."
  },
  {
    "key": "party_unlock_required",
    "id": "🔒 Buka kunci party terlebih dahulu.",
    "en": "🔒 Unlock the party first."
  },
  {
    "key": "party_select_member",
    "id": "Pilih member yang ingin dimasukkan:",
    "en": "Select the member to add:"
  },
  {
    "key": "party_select_one_member",
    "id": "Pilih 1 member",
    "en": "Select 1 member"
  },
  {
    "key": "party_kick_denied",
    "id": "❌ Hanya creator/admin yang dapat mengeluarkan member.",
    "en": "❌ Only the creator/admin can kick members."
  },
  {
    "key": "party_no_member_kick",
    "id": "❌ Belum ada member yang dapat dikeluarkan.",
    "en": "❌ There are no members to kick."
  },
  {
    "key": "party_swap_denied",
    "id": "❌ Hanya creator/admin yang dapat menukar slot.",
    "en": "❌ Only the creator/admin can swap slots."
  },
  {
    "key": "party_set_nest_denied",
    "id": "❌ Hanya creator/admin yang dapat mengatur Nest.",
    "en": "❌ Only the creator/admin can set the Nest."
  },
  {
    "key": "party_raid_finish_denied",
    "id": "❌ Hanya creator/admin yang dapat menyelesaikan raid.",
    "en": "❌ Only the creator/admin can finish the raid."
  },
  {
    "key": "party_finish_member_sync",
    "id": "${count} member disinkronkan ke Salary.",
    "en": "${count} members synchronized to Salary."
  },
  {
    "key": "party_finish_total_gold",
    "id": "Total Gold",
    "en": "Total Gold"
  },
  {
    "key": "party_finish_stamp_value",
    "id": "Stamp Value",
    "en": "Stamp Value"
  },
  {
    "key": "party_finish_seller_tax",
    "id": "Seller Tax",
    "en": "Seller Tax"
  },
  {
    "key": "party_finish_clean_salary",
    "id": "Clean Salary",
    "en": "Clean Salary"
  },
  {
    "key": "party_finish_stamp_reward",
    "id": "Stamp Reward",
    "en": "Stamp Reward"
  },
  {
    "key": "party_finish_salary_member",
    "id": "Salary / Member",
    "en": "Salary / Member"
  },
  {
    "key": "party_finish_total_payout",
    "id": "Total Payout",
    "en": "Total Payout"
  },
  {
    "key": "party_nest_max_slots",
    "id": "Nest ini menggunakan maksimal **${maxSlots} slot**. Keluarkan member terlebih dahulu, lalu coba **Atur Nest** lagi.",
    "en": "This Nest allows a maximum of **${maxSlots} slots**. Remove members first, then try **Set Nest** again."
  },
  {
    "key": "party_not_found",
    "id": "❌ Party tidak ditemukan.",
    "en": "❌ Party not found."
  },
  {
    "key": "party_edit_denied",
    "id": "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat menggunakan `/party edit`.",
    "en": "❌ Only the **Host/Party Creator** or **Discord Administrator** can use `/party edit`.",
    "segment": true
  },
  {
    "key": "party_edit_open_required",
    "id": "🔒 Party harus dalam status **OPEN** sebelum diedit.",
    "en": "🔒 The party must be **OPEN** before it can be edited."
  },
  {
    "key": "party_modal_title",
    "id": "✏️ Edit Party",
    "en": "✏️ Edit Party"
  },
  {
    "key": "party_modal_title_label",
    "id": "Judul / Nama Party",
    "en": "Party Title / Name"
  },
  {
    "key": "party_modal_title_placeholder",
    "id": "Contoh: SDN Hardcore • Need DPS",
    "en": "Example: SDN Hardcore • Need DPS"
  },
  {
    "key": "party_modal_jobs_label",
    "id": "Job / Slot (kosong = pertahankan)",
    "en": "Jobs / Slots (leave empty to keep current)"
  },
  {
    "key": "party_modal_jobs_placeholder",
    "id": "MT\\nHEALER\\nICE STACKING\\nFU\\nKALI\\nACRO\\nMC\\nDPS",
    "en": "MT\\nHEALER\\nICE STACKING\\nFU\\nKALI\\nACRO\\nMC\\nDPS"
  },
  {
    "key": "party_locked_closed",
    "id": "🔒 Party sedang terkunci/ditutup.",
    "en": "🔒 The party is locked/closed."
  },
  {
    "key": "party_slot_unavailable",
    "id": "❌ Slot tersebut tidak tersedia.",
    "en": "❌ That slot is not available."
  },
  {
    "key": "party_slot_occupied",
    "id": "❌ Slot **${role}** sudah diisi <@${userId}>.",
    "en": "❌ Slot **${role}** is already filled by <@${userId}>."
  },
  {
    "key": "party_already_in_slot",
    "id": "❌ Kamu sudah berada di slot **${role}**. Keluar dulu jika ingin pindah slot.",
    "en": "❌ You are already in slot **${role}**. Leave your current slot first if you want to switch."
  },
  {
    "key": "party_full",
    "id": "❌ Party sudah penuh.",
    "en": "❌ The party is full."
  },
  {
    "key": "party_joined_slot",
    "id": "✅ Kamu masuk ke slot **${role}**.",
    "en": "✅ You joined slot **${role}**."
  },
  {
    "key": "party_not_in_party",
    "id": "❌ Kamu tidak ada di party ini.",
    "en": "❌ You are not in this party."
  },
  {
    "key": "party_left_slot",
    "id": "🚪 Kamu keluar dari slot **${role}**.",
    "en": "🚪 You left slot **${role}**."
  },
  {
    "key": "party_closed",
    "id": "❌ Party sudah ditutup.",
    "en": "❌ The party has been closed."
  },
  {
    "key": "party_no_access",
    "id": "❌ Tidak punya akses.",
    "en": "❌ You do not have access."
  },
  {
    "key": "party_user_already_party",
    "id": "❌ User sudah ada di party.",
    "en": "❌ That user is already in the party."
  },
  {
    "key": "party_joined_user_slot",
    "id": "✅ <@${userId}> masuk ke **${role}**.",
    "en": "✅ <@${userId}> joined **${role}**."
  },
  {
    "key": "party_removed_user_slot",
    "id": "🚪 <@${userId}> dikeluarkan dari **${role}**.",
    "en": "🚪 <@${userId}> was removed from **${role}**."
  },
  {
    "key": "party_slot_empty_now",
    "id": "❌ Slot sudah kosong.",
    "en": "❌ The slot is already empty."
  },
  {
    "key": "party_swapped_slots",
    "id": "🔄 Slot **${a}** dan **${b}** berhasil ditukar.",
    "en": "🔄 Slots **${a}** and **${b}** were swapped successfully."
  },
  {
    "key": "party_nest_selected",
    "id": "🏰 **${nest}** dipilih.\n\nSekarang pilih mode Nest:",
    "en": "🏰 **${nest}** selected.\n\nNow select the Nest mode:"
  },
  {
    "key": "party_nest_not_determined",
    "id": "❌ Nest tidak dapat ditentukan. Silakan pilih Nest kembali.",
    "en": "❌ The Nest could not be determined. Please select the Nest again."
  },
  {
    "key": "party_nest_changed",
    "id": "🎯 Nest diubah menjadi **${nest}** — **${mode}**.",
    "en": "🎯 Nest changed to **${nest}** — **${mode}**."
  },
  {
    "key": "modal_bulk_drop_title",
    "id": "📦 Tambah Banyak Drop",
    "en": "📦 Bulk Add Drop"
  },
  {
    "key": "modal_bulk_drop_label",
    "id": "Nama | Stamp",
    "en": "Name | Stamp"
  },
  {
    "key": "modal_bulk_drop_placeholder",
    "id": "DDNL RING | 2\nBUKU 1 | 1\nFRAGMENT | 0",
    "en": "DDNL RING | 2\nBOOK 1 | 1\nFRAGMENT | 0"
  },
  {
    "key": "sold_requires_drop_data",
    "id": "❌ Belum ada data barang di Drop List. Gunakan `/drop add` atau `/drop bulk` terlebih dahulu sebelum menggunakan `/sold`.",
    "en": "❌ There are no items in the Drop List yet. Use `/drop add` or `/drop bulk` before using `/sold`."
  },
  {
    "key": "modal_bulk_sold_title",
    "id": "💰 Tambah Banyak Sold",
    "en": "💰 Bulk Sold Item"
  },
  {
    "key": "modal_bulk_sold_label",
    "id": "Nama Item | Gold",
    "en": "Item Name | Gold"
  },
  {
    "key": "modal_bulk_sold_placeholder",
    "id": "Isi Gold, contoh: 500g / 1.2k / 2m",
    "en": "Enter Gold, e.g. 500g / 1.2k / 2m"
  },
  {
    "key": "modal_bulk_sold_gold_placeholder",
    "id": "Masukkan Gold (contoh: 500g, 1.5k, 2m)",
    "en": "Enter Gold (example: 500g, 1.5k, 2m)"
  },
  {
    "key": "salary_setchannel_admin",
    "id": "❌ Hanya member dengan permission **Administrator** yang dapat menggunakan `/salary setchannel`.",
    "en": "❌ Only members with **Administrator** permission can use `/salary setchannel`."
  },
  {
    "key": "salary_setchannel_type",
    "id": "❌ Pilih **Text Channel, Announcement Channel, atau Forum Channel**.",
    "en": "❌ Select a **Text Channel, Announcement Channel, or Forum Channel**."
  },
  {
    "key": "salary_setchannel_success",
    "id": "✅ **Salary Channel berhasil disetting.**\n\n📋 Channel: <#${channelId}>\n💡 Sekarang Host/Co-Host dapat menekan tombol **💰 Create Salary Thread** pada party.",
    "en": "✅ **Salary Channel configured successfully.**\n\n📋 Channel: <#${channelId}>\n💡 The Host/Co-Host can now press the **💰 Create Salary Thread** button in the party.",
    "template": true
  },
  {
    "key": "salary_dashboard_missing_create",
    "id": "❌ Salary Dashboard belum dibuat.\n\nGunakan tombol **💰 Create Salary Thread** pada Party terlebih dahulu.",
    "en": "❌ The Salary Dashboard has not been created yet.\n\nUse the **💰 Create Salary Thread** button in the Party first."
  },
  {
    "key": "salary_setup_thread_only",
    "id": "❌ Command `/salary setup` hanya dapat digunakan di dalam Thread.\n\nBuat Thread terlebih dahulu, kemudian jalankan command ini.",
    "en": "❌ `/salary setup` can only be used inside a Thread.\n\nCreate a Thread first, then run this command."
  },
  {
    "key": "salary_dashboard_unavailable",
    "id": "❌ Salary Dashboard belum tersedia di Thread ini.",
    "en": "❌ The Salary Dashboard is not available in this Thread."
  },
  {
    "key": "salary_setup_loading",
    "id": "⏳ Membuat/update dashboard salary...",
    "en": "⏳ Creating/updating the Salary Dashboard..."
  },
  {
    "key": "salary_setup_success",
    "id": "✅ **Salary Dashboard berhasil dibuat!**",
    "en": "✅ **Salary Dashboard created successfully!**"
  },
  {
    "key": "salary_setup_host",
    "id": "👑 Host: ${host}",
    "en": "👑 Host: ${host}",
    "template": true
  },
  {
    "key": "salary_setup_host_not_set",
    "id": "Belum ditentukan",
    "en": "Not set"
  },
  {
    "key": "salary_setup_member_count",
    "id": "👥 Salary Member: ${count}",
    "en": "👥 Salary Members: ${count}",
    "template": true
  },
  {
    "key": "salary_setup_stamp_price",
    "id": "💰 Stamp Price: ${price}g",
    "en": "💰 Stamp Price: ${price}g",
    "template": true
  },
  {
    "key": "salary_setup_tax",
    "id": "🏦 Seller Tax: ${tax}g / 1.000g",
    "en": "🏦 Seller Tax: ${tax}g / 1,000g",
    "template": true
  },
  {
    "key": "salary_setup_guide_title",
    "id": "📖 **PANDUAN RAID**",
    "en": "📖 **RAID GUIDE**"
  },
  {
    "key": "salary_setup_step1",
    "id": "👥 **1. Tambahkan Member**",
    "en": "👥 **1. Add Members**"
  },
  {
    "key": "salary_setup_step2",
    "id": "🤝 **2. Tambahkan Co-Host**",
    "en": "🤝 **2. Add Co-Host**"
  },
  {
    "key": "salary_setup_step3",
    "id": "🏷️ **3. Atur Harga Stamp**",
    "en": "🏷️ **3. Set Stamp Price**"
  },
  {
    "key": "salary_setup_step4",
    "id": "🏦 **4. Atur Seller Tax**",
    "en": "🏦 **4. Set Seller Tax**"
  },
  {
    "key": "salary_setup_step5",
    "id": "📦 **5. Tambahkan Drop**",
    "en": "📦 **5. Add Drops**"
  },
  {
    "key": "salary_setup_step6",
    "id": "💰 **6. Input Barang yang Terjual**",
    "en": "💰 **6. Enter Sold Items**"
  },
  {
    "key": "salary_setup_step7",
    "id": "📋 **7. Cek Barang Terjual**",
    "en": "📋 **7. Check Sold Items**"
  },
  {
    "key": "salary_setup_step8",
    "id": "🏁 **8. Selesaikan Raid**",
    "en": "🏁 **8. Finish Raid**"
  },
  {
    "key": "salary_setup_raid_warning",
    "id": "⚠️ `/raid_done` hanya dapat digunakan oleh **Host / Co-Host**.",
    "en": "⚠️ `/raid_done` can only be used by the **Host / Co-Host**."
  },
  {
    "key": "salary_setup_workflow",
    "id": "💡 **Alur:**\nThread → Setup → Member → Drop → Sold → Raid Done",
    "en": "💡 **Workflow:**\nThread → Setup → Members → Drop → Sold → Raid Done"
  },
  {
    "key": "salary_tax_denied",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat mengubah Seller Tax.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can change the Seller Tax."
  },
  {
    "key": "salary_tax_invalid",
    "id": "❌ Nilai Seller Tax tidak valid.",
    "en": "❌ The Seller Tax value is invalid."
  },
  {
    "key": "salary_tax_updated",
    "id": "✅ Seller Tax diubah menjadi **${tax}g / 1.000g** untuk Thread ini.",
    "en": "✅ Seller Tax changed to **${tax}g / 1,000g** for this Thread.",
    "template": true
  },
  {
    "key": "salary_access_denied",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan command `/salary` di Thread ini.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can use `/salary` in this Thread."
  },
  {
    "key": "salary_host_set",
    "id": "👑 Host raid ini sekarang ${user}.",
    "en": "👑 The raid Host is now ${user}.",
    "template": true
  },
  {
    "key": "salary_cohost_added",
    "id": "🤝 ${user} ditambahkan sebagai Co-Host.",
    "en": "🤝 ${user} was added as Co-Host.",
    "template": true
  },
  {
    "key": "salary_cohost_removed",
    "id": "✅ ${user} dihapus dari Co-Host.",
    "en": "✅ ${user} was removed as Co-Host.",
    "template": true
  },
  {
    "key": "salary_cohost_not_found",
    "id": "⚠️ ${user} tidak sedang menjadi Co-Host.",
    "en": "⚠️ ${user} is not currently a Co-Host.",
    "template": true
  },
  {
    "key": "salary_sale_not_found",
    "id": "❌ Item dengan Sale ID \\`${saleId}\\` tidak ditemukan.\n\nGunakan `/sold_list` untuk melihat ID item.",
    "en": "❌ No item with Sale ID \\`${saleId}\\` was found.\n\nUse `/sold_list` to view item IDs.",
    "template": true
  },
  {
    "key": "salary_stamp_success",
    "id": "🏷️ **Stamp berhasil dicatat.**",
    "en": "🏷️ **Stamp recorded successfully.**"
  },
  {
    "key": "salary_stamp_item",
    "id": "📦 Item: **${itemName}**",
    "en": "📦 Item: **${itemName}**",
    "template": true
  },
  {
    "key": "salary_stamp_count",
    "id": "🏷️ Stamp kamu: **+${count}**",
    "en": "🏷️ Your stamps: **+${count}**",
    "template": true
  },
  {
    "key": "salary_stamp_total",
    "id": "🏷️ Total stamp item: **${stamp}**",
    "en": "🏷️ Total item stamps: **${stamp}**",
    "template": true
  },
  {
    "key": "salary_stamp_reward",
    "id": "💵 Reward kamu: **${reward}g**",
    "en": "💵 Your reward: **${reward}g**",
    "template": true
  },
  {
    "key": "salary_no_message_access",
    "id": "❌ Saya tidak dapat membaca pesan di Thread ini.",
    "en": "❌ I cannot read messages in this Thread."
  },
  {
    "key": "salary_no_tag_message",
    "id": "❌ Saya tidak menemukan pesan tag member dari kamu di Thread ini.",
    "en": "❌ I could not find a member-tag message from you in this Thread."
  },
  {
    "key": "salary_no_valid_mentions",
    "id": "❌ Tidak ada mention user yang valid.",
    "en": "❌ No valid user mentions were found."
  },
  {
    "key": "salary_member_none",
    "id": "❌ Belum ada salary member di Thread ini.",
    "en": "❌ There are no salary members in this Thread."
  },
  {
    "key": "salary_reset_success",
    "id": "⚠️ Semua data sold item, salary member, dan raid history pada Thread ini sudah di-reset.",
    "en": "⚠️ All sold items, salary members, and raid history in this Thread have been reset."
  },
  {
    "key": "stamp_dashboard_missing",
    "id": "❌ Thread ini belum memiliki Salary Dashboard.\n\nGunakan `/salary setup` terlebih dahulu.",
    "en": "❌ This Thread does not have a Salary Dashboard yet.\n\nUse `/salary setup` first."
  },
  {
    "key": "stamp_invalid",
    "id": "❌ Harga stamp tidak valid.",
    "en": "❌ The stamp price is invalid."
  },
  {
    "key": "stamp_updated",
    "id": "✅ Harga stamp Thread ini diubah menjadi **${price}g/stamp**.",
    "en": "✅ The Thread stamp price was changed to **${price}g/stamp**.",
    "template": true
  },
  {
    "key": "soldlist_system_missing",
    "id": "❌ Sistem Salary Dashboard belum tersedia.",
    "en": "❌ The Salary Dashboard system is not available."
  },
  {
    "key": "soldlist_empty",
    "id": "📦 Belum ada item terjual di Thread ini.",
    "en": "📦 No sold items have been recorded in this Thread."
  },
  {
    "key": "soldlist_title",
    "id": "📦 **SOLD ITEMS — THREAD INI**",
    "en": "📦 **SOLD ITEMS — THIS THREAD**"
  },
  {
    "key": "soldlist_count",
    "id": "📊 Menampilkan ${shown} dari ${total} item.",
    "en": "📊 Showing ${shown} of ${total} items.",
    "template": true
  },
  {
    "key": "drop_list_updated",
    "id": "✅ Drop List embed berhasil diperbarui.",
    "en": "✅ The Drop List embed was updated successfully."
  },
  {
    "key": "drop_sale_not_found",
    "id": "❌ Sale ID \\`${saleId}\\` tidak ditemukan di Drop List Thread ini.",
    "en": "❌ Sale ID \\`${saleId}\\` was not found in this Thread's Drop List.",
    "template": true
  },
  {
    "key": "drop_removed",
    "id": "🗑️ **Drop berhasil dihapus.**",
    "en": "🗑️ **Drop removed successfully.**"
  },
  {
    "key": "drop_clear_success",
    "id": "🗑️ Semua daftar drop pada Thread ini sudah dihapus.",
    "en": "🗑️ All drop entries in this Thread have been removed."
  },
  {
    "key": "drop_add_permission",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menambahkan Drop.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can add Drops."
  },
  {
    "key": "drop_no_items",
    "id": "❌ Tidak ada nama item yang valid.",
    "en": "❌ No valid item names were provided."
  },
  {
    "key": "drop_max_items",
    "id": "❌ Maksimal 50 item drop dalam satu command.",
    "en": "❌ You can add a maximum of 50 drop items in one command."
  },
  {
    "key": "drop_added",
    "id": "📦 **${count} item ${mode} ditambahkan.**",
    "en": "📦 **${count} ${mode} item(s) added.**",
    "template": true
  },
  {
    "key": "drop_duplicates",
    "id": "⚠️ **${count} item dilewati karena sudah ada:**",
    "en": "⚠️ **${count} item(s) skipped because they already exist:**",
    "template": true
  },
  {
    "key": "drop_modal_name_empty",
    "id": "❌ Nama item belum diisi.",
    "en": "❌ Item name is required."
  },
  {
    "key": "drop_dashboard_missing",
    "id": "❌ Thread ini belum memiliki Salary Dashboard.\n\nGunakan `/setup` terlebih dahulu.",
    "en": "❌ This Thread does not have a Salary Dashboard yet.\n\nUse `/setup` first."
  },
  {
    "key": "sold_dashboard_missing",
    "id": "❌ Thread ini belum memiliki Salary Dashboard.\n\nJalankan `/setup` terlebih dahulu.",
    "en": "❌ This Thread does not have a Salary Dashboard yet.\n\nRun `/setup` first."
  },
  {
    "key": "sold_permission",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan `/sold_item` pada raid ini.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can use `/sold_item` in this raid."
  },
  {
    "key": "sold_invalid_gold",
    "id": "❌ Format gold tidak valid.",
    "en": "❌ The gold format is invalid."
  },
  {
    "key": "sold_recorded",
    "id": "✅ **${itemName}** berhasil dicatat.",
    "en": "✅ **${itemName}** was recorded successfully.",
    "template": true
  },
  {
    "key": "sold_drop_updated",
    "id": "📋 Drop List: **UPDATED**",
    "en": "📋 Drop List: **UPDATED**"
  },
  {
    "key": "sold_drop_missing",
    "id": "⚠️ Item ini belum ada di Drop List.",
    "en": "⚠️ This item is not in the Drop List yet."
  },
  {
    "key": "raidparty_channel_access",
    "id": "❌ Bot tidak dapat mengakses channel tempat command ini dijalankan. Pastikan bot memiliki View Channel dan Send Messages.",
    "en": "❌ The bot cannot access the channel where this command was run. Make sure it has View Channel and Send Messages permissions."
  },
  {
    "key": "raidparty_created",
    "id": "✅ Raid party dibuat: **${name}**\nID: \\`${id}\\`",
    "en": "✅ Raid party created: **${name}**\nID: \\`${id}\\`",
    "template": true
  },
  {
    "key": "party_mode_invalid",
    "id": "❌ Mode **${mode}** tidak tersedia untuk **${nest}**.\nPilihan yang tersedia: **${choices}**.",
    "en": "❌ Mode **${mode}** is not available for **${nest}**.\nAvailable choices: **${choices}**.",
    "template": true
  },
  {
    "key": "party_no_active",
    "id": "Tidak ada party aktif.",
    "en": "No active parties."
  },
  {
    "key": "party_edit_title_empty",
    "id": "❌ Judul party tidak boleh kosong.",
    "en": "❌ Party title cannot be empty."
  },
  {
    "key": "party_custom_min",
    "id": "❌ Custom Party minimal **4 job/slot**.",
    "en": "❌ A Custom Party must have at least **4 jobs/slots**."
  },
  {
    "key": "party_custom_max",
    "id": "❌ Custom Party maksimal **8 job/slot**.",
    "en": "❌ A Custom Party can have at most **8 jobs/slots**."
  },
  {
    "key": "party_custom_duplicate",
    "id": "❌ Tidak boleh ada job/slot yang sama lebih dari satu kali.",
    "en": "❌ Jobs/slots cannot be duplicated."
  },
  {
    "key": "setup_thread_only",
    "id": "❌ `/setup` hanya bisa digunakan di dalam Thread.",
    "en": "❌ `/setup` can only be used inside a Thread."
  },
  {
    "key": "setup_loading",
    "id": "⏳ Menyiapkan Salary Dashboard...",
    "en": "⏳ Preparing the Salary Dashboard..."
  },
  {
    "key": "setup_dashboard_success",
    "id": "✅ **Salary Dashboard berhasil dibuat!**",
    "en": "✅ **Salary Dashboard created successfully!**"
  },
  {
    "key": "setup_dashboard_failed",
    "id": "❌ **Dashboard gagal dibuat.**\n\nPastikan bot bisa mengirim pesan di thread ini.",
    "en": "❌ **Failed to create the Dashboard.**\n\nMake sure the bot can send messages in this Thread."
  },
  {
    "key": "guide_host_only",
    "id": "❌ **Host Guide hanya dapat dilihat oleh Host, Co-Host, atau Administrator Discord.**",
    "en": "❌ **The Host Guide can only be viewed by the Host, Co-Host, or a Discord Administrator.**"
  },
  {
    "key": "salary_member_update",
    "id": "💰 **SALARY MEMBER UPDATE**",
    "en": "💰 **SALARY MEMBER UPDATE**",
    "segment": true
  },
  {
    "key": "salary_members_added",
    "id": "✅ **Ditambahkan ke Member List:**",
    "en": "✅ **Added to Member List:**",
    "segment": true
  },
  {
    "key": "salary_members_already",
    "id": "⚠️ **Sudah terdaftar:**",
    "en": "⚠️ **Already registered:**",
    "segment": true
  },
  {
    "key": "salary_members_removed",
    "id": "✅ **Dihapus:**",
    "en": "✅ **Removed:**",
    "segment": true
  },
  {
    "key": "salary_members_not_found",
    "id": "⚠️ **Tidak terdaftar:**",
    "en": "⚠️ **Not registered:**",
    "segment": true
  },
  {
    "key": "salary_total_members",
    "id": "👥 **Total Salary Member:** ${count}",
    "en": "👥 **Total Salary Members:** ${count}",
    "template": true
  },
  {
    "key": "salary_addmember_no_mentions",
    "id": "❌ Tidak ada mention user yang valid.",
    "en": "❌ No valid user mentions were found.",
    "segment": true
  },
  {
    "key": "salary_remove_member_no_mentions",
    "id": "❌ Tidak ada mention user yang valid.",
    "en": "❌ No valid user mentions were found.",
    "segment": true
  },
  {
    "key": "salary_members_list_title",
    "id": "💰 **SALARY MEMBERS**",
    "en": "💰 **SALARY MEMBERS**",
    "segment": true
  },
  {
    "key": "salary_total_label",
    "id": "👥 **Total:** ${count}",
    "en": "👥 **Total:** ${count}",
    "template": true
  },
  {
    "key": "salary_no_members",
    "id": "❌ Belum ada salary member di Thread ini.",
    "en": "❌ There are no salary members in this Thread.",
    "segment": true
  },
  {
    "key": "sold_bulk_select_text",
    "id": "💰 **Bulk Sold — Pilih Item yang TERJUAL**\n\nSemua item diambil dari Drop List. Pilih hanya item yang sudah terjual.\nItem yang tidak dipilih akan tetap berada di Drop List.\n\n${items}\n\nSetelah memilih item Sold, bot akan meminta Gold satu per satu.",
    "en": "💰 **Bulk Sold — Select SOLD Items**\n\nAll items are taken from the Drop List. Select only items that have been sold.\nItems that are not selected will remain in the Drop List.\n\n${items}\n\nAfter selecting the sold items, the bot will ask for Gold one item at a time.",
    "template": true
  },
  {
    "key": "sold_bulk_select_placeholder",
    "id": "Pilih item yang sudah Sold",
    "en": "Select sold items",
    "segment": true
  },
  {
    "key": "sold_bulk_select_option_description",
    "id": "Tandai item ini sebagai Sold",
    "en": "Mark this item as Sold",
    "segment": true
  },
  {
    "key": "sold_bulk_cancel_label",
    "id": "Batal",
    "en": "Cancel",
    "segment": true
  },
  {
    "key": "sold_bulk_select_denied",
    "id": "❌ Hanya orang yang menjalankan `/sold bulk` yang dapat memilih item.",
    "en": "❌ Only the person who started `/sold bulk` can select the items.",
    "segment": true
  },
  {
    "key": "sold_bulk_select_min_one",
    "id": "❌ Pilih minimal satu item yang sudah Sold.",
    "en": "❌ Select at least one sold item.",
    "segment": true
  },
  {
    "key": "sold_bulk_item_missing",
    "id": "❌ Item berikut sudah tidak tersedia di Drop List:\n${items}",
    "en": "❌ The following items are no longer available in the Drop List:\n${items}",
    "template": true
  },
  {
    "key": "sold_bulk_stamper_text",
    "id": "🏷️ **Pilih Stamper — ${index}/${total}**\n\n📦 **Item:** ${item}\n💰 **Gold:** ${gold}\n🏷️ **Stamp:** ${stamp}\n\nGunakan menu di bawah untuk memilih anggota yang melakukan stamp.\n📊 Progress: **${done}/${total}** item sudah memiliki stamper.",
    "en": "🏷️ **Select Stamper — ${index}/${total}**\n\n📦 **Item:** ${item}\n💰 **Gold:** ${gold}\n🏷️ **Stamp:** ${stamp}\n\nUse the menu below to select the member who performed the stamp.\n📊 Progress: **${done}/${total}** items have a stamper.",
    "template": true
  },
  {
    "key": "sold_bulk_stamper_placeholder",
    "id": "Pilih stamper untuk ${item}",
    "en": "Select stamper for ${item}",
    "template": true
  },
  {
    "key": "sold_bulk_result_item",
    "id": "**${index}. ${item}** — ${gold}\n🏷️ ${stamp} stamp • 👤 ${user}",
    "en": "**${index}. ${item}** — ${gold}\n🏷️ ${stamp} stamps • 👤 ${user}",
    "template": true
  },
  {
    "key": "sold_bulk_result",
    "id": "✅ **${count} item berhasil dicatat.**\n\n${items}\n\n📦 Total Gold: **${totalGold}**\n🏷️ Total Stamp: **${totalStamp}**\n📋 Drop List diperbarui: **${dropUpdated}/${count}**${unmatchedText}",
    "en": "✅ **${count} item(s) recorded successfully.**\n\n${items}\n\n📦 Total Gold: **${totalGold}**\n🏷️ Total Stamps: **${totalStamp}**\n📋 Drop List updated: **${dropUpdated}/${count}**${unmatchedText}",
    "template": true
  },
  {
    "key": "sold_bulk_no_stamper",
    "id": "Tidak ada",
    "en": "None",
    "segment": true
  },
  {
    "key": "sold_bulk_none",
    "id": "Tidak ada",
    "en": "None",
    "segment": true
  },
  {
    "key": "sold_bulk_handler_missing",
    "id": "❌ Handler pemilihan item Bulk Sold tidak ditemukan.",
    "en": "❌ The Bulk Sold item-selection handler was not found.",
    "segment": true
  },
  {
    "key": "sold_bulk_handler_error",
    "id": "❌ Terjadi error saat memproses item Sold.",
    "en": "❌ An error occurred while processing the sold items.",
    "segment": true
  },
  {
    "key": "sold_bulk_unmatched_prefix",
    "id": "\n⚠️ Tidak ditemukan di Drop List: ",
    "en": "\n⚠️ Not found in Drop List: ",
    "segment": true
  },
  {
    "key": "sold_bulk_expired",
    "id": "❌ Sesi bulk sold sudah berakhir. Jalankan `/sold bulk` lagi.",
    "en": "❌ The Bulk Sold session has expired. Run `/sold bulk` again.",
    "segment": true
  },
  {
    "key": "sold_bulk_picker_denied",
    "id": "❌ Hanya orang yang menjalankan `/sold bulk` atau Administrator yang dapat memilih stamper.",
    "en": "❌ Only the person who started `/sold bulk` or an Administrator can choose the stamper.",
    "segment": true
  },
  {
    "key": "sold_bulk_permission",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat melanjutkan proses Bulk Sold.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can continue the Bulk Sold process.",
    "segment": true
  },
  {
    "key": "sold_bulk_invalid_session",
    "id": "❌ Sesi pemilihan stamper tidak valid. Jalankan `/sold bulk` lagi.",
    "en": "❌ The stamper selection session is invalid. Run `/sold bulk` again.",
    "segment": true
  },
  {
    "key": "sold_bulk_user_missing",
    "id": "❌ User stamper tidak ditemukan.",
    "en": "❌ Stamper user was not found.",
    "segment": true
  },
  {
    "key": "sold_bulk_cancel_denied",
    "id": "❌ Hanya orang yang menjalankan `/sold bulk` atau Administrator yang dapat membatalkan.",
    "en": "❌ Only the person who started `/sold bulk` or an Administrator can cancel it.",
    "segment": true
  },
  {
    "key": "sold_bulk_cancelled",
    "id": "❌ **Bulk Sold dibatalkan.** Tidak ada item yang disimpan.",
    "en": "❌ **Bulk Sold cancelled.** No items were saved.",
    "segment": true
  },
  {
    "key": "sold_gold_invalid",
    "id": "❌ Format gold tidak valid. Contoh: `500g`, `1.5k`, `2m`.",
    "en": "❌ Invalid gold format. Example: `500g`, `1.5k`, `2m`.",
    "segment": true
  },
  {
    "key": "drop_permission",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan command Drop pada raid ini.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can use the Drop command in this raid.",
    "segment": true
  },
  {
    "key": "drop_embed_failed",
    "id": "❌ Gagal membuat Drop List embed. Pastikan bot memiliki izin mengirim dan mengedit pesan di Thread.",
    "en": "❌ Failed to create the Drop List embed. Make sure the bot can send and edit messages in the Thread.",
    "segment": true
  },
  {
    "key": "party_no_active_channel",
    "id": "❌ Tidak ada party aktif di channel ini. Gunakan `/party edit party_id:...` untuk memilih party tertentu.",
    "en": "❌ There is no active party in this channel. Use `/party edit party_id:...` to select a specific party.",
    "segment": true
  },
  {
    "key": "party_multiple_active",
    "id": "❌ Ada lebih dari satu party aktif di channel ini. Gunakan `/party edit party_id:PARTY_ID` agar party yang diedit jelas.",
    "en": "❌ There is more than one active party in this channel. Use `/party edit party_id:PARTY_ID` to specify which party to edit.",
    "segment": true
  },
  {
    "key": "party_custom_open_required",
    "id": "🔒 Party harus dalam status **OPEN** sebelum Custom Job diubah.",
    "en": "🔒 The party must be **OPEN** before Custom Jobs can be changed.",
    "segment": true
  },
  {
    "key": "party_delete_denied",
    "id": "❌ Hanya **Host/Creator Party** atau **Administrator Discord** yang dapat menghapus party.",
    "en": "❌ Only the **Host/Party Creator** or **Discord Administrator** can delete the party.",
    "segment": true
  },
  {
    "key": "party_deleted",
    "id": "🗑️ Party `${partyId}` berhasil dihapus dari database.",
    "en": "🗑️ Party `${partyId}` was deleted from the database.",
    "template": true
  },
  {
    "key": "party_edit_success",
    "id": "✅ **Party berhasil diperbarui.**",
    "en": "✅ **Party updated successfully.**",
    "segment": true
  },
  {
    "key": "party_edit_title",
    "id": "📝 Judul: **${title}**",
    "en": "📝 Title: **${title}**",
    "template": true
  },
  {
    "key": "party_edit_custom_jobs",
    "id": "🎯 Custom Job / Slot:",
    "en": "🎯 Custom Job / Slots:",
    "segment": true
  },
  {
    "key": "party_edit_unchanged",
    "id": "🎯 Job / Slot: **Tidak diubah**",
    "en": "🎯 Job / Slots: **Unchanged**",
    "segment": true
  },
  {
    "key": "party_members_preserved",
    "id": "👥 Member yang sudah mengisi slot tetap dipertahankan.",
    "en": "👥 Members already occupying slots are preserved.",
    "segment": true
  },
  {
    "key": "sold_item_permission",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menggunakan `/sold` pada raid ini.",
    "en": "❌ Only the **Host**, **Co-Host**, or **Administrator** can use `/sold` in this raid.",
    "segment": true
  },
  {
    "key": "sold_item_gold_invalid",
    "id": "❌ Format gold tidak valid. Contoh: `500g`, `1.5k`, `2m`.",
    "en": "❌ Invalid gold format. Example: `500g`, `1.5k`, `2m`.",
    "segment": true
  },
  // Migrated from legacy i18n locale map; now catalog-owned.
  {
    "key": "bot_name",
    "id": "Raid Helper",
    "en": "Raid Helper"
  },
  {
    "key": "today_at",
    "id": "Hari ini pukul",
    "en": "Today at",
    "segment": true
  },
  {
    "key": "only_host_cohost",
    "id": "Hanya untuk Host / Co-Host.",
    "en": "Only for Host / Co-Host.",
    "segment": true
  },
  {
    "key": "footer_help",
    "id": "PEMBANTU RAID • Gunakan /help untuk bantuan",
    "en": "Raid Helper • Use /help for assistance",
    "segment": true
  },
  {
    "key": "footer_raid_finish",
    "id": "PEMBANTU RAID • Raid Finish",
    "en": "Raid Helper • Raid Finish",
    "segment": true
  },
  {
    "key": "footer_salary_final",
    "id": "PEMBANTU RAID • Salary Final",
    "en": "Raid Helper • Salary Final",
    "segment": true
  },
  {
    "key": "footer_luckyzone",
    "id": "PEMBANTU RAID • LuckyZone • Asia/Jakarta",
    "en": "Raid Helper • LuckyZone • Asia/Jakarta",
    "segment": true
  },
  {
    "key": "lz_daily_rotation",
    "id": "LuckyZone • Rotasi Harian",
    "en": "LuckyZone • Daily Rotation",
    "segment": true
  },
  {
    "key": "lz_active_today",
    "id": "Map Lucky yang aktif hari ini",
    "en": "Active Lucky maps today",
    "segment": true
  },
  {
    "key": "lz_reset_daily",
    "id": "Reset setiap hari pukul 08:00 WIB.",
    "en": "Resets daily at 08:00 WIB.",
    "segment": true
  },
  {
    "key": "lz_map_active",
    "id": "MAP AKTIF",
    "en": "ACTIVE MAP",
    "segment": true
  },
  {
    "key": "lz_reset_lz",
    "id": "RESET LUCKYZONE",
    "en": "RESET LUCKYZONE"
  },
  {
    "key": "lz_reset_pattern",
    "id": "RESET POLA",
    "en": "RESET PATTERN",
    "segment": true
  },
  {
    "key": "lz_help_title",
    "id": "🍀 LuckyZone • Help",
    "en": "🍀 LuckyZone • Help"
  },
  {
    "key": "lz_help_description",
    "id": "Jadwal LuckyZone harian yang dikirim otomatis ke satu channel khusus.",
    "en": "Daily LuckyZone schedule automatically posted to one dedicated channel.",
    "segment": true
  },
  {
    "key": "lz_setup",
    "id": "Setup",
    "en": "Setup"
  },
  {
    "key": "lz_update",
    "id": "Update",
    "en": "Update"
  },
  {
    "key": "lz_disable",
    "id": "Disable",
    "en": "Disable"
  },
  {
    "key": "lz_setup_desc",
    "id": "Buat/atur channel khusus LuckyZone",
    "en": "Create or configure the dedicated LuckyZone channel",
    "segment": true
  },
  {
    "key": "lz_now_desc",
    "id": "Update LuckyZone sekarang",
    "en": "Update LuckyZone now",
    "segment": true
  },
  {
    "key": "lz_disable_desc",
    "id": "Matikan update otomatis LuckyZone",
    "en": "Disable automatic LuckyZone updates",
    "segment": true
  },
  {
    "key": "lz_admin_only",
    "id": "❌ Hanya member dengan permission **Administrator** yang dapat mengatur LuckyZone.",
    "en": "❌ Only members with **Administrator** permission can configure LuckyZone.",
    "segment": true
  },
  {
    "key": "lz_text_channel_only",
    "id": "❌ LuckyZone harus menggunakan **Text Channel**.",
    "en": "❌ LuckyZone must use a **Text Channel**.",
    "segment": true
  },
  {
    "key": "lz_setup_success",
    "id": "✅ **LuckyZone Channel berhasil disetting.**",
    "en": "✅ **LuckyZone channel configured successfully.**",
    "segment": true
  },
  {
    "key": "lz_auto_update",
    "id": "Update otomatis: **08:00 WIB setiap hari**",
    "en": "Automatic update: **08:00 WIB every day**",
    "segment": true
  },
  {
    "key": "lz_pattern_active",
    "id": "Pattern aktif: mengikuti jadwal Pattern 1/2/3.",
    "en": "Active pattern: follows Pattern 1/2/3 schedule.",
    "segment": true
  },
  {
    "key": "lz_disabled",
    "id": "✅ Update otomatis LuckyZone dimatikan.",
    "en": "✅ Automatic LuckyZone updates disabled.",
    "segment": true
  },
  {
    "key": "lz_not_configured",
    "id": "❌ LuckyZone belum disetting. Jalankan `/luckyzone setup` terlebih dahulu.",
    "en": "❌ LuckyZone has not been configured. Run `/luckyzone setup` first.",
    "segment": true
  },
  {
    "key": "lz_updated",
    "id": "✅ LuckyZone diperbarui di",
    "en": "✅ LuckyZone updated in",
    "segment": true
  },
  {
    "key": "lz_reset_announcement",
    "id": "🍀 **LuckyZone Reset!** LuckyZone hari ini sudah diperbarui.",
    "en": "🍀 **LuckyZone Reset!** Today's LuckyZone has been updated.",
    "segment": true
  },
  {
    "key": "drop_list_title",
    "id": "Daftar Drop",
    "en": "Drop List",
    "segment": true
  },
  {
    "key": "drop_list_empty",
    "id": "📋 Belum ada Drop List.",
    "en": "No drops recorded yet.",
    "segment": true
  },
  {
    "key": "drop_status_sold",
    "id": "Sold",
    "en": "Sold"
  },
  {
    "key": "drop_status_not_sold",
    "id": "Belum Sold",
    "en": "Not Sold",
    "segment": true
  },
  {
    "key": "unknown_item",
    "id": "Unknown Item",
    "en": "Unknown Item"
  },
  {
    "key": "raid_done_sold_items",
    "id": "Item Terjual",
    "en": "Items Sold"
  },
  {
    "key": "raid_done_remainder",
    "id": "Sisa / Pembulatan",
    "en": "Remainder / Rounding"
  },
  {
    "key": "raid_done_drop_preview",
    "id": "Preview Item Terjual",
    "en": "Sold Item Preview"
  },
  {
    "key": "raid_done_sold_items_list",
    "id": "Daftar Item Terjual",
    "en": "Sold Items List"
  },
  {
    "key": "raid_done_more_items",
    "id": "+${count} item lainnya — gunakan `/sold_list` untuk detail.",
    "en": "+${count} more items — use `/sold_list` for details.",
    "template": true
  },
  {
    "key": "raid_done_no_sold_items",
    "id": "Belum ada item yang terjual.",
    "en": "No sold items yet."
  },
  {
    "key": "raid_done_salary_members_title",
    "id": "Salary / User Member",
    "en": "Salary / User Member"
  },
  {
    "key": "raid_done_base_salary",
    "id": "Base Salary",
    "en": "Base Salary"
  },
  {
    "key": "raid_done_total_salary",
    "id": "Total Gaji",
    "en": "Total Salary"
  },
  {
    "key": "raid_done_other_stampers",
    "id": "Stamper di Luar Salary Member",
    "en": "Stampers Outside Salary Members"
  },
  {
    "key": "raid_done_no_salary_members",
    "id": "Belum ada Salary Member yang terdaftar.",
    "en": "No Salary Members are registered."
  },
  {
    "key": "raid_done_formula_description",
    "id": "Rumus inti perhitungan salary raid.",
    "en": "Core formulas used for the raid salary calculation."
  },
  {
    "key": "raid_done_check",
    "id": "Cek Perhitungan",
    "en": "Calculation Check"
  },
  {
    "key": "raid_done_untracked_stamp",
    "id": "Stamp Belum Tercatat",
    "en": "Untracked Stamp"
  },
  {
    "key": "raid_done_distribution_note",
    "id": "Catatan Pembagian",
    "en": "Distribution Note"
  },
  {
    "key": "raid_done_distribution_note_text",
    "id": "Base Salary dibagi rata ke Salary Member. Stamp Reward diberikan berdasarkan stamp masing-masing user. Seller Tax hanya diberikan kepada Host.",
    "en": "Base Salary is divided equally among Salary Members. Stamp Reward follows each user's stamps. Seller Tax is paid only to the Host."
  },
  {
    "key": "raid_result_title",
    "id": "Hasil Raid",
    "en": "Raid Result",
    "segment": true
  },
  {
    "key": "salary_result_title",
    "id": "Hasil Salary",
    "en": "Salary Result",
    "segment": true
  },
  {
    "key": "formula",
    "id": "Rumus",
    "en": "Formula",
    "segment": true
  },
  {
    "key": "total_gold",
    "id": "Total Gold",
    "en": "Total Gold"
  },
  {
    "key": "total_stamp",
    "id": "Total Stamp",
    "en": "Total Stamp"
  },
  {
    "key": "stamp_value",
    "id": "Stamp Value",
    "en": "Stamp Value"
  },
  {
    "key": "seller_tax",
    "id": "Seller Tax",
    "en": "Seller Tax"
  },
  {
    "key": "clean_salary",
    "id": "Clean Salary",
    "en": "Clean Salary"
  },
  {
    "key": "members",
    "id": "Members",
    "en": "Members"
  },
  {
    "key": "host",
    "id": "Host",
    "en": "Host"
  },
  {
    "key": "cohost",
    "id": "Co-Host",
    "en": "Co-Host"
  },
  {
    "key": "raid_id",
    "id": "Raid ID",
    "en": "Raid ID"
  },
  {
    "key": "raid_result_footer",
    "id": "PEMBANTU RAID • Raid Finish",
    "en": "Raid Helper • Raid Finish",
    "segment": true
  },
  {
    "key": "salary_result_footer",
    "id": "PEMBANTU RAID • Salary Final",
    "en": "Raid Helper • Salary Final",
    "segment": true
  },
  {
    "key": "salary_member_empty",
    "id": "Belum ada salary member.",
    "en": "No salary members yet.",
    "segment": true
  },
  {
    "key": "raid_dashboard_missing",
    "id": "❌ Salary dashboard untuk Thread ini belum dibuat.",
    "en": "❌ The Salary Dashboard for this thread has not been created.",
    "segment": true
  },
  {
    "key": "use_salary_setup",
    "id": "Gunakan `/salary setup` terlebih dahulu.",
    "en": "Use `/salary setup` first.",
    "segment": true
  },
  {
    "key": "raid_access_denied",
    "id": "❌ Hanya **Host**, **Co-Host**, atau **Administrator** yang dapat menjalankan `/raid_done` pada raid ini.",
    "en": "❌ Only **Host**, **Co-Host**, or **Administrator** can run `/raid_done` for this raid.",
    "segment": true
  },
  {
    "key": "raid_done_completed",
    "id": "✅ Hasil `/raid_done` berhasil dibuat dan ditampilkan.",
    "en": "✅ `/raid_done` result created and displayed.",
    "segment": true
  },
  {
    "key": "raid_done_updated",
    "id": "✅ Hasil `/raid_done` diperbarui pada pesan yang sama.",
    "en": "✅ The `/raid_done` result was updated in the same message.",
    "segment": true
  },
  {
    "key": "raid_done_unsold_items",
    "id": "❌ `/raid_done` belum dapat dijalankan karena masih ada **${count} item yang belum Sold** di Drop List.\n\n${items}\n\nSelesaikan penjualan item tersebut dengan `/sold` terlebih dahulu, lalu jalankan `/raid_done` kembali.",
    "en": "❌ `/raid_done` cannot be completed because **${count} item(s) are still unsold** in the Drop List.\n\n${items}\n\nComplete those sales with `/sold` first, then run `/raid_done` again.",
    "template": true
  },
  {
    "key": "formula_values",
    "id": "Total Gold (**${totalGold}**) - Stamp Value (**${stampValue}**) - Seller Tax (**${sellerTax}**) = Clean Salary (**${cleanSalary}**)\nClean Salary (**${cleanSalary}**) ÷ **${memberCount}** member = **${salaryPerMember} / member**",
    "en": "Total Gold (**${totalGold}**) - Stamp Value (**${stampValue}**) - Seller Tax (**${sellerTax}**) = Clean Salary (**${cleanSalary}**)\nClean Salary (**${cleanSalary}**) ÷ **${memberCount}** member = **${salaryPerMember} / member**",
    "template": true
  },
  {
    "key": "base_salary",
    "id": "Base",
    "en": "Base",
    "segment": true
  },
  {
    "key": "stamp_reward",
    "id": "Stamp",
    "en": "Stamp",
    "segment": true
  },
  {
    "key": "salary_member_required",
    "id": "❌ Belum ada salary member.",
    "en": "❌ No salary members yet.",
    "segment": true
  },
  {
    "key": "use_salary_addmember",
    "id": "Gunakan `/salary addmember` terlebih dahulu.",
    "en": "Use `/salary addmember` first.",
    "segment": true
  },
  {
    "key": "guide_title",
    "id": "Panduan Host — Raid Salary",
    "en": "Host Guide — Raid Salary",
    "segment": true
  },
  {
    "key": "guide_button",
    "id": "Panduan Host",
    "en": "Host Guide",
    "segment": true
  },
  {
    "key": "guide_step1",
    "id": "Atur Harga Stamp",
    "en": "Set Stamp Price",
    "segment": true
  },
  {
    "key": "guide_step2",
    "id": "Atur Seller Tax",
    "en": "Set Seller Tax",
    "segment": true
  },
  {
    "key": "guide_tax_tip",
    "id": "Gunakan 0 jika raid tidak menggunakan Seller Tax.",
    "en": "Use 0 if the raid has no Seller Tax.",
    "segment": true
  },
  {
    "key": "guide_step3",
    "id": "Tambah Co-host",
    "en": "Add Co-host",
    "segment": true
  },
  {
    "key": "guide_step4",
    "id": "Tambah Drop",
    "en": "Add Drops",
    "segment": true
  },
  {
    "key": "guide_step5",
    "id": "Input Barang Sold",
    "en": "Input Sold Items",
    "segment": true
  },
  {
    "key": "guide_step6",
    "id": "Cek Drop / Barang Sold",
    "en": "Check Drops / Sold Items",
    "segment": true
  },
  {
    "key": "guide_warning",
    "id": "hanya dapat digunakan oleh Host / Co-host.",
    "en": "can only be used by Host / Co-host.",
    "segment": true
  },
  {
    "key": "guide_workflow",
    "id": "Alur: Thread → Drop → Sold → Raid Done",
    "en": "Workflow: Thread → Drop → Sold → Raid Done",
    "segment": true
  },
  {
    "key": "help_title",
    "id": "Bantuan",
    "en": "Help",
    "segment": true
  },
  {
    "key": "help_description",
    "id": "Gunakan pilihan kategori di bawah untuk melihat cara memakai fitur bot.",
    "en": "Use the category options below to see how to use the bot's features.",
    "segment": true
  },
  {
    "key": "help_party_create",
    "id": "Buat party",
    "en": "Create a party",
    "segment": true
  },
  {
    "key": "help_party_edit",
    "id": "Edit judul / Custom Job party",
    "en": "Edit title / Custom party roles",
    "segment": true
  },
  {
    "key": "help_party_list",
    "id": "Lihat party aktif",
    "en": "View active parties",
    "segment": true
  },
  {
    "key": "help_party_delete",
    "id": "Hapus party",
    "en": "Delete a party",
    "segment": true
  },
  {
    "key": "help_salary_setup",
    "id": "Buat Salary Dashboard di thread",
    "en": "Create Salary Dashboard in thread",
    "segment": true
  },
  {
    "key": "help_salary_addmember",
    "id": "Tambah salary member",
    "en": "Add salary member",
    "segment": true
  },
  {
    "key": "help_salary_addcohost",
    "id": "Tambah Co-Host",
    "en": "Add Co-Host",
    "segment": true
  },
  {
    "key": "help_salary_settax",
    "id": "Atur Seller Tax",
    "en": "Set Seller Tax",
    "segment": true
  },
  {
    "key": "help_salary_setchannel",
    "id": "Atur channel Salary (Admin)",
    "en": "Set Salary channel (Admin)",
    "segment": true
  },
  {
    "key": "help_setstampprice",
    "id": "Atur harga stamp",
    "en": "Set stamp price",
    "segment": true
  },
  {
    "key": "help_drop_add",
    "id": "Tambah drop",
    "en": "Add drop",
    "segment": true
  },
  {
    "key": "help_drop_bulk",
    "id": "Tambah banyak drop",
    "en": "Bulk add drops",
    "segment": true
  },
  {
    "key": "help_drop_list",
    "id": "Lihat Drop List",
    "en": "View Drop List",
    "segment": true
  },
  {
    "key": "help_drop_remove",
    "id": "Hapus drop berdasarkan ID",
    "en": "Remove drop by ID",
    "segment": true
  },
  {
    "key": "help_drop_clear",
    "id": "Hapus semua drop",
    "en": "Clear all drops",
    "segment": true
  },
  {
    "key": "help_sold_add",
    "id": "Catat item terjual",
    "en": "Log sold item",
    "segment": true
  },
  {
    "key": "help_sold_bulk",
    "id": "Catat banyak item terjual",
    "en": "Bulk log sold items",
    "segment": true
  },
  {
    "key": "help_sold_item",
    "id": "Input sold item legacy",
    "en": "Input sold item (legacy)",
    "segment": true
  },
  {
    "key": "help_sold_list",
    "id": "Lihat daftar item terjual",
    "en": "View sold items list",
    "segment": true
  },
  {
    "key": "help_sold_remove",
    "id": "Hapus sold yang salah input berdasarkan Sale ID",
    "en": "Remove an incorrectly entered sold item by Sale ID",
    "segment": true
  },
  {
    "key": "lz_next_title",
    "id": "🍀 LuckyZone • Besok",
    "en": "🍀 LuckyZone • Tomorrow"
  },
  {
    "key": "lz_next_active",
    "id": "Map Lucky yang aktif besok",
    "en": "Lucky maps active tomorrow"
  },
  {
    "key": "lz_next_reset",
    "id": "LuckyZone besok mulai pukul 08:00 WIB",
    "en": "Tomorrow's LuckyZone starts at 08:00 WIB"
  },
  {
    "key": "lz_next_error",
    "id": "❌ Jadwal LuckyZone besok tidak dapat dimuat.",
    "en": "❌ Tomorrow's LuckyZone schedule could not be loaded."
  },
  {
    "key": "help_lz_setup",
    "id": "Buat/atur channel LuckyZone",
    "en": "Setup LuckyZone channel",
    "segment": true
  },
  {
    "key": "help_lz_now",
    "id": "Update LuckyZone sekarang",
    "en": "Update LuckyZone now",
    "segment": true
  },
  {
    "key": "help_lz_next",
    "id": "Lihat LuckyZone untuk besok",
    "en": "View tomorrow's LuckyZone",
    "segment": true
  },
  {
    "key": "help_lz_disable",
    "id": "Matikan update otomatis",
    "en": "Disable automatic updates",
    "segment": true
  },
  {
    "key": "help_raid_done",
    "id": "Selesaikan raid dan hitung salary",
    "en": "Finish raid and calculate salary",
    "segment": true
  },
  {
    "key": "help_party_title",
    "id": "⚔️ Party • Help",
    "en": "⚔️ Party • Help"
  },
  {
    "key": "help_party_description",
    "id": "Command untuk membuat dan mengelola party raid.",
    "en": "Commands for creating and managing raid parties.",
    "segment": true
  },
  {
    "key": "help_salary_title",
    "id": "💰 Salary • Help",
    "en": "💰 Salary • Help"
  },
  {
    "key": "help_salary_description",
    "id": "Command untuk mengatur dan menjalankan Salary Raid.",
    "en": "Commands for configuring and running Salary Raid.",
    "segment": true
  },
  {
    "key": "help_drop_title",
    "id": "📦 Drop • Help",
    "en": "📦 Drop • Help"
  },
  {
    "key": "help_drop_description",
    "id": "Command untuk mengelola daftar item drop raid.",
    "en": "Commands for managing raid drop items.",
    "segment": true
  },
  {
    "key": "help_sold_title",
    "id": "💵 Sold • Help",
    "en": "💵 Sold • Help"
  },
  {
    "key": "help_sold_description",
    "id": "Command untuk mencatat item yang berhasil terjual.",
    "en": "Commands for logging sold items.",
    "segment": true
  },
  {
    "key": "help_raid_title",
    "id": "🏁 Raid • Help",
    "en": "🏁 Raid • Help"
  },
  {
    "key": "help_raid_description",
    "id": "Command untuk menyelesaikan dan melihat hasil Salary Raid.",
    "en": "Commands for finishing and viewing Salary Raid results.",
    "segment": true
  },
  {
    "key": "party_notification_failed",
    "id": "❌ Gagal mengirim @here. Pastikan bot memiliki permission **Mention @everyone, Send Messages, dan Embed Links**.",
    "en": "❌ Failed to send @here. Make sure the bot has **Mention @everyone, Send Messages, and Embed Links** permissions.",
    "segment": true
  },
  {
    "key": "dashboard_no_members",
    "id": "Belum ada member",
    "en": "No members",
    "segment": true
  },
  {
    "key": "dashboard_no_cohost",
    "id": "Belum ada Co-Host",
    "en": "No Co-Host",
    "segment": true
  },
  {
    "key": "dashboard_not_found",
    "id": "❌ Salary Dashboard tidak ditemukan.",
    "en": "❌ Salary Dashboard not found.",
    "segment": true
  },
  {
    "key": "sold_remove_success",
    "id": "🗑️ **${itemName}** berhasil dihapus.\n\n💰 Gold: **${gold}**\n\n🧾 Stamp: **${stamp}**\n\n🆔 ID: `${id}`",
    "en": "🗑️ **${itemName}** was removed successfully.\n\n💰 Gold: **${gold}**\n\n🧾 Stamp: **${stamp}**\n\n🆔 ID: `${id}`",
    "template": true
  },
  {
    "key": "not_set",
    "id": "Belum ditentukan",
    "en": "Not set",
    "segment": true
  },
  {
    "key": "not_recorded",
    "id": "Belum tercatat",
    "en": "Not recorded",
    "segment": true
  },
  {
    "key": "none",
    "id": "Tidak ada",
    "en": "None",
    "segment": true
  },
  {
    "key": "no_members",
    "id": "Tidak ada member.",
    "en": "No members.",
    "segment": true
  },
  {
    "key": "permission_denied",
    "id": "❌ Tidak punya akses.",
    "en": "❌ You do not have permission.",
    "segment": true
  },
  {
    "key": "command_not_found",
    "id": "❌ Command tidak ditemukan.",
    "en": "❌ Command not found.",
    "segment": true
  },
  {
    "key": "server_only",
    "id": "❌ Command ini hanya dapat digunakan di server Discord.",
    "en": "❌ This command can only be used in a Discord server.",
    "segment": true
  },
  {
    "key": "modal_server_only",
    "id": "❌ Modal ini hanya dapat digunakan di server Discord.",
    "en": "❌ This modal can only be used in a Discord server.",
    "segment": true
  },
  {
    "key": "generic_error",
    "id": "❌ Terjadi error saat menjalankan command/interaksi.",
    "en": "❌ An error occurred while running the command/interaction.",
    "segment": true
  }
,

  {
    "key": "language_admin_only",
    "id": "❌ Hanya **Administrator Discord** yang dapat mengubah bahasa server.",
    "en": "❌ Only a **Discord Administrator** can change the server language."
  },
  {
    "key": "language_changed",
    "id": "🇮🇩 Bahasa server berhasil diubah ke Indonesia.",
    "en": "🇬🇧 Server language successfully changed to English."
  },
  {
    "key": "help_language_set",
    "id": "Ubah bahasa server (khusus Administrator Discord)",
    "en": "Change the server language (Discord Administrator only)"
  },
  {
    "key": "dashboard_status_tracking",
    "id": "🟢 Data raid sedang dicatat",
    "en": "🟢 Raid data is being tracked"
  },
  {
    "key": "dashboard_status_waiting",
    "id": "🟡 Menunggu item terjual",
    "en": "🟡 Waiting for sold items"
  },
  {
    "key": "dashboard_thread_name",
    "id": "Salary Thread",
    "en": "Salary Thread"
  },
  {
    "key": "dashboard_overview_section",
    "id": "Ringkasan",
    "en": "Overview"
  },
  {
    "key": "dashboard_configuration_section",
    "id": "Konfigurasi",
    "en": "Configuration"
  },
  {
    "key": "dashboard_salary_members_section",
    "id": "Salary Members",
    "en": "Salary Members"
  },
  {
    "key": "dashboard_recent_sold_section",
    "id": "Preview Item Terjual",
    "en": "Recent Sold Items"
  },
  {
    "key": "dashboard_host_not_set",
    "id": "Belum ditentukan",
    "en": "Not set"
  },
  {
    "key": "dashboard_no_sold_items",
    "id": "_Belum ada item yang terjual._",
    "en": "_No items sold yet._"
  },
  {
    "key": "dashboard_more_members",
    "id": "+${count} member lainnya",
    "en": "+${count} more members"
  },
  {
    "key": "dashboard_more_items",
    "id": "+${count} item lainnya — gunakan /sold_list",
    "en": "+${count} more items — use /sold_list"
  },
  {
    "key": "dashboard_item_sold_count",
    "id": "${count} item terjual",
    "en": "${count} items sold"
  },
  {
    "key": "dashboard_stamp_unit",
    "id": "${count} stamp",
    "en": "${count} stamps"
  },
  {
    "key": "dashboard_stamp_price_format",
    "id": "${value}/stamp",
    "en": "${value}/stamp"
  },
  {
    "key": "dashboard_seller_tax_format",
    "id": "${value}/1.000g",
    "en": "${value}/1,000g"
  },
  {
    "key": "dashboard_sold_item_format",
    "id": "**${number}. ${item}** — 💰 ${gold}  •  🏷️ ${stamp}",
    "en": "**${number}. ${item}** — 💰 ${gold}  •  🏷️ ${stamp}"
  }
,
  {
    "key": "dashboard_stamp_unrecorded",
    "id": "${count} stamp belum tercatat",
    "en": "${count} stamps not yet recorded"
  },
  {
    "key": "dashboard_open_sold_list",
    "id": "lanjut di /sold_list",
    "en": "continue in /sold_list"
  }
];

const locales = {
  id: Object.fromEntries(catalog.map(x => [x.key, x.id])),
  en: Object.fromEntries(catalog.map(x => [x.key, x.en]))
};

const byId = Object.fromEntries(catalog.filter(x => !x.template).map(x => [x.id, x.en]));
const byKey = {
  id: Object.fromEntries(catalog.map(x => [x.key, x.id])),
  en: Object.fromEntries(catalog.map(x => [x.key, x.en]))
};

module.exports = { catalog, locales, byId, byKey };
