import { z } from "zod";

export const createOrderSchema = z.object({
  body: z.object({
    deliveryAddress: z.object({
      line1: z.string().min(3),
      line2: z.string().optional(),
      city: z.string().min(2),
      state: z.string().min(2),
      postalCode: z.string().min(4)
    })
  })
});

export const updateOrderStatusSchema = z.object({
  params: z.object({
    orderId: z.string()
  }),
  body: z.object({
    status: z.enum(["PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"])
  })
});
