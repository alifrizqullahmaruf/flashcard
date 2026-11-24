# Langkah 2 — Simulasi ujian Goethe-Zertifikat A1 (Start Deutsch 1)

**Tujuan:** user bisa berlatih dengan **format** ujian A1 yang sebenarnya, tahu skor per modul, dan tahu bagian mana yang lemah.
**Perkiraan:** 3–4 sesi · **Prasyarat:** Langkah 1 minimal T3 (kosakata cukup untuk soal).
**Hak cipta:** soal **dibuat sendiri** mengikuti *format* resmi; tidak menyalin Modellsatz Goethe. Format & poin di bawah **harus dicocokkan ulang** dengan *Testbeschreibung/Modellsatz* resmi terbaru sebelum implementasi.

## 2.1 Format ujian (ringkasan yang akan diverifikasi)
| Modul | Durasi ± | Bagian | Bentuk soal |
|---|---|---|---|
| **Hören** (menyimak) | 20 mnt | 3 Teile | dialog/pengumuman pendek → pilihan ganda / richtig-falsch |
| **Lesen** (membaca) | 25 mnt | 3 Teile | pesan, iklan, papan info → richtig-falsch / pilih a-b |
| **Schreiben** (menulis) | 20 mnt | 2 Teile | isi formulir; pesan pendek ±30 kata dengan 3 poin |
| **Sprechen** (berbicara) | 15 mnt | 3 Teile | perkenalan diri; tanya-jawab dengan kartu kata; meminta/menanggapi |
Skor: tiap modul berbobot sama; lulus bila total ≥ 60% (diverifikasi ulang).

## 2.2 Mode di app
1. **Latihan per modul** (tanpa batas waktu, ada penjelasan setelah tiap soal).
2. **Simulasi penuh** (pakai timer per modul, penjelasan baru muncul di akhir, hasil = rapor).
3. **Rapor**: skor per modul & per Teil, rekomendasi ("Hören Teil 2 lemah → latih angka & jam").

Rute: `/de/ujian` (daftar), `/de/ujian/a1/[modul]`, `/de/ujian/a1/simulasi`, `/de/ujian/a1/hasil/[id]`. Masuk dari Beranda (kartu "Simulasi ujian") dan Progress.

## 2.3 Hören — detail
- **Audio dialog** dibuat dengan Piper. Butuh **≥ 2 suara** (pria + wanita) agar dialog natural.
  Kandidat voice Piper de_DE: thorsten (pria, CC0 ✅), dan suara wanita (mis. *eva_k*, *kerstin*, *ramona*) — **lisensi tiap voice perlu dicek** (keputusan **D2-3**). Bila tidak ada yang lisensinya aman, pakai thorsten dengan variasi kecepatan + narator.
- Format data: `lib/de/exam/a1/hoeren.ts` → `{ teil, script: [{speaker, text}], question, options, answer, explain }`.
- Script dialog → `scripts/de-audio` di-extend: gabungkan baris per speaker jadi 1 mp3 dengan jeda 400 ms (ffmpeg concat).
- Aturan Goethe: sebagian audio diputar 2×, sebagian 1× → field `plays: 1 | 2`.
- Jumlah awal: 2 set lengkap (masing-masing 15 soal).

## 2.4 Lesen — detail
- Teks pendek dibuat sendiri: SMS/e-mail, iklan, papan pengumuman, jadwal.
- Tipe soal: `richtig/falsch` (pakai komponen `tf`), pilih iklan a/b (komponen baru `choose-text` menampilkan 2 kartu teks).
- Data: `lib/de/exam/a1/lesen.ts`. Jumlah awal: 2 set × 15 soal.

## 2.5 Schreiben — detail (keputusan D2-2)
- **Teil 1 — formulir:** teks situasi + formulir 5 kolom (nama, tanggal, jumlah orang …) → dicek otomatis (normalisasi huruf/umlaut seperti `gap`).
- **Teil 2 — pesan pendek:** tugas dengan 3 poin wajib, input teks bebas ±30 kata.
  - **Opsi A (default, gratis):** penilaian mandiri: checklist 3 poin + salam pembuka/penutup + contoh jawaban model; user menandai sendiri.
  - **Opsi B (berbayar, nanti):** koreksi AI (Claude API) — perlu server route + kunci API + batas pemakaian. Hanya bila user setuju.
- Penghitung kata & penanda poin yang sudah disebut (deteksi kata kunci sederhana).

## 2.6 Sprechen — detail (keputusan D2-1)
- **Teil 1:** kartu perkenalan (Name, Alter, Land, Wohnort, Sprachen, Beruf, Hobby) → user bicara; contoh model dengan audio.
- **Teil 2:** kartu topik + kata (mis. *Thema: Essen — Frühstück?*) → buat pertanyaan & jawab.
- **Teil 3:** kartu gambar/kata → membuat permintaan (*Können Sie … bitte …?*).
- **Rekam suara sendiri** (MediaRecorder, disimpan sementara di perangkat) → putar ulang & bandingkan dengan model.
- **Opsional:** pengenalan suara browser (Web Speech `SpeechRecognition`, de-DE; hanya Chrome/Android) untuk menampilkan transkrip. Tidak dinilai otomatis.

## 2.7 Penyimpanan & integrasi
- Hasil ujian: `localStorage de:exam:a1:<timestamp>` → nanti ikut sinkron di Langkah 3.
- Soal yang salah → masuk FSRS grammar/kosakata terkait (tag `exam`), muncul di Hari ini.
- **Kesiapan A1** diperluas: 40% materi + 40% kosakata + 20% skor simulasi terbaik (rumus didokumentasikan di Progress).

## 2.8 Tahapan
| Tahap | Isi | Selesai bila |
|---|---|---|
| U1 | Verifikasi format resmi, model data, rute, Lesen set 1 | Lesen bisa dikerjakan & dinilai |
| U2 | Hören set 1 + audio dialog (+ keputusan suara) | audio 2 suara jalan di HP |
| U3 | Schreiben (opsi A) + Sprechen (rekam) | semua modul ada |
| U4 | Simulasi penuh + timer + rapor + set 2 | rapor & rekomendasi tampil |

## Risiko
| Risiko | Mitigasi |
|---|---|
| Format berbeda dari ujian terbaru | Cocokkan dengan Testbeschreibung resmi di U1 |
| Audio dialog terdengar kaku | 2 suara, jeda natural, kecepatan 0.95 |
| Mikrofon ditolak/tidak didukung | Sprechen tetap bisa: baca model & latihan lisan tanpa rekam |
