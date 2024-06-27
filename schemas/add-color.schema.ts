import { z } from "zod";

const hexColorRegex = /^#[0-9A-Fa-f]{6}$/;

export const addColorSchema = z.object({
  name: z.string().min(3, { message: "Masukkan minimal 3 karakter" }),
  hex: z.string().regex(hexColorRegex, { message: "Kode warna tidak valid!" }),
});
