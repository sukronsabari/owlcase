"use server";

import { z } from "zod";
import { hash } from "bcrypt";
import { v4 as uuidv4 } from "uuid";
import { registerFormSchema } from "@/schemas/register";
import { prisma } from "@/lib/db";
import { sendActivationMail } from "@/lib/mail";
import { IApiResponse } from "@/types/api-response";
import { runQueryWithTransaction } from "@/lib/transaction";

export async function registerAction(
  payload: z.infer<typeof registerFormSchema>
): Promise<IApiResponse<any>> {
  const validatedPayload = registerFormSchema.safeParse(payload);

  if (!validatedPayload.success) {
    return {
      success: false,
      message: validatedPayload.error.toString(),
      statusCode: 422,
    };
  }

  const {
    data: { name, email, password },
  } = validatedPayload;

  const existingUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (existingUser) {
    return {
      success: false,
      statusCode: 400,
      message: "Email already in use, please use different email!",
    };
  }

  const hashedPassword = await hash(password, 10);
  const newToken = uuidv4();

  const result = await runQueryWithTransaction(async (tx) => {
    const newUser = await tx.user.create({
      data: { name, email, password: hashedPassword },
    });

    await Promise.all([
      tx.account.create({
        data: {
          userId: newUser.id,
          provider: "credentials",
          providerAccountId: newUser.id,
          type: "credentials",
        },
      }),
      tx.verificationToken.create({
        data: {
          token: newToken,
          expires: new Date(new Date().getTime() + 30 * 60 * 1000),
          email,
        },
      }),
    ]);
  });

  if (!result.success) {
    return {
      ...result,
      message:
        "Failed to register new user, please try again or use different email",
    };
  }

  await sendActivationMail(email, newToken);

  return {
    statusCode: 201,
    success: true,
    message:
      "Registered new user successfully, check your email to activate your account!",
  };
}
