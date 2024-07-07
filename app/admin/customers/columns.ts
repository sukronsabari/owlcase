"use client";

import { ColumnDef } from "@tanstack/react-table";

export type User = {
  id: string;
  name: string;
  email: string;
  orderTotal: number;
};

export const columns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "id",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "orderTotal",
    header: "Order Total",
  },
];
