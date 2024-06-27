import { prisma } from "@/lib/db";
import { CartList } from "./CartList";
import getSession from "@/lib/getSession";
import { notFound } from "next/navigation";

export default async function CartsPage() {
  const session = await getSession();

  if (!session?.user.id) {
    notFound();
  }

  return <CartList />;
}
