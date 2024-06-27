import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import { UserRole } from "@prisma/client";
import { notFound, redirect } from "next/navigation";
import { Dashboard } from "./Dashboard";
import { getDashboardData } from "./actions";

export default async function DashboardPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/dashboard`);

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
