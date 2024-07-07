import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import getSession from "@/lib/getSession";

import { getDashboardData } from "./actions";
import { Dashboard } from "./Dashboard";

export default async function DashboardPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/dashboard`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  const {
    salesChartData,
    recentOrders,
    totalSales,
    totalRevenue,
    topProducts,
    totalNewUsers,
  } = await getDashboardData();

  return (
    <Dashboard
      salesChartData={salesChartData}
      recentOrders={recentOrders}
      totalSales={totalSales}
      totalRevenue={totalRevenue}
      topProducts={topProducts}
      totalNewUsers={totalNewUsers}
    />
  );
}
