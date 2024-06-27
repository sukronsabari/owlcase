import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { Adapter } from "next-auth/adapters";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { compare } from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

import { prisma } from "@/lib/db";
import { loginFormSchema } from "@/schemas/login";
import { sendActivationMail } from "@/lib/mail";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: "/",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, account }) {
      const existingUser = await prisma.user.findUnique({
        where: { id: token.sub },
      });
      if (!existingUser) return token;

      token.role = existingUser.role;
      return token;
    },
    session({ session, token, trigger, newSession }) {
      if (token.sub) {
        session.user.id = token.sub;
      }

      if (token.role) {
        session.user.role = token.role;
      }

      return session;
    },
  },
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Github,
    Credentials({
      authorize: async (credentials) => {
        const validatedFields = loginFormSchema.safeParse(credentials);

        if (!validatedFields.success) {
          return new Error("Invalid field, please check your input!");
        }

        const { email, password } = validatedFields.data;
        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid email or password!");
        }
        if (!user?.password) {
          throw new Error(
            "Your not login using this method, try another method!."
          );
        }

        const match = await compare(password, user?.password);

        if (!match) {
          throw new Error("Invalid email or password combination!");
        }

        if (!user.emailVerified) {
          const newToken = uuidv4();
          const oldToken = await prisma.verificationToken.findFirst({
            where: { email },
          });

          if (oldToken) {
            await prisma.verificationToken.delete({
              where: {
                email_token: {
                  email,
                  token: oldToken.token,
                },
              },
            });
          }

          await prisma.verificationToken.create({
            data: {
              email,
              expires: new Date(new Date().getTime() + 30 * 60 * 1000),
              token: newToken,
            },
          });
          await sendActivationMail(email, newToken);

          throw new Error(
            "Your account has not been activated, please check your email and activate it now!"
          );
        }

        const { password: pass, ...rest } = user;
        return { ...rest };
      },
    }),
  ],
});
