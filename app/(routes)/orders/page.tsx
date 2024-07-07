import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";

import { Orders } from "./Orders";

export default async function OrderListPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/orders`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  return <Orders />;
}
