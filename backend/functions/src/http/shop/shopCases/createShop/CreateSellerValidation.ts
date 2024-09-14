import { z } from 'zod';

export const createSellerValidation = z.object({
  idUser: z.string().trim(),
  name: z.string().trim(),
  email: z.string().trim().email(),
  discription: z.string().trim(),
  phone: z.string().trim()
});

export type CreateSellerParams = z.infer<typeof createSellerValidation>;
