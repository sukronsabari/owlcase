"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { unstable_noStore as noStore } from "next/cache";

export async function cartCount() {
  noStore();
  const session = await auth();

  if (!session?.user.id) {
    return;
  }

  const cart = await prisma.cart.findFirst({
    where: { userId: session.user.id },
    include: {
      items: true,
    },
  });

  return cart;
}
