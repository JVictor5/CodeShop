import { z } from 'zod';

export const updateSellerValidation = z.object({
  idUser: z.string().trim().optional(),
  name: z.string().trim().optional(),
  email: z.string().trim().email().optional(),
  discription: z.string().trim().optional(),
  phone: z
    .string()
    .trim()
    .min(10)
    .max(14)
    .transform(value => {
      if (value.startsWith('+55')) return value;
      return `+55${value}`;
    })
    .optional()
});

export const updateShopParamsValidation = z.object({
  id: z.string().trim()
});

export type UpdateParams = z.infer<typeof updateSellerValidation>;
