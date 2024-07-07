import React, { Suspense } from "react";

import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

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
