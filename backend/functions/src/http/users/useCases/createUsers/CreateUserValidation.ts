import { z } from 'zod';

export const createUserValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim().email(),
  password: z.string().trim().min(8),
  document: z.string().trim().min(11).max(14),
  documentType: z.enum(['CPF', 'CNPJ']),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(14)
    .transform(value => {
      if (value.startsWith('+55')) return value;
      return `+55${value}`;
    }),
  nivel: z.number().int().positive().max(3)
});

export type UserParams = z.infer<typeof createUserValidation>;
