/**
 * Seed Irodori Starter (A1) — Japanese learning content
 *
 * Source: Japan Foundation IRODORI - https://www.irodori.jpf.go.jp
 * License: Free for personal learning use
 *
 * Format kartu:
 *   soal    = hiragana / katakana
 *   jawaban = romaji — arti dalam Bahasa Indonesia
 *
 * Auto-cleanup: kalau folder dengan nama sama sudah ada, akan DIHAPUS
 * (beserta semua deck + kartu di dalamnya) sebelum seed baru.
 *
 * Usage:
 *   npm run seed:irodori <your-firebase-uid>
 */
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, FieldValue } from 'firebase-admin/firestore'

// ====================================================================
// 1. Initialize Firebase Admin
// ====================================================================
function initAdmin() {
  if (getApps().length) return
  const projectId = process.env.FIREBASE_PROJECT_ID
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
  let privateKey = process.env.FIREBASE_PRIVATE_KEY

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error('FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY wajib di .env / .env.local')
  }
  if (privateKey.startsWith('"') && privateKey.endsWith('"')) {
    privateKey = privateKey.slice(1, -1)
  }
  privateKey = privateKey.replace(/\\n/g, '\n')

  initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) })
}

// ====================================================================
// 2. Irodori Starter Content
// ====================================================================
type Card = { soal: string; jawaban: string }
type DeckSeed = { title: string; description: string; icon: string; cards: Card[] }

const FOLDER_NAME = '日本語 — Irodori Starter (A1)'
const FOLDER_DESC = 'Materi resmi Japan Foundation untuk pemula. Topik 1-9. Format: hiragana → romaji + arti.'
const FOLDER_ICON = '🇯🇵'

