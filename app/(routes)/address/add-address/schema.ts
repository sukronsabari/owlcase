import { z } from "zod";

export const addAddressFormSchema = z.object({
  contactName: z
    .string()
    .min(3, { message: "Masukkan nama yang valid, minimal 3 karakter" }),
  phoneNumber: z
    .string()
    .min(5, { message: "Masukkan nomer hp yang valid, minimal 5 karakter" }),
  mapAreaId: z.string(),
  addressDetail: z.string().min(5, {
    message: "Masukkan detail alamat yang valid, minimal 5 karakter ",
  }),
  isMainAddress: z.boolean(),
});
