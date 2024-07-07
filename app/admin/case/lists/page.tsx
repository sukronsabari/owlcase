import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";

import { CaseList } from "./CaseList";

export default async function CaseModelPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/case/lists`);

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
