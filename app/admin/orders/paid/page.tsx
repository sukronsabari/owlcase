import getSession from "@/lib/getSession";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Orders } from "./PaidOrder";

export default async function PaidOrderPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/orders/paid`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  return <Orders />;
}
