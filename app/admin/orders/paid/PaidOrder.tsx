/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { EllipsisVertical, Search } from "lucide-react";

import {
  requestCourierShipping,
  getPaidOrders,
  updateStatusToProcess,
} from "./actions";
import { cn, formatPrice } from "@/lib/utils";
import { ORDER_STATUS_PHRASE } from "@/lib/constants";

import { SectionWrapper } from "@/components/SectionWrapper";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusTags } from "@/components/OrderStatusTags";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";

const tags = [
  {
    name: ORDER_STATUS_PHRASE.PENDING,
    value: "pending",
  },
  {
    name: ORDER_STATUS_PHRASE.PROCESS,
    value: "process",
  },
  {
    name: ORDER_STATUS_PHRASE.AWAITING_SHIPMENT,
    value: "awaiting_shipment",
  },
  {
    name: ORDER_STATUS_PHRASE.SHIPPED,
    value: "shipped",
  },
  {
    name: ORDER_STATUS_PHRASE.FULLFILLED,
    value: "fullfilled",
  },
];

export function Orders() {
  const searchParams = useSearchParams();
  const status = searchParams.get("status") || tags[0].value;
  const [searchTerm, setSearchTerm] = useState("");
  const [openRequestCourierDialog, setOpenRequestCourierDialog] =
    useState(false);

  const {
    data: orders,
    error,
    isPending,
    refetch,
  } = useQuery({
    queryKey: ["paid-orders"],
    queryFn: async () => {
      return await getPaidOrders();
    },
  });

  const filteredOrder = useMemo(() => {
    if (status && orders) {
      return orders
        .filter((order) => order.status.toUpperCase() === status.toUpperCase())
        .filter((order) =>
          order.orderNumber
            .toLowerCase()
            .includes(searchTerm.toLocaleLowerCase())
        );
    }

    return orders;
  }, [orders, status, searchTerm]);

  const handleUpdateStatusToProcess = async (orderId: string) => {
    await updateStatusToProcess(orderId);
    refetch();
  };

  const handleRequestCourierShipping = async (orderId: string) => {
    await requestCourierShipping(orderId);
    refetch();
  };

  if (error) {
    return (
      <SectionWrapper className="px-4 py-10 md:px-20 lg:px-44 xl:px-28">
        <p className="font-medium">{error.message || "Terjadi kesalahan"}</p>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="px-4 py-10 md:px-20 lg:px-44 xl:px-28">
      <div className="mb-10">
        <div className="w-full mb-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold ">Pesanan</h2>
        </div>
        <div className="w-full mb-4">
          <Input
            placeholder="Contoh: ORD-20240101-1"
            className="w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center space-x-4">
          <OrderStatusTags tags={tags} />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-8 justify-center items-center">
        {isPending ? (
          <>
            {new Array(3).fill(0).map((_, index) => (
              <div key={index} className="bg-white shadow-md">
                <div className="flex justify-between items-center border-b border-b-gray-200 p-8">
                  <div>
                    <Skeleton className="h-6 w-24 mb-2" />
                    <div className="flex items-center mt-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24 ml-8" />
                      <Skeleton className="h-4 w-20 ml-4" />
                    </div>
                  </div>
                  <Skeleton className="h-8 w-8" />
                </div>
                <div className="grid grid-cols-1 p-4">
                  {new Array(1).fill(0).map((_, idx) => (
                    <div
                      className={`flex items-start gap-6 p-3 relative ${
                        idx % 2 === 0 ? "border-b border-b-gray-200" : ""
                      }`}
                      key={idx}
                    >
                      <Skeleton className="h-44 w-24" />
                      <div className="flex-1 text-xs relative h-44">
                        <Skeleton className="h-5 w-3/4 mb-4" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="h-4 w-1/2 mb-1" />
                        <Skeleton className="absolute bottom-0 h-4 w-1/4" />
                        <Skeleton className="absolute bottom-0 right-0 h-4 w-1/6" />
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t border-t-gray-200 p-8">
                  <div className="grid gap-4 grid-cols-1 text-sm lg:grid-cols-2">
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="text-xs mt-1">
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                      </div>
                    </div>
                    <div>
                      <Skeleton className="h-5 w-24 mb-2" />
                      <div className="text-xs mt-1">
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-3/4 mb-1" />
                        <Skeleton className="h-4 w-full mb-1" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </>
        ) : (
          <>
            {filteredOrder && filteredOrder.length ? (
              filteredOrder.map((order) => (
                <div key={order.id} className="bg-white shadow-md">
                  <div className="flex justify-between items-center border-b border-b-gray-200 p-4 lg:p-8">
                    <div>
                      <h3 className="font-bold">#{order.orderNumber}</h3>
                      <div className="flex flex-col mt-2 lg:flex-row lg:items-center lg:space-x-8">
                        <p className="text-xs text-muted-foreground">
                          Order Date: {order.createdAt.toLocaleDateString()}
                        </p>
                        <div className="flex mt-4 space-x-2 lg:mt-0">
                          <Badge className="text-xs w-fit">
                            {order.isPaid ? "Sudah Bayar" : "Belum Bayar"}
                          </Badge>
                          <Badge className="text-xs w-fit">
                            {ORDER_STATUS_PHRASE[order.status] || "Pending"}
                          </Badge>
                        </div>
                      </div>
                    </div>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="icon">
                          <EllipsisVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>Lihat Detail</DropdownMenuItem>
                        {order.status === "PENDING" ? (
                          <DropdownMenuItem
                            onClick={() =>
                              handleUpdateStatusToProcess(order.id)
                            }
                          >
                            Proses Pesanan
                          </DropdownMenuItem>
                        ) : null}
                        {order.status === "PROCESS" ? (
                          <DropdownMenuItem
                            onClick={() => setOpenRequestCourierDialog(true)}
                          >
                            Request Pengiriman
                          </DropdownMenuItem>
                        ) : null}
                        <DropdownMenuItem asChild>
                          <a
                            href={`/api/orders/${order.id}/download`}
                            target="_blank"
                          >
                            Unduh File
                          </a>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    <ActionAlertDialog
                      openDialog={openRequestCourierDialog}
                      setOpenDialog={setOpenRequestCourierDialog}
                      title="Anda akan mengirim pesanan ini sekarang?"
                      cancelText="Batal"
                      actionText="Kirim"
                      description="Jasa pengiriman akan segera mengambil barang, ketika anda menyetujui aksi ini."
                      action={() => handleRequestCourierShipping(order.id)}
                    />
                  </div>
                  <div className="grid grid-cols-1 p-4">
                    {order.items.map((item) => (
                      <div
                        className={cn("flex items-start gap-6 p-3 relative", {
                          "odd:border-b odd:border-b-gray-200":
                            order.items.length > 1,
                        })}
                        key={item.id}
                      >
                        <Image
                          src={
                            item.caseOption.imageConfiguration
                              .croppedImageUrl || ""
                          }
                          alt="custom case image"
                          width={87}
                          height={176}
                          className="h-44 w-auto"
                        />
                        <div className="flex-1 text-xs relative h-44">
                          <div className="mb-4">
                            <h3 className="font-bold text-sm">
                              {item.caseOption.caseModel.name} Case
                            </h3>
                          </div>
                          <div>
                            <p className="capitalize">
                              color: {item.caseOption.caseColor.name}
                            </p>
                            <p className="capitalize">
                              material: {item.caseOption.caseMaterial.name}
                            </p>
                            <p className="capitalize">
                              finishing: {item.caseOption.caseFinish.name}
                            </p>
                          </div>
                          <div className="absolute bottom-0 flex items-center justify-between w-full pr-3">
                            <div className="w-full flex justify-between items-center">
                              <p className="font-medium">
                                {formatPrice(
                                  item.caseOption.caseModel.price +
                                    item.caseOption.caseMaterial.price +
                                    item.caseOption.caseFinish.price
                                )}
                              </p>
                              <p>{item.quantity}x</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-t-gray-200 p-4 lg:p-8">
                    <div className="grid gap-4 grid-cols-1 text-sm lg:grid-cols-2">
                      <div>
                        <h3 className="font-bold text-sm">Pembayaran</h3>
                        <div className="text-xs mt-1">
                          <p>
                            <span className="font-medium">Metode Bayar: </span>
                            Bank Transfer
                          </p>
                          <p>
                            <span className="font-medium">Ongkos Kirim: </span>{" "}
                            {formatPrice(order.courierRates)}
                          </p>
                          <p>
                            <span className="font-medium">Total Bayar: </span>
                            {formatPrice(order.amount + order.courierRates)}
                          </p>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-bold text-sm">Pengiriman</h3>
                        <div className="text-xs mt-1">
                          <p>
                            <span className="font-medium">Kurir: </span>
                            <span className="uppercase">
                              {order.courierCompany}
                            </span>
                          </p>
                          <p>Penerima: {order.shippingAddress.contactName}</p>
                          <p>
                            <span className="font-medium">
                              Alamat Pengiriman:{" "}
                            </span>
                            {`${order.shippingAddress.addressDetail}, ${order.shippingAddress.district}, ${order.shippingAddress.city}, ${order.shippingAddress.province}. ${order.shippingAddress.postalCode}`}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center font-medium">Belum ada pesanan!</p>
            )}
          </>
        )}
      </div>
    </SectionWrapper>
  );
}
