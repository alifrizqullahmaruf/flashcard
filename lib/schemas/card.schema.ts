import { z } from 'zod'

export const CardSchema = z.object({
  soal: z.string().min(1, 'Soal wajib diisi').max(5000).trim(),
  jawaban: z.string().min(1, 'Jawaban wajib diisi').max(5000).trim(),
  order: z.number().int().nonnegative(),
})

export const BulkCreateCardsSchema = z
  .array(CardSchema)
  .min(1)
  .max(200, 'Maksimal 200 kartu per import')
