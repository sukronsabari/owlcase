"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { editAddressFormSchema } from "./schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function editAddressAction({
  id,
  addressDetail,
  contactName,
  isMainAddress,
  mapAreaId,
  phoneNumber,
}: z.infer<typeof editAddressFormSchema> & { id: string }) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, login terlebih dahulu!");
  }

  if (isMainAddress) {
    const mainAddress = await prisma.shippingAddress.findFirst({
      where: { isMainAddress: true },
    });

    if (mainAddress && mainAddress.id !== id) {
      await prisma.shippingAddress.update({
        where: { id: mainAddress.id },
        data: {
          isMainAddress: false,
        },
      });
    }
  }

  await prisma.shippingAddress.update({
    where: { id },
    data: {
      userId: session.user.id,
      isMainAddress,
      addressDetail,
      contactName,
      mapAreaId,
      phoneNumber,
    },
  });

  revalidatePath("/address");
}
