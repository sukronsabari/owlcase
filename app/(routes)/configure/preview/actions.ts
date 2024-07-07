"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { AuthenticationError } from "@/lib/exceptions";

export async function addToCartAction(caseOptionId: string) {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthenticationError(
      "Terjadi kesalahan, anda belum login, login terlebih dahulu untuk melakukan aksi ini"
    );
  }

  let findCart = await prisma.cart.findUnique({
    where: {
      userId: session.user.id,
    },
  });

  if (!findCart) {
    findCart = await prisma.cart.create({
      data: {
        userId: session.user.id,
      },
    });
  }

  const findCartItem = await prisma.cartItem.findFirst({
    where: {
      cartId: findCart.id,
      caseOptionId,
    },
  });

  if (findCartItem) {
    await prisma.cartItem.update({
      where: {
        id: findCartItem.id,
      },
      data: {
        quantity: findCartItem.quantity + 1,
      },
    });
  } else {
    await prisma.cartItem.create({
      data: {
        cartId: findCart.id,
        caseOptionId,
        quantity: 1,
      },
    });
  }
}
