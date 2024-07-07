import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import getSession from "@/lib/getSession";

import { AddCaseModel } from "./AddCaseModel";

export default async function AddCaseListPage() {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/admin/lists/add`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  return <AddCaseModel />;
}
