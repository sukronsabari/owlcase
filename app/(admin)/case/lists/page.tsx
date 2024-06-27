import { prisma } from "@/lib/db";
import { CaseList } from "./CaseList";
import getSession from "@/lib/getSession";
import { redirect, notFound } from "next/navigation";
import { UserRole } from "@prisma/client";

export default async function CaseModelPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/dashboard`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  const [caseColors, caseMaterials, caseFinishes] = await Promise.all([
    prisma.caseColor.findMany({}),
    prisma.caseMaterial.findMany({}),
    prisma.caseFinish.findMany({}),
  ]);

  return (
    <CaseList
      caseColors={caseColors}
      caseMaterials={caseMaterials}
      caseFinishes={caseFinishes}
    />
  );
}
