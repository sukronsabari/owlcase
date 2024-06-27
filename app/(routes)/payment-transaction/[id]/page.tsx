import { notFound } from "next/navigation";
import getSession from "@/lib/getSession";
import { SectionWrapper } from "@/components/SectionWrapper";
import { TransactionStatus } from "./type";
import { Payment } from "./Payment";
import { Suspense } from "react";

export default async function PaymentTransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getSession();

  if (!session?.user.id) {
    notFound();
  }

  if (!params.id) {
    notFound();
  }

  const response = await fetch(
    `${process.env.MIDTRANS_BASE_URL!}/${params.id}/status`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization:
          "Basic " +
          Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
      },
    }
  );

  const transactionStatus = (await response.json()) as TransactionStatus;

  if (!response.ok || !transactionStatus.transaction_id) {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">404</h2>
        <p className="text-center font-medium mt-1">
          Transaksi tidak ditemukan
        </p>
      </SectionWrapper>
    );
  }

  return (
    <Suspense>
      <Payment transactionStatus={transactionStatus} />
    </Suspense>
  );
}
