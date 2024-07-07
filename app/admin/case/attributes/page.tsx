import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";

import { CaseAttribute } from "./CaseAttribute";

export default async function CaseAttributePage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/case/attributes`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  const caseColors = await prisma.caseColor.findMany({});
  const caseMaterials = await prisma.caseMaterial.findMany({});
  const caseFinishes = await prisma.caseFinish.findMany({});

  return (
    <CaseAttribute
      caseColors={caseColors}
      caseMaterials={caseMaterials}
      caseFinishes={caseFinishes}
    />
  );
}
