import { z } from "zod";

export const registerFormSchema = z.object({
  name: z.string().min(3, { message: "Input name at least 3 character " }),
  email: z
    .string()
    .email({ message: "Please enter an email with a valid format" }),
  password: z
    .string()
    .min(6, { message: "Input password at least 6 character" }),
});
