import { auth } from "@/auth";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";
import { AddressList } from "./AddressList";

export default async function AddressPage() {
  const session = await auth();

  if (!session?.user.id) {
    notFound();
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
  });

  return <AddressList addresses={addresses} />;
}
