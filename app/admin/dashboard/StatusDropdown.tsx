"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { Check, ChevronsUpDown } from "lucide-react";
import { ChangeOrderStatus } from "./actions";
import { useRouter } from "next/navigation";

const ORDER_LABEL: Record<keyof typeof OrderStatus, string> = {
  AWAITING_SHIPMENT: "Awaiting Shipment",
  FULLFILLED: "Fullfilled",
  SHIPPED: "Shipped",
};

export function StatusDropdown({
  id,
  orderStatus,
}: {
  id: string;
  orderStatus: OrderStatus;
}) {
  const router = useRouter();

  const { mutate: changeStatus } = useMutation({
    mutationKey: ["change-order-status"],
    mutationFn: ChangeOrderStatus,
    onSuccess: () => {
      router.refresh();
    },
  });

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-52 flex justify-between items-center"
        >
          <>
            {ORDER_LABEL[orderStatus]}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="p-0">
        {Object.keys(OrderStatus).map((status) => (
          <DropdownMenuItem
            key={status}
            className={cn(
              "flex text-sm gap-1 items-center p-2.5 cursor-default hover:bg-zinc-100",
              { "bg-zinc-100": orderStatus === status }
            )}
            onClick={() =>
              changeStatus({ id, newStatus: status as OrderStatus })
            }
          >
            <Check
              className={cn(
                "mr-2 h-2 w-4 text-primary",
                orderStatus === status ? "opacity-100" : "opacity-0"
              )}
            />
            {ORDER_LABEL[status as OrderStatus]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
