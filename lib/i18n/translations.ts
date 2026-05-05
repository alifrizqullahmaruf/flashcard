import type { Locale } from '@/lib/types'

/**
 * Lightweight i18n dictionary.
 * Add new keys here, both `id` and `en` must be present (TypeScript enforces it).
 *
 * Variable interpolation: use `{name}` syntax in strings, pass `vars` to t().
 */
export const translations = {
  // Common
  'common.lang.id': { id: 'Bahasa Indonesia', en: 'Indonesian' },
  'common.lang.en': { id: 'Bahasa Inggris', en: 'English' },
  'common.save': { id: 'Simpan', en: 'Save' },
  'common.cancel': { id: 'Batal', en: 'Cancel' },
  'common.loading': { id: 'Memuat...', en: 'Loading...' },
  'common.coming_soon': { id: 'Segera', en: 'Soon' },
  'common.back': { id: 'Kembali', en: 'Back' },
  'common.search': { id: 'Cari', en: 'Search' },
  'common.empty': { id: 'Kosong', en: 'Empty' },

  // ─── NAVBAR ────────────────────────────────────────────────
  'nav.home': { id: 'Beranda', en: 'Home' },
  'nav.folder': { id: 'Folder', en: 'Folders' },
  'nav.progress': { id: 'Progres', en: 'Progress' },
  'nav.profile': { id: 'Profil', en: 'Profile' },
  'nav.brand_tagline': { id: 'Belajar Seru', en: 'Fun Learning' },

  // ─── DECKS / FOLDERS PAGE ─────────────────────────────────
  'decks.title': { id: 'Folder', en: 'Folders' },
  'decks.add_folder': { id: '+ Folder', en: '+ Folder' },
  'decks.search_placeholder': { id: 'Cari folder...', en: 'Search folders...' },
  'decks.search_in_decks': { id: 'Cari di semua deck →', en: 'Search all decks →' },
  'decks.empty_title': { id: 'Belum ada folder', en: 'No folders yet' },
  'decks.empty_desc': { id: 'Buat folder pertamamu untuk mulai mengelompokkan deck.', en: 'Create your first folder to start organizing decks.' },
  'decks.empty_create': { id: '+ Buat Folder', en: '+ Create Folder' },
  'decks.no_match': { id: 'Tidak ada folder cocok dengan "{query}"', en: 'No folders match "{query}"' },

  // ─── STATS PAGE ────────────────────────────────────────────
  'stats.title': { id: 'Progres', en: 'Progress' },
  'stats.tab_overview': { id: 'Ringkasan', en: 'Overview' },
  'stats.tab_activity': { id: 'Aktivitas', en: 'Activity' },
  'stats.tab_achievements': { id: 'Pencapaian', en: 'Achievements' },

  'stats.empty_title': { id: 'Mulai perjalanan kamu', en: 'Start your journey' },
  'stats.empty_desc': { id: 'Buat folder dan deck pertama untuk lihat statistik, achievement, dan progres belajar di sini.', en: 'Create your first folder and deck to see statistics, achievements, and learning progress here.' },
  'stats.empty_cta': { id: 'Mulai Sekarang', en: 'Start Now' },

  'stats.streak_label': { id: 'Streak Saat Ini', en: 'Current Streak' },
  'stats.streak_unit': { id: 'hari', en: 'days' },
  'stats.streak_continue': { id: 'Lanjut! Streak terpanjang {n} hari', en: 'Keep going! Longest streak {n} days' },
  'stats.streak_start': { id: 'Mulai belajar hari ini buat dapat streak pertama!', en: 'Start studying today for your first streak!' },
  'stats.streak_target': { id: 'Target Hari Ini', en: 'Today\'s Goal' },

  'stats.retention_title': { id: 'Tingkat Hafalan', en: 'Retention Rate' },
  'stats.retention_window': { id: '{days} hari terakhir · {n} review', en: 'Last {days} days · {n} reviews' },
  'stats.retention_remembered': { id: 'masih kamu ingat', en: 'still remembered' },
  'stats.retention_too_few': { id: 'Belum cukup data', en: 'Not enough data yet' },
  'stats.retention_too_few_advice': { id: 'Lakukan {n} review lagi untuk lihat tingkat hafalan kamu.', en: 'Do {n} more reviews to see your retention rate.' },
  'stats.retention_optimal_label': { id: 'Mungkin terlalu mudah', en: 'May be too easy' },
  'stats.retention_optimal_advice': { id: 'Kamu hampir selalu ingat. Coba tantang dirimu dengan kartu lebih sulit.', en: 'You almost always remember. Try challenging yourself with harder cards.' },
  'stats.retention_success_label': { id: 'Bagus banget!', en: 'Great job!' },
  'stats.retention_success_advice': { id: 'Tingkat hafalan kamu sehat. Pertahankan ritmenya!', en: 'Your retention rate is healthy. Keep the rhythm!' },
  'stats.retention_warning_label': { id: 'Perlu lebih sering', en: 'Needs more practice' },
  'stats.retention_warning_advice': { id: 'Coba review lebih sering untuk meningkatkan hafalan.', en: 'Try reviewing more often to improve retention.' },
  'stats.retention_low_label': { id: 'Butuh latihan rutin', en: 'Needs regular practice' },
  'stats.retention_low_advice': { id: 'Banyak yang lupa. Tidak apa-apa! Pelan-pelan akan lebih baik.', en: 'Lots forgotten. That\'s okay! Slow and steady wins the race.' },

  'stats.mastery_title': { id: 'Kemajuan Hafalan', en: 'Memorization Progress' },
  'stats.mastery_subtitle': { id: 'Distribusi kartu', en: 'Card distribution' },
  'stats.mastery_empty_title': { id: 'Belum ada kartu', en: 'No cards yet' },
  'stats.mastery_empty_desc': { id: 'Buat deck pertama untuk mulai belajar.', en: 'Create your first deck to start learning.' },
  'stats.mastery_center_label': { id: 'hafal', en: 'mastered' },
  'stats.mastery_legend_new': { id: 'Baru', en: 'New' },
  'stats.mastery_legend_learning': { id: 'Belajar', en: 'Learning' },
  'stats.mastery_legend_mastered': { id: 'Hafal', en: 'Mastered' },

  'stats.heatmap_title': { id: 'Aktivitas Belajar', en: 'Study Activity' },
  'stats.heatmap_window': { id: '{n} hari terakhir', en: 'Last {n} days' },
  'stats.heatmap_unit': { id: 'review', en: 'reviews' },
  'stats.heatmap_empty': { id: 'Belum ada aktivitas. Mulai belajar untuk lihat kotak warna mint di sini!', en: 'No activity yet. Start studying to see mint-colored squares here!' },
  'stats.heatmap_no_study': { id: 'tidak belajar', en: 'no study' },
  'stats.heatmap_active_days': { id: '{n} hari aktif', en: '{n} active days' },
  'stats.heatmap_legend_less': { id: 'Sedikit', en: 'Less' },
  'stats.heatmap_legend_more': { id: 'Banyak', en: 'More' },
  'stats.heatmap_tooltip_new': { id: '{n} baru', en: '{n} new' },

  'stats.reviews_title': { id: 'Review per Hari', en: 'Reviews per Day' },
  'stats.reviews_window': { id: '30 hari terakhir', en: 'Last 30 days' },
  'stats.reviews_avg': { id: 'rata-rata/hari', en: 'avg/day' },
  'stats.reviews_empty': { id: 'Belum ada data review.', en: 'No review data yet.' },
  'stats.reviews_label_review': { id: 'Review', en: 'Review' },
  'stats.reviews_label_new': { id: 'Baru', en: 'New' },

  'stats.forecast_title': { id: 'Forecast Review', en: 'Review Forecast' },
  'stats.forecast_window': { id: '14 hari ke depan', en: 'Next 14 days' },
  'stats.forecast_today': { id: 'hari ini', en: 'today' },
  'stats.forecast_empty': { id: 'Tidak ada review terjadwal. Tambah kartu baru untuk mulai!', en: 'No reviews scheduled. Add new cards to start!' },
  'stats.forecast_legend_today': { id: 'Hari ini (termasuk overdue)', en: 'Today (incl. overdue)' },
  'stats.forecast_legend_future': { id: 'Mendatang', en: 'Upcoming' },
  'stats.forecast_due_label': { id: 'Due', en: 'Due' },
  'stats.forecast_unit_card': { id: '{n} kartu', en: '{n} cards' },
  'stats.forecast_day_today': { id: 'Hari ini', en: 'Today' },
  'stats.forecast_day_tomorrow': { id: 'Besok', en: 'Tomorrow' },

  'stats.interval_title': { id: 'Interval Memori', en: 'Memory Interval' },
  'stats.interval_subtitle': { id: 'Detail teknis · {n} kartu aktif', en: 'Technical details · {n} active cards' },
  'stats.interval_desc': { id: 'Berapa lama kartu kamu "awet" di otak. Semakin banyak di kanan = semakin kuat memori jangka panjang.', en: 'How long your cards stick in your brain. More to the right = stronger long-term memory.' },
  'stats.interval_label_1d': { id: '< 1 hari', en: '< 1 day' },
  'stats.interval_label_1w': { id: '1-7 hari', en: '1-7 days' },
  'stats.interval_label_1m': { id: '1-4 minggu', en: '1-4 weeks' },
  'stats.interval_label_3m': { id: '1-3 bulan', en: '1-3 months' },
  'stats.interval_label_1y': { id: '3 bln-1 thn', en: '3 mo-1 yr' },
  'stats.interval_label_long': { id: '> 1 tahun', en: '> 1 year' },
  'stats.interval_unit': { id: 'kartu', en: 'cards' },
  'stats.interval_count_label': { id: 'Jumlah', en: 'Count' },

  'stats.folders_title': { id: 'Per Folder', en: 'By Folder' },
  'stats.folders_progress_new': { id: '{n} baru', en: '{n} new' },
  'stats.folders_progress_learning': { id: '{n} belajar', en: '{n} learning' },
  'stats.folders_progress_mastered': { id: '{n} hafal', en: '{n} mastered' },

  'stats.records_title': { id: 'Rekor Pribadi', en: 'Personal Records' },
  'stats.records_streak_unit': { id: 'hari', en: 'days' },
  'stats.records_streak_label': { id: 'Streak terlama', en: 'Longest streak' },
  'stats.records_best_unit': { id: 'review', en: 'reviews' },
  'stats.records_best_label': { id: 'Hari terbaik', en: 'Best day' },
  'stats.records_active_unit': { id: 'hari', en: 'days' },
  'stats.records_active_label': { id: 'Total aktif', en: 'Total active' },
  'stats.records_largest_label': { id: 'Deck Terbesar', en: 'Largest Deck' },
  'stats.records_largest_unit': { id: '{n} kartu', en: '{n} cards' },

  'stats.badges_title': { id: 'Lencana', en: 'Badges' },
  'stats.badge_max': { id: '✨ Max ✨', en: '✨ Max ✨' },
  'stats.badge_progress': { id: '{cur} / {next} {unit}', en: '{cur} / {next} {unit}' },

  // Achievement names + descriptions (overrides lib/achievements.ts hardcoded text)
  'achievement.wildfire.name': { id: 'Streak Master', en: 'Streak Master' },
  'achievement.wildfire.desc': { id: 'Belajar setiap hari', en: 'Study every day' },
  'achievement.wildfire.unit': { id: 'hari', en: 'days' },
  'achievement.scholar.name': { id: 'Sang Cendekia', en: 'Scholar' },
  'achievement.scholar.desc': { id: 'Kartu sudah dihafal', en: 'Cards mastered' },
  'achievement.scholar.unit': { id: 'kartu', en: 'cards' },
  'achievement.marathon.name': { id: 'Pelari Maraton', en: 'Marathoner' },
  'achievement.marathon.desc': { id: 'Total review yang dilakukan', en: 'Total reviews completed' },
  'achievement.marathon.unit': { id: 'review', en: 'reviews' },
  'achievement.sharpshooter.name': { id: 'Penembak Jitu', en: 'Sharpshooter' },
  'achievement.sharpshooter.desc': { id: 'Tingkat hafalan kartu', en: 'Card retention rate' },
  'achievement.sharpshooter.unit': { id: '% retensi', en: '% retention' },
  'achievement.curator.name': { id: 'Kurator', en: 'Curator' },
  'achievement.curator.desc': { id: 'Folder yang dibuat', en: 'Folders created' },
  'achievement.curator.unit': { id: 'folder', en: 'folders' },
  'achievement.daily_habit.name': { id: 'Kebiasaan Harian', en: 'Daily Habit' },
  'achievement.daily_habit.desc': { id: 'Hari aktif belajar', en: 'Active study days' },
  'achievement.daily_habit.unit': { id: 'hari', en: 'days' },

  'tier.bronze': { id: 'Perunggu', en: 'Bronze' },
  'tier.silver': { id: 'Perak', en: 'Silver' },
  'tier.gold': { id: 'Emas', en: 'Gold' },
  'tier.diamond': { id: 'Diamond', en: 'Diamond' },

  // ─── HOME PAGE ─────────────────────────────────────────────
  'home.greeting': { id: 'Halo, {name}!', en: 'Hi, {name}!' },
  'home.streak_active': { id: 'Streak {n} hari — keep going!', en: '{n}-day streak — keep going!' },
  'home.streak_start': { id: 'Yuk mulai belajar pertamamu hari ini.', en: 'Start your first study session today.' },
  'home.streak_first': { id: 'belajar pertamamu', en: 'first study' },
  'home.daily_goal_label': { id: 'Target hari ini', en: 'Today\'s Goal' },
  'home.daily_goal_unit': { id: 'kartu', en: 'cards' },
  'home.continue_studying': { id: 'Lanjut Belajar', en: 'Continue Studying' },
  'home.start_now': { id: 'Mulai Sekarang', en: 'Start Now' },
  'home.streak_chip': { id: '{n} hari', en: '{n} days' },
  'home.xp_chip': { id: '{n} XP', en: '{n} XP' },
  'home.profile_aria': { id: 'Profil', en: 'Profile' },

  'home.stat_folder': { id: 'Folder', en: 'Folders' },
  'home.stat_deck': { id: 'Deck', en: 'Decks' },
  'home.stat_card': { id: 'Kartu', en: 'Cards' },

  'home.folders_title': { id: 'Folder', en: 'Folders' },
  'home.folders_see_all': { id: 'Semua →', en: 'See all →' },
  'home.folders_empty_title': { id: 'Belum ada folder', en: 'No folders yet' },
  'home.folders_empty_desc': { id: 'Buat folder pertamamu untuk mulai mengelompokkan deck.', en: 'Create your first folder to start organizing decks.' },
  'home.folders_create_btn': { id: 'Buat Folder', en: 'Create Folder' },
  'home.folder_new_tile': { id: 'Folder baru', en: 'New folder' },
  'home.folder_decks_count': { id: '{n} deck', en: '{n} decks' },

  'home.quests_title': { id: 'Misi Hari Ini', en: 'Daily Quests' },
  'home.quest_cards_title': { id: 'Selesaikan 10 kartu', en: 'Finish 10 cards' },
  'home.quest_minutes_title': { id: 'Belajar 5 menit', en: 'Study for 5 minutes' },
  'home.unit_card': { id: 'kartu', en: 'cards' },
  'home.unit_minute': { id: 'mnt', en: 'min' },

  // ─── PROFILE PAGE ──────────────────────────────────────────
  'profile.title': { id: 'Profil', en: 'Profile' },
  'profile.no_email': { id: 'Tanpa email', en: 'No email' },
  'profile.streak_chip': { id: '{n} hari', en: '{n} days' },
  'profile.xp_chip': { id: '{n} XP', en: '{n} XP' },

  'profile.account_title': { id: 'Akun', en: 'Account' },
  'profile.account_email': { id: 'Email', en: 'Email' },
  'profile.account_user_id': { id: 'User ID', en: 'User ID' },
  'profile.account_status': { id: 'Status', en: 'Status' },
  'profile.account_status_active': { id: 'Aktif ✨', en: 'Active ✨' },

  'profile.settings_title': { id: 'Pengaturan', en: 'Settings' },
  'profile.setting_language': { id: 'Bahasa', en: 'Language' },
  'profile.setting_daily_goal': { id: 'Target harian', en: 'Daily goal' },
  'profile.setting_daily_goal_value': { id: '10 kartu', en: '10 cards' },
  'profile.setting_streak_freeze': { id: 'Streak freeze', en: 'Streak freeze' },
  'profile.setting_streak_freeze_value': { id: '0 tersedia', en: '0 available' },
  'profile.setting_theme': { id: 'Tema', en: 'Theme' },
  'profile.setting_theme_value': { id: 'Terang', en: 'Light' },

  'profile.lang_picker_title': { id: 'Pilih Bahasa', en: 'Choose Language' },
  'profile.lang_saved': { id: 'Bahasa berhasil disimpan!', en: 'Language saved!' },
  'profile.lang_save_failed': { id: 'Gagal menyimpan bahasa', en: 'Failed to save language' },

  'profile.tagline': { id: 'Hafalin v1.0 · Belajar sebentar, inget selamanya', en: 'Hafalin v1.0 · Learn briefly, remember forever' },
  'profile.logout': { id: 'Keluar', en: 'Logout' },
  'profile.logout_confirm': { id: 'Yakin ingin keluar?', en: 'Are you sure you want to logout?' },

  'profile.stat_folder': { id: 'Folder', en: 'Folders' },
  'profile.stat_deck': { id: 'Deck', en: 'Decks' },
  'profile.stat_card': { id: 'Kartu', en: 'Cards' },
} as const

export type TranslationKey = keyof typeof translations

/**
 * Server-side translate.
 * Reads from the dictionary and interpolates `{var}` placeholders.
 */
export function t(
  key: TranslationKey,
  locale: Locale,
  vars?: Record<string, string | number>
): string {
  const entry = translations[key]
  if (!entry) return String(key)
  let str: string = entry[locale] ?? entry.id

  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      str = str.replace(new RegExp(`\\{${k}\\}`, 'g'), String(v))
    }
  }
  return str
}
