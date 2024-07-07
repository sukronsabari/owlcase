import { prisma } from "@/lib/db";
import { notFound, redirect } from "next/navigation";
import { AddressList } from "./AddressList";
import getSession from "@/lib/getSession";

export default async function AddressPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/address`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
  });

  return <AddressList addresses={addresses} />;
}
