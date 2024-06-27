import { DefaultArgs } from "@prisma/client/runtime/library";
import { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db"; // Pastikan Anda mengimpor Prisma Client yang telah dikonfigurasi

type TX = Omit<
  PrismaClient<Prisma.PrismaClientOptions, never, DefaultArgs>,
  "$connect" | "$disconnect" | "$on" | "$transaction" | "$use" | "$extends"
>;

export async function runQueryWithTransaction(
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
