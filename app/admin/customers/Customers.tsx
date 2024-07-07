"use client";

import { SectionWrapper } from "@/components/SectionWrapper";

import { columns } from "./columns";
import { DataTable } from "./data-table";

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