const DECKS: DeckSeed[] = [
  // ----------------------------------------------------------------
  {
    title: 'Topik 1 — Salam (あいさつ)',
    description: 'Greetings & basic phrases',
    icon: '👋',
    cards: [
      { soal: 'おはようございます', jawaban: 'ohayou gozaimasu — Selamat pagi (sopan)' },
      { soal: 'こんにちは', jawaban: 'konnichiwa — Selamat siang / Halo' },
      { soal: 'こんばんは', jawaban: 'konbanwa — Selamat malam' },
      { soal: 'さようなら', jawaban: 'sayounara — Selamat tinggal' },
      { soal: 'おやすみなさい', jawaban: 'oyasumi nasai — Selamat tidur (sopan)' },
      { soal: 'ありがとうございます', jawaban: 'arigatou gozaimasu — Terima kasih (sopan)' },
      { soal: 'すみません', jawaban: 'sumimasen — Maaf / Permisi' },
      { soal: 'はじめまして', jawaban: 'hajimemashite — Senang berkenalan' },
      { soal: 'よろしくおねがいします', jawaban: 'yoroshiku onegaishimasu — Mohon kerjasamanya' },
      { soal: 'おげんきですか', jawaban: 'ogenki desu ka — Apa kabar?' },
      { soal: 'げんきです', jawaban: 'genki desu — Saya baik-baik saja' },
      { soal: 'いってきます', jawaban: 'ittekimasu — Saya berangkat' },
      { soal: 'いってらっしゃい', jawaban: 'itterasshai — Hati-hati di jalan' },
      { soal: 'ただいま', jawaban: 'tadaima — Saya pulang' },
      { soal: 'おかえりなさい', jawaban: 'okaerinasai — Selamat datang kembali' },
      { soal: 'いただきます', jawaban: 'itadakimasu — Selamat makan (sebelum)' },
      { soal: 'ごちそうさま', jawaban: 'gochisousama — Terima kasih atas makanannya' },
      { soal: 'おねがいします', jawaban: 'onegaishimasu — Tolong / Mohon' },
      { soal: 'すみません、わかりません', jawaban: 'sumimasen, wakarimasen — Maaf, saya tidak mengerti' },
      { soal: 'もういちどおねがいします', jawaban: 'mou ichido onegaishimasu — Tolong sekali lagi' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 2 — Diri sendiri (わたし)',
    description: 'Self-introduction, profession, nationality',
    icon: '🧑',
    cards: [
      { soal: 'わたし', jawaban: 'watashi — saya' },
      { soal: 'あなた', jawaban: 'anata — kamu / anda' },
      { soal: 'なまえ', jawaban: 'namae — nama' },
      { soal: 'おなまえ', jawaban: 'onamae — nama (sopan)' },
      { soal: '〜さん', jawaban: '-san — akhiran nama (Tn/Ny/Sdr)' },
      { soal: 'にほんじん', jawaban: 'nihonjin — orang Jepang' },
      { soal: 'インドネシアじん', jawaban: 'indoneshia-jin — orang Indonesia' },
      { soal: 'がくせい', jawaban: 'gakusei — pelajar / mahasiswa' },
      { soal: 'せんせい', jawaban: 'sensei — guru' },
      { soal: 'かいしゃいん', jawaban: 'kaishain — karyawan / pegawai' },
      { soal: 'いしゃ', jawaban: 'isha — dokter' },
      { soal: 'エンジニア', jawaban: 'enjinia — engineer / insinyur' },
      { soal: 'なんさい', jawaban: 'nansai — berapa umur?' },
      { soal: 'にじゅっさい', jawaban: 'nijussai — 20 tahun' },
      { soal: 'でんわばんごう', jawaban: 'denwa bangou — nomor telepon' },
      { soal: 'メールアドレス', jawaban: 'meeru adoresu — alamat email' },
      { soal: 'はい', jawaban: 'hai — ya' },
      { soal: 'いいえ', jawaban: 'iie — tidak' },
      { soal: 'そうです', jawaban: 'sou desu — iya, benar' },
      { soal: 'ちがいます', jawaban: 'chigaimasu — bukan / salah' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 3 — Makanan (たべもの)',
    description: 'Food, drinks, ordering',
    icon: '🍱',
    cards: [
      { soal: 'たべもの', jawaban: 'tabemono — makanan' },
      { soal: 'のみもの', jawaban: 'nomimono — minuman' },
      { soal: 'ごはん', jawaban: 'gohan — nasi / makanan' },
      { soal: 'パン', jawaban: 'pan — roti' },
      { soal: 'みず', jawaban: 'mizu — air' },
      { soal: 'おちゃ', jawaban: 'ocha — teh hijau' },
      { soal: 'コーヒー', jawaban: 'koohii — kopi' },
      { soal: 'ぎゅうにゅう', jawaban: 'gyuunyuu — susu' },
      { soal: 'ジュース', jawaban: 'juusu — jus' },
      { soal: 'ビール', jawaban: 'biiru — bir' },
      { soal: 'さかな', jawaban: 'sakana — ikan' },
      { soal: 'にく', jawaban: 'niku — daging' },
      { soal: 'やさい', jawaban: 'yasai — sayuran' },
      { soal: 'くだもの', jawaban: 'kudamono — buah' },
      { soal: 'りんご', jawaban: 'ringo — apel' },
      { soal: 'バナナ', jawaban: 'banana — pisang' },
      { soal: 'たまご', jawaban: 'tamago — telur' },
      { soal: 'すし', jawaban: 'sushi — sushi' },
      { soal: 'ラーメン', jawaban: 'raamen — ramen' },
      { soal: 'おいしい', jawaban: 'oishii — enak' },
      { soal: 'からい', jawaban: 'karai — pedas' },
      { soal: 'あまい', jawaban: 'amai — manis' },
      { soal: 'ください', jawaban: 'kudasai — tolong (saat order)' },
      { soal: 'いくらですか', jawaban: 'ikura desu ka — berapa harganya?' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 4 — Pekerjaan (しごと)',
    description: 'Work, time, schedule',
    icon: '💼',
    cards: [
      { soal: 'しごと', jawaban: 'shigoto — pekerjaan' },
      { soal: 'かいしゃ', jawaban: 'kaisha — perusahaan' },
      { soal: 'がっこう', jawaban: 'gakkou — sekolah' },
      { soal: 'だいがく', jawaban: 'daigaku — universitas' },
      { soal: 'びょういん', jawaban: 'byouin — rumah sakit' },
      { soal: 'いま', jawaban: 'ima — sekarang' },
      { soal: 'なんじ', jawaban: 'nanji — jam berapa?' },
      { soal: 'いちじ', jawaban: 'ichiji — jam 1' },
      { soal: 'にじ', jawaban: 'niji — jam 2' },
      { soal: 'さんじ', jawaban: 'sanji — jam 3' },
      { soal: 'ごぜん', jawaban: 'gozen — AM (pagi)' },
      { soal: 'ごご', jawaban: 'gogo — PM (siang/sore)' },
      { soal: 'はじめます', jawaban: 'hajimemasu — memulai' },
      { soal: 'おわります', jawaban: 'owarimasu — selesai' },
      { soal: 'やすみ', jawaban: 'yasumi — libur / istirahat' },
      { soal: 'いそがしい', jawaban: 'isogashii — sibuk' },
      { soal: 'たいへん', jawaban: 'taihen — berat / susah' },
      { soal: 'がんばります', jawaban: 'ganbarimasu — akan berusaha' },
      { soal: 'おつかれさまでした', jawaban: 'otsukaresama deshita — terima kasih atas kerja kerasnya' },
      { soal: 'おさきにしつれいします', jawaban: 'osaki ni shitsurei shimasu — permisi saya duluan' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 5 — Rumah (いえ)',
    description: 'Home, rooms, furniture',
    icon: '🏠',
    cards: [
      { soal: 'いえ', jawaban: 'ie — rumah' },
      { soal: 'うち', jawaban: 'uchi — rumah saya' },
      { soal: 'へや', jawaban: 'heya — kamar' },
      { soal: 'だいどころ', jawaban: 'daidokoro — dapur' },
      { soal: 'おふろ', jawaban: 'ofuro — kamar mandi (untuk berendam)' },
      { soal: 'トイレ', jawaban: 'toire — toilet' },
      { soal: 'リビング', jawaban: 'ribingu — ruang tamu' },
      { soal: 'しんしつ', jawaban: 'shinshitsu — kamar tidur' },
      { soal: 'つくえ', jawaban: 'tsukue — meja' },
      { soal: 'いす', jawaban: 'isu — kursi' },
      { soal: 'ベッド', jawaban: 'beddo — tempat tidur' },
      { soal: 'まど', jawaban: 'mado — jendela' },
      { soal: 'ドア', jawaban: 'doa — pintu' },
      { soal: 'テレビ', jawaban: 'terebi — televisi' },
      { soal: 'れいぞうこ', jawaban: 'reizouko — kulkas' },
      { soal: 'せんたくき', jawaban: 'sentakuki — mesin cuci' },
      { soal: 'エアコン', jawaban: 'eakon — AC' },
      { soal: 'ひろい', jawaban: 'hiroi — luas' },
      { soal: 'せまい', jawaban: 'semai — sempit' },
      { soal: 'あたらしい', jawaban: 'atarashii — baru' },
      { soal: 'ふるい', jawaban: 'furui — lama / tua' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 6 — Belanja (かいもの)',
    description: 'Shopping, prices, numbers',
    icon: '🛍️',
    cards: [
      { soal: 'みせ', jawaban: 'mise — toko' },
      { soal: 'スーパー', jawaban: 'suupaa — supermarket' },
      { soal: 'コンビニ', jawaban: 'konbini — minimarket' },
      { soal: 'デパート', jawaban: 'depaato — pusat perbelanjaan' },
      { soal: 'いくら', jawaban: 'ikura — berapa harganya' },
      { soal: 'えん', jawaban: 'en — yen (mata uang)' },
      { soal: 'やすい', jawaban: 'yasui — murah' },
      { soal: 'たかい', jawaban: 'takai — mahal / tinggi' },
      { soal: 'いちまんえん', jawaban: 'ichiman en — 10.000 yen' },
      { soal: 'ひゃくえん', jawaban: 'hyaku en — 100 yen' },
      { soal: 'せんえん', jawaban: 'sen en — 1.000 yen' },
      { soal: 'クレジットカード', jawaban: 'kurejitto kaado — kartu kredit' },
      { soal: 'げんきん', jawaban: 'genkin — uang tunai' },
      { soal: 'レシート', jawaban: 'reshiito — struk belanja' },
      { soal: 'ふくろ', jawaban: 'fukuro — kantong / tas' },
      { soal: 'これ', jawaban: 'kore — ini' },
      { soal: 'それ', jawaban: 'sore — itu (dekat lawan bicara)' },
      { soal: 'あれ', jawaban: 'are — itu (jauh)' },
      { soal: 'おおきい', jawaban: 'ookii — besar' },
      { soal: 'ちいさい', jawaban: 'chiisai — kecil' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 7 — Jadwal (スケジュール)',
    description: 'Days, dates, schedule',
    icon: '📅',
    cards: [
      { soal: 'きょう', jawaban: 'kyou — hari ini' },
      { soal: 'あした', jawaban: 'ashita — besok' },
      { soal: 'きのう', jawaban: 'kinou — kemarin' },
      { soal: 'あさ', jawaban: 'asa — pagi' },
      { soal: 'ひる', jawaban: 'hiru — siang' },
      { soal: 'よる', jawaban: 'yoru — malam' },
      { soal: 'げつようび', jawaban: 'getsuyoubi — Senin' },
      { soal: 'かようび', jawaban: 'kayoubi — Selasa' },
      { soal: 'すいようび', jawaban: 'suiyoubi — Rabu' },
      { soal: 'もくようび', jawaban: 'mokuyoubi — Kamis' },
      { soal: 'きんようび', jawaban: 'kinyoubi — Jumat' },
      { soal: 'どようび', jawaban: 'doyoubi — Sabtu' },
      { soal: 'にちようび', jawaban: 'nichiyoubi — Minggu' },
      { soal: 'こんしゅう', jawaban: 'konshuu — minggu ini' },
      { soal: 'らいしゅう', jawaban: 'raishuu — minggu depan' },
      { soal: 'せんしゅう', jawaban: 'senshuu — minggu lalu' },
      { soal: 'こんげつ', jawaban: 'kongetsu — bulan ini' },
      { soal: 'らいげつ', jawaban: 'raigetsu — bulan depan' },
      { soal: 'なんようび', jawaban: 'nanyoubi — hari apa?' },
      { soal: 'いつ', jawaban: 'itsu — kapan' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 8 — Mari pergi (いきましょう)',
    description: 'Transportation, directions',
    icon: '🚆',
    cards: [
      { soal: 'いきます', jawaban: 'ikimasu — pergi' },
      { soal: 'きます', jawaban: 'kimasu — datang' },
      { soal: 'かえります', jawaban: 'kaerimasu — pulang' },
      { soal: 'でんしゃ', jawaban: 'densha — kereta' },
      { soal: 'バス', jawaban: 'basu — bis' },
      { soal: 'タクシー', jawaban: 'takushii — taksi' },
      { soal: 'くるま', jawaban: 'kuruma — mobil' },
      { soal: 'じてんしゃ', jawaban: 'jitensha — sepeda' },
      { soal: 'ひこうき', jawaban: 'hikouki — pesawat' },
      { soal: 'えき', jawaban: 'eki — stasiun' },
      { soal: 'バスてい', jawaban: 'basutei — halte bus' },
      { soal: 'くうこう', jawaban: 'kuukou — bandara' },
      { soal: 'みぎ', jawaban: 'migi — kanan' },
      { soal: 'ひだり', jawaban: 'hidari — kiri' },
      { soal: 'まっすぐ', jawaban: 'massugu — lurus' },
      { soal: 'ちかい', jawaban: 'chikai — dekat' },
      { soal: 'とおい', jawaban: 'tooi — jauh' },
      { soal: 'どこ', jawaban: 'doko — di mana' },
      { soal: 'どうやって', jawaban: 'douyatte — dengan cara apa' },
      { soal: 'なんぷん', jawaban: 'nanpun — berapa menit' },
    ],
  },
  // ----------------------------------------------------------------
  {
    title: 'Topik 9 — Kota saya (わたしのまち)',
    description: 'Town, places, weather',
    icon: '🏙️',
    cards: [
      { soal: 'まち', jawaban: 'machi — kota / kawasan' },
      { soal: 'こうえん', jawaban: 'kouen — taman' },
      { soal: 'としょかん', jawaban: 'toshokan — perpustakaan' },
      { soal: 'ぎんこう', jawaban: 'ginkou — bank' },
      { soal: 'ゆうびんきょく', jawaban: 'yuubinkyoku — kantor pos' },
      { soal: 'びじゅつかん', jawaban: 'bijutsukan — museum seni' },
      { soal: 'はくぶつかん', jawaban: 'hakubutsukan — museum' },
      { soal: 'えいがかん', jawaban: 'eigakan — bioskop' },
      { soal: 'レストラン', jawaban: 'resutoran — restoran' },
      { soal: 'カフェ', jawaban: 'kafe — kafe' },
      { soal: 'てんき', jawaban: 'tenki — cuaca' },
      { soal: 'はれ', jawaban: 'hare — cerah' },
      { soal: 'くもり', jawaban: 'kumori — mendung' },
      { soal: 'あめ', jawaban: 'ame — hujan' },
      { soal: 'ゆき', jawaban: 'yuki — salju' },
      { soal: 'あつい', jawaban: 'atsui — panas' },
      { soal: 'さむい', jawaban: 'samui — dingin' },
      { soal: 'いい', jawaban: 'ii — bagus' },
      { soal: 'すごい', jawaban: 'sugoi — hebat / wow' },
      { soal: 'たのしい', jawaban: 'tanoshii — menyenangkan' },
    ],
  },
]

// ====================================================================
// 3. Cleanup helper — hapus folder lama dengan nama sama
// ====================================================================
async function cleanupExistingFolder(userId: string) {
  const db = getFirestore()
  const foldersSnap = await db
    .collection('users').doc(userId).collection('folders')
    .where('name', '==', FOLDER_NAME)
    .get()

  if (foldersSnap.empty) {
    console.log('ℹ️  Tidak ada folder Irodori sebelumnya.\n')
    return
  }

  console.log(`🧹 Menemukan ${foldersSnap.size} folder lama, menghapus...`)

  for (const folderDoc of foldersSnap.docs) {
    const folderId = folderDoc.id

    // Find all decks in this folder
    const decksSnap = await db
      .collection('users').doc(userId).collection('decks')
      .where('folderId', '==', folderId)
      .get()

    // Delete all decks + their cards
    for (const deckDoc of decksSnap.docs) {
      const cardsSnap = await deckDoc.ref.collection('cards').get()
      const batch = db.batch()
      cardsSnap.docs.forEach((c) => batch.delete(c.ref))
      batch.delete(deckDoc.ref)
      await batch.commit()
    }

    // Delete folder itself
    await folderDoc.ref.delete()
    console.log(`   ✓ Dihapus folder ${folderId} (${decksSnap.size} deck)`)
  }
  console.log()
}

// ====================================================================
// 4. Seed function
// ====================================================================
async function seed(userId: string) {
  initAdmin()
  const db = getFirestore()

  console.log(`\n🌱 Seeding Irodori untuk user: ${userId}\n`)

  // Cleanup dulu
  await cleanupExistingFolder(userId)

  // Create folder
  const folderRef = db.collection('users').doc(userId).collection('folders').doc()
  const now = FieldValue.serverTimestamp()

  await folderRef.set({
    name: FOLDER_NAME,
    description: FOLDER_DESC,
    icon: FOLDER_ICON,
    userId,
    deckCount: DECKS.length,
    createdAt: now,
    updatedAt: now,
  })

  console.log(`✅ Folder dibuat: ${FOLDER_NAME}`)
  console.log(`   ID: ${folderRef.id}\n`)

  // Create decks + cards
  let totalCards = 0
  for (const deck of DECKS) {
    const deckRef = db.collection('users').doc(userId).collection('decks').doc()
    const batch = db.batch()

    batch.set(deckRef, {
      title: deck.title,
      description: deck.description,
      icon: deck.icon,
      userId,
      folderId: folderRef.id,
      cardCount: deck.cards.length,
      createdAt: now,
      updatedAt: now,
    })

    deck.cards.forEach((card, i) => {
      const cardRef = deckRef.collection('cards').doc()
      batch.set(cardRef, {
        soal: card.soal,
        jawaban: card.jawaban,
        order: i,
        state: 'new',
        createdAt: now,
        updatedAt: now,
      })
    })

    await batch.commit()
    totalCards += deck.cards.length
    console.log(`✅ ${deck.title}  (${deck.cards.length} kartu)`)
  }

  console.log(`\n🎉 Selesai! ${DECKS.length} deck, ${totalCards} kartu total.\n`)
}

// ====================================================================
// 5. Entry point
// ====================================================================
const userId = process.argv[2]
if (!userId) {
  console.error('\n❌ UID tidak diberikan.\n')
  console.error('Cara pakai:')
  console.error('  npm run seed:irodori <firebase-uid>\n')
  process.exit(1)
}

seed(userId)
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('\n❌ Seed gagal:', err)
    process.exit(1)
  })
