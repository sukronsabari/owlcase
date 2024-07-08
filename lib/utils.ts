import { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!;

export function constructMetadata({
  title = "Owlcase | Buat Custom Case Dengan Mudah",
  description = "Buat custom case berkualitas tinggi untuk smartphone Anda dengan mudah. Desain case unik dan personal dengan gambar atau teks pilihan Anda. Pilih dari berbagai jenis case seperti hard case, soft case, dan flip case. Unggah desain Anda sendiri atau pilih dari berbagai template menarik kami. Buat case dengan kualitas terbaik dan tampil beda dengan Owlcase.",
  image = "/images/thumbnail.png",
  icons = "/favicon.ico",
}: {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
} = {}): Metadata {
  return {
    title: {
      default: title,
      template: `%s | Owlcase`,
    },
    keywords: [
      "custom case",
      "customcase",
      "custom phone case",
      "buat custom case",
      "beli custom case",
      "owlcase",
      "desain custom case",
      "phone case",
      "casing hp",
      "case hp",
    ],
    description,
    openGraph: {
      title,
      description,
      url: baseUrl,
      siteName: "Owlcase",
      images: [{ url: `${baseUrl}/${image}` }],
      locale: "id_ID",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
      creator: "@sukronsabari",
    },
    icons,
    metadataBase: new URL("https://owlcase.sukronsabari.cloud"),
  };
}

export const formatPrice = (priceInIdr: number) => {
  const formatter = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });

  return formatter.format(priceInIdr);
};

export const base64ToBlob = (base64: string, mimetype: string) => {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type: mimetype });
};

export function generateQrCodeUrl(transactionId: string) {
  return `https://api.sandbox.veritrans.co.id/v2/gopay/${transactionId}/qr-code`;
}
