import { z } from 'zod'

// Icon: optional emoji string. Empty string allowed (means "use default/auto").
// Max 16 chars to accommodate flag emojis (4 UTF-16 units) + ZWJ sequences.
const iconField = z.string().max(16, 'Icon terlalu panjang').optional()

export const CreateFolderSchema = z.object({
  name: z.string().min(1, 'Nama folder wajib diisi').max(100, 'Maksimal 100 karakter').trim(),
  description: z.string().max(500, 'Maksimal 500 karakter').trim().optional(),
  icon: iconField,
})

export const UpdateFolderSchema = CreateFolderSchema
