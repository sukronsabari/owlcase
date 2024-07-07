import { NextResponse } from "next/server";

import { prisma } from "@/lib/db";

interface VaNumber {
  va_number: string;
  bank: string;
}

interface WebhookResponse {
  transaction_type?: string;
  transaction_time: string;
  transaction_status: string;
  transaction_id: string;
  status_message: string;
  status_code: string;
  signature_key: string;
  settlement_time: string;
  payment_type: string;
  order_id: string;
  merchant_id: string;
  issuer?: string;
  gross_amount: string;
  fraud_status: string;
  currency: string;
  acquirer?: string;
  va_numbers?: VaNumber[];
  payment_amounts?: any[];
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as WebhookResponse;

    let orderId = body.order_id;
    let transactionStatus = body.transaction_status;
    let fraudStatus = body.fraud_status;

    if (transactionStatus == "capture" || transactionStatus == "settlement") {
      if (fraudStatus == "accept") {
        const findOrder = await prisma.order.findUnique({
          where: {
            id: orderId,
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

        if (findOrder) {
          await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              isPaid: true,
            },
          });

          return NextResponse.json({ ok: true });
        }
      }
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      const findOrder = await prisma.order.findUnique({
        where: {
          id: orderId,
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

      if (findOrder) {
        await prisma.order.update({
          where: {
            id: orderId,
          },
          data: {
            status: "FAILURE",
          },
        });

        return NextResponse.json({ ok: true });
      }

      return NextResponse.json({ ok: true });
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      return NextResponse.json({ ok: true });
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
