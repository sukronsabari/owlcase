"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import BcaImg from "@/public/images/banks/bca.png";
import BniImg from "@/public/images/banks/bni.png";
import BriImg from "@/public/images/banks/bri.png";
import CimbImg from "@/public/images/banks/cimb.png";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/SectionWrapper";

import { TransactionStatus } from "./type";

interface TimeLeft {
  hours: number;
  minutes: number;
  seconds: number;
}

const banks = [
  {
    name: "bri",
    img: BriImg,
    contentList: `
      <li>Buka aplikasi BRI Mobile atau masuk ke internet banking BRI.</li>
      <li>Pilih menu "Pembayaran" dan kemudian pilih "BRIVA".</li>
      <li>Masukkan nomor Virtual Account BRI dan jumlah pembayaran.</li>
      <li>Konfirmasi detail pembayaran dan selesaikan transaksi.</li>
    `,
  },
  {
    name: "bca",
    img: BcaImg,
    contentList: `
      <li>Buka aplikasi BCA Mobile atau masuk ke KlikBCA.</li>
      <li>Pilih menu "m-Transfer" dan kemudian pilih "BCA Virtual Account".</li>
      <li>Masukkan nomor Virtual Account BCA dan jumlah pembayaran.</li>
      <li>Konfirmasi detail pembayaran dan selesaikan transaksi.</li>
    `,
  },
  {
    name: "bni",
    img: BniImg,
    contentList: `
      <li>Buka aplikasi BNI Mobile atau masuk ke internet banking BNI.</li>
      <li>Pilih menu "Transfer" dan kemudian pilih "Virtual Account Billing".</li>
      <li>Masukkan nomor Virtual Account BNI dan jumlah pembayaran.</li>
      <li>Konfirmasi detail pembayaran dan selesaikan transaksi.</li>
    `,
  },
  {
    name: "cimb",
    img: CimbImg,
    contentList: `
      <li>Buka aplikasi CIMB Clicks atau masuk ke internet banking CIMB.</li>
      <li>Pilih menu "Pembayaran" dan kemudian pilih "Virtual Account".</li>
      <li>Masukkan nomor Virtual Account CIMB dan jumlah pembayaran.</li>
      <li>Konfirmasi detail pembayaran dan selesaikan transaksi.</li>
    `,
  },
] as const;

const convertWibToUnixTimestamp = (timeString: string) => {
  const [date, time] = timeString.split(" ");
  const [year, month, day] = date.split("-").map(Number);
  const [hours, minutes, seconds] = time.split(":").map(Number);

  // Membuat objek Date dengan waktu WIB
  const wibDate = new Date(
    Date.UTC(year, month - 1, day, hours - 7, minutes, seconds)
  );

  return wibDate.getTime();
};

