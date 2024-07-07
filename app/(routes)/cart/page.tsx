import { redirect } from "next/navigation";

import getSession from "@/lib/getSession";

import { CartList } from "./CartList";

export default async function CartsPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/cart`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  return <CartList />;
}
