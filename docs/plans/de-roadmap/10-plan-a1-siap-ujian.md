# Rencana — "A1 siap ujian" (berdasarkan audit resmi Goethe)

Dasar: [09-audit-a1-goethe.md](09-audit-a1-goethe.md). Tujuan: user bisa lulus Goethe-Zertifikat A1 (≥ 60/100) dengan yakin.
Target terukur: **kosakata resmi ≥ 95%**, **grammar resmi 100%**, **latihan 4 modul berformat ujian + simulasi penuh**.

## R1 — Kosakata sesuai daftar resmi (201 kata isi + 62 kata fungsi)
Tandai setiap kata: `official` (ada di Wortliste/Wortgruppen) atau tambahan. Kata baru di "Hari ini" diambil **dari kata resmi dulu**; Kesiapan menghitung kata resmi saja.
| Batch | Isi (prioritas ujian) | ± kata |
|---|---|---|
| V1 | Formulir & data diri (geboren, Geburtsort, Familienstand, männlich/weiblich, ankreuzen, Unterschrift…) · perjalanan & pengumuman (Abfahrt, Ankunft, Durchsage, Ansage, Bahnsteig, Schalter, Auskunft, gültig…) · telepon/pos (Anrufbeantworter, Vorwahl, Anrede, Gruß…) | 70 |
| V2 | Kata dasar & kata kerja umum (Zeit, Mensch, Problem, Hilfe, Anfang/Ende, tun, legen, stellen, abholen, danken, bitten, erklären, mitbringen…) | 65 |
| V3 | Sisa (Feier, Glückwunsch, Laden, Kiosk, Sehenswürdigkeit, übernachten, wandern…) + kategori **kata fungsi** (dieser, man, alle, beide, dann, schon, gleich…) | 66 + 62 |
Verifikasi tiap batch: validator Wiktionary (0 mismatch) + skrip perbandingan Wortliste (cakupan naik → target ≥ 95%).

## R2 — Grammar sesuai inventar resmi (3 materi baru → A1 = 14 materi)
| Materi | Isi menurut inventar resmi |
|---|---|
| Perfekt + war/hatte | haben/sein + Partizip II untuk 15 verba resmi (arbeiten, bleiben, essen, fahren, fragen, glauben, haben, lesen, lernen, machen, schlafen, sehen, passieren, trinken, verstehen); war/hatte (ich/er) |
| Dativ dasar | mir/dir/Ihnen dengan danken, gehören, helfen, geben, *es geht mir*; Wem?; kata depan mit, bei, zu (zum/zur), aus, nach, von … nach, an/in/auf + Dativ (tempat & waktu) |
| Sopan & menghubungkan | möchte · würde gern · hätte gern (sebagai frasa) · gern/lieber · dieser · und/oder/aber/denn/dann |
Masing-masing: penjelasan + contoh bersuara + ±20 soal (5 jenis).

## R3 — Latihan & simulasi berformat ujian (soal dibuat sendiri, mengikuti format resmi)
| Modul | Bagian | Rencana di Klar |
|---|---|---|
| Lesen | T1 catatan/e-mail (r/f) · T2 iklan kecil (a/b) · T3 papan pengumuman (r/f) | 3 set × 15 soal; tampilan kartu teks/iklan/papan |
| Hören | T1 dialog (pilihan ganda, 2×) · T2 pengumuman (r/f, 1×) · T3 pesan telepon (pilihan ganda, 2×) | Audio Piper; dialog butuh **suara kedua** (cek lisensi suara wanita Piper); batas putar sesuai aturan |
| Schreiben | T1 formulir 5 isian · T2 pesan ±30 kata, 3 poin + salam | T1 dinilai otomatis; T2 penghitung kata + checklist + skema nilai resmi (3/1,5/0 per poin + bentuk teks) + contoh jawaban |
| Sprechen | T1 perkenalan, mengeja, nomor · T2 tanya-jawab (kartu tema) · T3 permintaan (kartu) | Kartu acak + **rekam suara** & bandingkan contoh (gabung dengan rencana shadowing) + pengenalan suara opsional |
| Simulasi penuh | 4 modul, timer resmi | Nilai diskalakan 25/modul, lulus ≥ 60, rapor + kelemahan → masuk "Hari ini" |

## R4 — Kesiapan yang jujur
Kesiapan A1 = kosakata resmi (30%) + grammar resmi (20%) + skor simulasi terbaik (50%), ditampilkan per modul ujian.

## Urutan sesi (±9 sesi)
| Sesi | Isi |
|---|---|
| 1 | R1-V1 + R2 Perfekt/war-hatte + penanda `official` |
| 2 | R1-V2 + R2 Dativ dasar |
| 3 | R1-V3 + kata fungsi + R2 sopan & penghubung |
| 4 | R3 Lesen (3 set) |
| 5–6 | R3 Hören (suara kedua, 3 set) |
| 7 | R3 Schreiben |
| 8 | R3 Sprechen |
| 9 | Simulasi penuh + rapor + R4 Kesiapan |
Setiap sesi: tsc, lint, build, uji browser, commit + push, cek deploy.
