import { z } from "zod";

export const loginFormSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter an email with a valid format" }),
  password: z
    .string()
    .min(6, { message: "Input password at least 6 character" }),
});
