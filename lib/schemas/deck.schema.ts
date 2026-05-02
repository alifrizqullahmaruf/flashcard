import { z } from 'zod'

export const CreateDeckSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255).trim(),
  description: z.string().max(1000).trim().optional(),
})

export const UpdateDeckSchema = CreateDeckSchema
