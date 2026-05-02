import { z } from 'zod'

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Nama folder wajib diisi').max(100, 'Maksimal 100 karakter').trim(),
  description: z.string().max(500, 'Maksimal 500 karakter').trim().optional(),
})

export const UpdateFolderSchema = CreateFolderSchema
