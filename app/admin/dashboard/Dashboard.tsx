/* eslint-disable @next/next/no-img-element */
"use client";

import type {
  CaseModel,
  Order,
  OrderItem,
  ShippingAddress,
  User,
} from "@prisma/client";
import {
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  Title,
} from "chart.js";
import { Line } from "react-chartjs-2";

import { formatPrice } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SectionWrapper } from "@/components/SectionWrapper";

type OrderProps = {
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  user: User;
} & Order;

interface DashboardProps {
  salesChartData: any;
  recentOrders: OrderProps[];
  totalSales: number;
  totalRevenue: number;
  topProducts: (CaseModel & { sales: number })[];
  totalNewUsers: number;
}

// import { generateCsv } from "./actions";

ChartJS.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

export function Dashboard({
  salesChartData,
  totalRevenue,
  totalSales,
}: DashboardProps) {
  return (
    <SectionWrapper className="px-4 py-10 md:px-10">
      <>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <div className="grid gap-4 sm:grid-cols-2 max-w-4xl">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Penjualan (case)</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl">{totalSales}</CardTitle>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Total Pendapatan</CardDescription>
            </CardHeader>
            <CardContent>
              <CardTitle className="text-4xl">
                {formatPrice(totalRevenue)}
              </CardTitle>
            </CardContent>
          </Card>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Ringkasan Penjualan</h2>
          <Line data={salesChartData} />
        </div>
      </>
    </SectionWrapper>
  );
}
