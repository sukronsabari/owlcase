import getSession from "@/lib/getSession";
import { redirect, notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { Orders } from "./UnpaidOrder";

export default async function PaidOrderPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/orders/unpaid`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  return <Orders />;
}
