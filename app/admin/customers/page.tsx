import getSession from "@/lib/getSession";
import { redirect, notFound } from "next/navigation";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { Customers } from "./Customers";

export default async function CustomersPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/customers`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  const customers = await prisma.user.findMany({
    where: {
      // role: "USER",
    },
    select: {
      id: true,
      name: true,
      email: true,
      orders: true,
    },
  });

  const customerData = customers.map((customer) => ({
    id: customer.id,
    name: customer.name as string,
    email: customer.email,
    orderTotal: customer.orders.length || 0,
  }));

  return <Customers customerData={customerData} />;
}
