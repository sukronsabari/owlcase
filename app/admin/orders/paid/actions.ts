"use server";

import { auth } from "@/auth";
import { UserRole } from "@prisma/client";
import { render } from "@react-email/render";

import { prisma } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { OrderReceivedEmail } from "@/components/emails/OrderReceivedEmail";

import { OrderCreatedResponse, OrderFailedResponse } from "../type";

export async function getPaidOrders() {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak dapat mengakses resource ini!");
  }

  const paidOrders = await prisma.order.findMany({
    where: {
      isPaid: true,
    },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              caseModel: true,
              caseColor: true,
              caseMaterial: true,
              caseFinish: true,
              imageConfiguration: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  return paidOrders;
}

export async function updateStatusToProcess(id: string) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak dapat mengakses resource ini!");
  }

  if (!id) {
    throw new Error("Pesanan tidak ditemukan!");
  }

  const findOrder = await prisma.order.findFirst({
    where: { id, isPaid: true },
  });

  if (!findOrder) {
    throw new Error("Pesanan tidak ditemukan!");
  }

  if (findOrder.status !== "PENDING") {
    throw new Error("Pesanan sudah di proses!");
  }

  await prisma.order.update({
    where: { id },
    data: {
      status: "PROCESS",
    },
  });
}

export async function requestCourierShipping(orderId: string) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu!");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Anda tidak dapat mengakses resource ini!");
  }

  const findOrder = await prisma.order.findFirst({
    where: {
      id: orderId,
      isPaid: true,
      status: "PROCESS",
    },
    include: {
      shippingAddress: true,
      user: true,
      items: {
        include: {
          caseOption: {
            include: {
              caseColor: true,
              caseModel: true,
              caseMaterial: true,
              caseFinish: true,
            },
          },
        },
      },
    },
  });

  if (!findOrder) {
    throw new Error("Pesanan tidak ditemukan!");
  }

  if (findOrder.courierOrderId) {
    throw new Error("Pesananan sudah di proses oleh jasa pengiriman!");
  }

  const shippingItems = findOrder.items.map((item) => {
    const weight = item.quantity * 50;

    return {
      name: `${item.caseOption.caseModel.name} Case`,
      description: `Custom case untuk ${item.caseOption.caseModel.name}, warna ${item.caseOption.caseColor.name}, material ${item.caseOption.caseMaterial.name}, dengan finishing ${item.caseOption.caseFinish.name}`,
      value:
        (item.caseOption.caseModel.price +
          item.caseOption.caseMaterial.price +
          item.caseOption.caseFinish.price) *
        item.quantity,
      quantity: item.quantity,
      weight, // grams
    };
  });

  const shippingReqBody = {
    reference_id: findOrder.orderNumber,
    shipper_contact_name: "Sukron Sabari",
    shipper_contact_phone: "082253784251",
    shipper_contact_email: "sukronsabari11@gmail.com",
    shipper_organization: "Owlcase",
    origin_contact_name: "Sukron Sabari",
    origin_contact_phone: "082253784251",
    origin_address:
      "Jalan samratulangi Sungai Panjang Gang. Gotong Royong, Samarinda Seberang, Samarinda, Kalimantan Timur. 75131",
    origin_note: "Kos warna biru, dekat warung pangestu",
    origin_postal_code: 75131,
    destination_contact_name: findOrder.shippingAddress.contactName,
    destination_contact_phone: findOrder.shippingAddress.phoneNumber,
    destination_contact_email: "",
    destination_address: `${findOrder.shippingAddress.addressDetail}, ${findOrder.shippingAddress.district}, ${findOrder.shippingAddress.city}, ${findOrder.shippingAddress.province}. ${findOrder.shippingAddress.postalCode}`,
    destination_postal_code: findOrder.shippingAddress.postalCode,
    destination_note: findOrder.shippingAddress.addressDetail,
    courier_company: findOrder.courierCompany,
    courier_type: findOrder.courierType,
    courier_insurance: findOrder.courierInsurance,
    delivery_type: findOrder.deliveryType,
    order_note: "Please be careful",
    metadata: {},
    items: shippingItems,
  };

  const response = await fetch(`${process.env.BITESHIP_BASE_URL!}/v1/orders`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: process.env.BITESHIP_API_KEY!,
    },
    body: JSON.stringify(shippingReqBody),
  });

  if (!response.ok) {
    throw new Error(
      "Gagal dalam menghubungi layanan jasa kurir, tolong coba kembali!"
    );
  }

  const shippingResponse = (await response.json()) as
    | OrderCreatedResponse
    | OrderFailedResponse;

  if (!shippingResponse?.success) {
    throw new Error(
      "Gagal dalam menghubungi layanan jasa kurir, tolong coba kembali!"
    );
  }

  const updatedOrder = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "AWAITING_SHIPMENT",
      courierOrderId: shippingResponse?.id,
      waybillId: shippingResponse?.courier?.waybill_id,
      trackingId: shippingResponse?.courier?.tracking_id,
    },
    include: {
      shippingAddress: true,
      user: true,
      items: {
        include: {
          caseOption: {
            include: {
              caseColor: true,
              caseModel: true,
              caseMaterial: true,
              caseFinish: true,
            },
          },
        },
      },
    },
  });

  const emailHtml = render(
    OrderReceivedEmail({
      orderId,
      orderDate: updatedOrder.createdAt.toLocaleDateString(),
      shippingAddress: updatedOrder.shippingAddress!,
    })
  );

  await sendMail({
    to: updatedOrder.user.email,
    subject: "Pesanan Anda segera dikirim",
    content: emailHtml,
  });
}
