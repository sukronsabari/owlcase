import { notFound, redirect } from "next/navigation";

import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";

import { EditAddress } from "./EditAddress";

export default async function EditAddressPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/address/${params.id}`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  const findAddress = await prisma.shippingAddress.findUnique({
    where: { id: params.id, userId: session.user.id },
  });

  if (!findAddress) {
    notFound();
  }

  return <EditAddress address={findAddress} />;
}
