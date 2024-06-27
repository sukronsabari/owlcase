import React from "react";
import { SectionWrapper } from "@/components/SectionWrapper";

export default function AuthLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <div className="flex flex-col">{children}</div>
    </>
  );
}
