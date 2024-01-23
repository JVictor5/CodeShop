import { z } from 'zod';

export const createUserValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim().email()
});

export type UserParams = z.infer<typeof createUserValidation>;
