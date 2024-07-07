import { Phone } from "@/components/Phone";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import { formatPrice } from "@/lib/utils";
import Image from "next/image";
import { redirect } from "next/navigation";
import { Orders } from "./Orders";

export default async function OrderListPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/orders`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  return <Orders />;
}
