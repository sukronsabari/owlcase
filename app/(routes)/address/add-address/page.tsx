import { fetchProvinces } from "@/actions/idn-area";
import { AddAddress } from "./AddAddress";
import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import { notFound } from "next/navigation";

export default async function AddAddressPage() {
  const session = await getSession();

  if (!session?.user.id) {
    notFound();
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
  });

  return <AddAddress totalAddress={addresses.length} />;
}
