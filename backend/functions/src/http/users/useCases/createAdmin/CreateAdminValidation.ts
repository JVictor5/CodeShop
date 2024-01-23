import { z } from 'zod';

export const createAdminValidation = z.object({
  name: z.string().trim(),
  email: z.string().trim().email()
});

export type AdminParams = z.infer<typeof createAdminValidation>;
