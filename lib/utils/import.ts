export type CardInput = {
  /** Existing card id — if present, server preserves FSRS state on update */
  id?: string
  soal: string
  jawaban: string
}

const sanitize = (s: string) => s.replace(/^[=+\-@]/, '')

export async function parseImportText(
  text: string
): Promise<{ cards: CardInput[]; errors: string[] }> {
  const lines = text.trim().split('\n').filter(Boolean)
  const sep = text.includes('\t') ? '\t' : ','
  const cards: CardInput[] = []
  const errors: string[] = []

  for (const line of lines) {
    const parts = line.split(sep)
    if (parts.length < 2) {
      errors.push(`Baris tidak valid: "${line.substring(0, 50)}"`)
      continue
    }
    const soal = sanitize(parts[0].trim().replace(/^"|"$/g, ''))
    const jawaban = sanitize(parts.slice(1).join(sep).trim().replace(/^"|"$/g, ''))
    if (!soal || !jawaban) {
      errors.push(`Soal atau jawaban kosong pada baris: "${line.substring(0, 50)}"`)
      continue
    }
    cards.push({ soal, jawaban })
    if (cards.length >= 200) break
  }

  return { cards, errors }
}

export async function parseCsvFile(
  file: File
): Promise<{ cards: CardInput[]; errors: string[] }> {
  const Papa = await import('papaparse')
  return new Promise((resolve) => {
    Papa.default.parse<{ soal: string; jawaban: string }>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        const cards: CardInput[] = []
        const errors: string[] = []
        for (const row of results.data) {
          const soal = sanitize((row.soal ?? '').trim())
          const jawaban = sanitize((row.jawaban ?? '').trim())
          if (!soal || !jawaban) {
            errors.push('Baris dengan soal/jawaban kosong dilewati')
            continue
          }
          cards.push({ soal, jawaban })
          if (cards.length >= 200) break
        }
        resolve({ cards, errors })
      },
      error: (err) => resolve({ cards: [], errors: [`Error: ${err.message}`] }),
    })
  })
}
