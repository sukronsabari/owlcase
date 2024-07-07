"use client";

import type { User } from "@prisma/client";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { SectionWrapper } from "@/components/SectionWrapper";

export function Customers({
  customerData,
}: {
  customerData: {
    id: string;
    name: string;
    email: string;
    orderTotal: number;
  }[];
}) {
  return (
    <SectionWrapper className="py-10">
      <div className="mb-4">
        <h2 className="font-bold text-2xl">Customers</h2>
      </div>
      <DataTable columns={columns} data={customerData} />
    </SectionWrapper>
  );
}
