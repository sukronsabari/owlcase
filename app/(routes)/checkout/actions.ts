"use server";

import { auth } from "@/auth";
import { CheckoutItem } from "@/stores";
import { createId as cuid } from "@paralleldrive/cuid2";

import { prisma } from "@/lib/db";

import { CourierPricingResponse, Transaction } from "./types";

export async function getCaseOptions(ids: string[]) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error(
      "Terjadi kesalahan, anda belum login. Login terlebih dahulu!"
    );
  }

  const findCaseOption = await prisma.caseOption.findMany({
    where: {
      id: {
        in: ids,
      },
    },
    include: {
      imageConfiguration: true,
      caseModel: true,
      caseColor: true,
      caseMaterial: true,
      caseFinish: true,
    },
  });

  if (findCaseOption.length !== ids.length) {
    throw new Error(
      "Terjadi kesalahan, product atau configurasi case anda tidak valid, tolong periksa kembali!"
    );
  }

  return findCaseOption;
}

export async function getAddresses() {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error(
      "Terjadi kesalahan, anda belum login. Login terlebih dahulu!"
    );
  }

  const addresses = await prisma.shippingAddress.findMany({
    where: { userId: session.user.id },
  });

  return addresses;
}

export async function getCourierPricing({
  addressId,
  checkoutItems,
}: {
  addressId: string;
  checkoutItems: CheckoutItem[];
}) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error(
      "Terjadi kesalahan, anda belum login. Login terlebih dahulu!"
    );
  }

  const findAddress = await prisma.shippingAddress.findUnique({
    where: { id: addressId },
  });

  if (!findAddress) {
    return [];
  }

  const caseOptionIds = checkoutItems.map((item) => item.caseOptionId);
  const caseOptions = await prisma.caseOption.findMany({
    where: {
      id: {
        in: caseOptionIds,
      },
    },
    include: {
      caseModel: true,
      caseColor: true,
      caseMaterial: true,
      caseFinish: true,
    },
  });

  if (caseOptions.length !== caseOptionIds.length) {
    throw new Error(
      "Terjadi kesalahan, barang yang anda checkout tidak ditemukan, periksa kembali barang anda"
    );
  }

  const items = caseOptions.map((caseOpt) => {
    const checkoutItem = checkoutItems.find(
      (item) => item.caseOptionId === caseOpt.id
    );

    if (!checkoutItem) return;

    const weight = checkoutItem.quantity * 50;

    return {
      name: caseOpt.caseModel.name,
      description: `Custom case untuk ${caseOpt.caseModel.name}, warna ${caseOpt.caseColor.name}, material ${caseOpt.caseMaterial.name}, dengan finishing ${caseOpt.caseFinish.name}`,
      value:
        (caseOpt.caseModel.price +
          caseOpt.caseMaterial.price +
          caseOpt.caseFinish.price) *
        checkoutItem!.quantity!,
      quantity: checkoutItem.quantity,
      weight, // grams
    };
  });

  const response = await fetch(
    `${process.env.BITESHIP_BASE_URL!}/v1/rates/couriers`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: process.env.BITESHIP_API_KEY!,
      },
      body: JSON.stringify({
        origin_area_id: process.env.BITESHIP_STORE_AREA_ID!,
        destination_area_id: findAddress.mapAreaId,
        couriers: "jne,sicepat,jnt,anteraja",
        items,
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Terjadi kesalahan, lokasi yang anda pilih tidak ditemukan"
    );
  }

  const responseJson = (await response.json()) as CourierPricingResponse;
  return responseJson.pricing;
}

const generateOrderNumber = async () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);

  const orderCount = await prisma.order.count();
  const orderNumber = `ORD-${year}${month}${day}-${orderCount + 1}`;

  return orderNumber;
};

