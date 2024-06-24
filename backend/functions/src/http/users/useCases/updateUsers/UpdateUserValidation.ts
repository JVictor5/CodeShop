import { z } from 'zod';

export const updateUserBodyValidation = z.object({
  name: z.string().trim().optional(),
  email: z.string().email().trim().optional(),
  password: z.string().trim().optional(),
  document: z.string().trim().min(11).max(14).optional(),
  documentType: z.enum(['CPF', 'CNPJ']).optional(),
  phone: z.string().trim().min(8).max(14).optional(),
  nivel: z.number().int().positive().max(3).optional()
});

export const updateUserParamsValidation = z.object({
  id: z.string().trim()
});

export type UpdateParams = z.infer<typeof updateUserBodyValidation>;
