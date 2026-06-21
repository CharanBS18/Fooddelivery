import { z } from "zod";

export const createMenuItemSchema = z.object({
  body: z.object({
    restaurant: z.string(),
    name: z.string().min(2),
    description: z.string().optional(),
    category: z.string().optional(),
    price: z.number().positive(),
    imageUrl: z.string().url().optional(),
    isVeg: z.boolean().optional(),
    isAvailable: z.boolean().optional()
  })
});
