import { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";

import { DesignPreview } from "./DesignPreview";

interface PreviewPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const metadata: Metadata = {
  title: "Preview Your Image",
};

export default async function PreviewPage({ searchParams }: PreviewPageProps) {
  const caseOptionId = searchParams?.caseOptionId as string;

  if (!caseOptionId) {
    notFound();
  }

  const caseOption = await prisma.caseOption.findUnique({
    where: {
      id: caseOptionId,
    },
    include: {
      imageConfiguration: true,
      caseColor: true,
      caseModel: true,
      caseFinish: true,
      caseMaterial: true,
    },
  });

  if (!caseOption) {
    notFound();
  }

  return <DesignPreview caseOption={caseOption} />;
}
