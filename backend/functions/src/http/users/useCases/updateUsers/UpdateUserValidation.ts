import { z } from 'zod';

export const updateUserBodyValidation = z.object({
  email: z.string().email().trim().optional(),
  password: z.string().trim().optional()
});

export const updateUserParamsValidation = z.object({
  id: z.string().trim()
});

export type UpdateParams = z.infer<typeof updateUserBodyValidation>;
