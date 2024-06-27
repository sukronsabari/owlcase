"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";

export async function deleteAddressAction(id: string) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, login terlebih dahulu!");
  }

  const deleteAddress = await prisma.shippingAddress.findFirst({
    where: { id, userId: session.user.id },
  });

  if (!deleteAddress) {
    throw new Error("Alamat tidak ditemukan!");
  }

  if (deleteAddress.isMainAddress) {
    const lastAddressCreated = await prisma.shippingAddress.findFirst({
      where: { userId: session.user.id },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    if (lastAddressCreated) {
      await prisma.shippingAddress.update({
        where: { id: lastAddressCreated.id },
        data: {
          isMainAddress: true,
        },
      });
    }
  }

  await prisma.shippingAddress.delete({
    where: { id },
  });

  revalidatePath("/address");
}
