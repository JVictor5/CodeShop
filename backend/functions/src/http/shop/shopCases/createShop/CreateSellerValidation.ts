import { z } from 'zod';

export const createSellerValidation = z.object({
  idUser: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  discription: z.string().trim(),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(14)
    .transform(value => {
      if (value.startsWith('+55')) return value;
      return `+55${value}`;
    })
});

export type CreateSellerParams = z.infer<typeof createSellerValidation>;
