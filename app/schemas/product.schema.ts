import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(1, "Name is required"),
  price: z.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  stock_quantity: z.number().min(0, "Stock required"),
  category_id: z.string().min(1, "Category required"),
});

export type ProductSchema = z.infer<typeof productSchema>;
