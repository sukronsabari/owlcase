"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getUnpaidOrders() {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak dapat mengakses resource ini!");
  }

  const paidOrders = await prisma.order.findMany({
    where: {
      isPaid: false,
    },
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
      shippingAddress: true,
    },
  });

  return paidOrders;
}

export async function updateOrderPaidStatus(orderId: string) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak dapat mengakses resource ini!");
  }

  const findUnPaidOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      isPaid: false,
    },
  });

  if (!findUnPaidOrder) {
    throw new Error("Pesanan tidak ditemukan!");
  }

  await prisma.order.update({
    where: { id: orderId },
    data: {
      isPaid: true,
      status: "PENDING",
    },
  });
}
