/* eslint-disable @next/next/no-img-element */
"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatPrice } from "@/lib/utils";
import {
  ImageConfiguration,
  Order,
  CaseOption,
  ShippingAddress,
  User,
  OrderItem,
  CaseModel,
} from "@prisma/client";
import { StatusDropdown } from "./StatusDropdown";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Line } from "react-chartjs-2";

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

import {
  Chart as ChartJS,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

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
  recentOrders,
  topProducts,
  totalNewUsers,
  totalRevenue,
  totalSales,
}: DashboardProps) {
  // async function handleDownload(url: string, filename: string) {
  //   try {
  //     const response = await fetch(url);
  //     const blob = await response.blob();

  //     const contentType = response.headers.get("Content-Type");
  //     const extension = contentType ? contentType.split("/").pop() : "";
  //     const fullFilename = `${filename}.${extension}`;

  //     const ancorUrl = window.URL.createObjectURL(new Blob([blob]));
  //     const link = document.createElement("a");

  //     link.href = ancorUrl;
  //     link.setAttribute("download", fullFilename);
  //     document.body.appendChild(link);
  //     link.click();
  //     link?.parentNode?.removeChild(link);
  //   } catch (err) {
  //     console.error("Gagal mengunduh file:", err);
  //   }
  // }

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
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-2">Produk Terlaris</h2>
          <ul>
            {topProducts.length ? (
              topProducts.map((product) => (
                <li key={product.id}>
                  {product.name} - {product.sales}
                </li>
              ))
            ) : (
              <p className="text-muted-foreground">Belum ada produk terlaris</p>
            )}
          </ul>
        </div>

        <div className="mt-8 pb-14">
          <h2 className="text-xl font-semibold mb-2">Pesanan Terbaru</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Customer</TableHead>
                <TableHead className="hidden sm:table-cell">Status</TableHead>
                <TableHead className="hidden sm:table-cell">Tanggal</TableHead>
                <TableHead className="text-right">Total</TableHead>
                {/* <TableHead className="hidden sm:table-cell">File</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentOrders.map((order) => (
                <TableRow key={order.id} className="bg-accent">
                  <TableCell>
                    <div className="font-medium">
                      {order.shippingAddress.contactName}
                    </div>
                    <div className="hidden text-sm text-muted-foreground md:inline">
                      {order.user.email}
                    </div>
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {/* <StatusDropdown id={order.id} orderStatus={order.status} /> */}
                    {order.status}
                  </TableCell>
                  <TableCell className="hidden sm:table-cell">
                    {order.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {formatPrice(order.amount / 100)}
                  </TableCell>
                  {/* <TableCell className="hidden sm:table-cell">
                    <Button
                      variant="link"
                      className="text-blue-500 px-0"
                      // onClick={() =>
                      //   handleDownload(
                      //     order.phoneConfiguration!.imageConfiguration!
                      //       .croppedImageUrl!,
                      //     `image-${new Date().getTime()}`
                      //   )
                      // }
                    >
                      Link
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </>
    </SectionWrapper>
  );
}
