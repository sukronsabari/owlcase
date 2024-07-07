import { prisma } from "@/lib/db";
import { CartList } from "./CartList";
import getSession from "@/lib/getSession";
import { notFound, redirect } from "next/navigation";

export default async function CartsPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/cart`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  return <CartList />;
}
