import { Metadata } from "next";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/db";

import { DesignConfigurator } from "./DesignConfigurator";

interface DesignPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export const metadata: Metadata = {
  title: "Customize Image",
};

export default async function DesignPage({ searchParams }: DesignPageProps) {
  const imageConfigId = searchParams?.imageConfigId as string;

  if (!imageConfigId) {
    notFound();
  }

  const imageConfiguration = await prisma.imageConfiguration.findUnique({
    where: {
      id: imageConfigId,
    },
  });

  if (!imageConfiguration) {
    notFound();
  }

  const caseModels = await prisma.caseModel.findMany({
    include: { caseColors: true, caseMaterials: true, caseFinishes: true },
  });

  return (
    <DesignConfigurator
      imageConfigId={imageConfigId}
      imageConfigUrl={imageConfiguration.url}
      imageConfigDimension={{
        width: imageConfiguration.width,
        height: imageConfiguration.height,
      }}
      caseModels={caseModels}
    />
  );
}
