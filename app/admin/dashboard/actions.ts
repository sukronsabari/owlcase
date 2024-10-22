"use server";

import type { OrderStatus } from "@prisma/client";

import { prisma } from "@/lib/db";

// export async function generateCsv() {
//   const orders = await prisma.order.findMany({
//     where: {
//       isPaid: true,
//     },
//     include: {
//       items: {
//         include: {
//           caseOption: {
//             include: {
//               imageConfiguration: true,
//               caseModel: true,
//             },
//           },
//         },
//       },
//       shippingAddress: true,
//       user: true,
//     },
//   });

//   const orderMap = orders.map((order) => ({
//     id: order.id,
//     orderDate: order.createdAt.toLocaleDateString(),
//     amount: order.amount,
//     courierRates: order.courierRates,
//     items: order.items
//       .map((item) => {
//         return `${item.caseOption.caseModel.name} (${item.quantity}): ${item.caseOption.imageConfiguration.croppedImageUrl}`;
//       })
//       .join(", "), // Menggabungkan item menjadi satu string
//   }));

//   // const fields = ["id", "status", "customer", "item", "date"];
//   const opts = {};
//   const transformOpts = {};

//   const parser = new AsyncParser(opts, transformOpts);

//   // let csv = "";

//   const data = await parser.parse(orderMap).promise();
//   console.log(data);

//   return data;
// }

export async function ChangeOrderStatus({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) {
  await prisma.order.update({
    where: { id },
    data: { status: newStatus },
  });
}

export const getDashboardData = async () => {
  // Ambil semua order yang sudah dibayar
  const orders = await prisma.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              imageConfiguration: true,
            },
          },
        },
      },
      shippingAddress: true,
      user: true,
    },
  });

  // Inisialisasi array penjualan bulanan
  const salesPerMonth = Array(12).fill(0);

  // Menghitung penjualan per bulan
  orders.forEach((order) => {
    const orderMonth = new Date(order.createdAt).getMonth();
    const orderTotal = order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    salesPerMonth[orderMonth] += orderTotal;
  });

  // Menghitung produk terlaris
  const productSales: { [key: string]: number } = {};
  orders.forEach((order) => {
    order.items.forEach((item) => {
      if (!productSales[item.caseOptionId]) {
        productSales[item.caseOptionId] = 0;
      }
      productSales[item.caseOptionId] += item.quantity;
    });
  });

  const topProducts = await prisma.caseModel.findMany({
    where: {
      id: { in: Object.keys(productSales) },
    },
    include: {
      caseColors: true,
      caseFinishes: true,
      caseMaterials: true,
    },
    take: 5,
  });

  const topProductsData = topProducts.map((product) => ({
    ...product,
    sales: productSales[product.id],
  }));

  const totalSales = orders.reduce(
    (acc, order) =>
      acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0),
    0
  );

  // Menghitung pengguna baru (misalnya, dalam 30 hari terakhir)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  const totalNewUsers = await prisma.user.count({
    where: {
      createdAt: {
        gte: thirtyDaysAgo,
      },
    },
  });

  return {
    salesChartData: {
      labels: [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ],
      datasets: [
        {
          label: "Penjualan",
          data: salesPerMonth,
          fill: false,
          backgroundColor: "rgb(75, 192, 192)",
          borderColor: "rgba(75, 192, 192, 0.2)",
        },
      ],
    },
    totalSales,
    totalRevenue: salesPerMonth.reduce(
      (acc, sales) => acc + sales,
      0
    ) as number,
    topProducts: topProductsData,
    totalNewUsers,
    recentOrders: orders.slice(0, 5),
  };
};
