import { Metadata } from "next";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const baseUrl = process.env.NEXT_PUBLIC_SERVER_URL!;

export function constructMetadata({
  title = "Owlcase",
  description = "Buat custom case berkualitas tinggi dengan Owlcase. Desain case unik dan personal untuk smartphone Anda.",
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
