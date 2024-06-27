import React, { Suspense } from "react";

import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Suspense>
        <Navbar />
      </Suspense>
      <>{children}</>
      <Footer />
    </>
  );
}
