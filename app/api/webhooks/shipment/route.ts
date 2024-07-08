import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

interface WebhookBiteshipStatusResponse {
  event: string;
  courier_tracking_id: string;
  courier_waybill_id: string;
  courier_company: string;
  courier_type: string;
  courier_driver_name: string;
  courier_driver_phone: string;
  courier_driver_photo_url: string;
  courier_driver_plate_number: string;
  courier_link: string;
  order_id: string;
  order_price: number;
  status: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req?.json()) as WebhookBiteshipStatusResponse;
    console.log("WEBHOOKS BITESHIP", body);

    if (body?.status?.toLowerCase() === "delivered") {
      if (body.order_id) {
        const findOrder = await prisma.order.findFirst({
          where: {
            courierOrderId: body.order_id,
          },
        });

        if (!findOrder) {
          return NextResponse.json({ ok: true });
        }

        await prisma.order.update({
          where: {
            id: findOrder.id,
          },
          data: {
            status: "FULLFILLED",
          },
        });
      }
    } else if (body?.status?.toLowerCase() === "picked") {
      const findOrder = await prisma.order.findFirst({
        where: {
          courierOrderId: body.order_id,
        },
      });

      if (!findOrder) {
        return NextResponse.json({ ok: true });
      }

      await prisma.order.update({
        where: {
          id: findOrder.id,
        },
        data: {
          status: "SHIPPED",
        },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: true });
  }
}
