import { z } from "zod";

export const addModelSchema = z.object({
  name: z.string().min(3, { message: "Masukkan minimal 3 karakter" }),
  price: z.coerce.number().min(0, { message: "Harga minimal 0" }),
  url: z.string().min(3, { message: "Masukkan minimal 3 karakter" }),
});
