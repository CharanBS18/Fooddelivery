import { z } from "zod";

export const upsertCartItemSchema = z.object({
  body: z.object({
    menuItemId: z.string(),
    quantity: z.number().int().min(1).max(20)
  })
});

export const removeCartItemSchema = z.object({
  params: z.object({
    menuItemId: z.string()
  })
});
