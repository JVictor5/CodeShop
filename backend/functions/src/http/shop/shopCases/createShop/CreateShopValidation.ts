import { z } from 'zod';

export const createShopValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim().email()
});

export type CreateShopParams = z.infer<typeof createShopValidation>;
