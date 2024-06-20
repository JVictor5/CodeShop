import { z } from 'zod';

export const createUserValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
  document: z.string().trim().min(11).max(14),
  documentType: z.enum(['CPF', 'CNPJ']),
  phone: z.string().trim().min(8).max(14),
  nivel: z.number().int().positive().max(3)
});

export type UserParams = z.infer<typeof createUserValidation>;
