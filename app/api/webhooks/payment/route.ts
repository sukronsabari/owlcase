import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";
import { render } from "@react-email/render";
import { OrderReceivedEmail } from "@/components/emails/OrderReceivedEmail";
import { sendMail } from "@/lib/mail";

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

// Interface for OrderCreated response
interface OrderCreatedResponse {
  success: true;
  message: string;
  object: string;
  id: string;
  shipper: {
    name: string;
    email: string;
    phone: string;
    organization: string;
  };
  origin: {
    contact_name: string;
    contact_phone: string;
    coordinate: {
      latitude: number;
      longitude: number;
    };
    address: string;
    note: string;
    postal_code: number;
  };
  destination: {
    contact_name: string;
    contact_phone: string;
    contact_email: string;
    address: string;
    note: string;
    proof_of_delivery: {
      use: boolean;
      fee: number;
      note: string | null;
      link: string | null;
    };
    cash_on_delivery: {
      id: string;
      amount: number;
      fee: number;
      note: string | null;
      type: string;
    };
    coordinate: {
      latitude: number;
      longitude: number;
    };
    postal_code: number;
  };
  courier: {
    tracking_id: string;
    waybill_id: string | null;
    company: string;
    name: string | null; // Deprecated
    phone: string | null; // Deprecated
    driver_name: string | null;
    driver_phone: string | null;
    driver_photo_url: string | null;
    driver_plate_number: string | null;
    type: string;
    link: string | null;
    insurance: {
      amount: number;
      fee: number;
      note: string;
    };
    routing_code: string | null;
  };
  delivery: {
    datetime: string;
    note: string | null;
    type: string;
    distance: number;
    distance_unit: string;
  };
  reference_id: string | null;
  items: {
    name: string;
    description: string;
    sku: string | null;
    value: number;
    quantity: number;
    length: number;
    width: number;
    height: number;
    weight: number;
  }[];
  extra: any[]; // or define a specific type if known
  price: number;
  metadata: any; // or define a specific type if known
  note: string;
  status: string;
}

// Interface for order failed response
interface OrderFailedResponse {
  success: false;
  error: string;
  code: number;
  details: {
    order_id: string;
    waybill_id: string;
    reference_id: string;
  };
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
          const shippingItems = findOrder.items.map((item) => {
            const weight = item.quantity * 50;

            return {
              name: item.caseOption.caseModel.name,
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
            reference_id: findOrder.id,
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

          const response = await fetch(
            `${process.env.BITESHIP_BASE_URL!}/v1/orders`,
            {
              method: "POST",
              headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
                Authorization: process.env.BITESHIP_API_KEY!,
              },
              body: JSON.stringify(shippingReqBody),
            }
          );

          if (!response.ok) {
            return NextResponse.json(
              { message: "Something went wrong", ok: false },
              { status: 500 }
            );
          }

          const shippingResponse = (await response.json()) as
            | OrderCreatedResponse
            | OrderFailedResponse;

          if (!shippingResponse?.success) {
            return NextResponse.json(
              { message: "Something went wrong", ok: false },
              { status: 500 }
            );
          }

          const updatedOrder = await prisma.order.update({
            where: {
              id: orderId,
            },
            data: {
              isPaid: true,
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
            subject: "Pesanan Anda di Proses",
            content: emailHtml,
          });

          return NextResponse.json({ ok: true });
        }
      }
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
    }
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { message: "Something went wrong", ok: false },
      { status: 500 }
    );
  }
}
