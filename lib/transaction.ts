import { Prisma, PrismaClient } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";

import { prisma } from "@/lib/db"; // Pastikan Anda mengimpor Prisma Client yang telah dikonfigurasi

type TX = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function runQueryWithTransaction(
  // eslint-disable-next-line no-unused-vars
  actions: (tx: TX) => Promise<any>
) {
  try {
    await prisma.$transaction(async (tx) => {
      return await actions(tx);
    });

    return {
      success: true,
      statusCode: 200,
      message: "Transaction completed successfully",
    };
  } catch (error) {
    console.error("Error during Prisma transaction:", error);
    return {
      success: false,
      statusCode: 500,
      message: "An error occurred during the transaction.",
    };
  }
}
