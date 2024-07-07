import { ReactNode, Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { UserRole } from "@prisma/client";

import getSession from "@/lib/getSession";

import { Navbar } from "./Navbar";
import { SideBar } from "./Sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const callbackUrl = encodeURIComponent(`/?callbackUrl=/dashboard`);

  if (!session?.user.id) {
    redirect(callbackUrl);
  }

  if (session.user.role !== UserRole.ADMIN) {
    return notFound();
  }

  return (
    <>
      <Suspense>
        <SideBar />
      </Suspense>
      <div className="min-h-screen transition-all ease-in-out duration-200 xl:ml-56">
        <Suspense>
          <Navbar />
        </Suspense>
        {children}
      </div>
    </>
  );
}
