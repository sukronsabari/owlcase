"use server";

import { auth } from "@/auth";

import { prisma } from "@/lib/db";

export async function getCart() {
  const session = await auth();

  if (!session?.user.id) {
    return;
  }

  const cart = await prisma.cart.findUnique({
    where: { userId: session?.user.id },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              imageConfiguration: true,
              caseColor: true,
              caseModel: true,
              caseMaterial: true,
              caseFinish: true,
            },
          },
        },
      },
    },
  });

  return cart;
}

export async function decreaseQuantity(cartItemId: string) {
  const findCartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!findCartItem) {
    throw new Error("Cart not found");
  }

  const newQuantity = findCartItem.quantity - 1;
  if (newQuantity < 1) {
    await prisma.cartItem.delete({
      where: { id: cartItemId },
    });
  } else {
    await prisma.cartItem.update({
      where: { id: cartItemId },
      data: {
        quantity: newQuantity,
      },
    });
  }
}

export async function increaseQuantity(cartItemId: string) {
  const findCartItem = await prisma.cartItem.findUnique({
    where: { id: cartItemId },
  });

  if (!findCartItem) {
    throw new Error("Cart item not found");
  }

  await prisma.cartItem.update({
    where: { id: cartItemId },
    data: {
      quantity: findCartItem.quantity + 1,
    },
  });
}