export async function createOrder({
  payment,
  addressId,
  checkoutItems,
  courier,
}: {
  payment: {
    paymentType: string;
    bankName?: string;
  };
  addressId: string;
  courier: {
    courierCompany: string;
    courierType: string;
    courierInsurance: number;
    deliveryType: "now" | "scheduled" | "later";
  };
  checkoutItems: CheckoutItem[];
}) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error(
      "Terjadi kesalahan, anda belum login. Login terlebih dahulu!"
    );
  }

  if (!payment || !addressId || !checkoutItems?.length) {
    throw new Error(
      "Silahkan pilih alamat, kurir, metode pembayaran dan barang yang valid!"
    );
  }

  const findAddress = await prisma.shippingAddress.findUnique({
    where: { id: addressId },
  });

  if (!findAddress) {
    throw new Error(
      "Alamat tidak ditemukan, tolong periksa alamat yang anda pilih"
    );
  }

  const courierPricing = await getCourierPricing({
    addressId,
    checkoutItems,
  });

  const findSelectedCourier = courierPricing.find(
    (pricing) =>
      pricing.company === courier.courierCompany &&
      pricing.type === courier.courierType
  );

  if (!findSelectedCourier) {
    throw new Error(
      "Terjadi kesalahan, jasa pengiriman yang anda pilih tidak ditemukan, tolong periksa kembali!"
    );
  }

  const caseOptionIds = checkoutItems.map((item) => item.caseOptionId);
  const caseOptions = await prisma.caseOption.findMany({
    where: {
      id: {
        in: caseOptionIds,
      },
    },
    include: {
      caseModel: true,
      caseColor: true,
      caseMaterial: true,
      caseFinish: true,
    },
  });

  if (caseOptions.length !== caseOptionIds.length) {
    throw new Error(
      "Terjadi kesalahan, barang yang anda checkout tidak ditemukan, periksa kembali barang anda"
    );
  }

  const totalAmount = caseOptions.reduce((total, current) => {
    const findCheckoutItem = checkoutItems.find(
      (item) => item.caseOptionId === current.id
    );

    if (!findCheckoutItem) return 0;

    const totalPrice =
      (current.caseModel.price +
        current.caseMaterial.price +
        current.caseFinish.price) *
      findCheckoutItem!.quantity;

    return (total += totalPrice);
  }, 0);

  const orderItemsData = caseOptions.map((caseOpt) => {
    const findCheckoutItem = checkoutItems.find(
      (item) => item.caseOptionId === caseOpt.id
    );

    return {
      caseOptionId: caseOpt.id,
      price:
        caseOpt.caseModel.price +
        caseOpt.caseMaterial.price +
        caseOpt.caseFinish.price,
      quantity: findCheckoutItem!.quantity,
    };
  });

  const orderNumber = await generateOrderNumber();
  const newOrder = await prisma.order.create({
    data: {
      userId: session.user.id,
      amount: totalAmount,
      orderNumber,
      shippingAddressId: findAddress.id,
      paymentMethod: payment.paymentType,
      courierCompany: courier.courierCompany,
      courierInsurance: courier.courierInsurance,
      courierType: courier.courierType,
      courierRates: findSelectedCourier.price,
      deliveryType: courier.deliveryType,
      items: {
        createMany: {
          data: orderItemsData,
        },
      },
    },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              caseModel: true,
            },
          },
        },
      },
    },
  });

  const findCart = await prisma.cart.findFirst({
    where: {
      userId: session.user.id,
    },
  });

  if (findCart) {
    const cartItems = await prisma.cartItem.findMany({
      where: {
        caseOptionId: {
          in: caseOptionIds,
        },
        cartId: findCart?.id,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        id: {
          in: cartItems.map((item) => item.id),
        },
      },
    });
  }

  let itemDetails = newOrder.items.map((item) => ({
    id: item.id,
    quantity: item.quantity,
    price: item.price,
    name: `Custom Case ${item.caseOption.caseModel.name}`,
  }));

  let paymentReqBody = {
    payment_type: payment.paymentType,
    transaction_details: {
      gross_amount: newOrder.amount + newOrder.courierRates,
      order_id: newOrder.id,
    },
    customer_details: {
      first_name: session.user.name,
      last_name: "",
      email: session.user.email,
      shipping_address: {
        first_name: findAddress.contactName,
        last_name: "",
        phone: findAddress.phoneNumber,
        address: `${findAddress.district} ${findAddress.city} ${findAddress.province}. ${findAddress.postalCode}`,
        city: findAddress.city,
        postal_code: findAddress.postalCode,
        country_code: "IDN",
      },
    },
    item_details: [
      ...itemDetails,
      {
        id: cuid(),
        quantity: 1,
        price: newOrder.courierRates,
        name: "Shipping Rates",
      },
    ],
    custom_expiry: {
      expiry_duration: 60,
      unit: "minute",
    },
  };

  const paymentResponse = await fetch(
    `${process.env.MIDTRANS_BASE_URL}/charge`!,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
      },
      body:
        payment.paymentType === "bank_transfer"
          ? JSON.stringify({
              ...paymentReqBody,
              bank_transfer: {
                bank: payment!.bankName,
              },
            })
          : JSON.stringify(paymentReqBody),
    }
  );

  if (!paymentResponse.ok) {
    throw new Error(
      "Terjadi kesalahan, gagal dalam membuat sesi pembayaran, tolong periksa kembali metode pembayaran yang anda gunakan atau gunakan metode pembayaran yang lain"
    );
  }

  const paymentResponseJson: Transaction = await paymentResponse.json();

  if (paymentResponseJson.transaction_id) {
    await prisma.order.update({
      where: {
        id: newOrder.id,
      },
      data: {
        transactionId: paymentResponseJson.transaction_id,
      },
    });
  } else {
    throw new Error(
      "Terjadi kesalahan, gagal dalam membuat sesi pembayaran, tolong periksa kembali metode pembayaran yang anda gunakan atau gunakan metode pembayaran yang lain"
    );
  }

  return paymentResponseJson as Transaction;
}
