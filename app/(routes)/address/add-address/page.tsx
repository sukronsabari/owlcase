import { fetchProvinces } from "@/actions/idn-area";
import { AddAddress } from "./AddAddress";
import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import { notFound, redirect } from "next/navigation";

export default async function AddAddressPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/address/add-address`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
  });

  return <AddAddress totalAddress={addresses.length} />;
}
