import { z } from 'zod'

const iconField = z.string().max(16, 'Icon terlalu panjang').optional()

export const CreateDeckSchema = z.object({
  title: z.string().min(1, 'Judul wajib diisi').max(255).trim(),
  description: z.string().max(1000).trim().optional(),
  icon: iconField,
})

export const UpdateDeckSchema = CreateDeckSchema
