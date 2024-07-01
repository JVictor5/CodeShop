import { z } from 'zod';

export const recoverPasswordValidation = z.object({
  email: z.string().email().trim(),
  password: z.string().trim()
});

export type UpdateParams = z.infer<typeof recoverPasswordValidation>;