export function Payment({
  transactionStatus,
}: {
  transactionStatus: TransactionStatus;
}) {
  const bank =
    transactionStatus.va_numbers?.length &&
    transactionStatus.payment_type === "bank_transfer"
      ? banks.find(
          (bank) => bank.name === transactionStatus!.va_numbers![0].bank
        )
      : undefined;

  const expiryTime = transactionStatus.expiry_time; // GMT+7

  const calculateTimeLeft = useCallback(() => {
    const expiryDate = convertWibToUnixTimestamp(expiryTime);
    const currentDate = new Date().getTime();
    const difference = expiryDate - currentDate;

    let timeLeft = {
      hours: 0,
      minutes: 0,
      seconds: 0,
    } as TimeLeft;

    if (difference > 0) {
      timeLeft = {
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return timeLeft;
  }, [expiryTime]);

  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

  useEffect(() => {
    if (
      timeLeft.hours === 0 &&
      timeLeft.minutes === 0 &&
      timeLeft.seconds === 0
    ) {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [calculateTimeLeft, timeLeft]);

  const formatTime = (time: TimeLeft) => {
    return `${time?.hours?.toString().padStart(2, "0")}:${time.minutes
      ?.toString()
      .padStart(2, "0")}:${time.seconds?.toString().padStart(2, "0")}`;
  };

  if (transactionStatus.transaction_status === "pending") {
    if (!timeLeft.hours && !timeLeft.minutes && !timeLeft.seconds) {
      return (
        <SectionWrapper className="min-h-screen max-w-3xl py-14">
          <p className="font-medium text-center">
            Sesi Pembayaran Berakhir, Anda tidak bisa melanjutkan pembayaran
          </p>
        </SectionWrapper>
      );
    }

    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <div className="bg-white p-4 shadow-md">
          <h2 className="font-bold mb-1">Pembayaran</h2>
          <div className="flex justify-between items-center">
            <p>Jumlah Pembayaran</p>
            <p>{formatPrice(Number(transactionStatus.gross_amount))}</p>
          </div>
          <div className="flex justify-between items-center">
            <div>Pembayaran Dalam</div>
            <p suppressHydrationWarning>{formatTime(timeLeft)}</p>
          </div>
        </div>
        {transactionStatus.payment_type === "bank_transfer" && bank ? (
          <div className="bg-white p-6 shadow-md mt-8">
            <div className="mb-3">
              <Image
                width={150}
                height={100}
                src={bank?.img || ""}
                alt="bank image"
              />
            </div>
            <div className="ml-8 pt-3 border-t border-t-gray-200">
              <p className="text-xs">No. Rekening Virtual: </p>
              <div className="flex justify-between items-center">
                {transactionStatus!.va_numbers![0]!.va_number}
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-teal-600 hover:text-teal-600"
                >
                  SALIN
                </Button>
              </div>
            </div>
            <div className="mt-8 ml-4 text-sm">
              <h3 className="font-medium">Panduan Pembayaran:</h3>
              <ol
                className="list-decimal pl-5"
                dangerouslySetInnerHTML={{ __html: bank!.contentList }}
              ></ol>
            </div>
          </div>
        ) : null}

        {transactionStatus.payment_type === "gopay" ? (
          <div className="bg-white p-8 shadow-md mt-8">
            <div className="flex justify-center">
              <Image
                width={200}
                height={200}
                src={`https://api.sandbox.midtrans.com/v2/gopay/${transactionStatus.transaction_id}/qr-code`}
                alt="qr code pembayaran"
                className="text-center"
                priority
              />
            </div>
            <div className="mt-8 text-sm">
              <h3 className="font-bold text-center mb-2">Panduan Pembayaran</h3>
              <ol className="list-decimal pl-5">
                <li>
                  Buka aplikasi pembayaran yang mendukung QRIS (contoh: Gopay,
                  OVO, DANA, LinkAja, dsb.).
                </li>
                <li>
                  Pilih menu &quot;Scan&quot; atau &quot;Pindai&quot; di
                  aplikasi.
                </li>
                <li>Arahkan kamera ke kode QRIS yang ditampilkan.</li>
                <li>Periksa dan konfirmasi detail pembayaran Anda.</li>
                <li>
                  Masukkan PIN atau autentikasi sesuai dengan aplikasi yang
                  digunakan untuk menyelesaikan pembayaran.
                </li>
              </ol>
            </div>
          </div>
        ) : null}
      </SectionWrapper>
    );
  }

  if (
    transactionStatus.transaction_status === "partial_refund" ||
    transactionStatus.transaction_status === "refund"
  ) {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">Payment Refund</h2>
        <p className="text-center font-medium mt-1">
          Transaksi tidak dapat dilakukan, pengembalian dana akan dilakukan
          (refund). Jika anda belum menerima pengembalian dana, segera hubungi
          admin
        </p>
      </SectionWrapper>
    );
  }

  if (transactionStatus.transaction_status === "deny") {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">Payment Deny</h2>
        <p className="text-center font-medium mt-1">
          Transaksi tidak dapat dilakukan, pembayaran anda ditolak, segera
          hubungi admin jika terdapat kendala.
        </p>
      </SectionWrapper>
    );
  }

  if (transactionStatus.transaction_status === "deny") {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">Payment Deny</h2>
        <p className="text-center font-medium mt-1">
          Transaksi tidak dapat dilakukan, pembayaran anda ditolak, segera
          hubungi admin jika terdapat kendala.
        </p>
      </SectionWrapper>
    );
  }

  if (transactionStatus.transaction_status === "expire") {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">Payment Expire</h2>
        <p className="text-center font-medium mt-1">
          Sesi Pembayaran Berakhir, Anda tidak bisa melanjutkan pembayaran
        </p>
      </SectionWrapper>
    );
  }

  if (
    transactionStatus.transaction_status === "capture" ||
    transactionStatus.transaction_status === "settlement"
  ) {
    return (
      <SectionWrapper className="min-h-screen max-w-3xl py-14">
        <h2 className="text-center font-bold text-5xl">Payment Success</h2>
        <p className="text-center font-medium mt-1">
          Pembayaran anda berhasil, anda bisa melihat pesanan anda di menu{" "}
          <Link
            href="/orders?status=pending"
            className="text-teal-600 underline"
          >
            Pesanan Saya
          </Link>
        </p>
      </SectionWrapper>
    );
  }
}
