import type { Metadata, Viewport } from "next";
import { Recursive } from "next/font/google";
import { SessionProvider } from "next-auth/react";

import { constructMetadata } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";
import { Providers } from "@/components/Provider";

import "./globals.css";

const font = Recursive({ subsets: ["latin"] });

export const metadata: Metadata = constructMetadata();
export const viewport: Viewport = {
  themeColor: "#ffffff",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <SessionProvider>
        <body
          className={`${font.className} bg-gray-50 grainy-light text-gray-900`}
        >
          <Providers>{children}</Providers>
          <Toaster />
        </body>
      </SessionProvider>
    </html>
  );
}
