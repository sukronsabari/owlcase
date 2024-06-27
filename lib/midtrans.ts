"use server";

export async function bankTransferCharge() {
  const requestBody = {
    "payment-type": "bank_transfer",
  };
}

export async function eWalletCharge() {
  const requestBody = {
    payment_type: "gopay",
    transaction_details: {
      gross_amount: 12145,
      order_id: "test-transaction-54321",
    },
    gopay: {
      enable_callback: true, // optional
      callback_url: "someapps://callback", // optional
    },
  };

  const response = await fetch(process.env.MIDTRANS_CHARGE_URL!, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization:
        "Basic " +
        Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
    },
  });
}
