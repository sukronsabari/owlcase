import { z } from "zod";

export const addMaterialSchema = z.object({
  name: z.string().min(3, { message: "Masukkan minimal 3 karakter" }),
  price: z.coerce
    .number()
    .min(0, { message: "Harga tidak boleh lebih kecil dari 0" }),
  description: z.string().optional(),
});
