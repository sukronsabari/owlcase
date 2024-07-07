"use server";

import { signIn } from "@/auth";
import { loginFormSchema } from "@/schemas/login";
import { AuthError } from "next-auth";
import { z } from "zod";

import { IApiResponse } from "@/types/api-response";

export async function LoginAction(
  payload: z.infer<typeof loginFormSchema>,
  callbackUrl?: string | null
): Promise<IApiResponse<any | { redirectUrl: string }>> {
  try {
    const redirectUrl = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirectTo: callbackUrl || "/configure/upload",
      redirect: false,
    });

    return {
      success: true,
      statusCode: 200,
      message: "user logged in!",
      data: {
        redirectUrl,
      },
    };
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        statusCode: 401,
        success: false,
        message:
          error.cause?.err?.message || "Invalid email or password combination!",
      };
    }

    throw error;
  }
}
