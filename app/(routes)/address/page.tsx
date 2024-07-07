import { redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";

import { AddressList } from "./AddressList";

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
