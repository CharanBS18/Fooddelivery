import { z } from "zod";

export const createRestaurantSchema = z.object({
  body: z.object({
    name: z.string().min(2),
    description: z.string().optional(),
    cuisines: z.array(z.string()).default([]),
    avgDeliveryMinutes: z.number().int().positive().optional(),
    imageUrl: z.string().url().optional(),
    address: z
      .object({
        line1: z.string().optional(),
        line2: z.string().optional(),
        city: z.string().optional(),
        state: z.string().optional(),
        postalCode: z.string().optional()
      })
      .optional()
  })
});
