import React from "react";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Steps } from "./Steps";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SectionWrapper className="flex-1 flex flex-col">
        <Steps />
        {children}
      </SectionWrapper>
    </>
  );
}
