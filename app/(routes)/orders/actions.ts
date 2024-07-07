"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";

export async function getMyOrders() {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu");
  }

  const myOrders = await prisma.order.findMany({
    where: { userId: session.user.id },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              caseModel: true,
              caseColor: true,
              caseMaterial: true,
              caseFinish: true,
              imageConfiguration: true,
            },
          },
        },
      },
    },
  });

  return myOrders;
}
