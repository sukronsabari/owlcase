import Image from "next/image";
import { notFound } from "next/navigation";

import { ORDER_STATUS_PHRASE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { cn, formatPrice } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SectionWrapper } from "@/components/SectionWrapper";

import { TrackingList } from "./TrackingList";
import { TrackingData } from "./type";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  const findOrder = await prisma.order.findUnique({
    where: {
      id: params.id,
    },
    include: {
      items: {
        include: {
          caseOption: {
            include: {
              caseModel: true,
              caseColor: true,
              caseMaterial: true,
              caseFinish: true,
              imageConfiguration: true,
            },
          },
        },
      },
      shippingAddress: true,
    },
  });

  if (!findOrder) {
    notFound();
  }

  let trackingData: TrackingData | null = null;

  if (findOrder?.trackingId) {
    const response = await fetch(
      `${process.env.BITESHIP_BASE_URL!}/v1/trackings/${findOrder.trackingId}`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: process.env.BITESHIP_API_KEY!,
        },
        cache: "no-store",
      }
    );

    trackingData = (await response.json()) as TrackingData;
    console.log(trackingData);
  }

  return (
    <SectionWrapper className="px-4 py-10 md:px-20 lg:px-44 xl:px-28 min-h-screen">
      <div className="bg-white">
        <div className="flex justify-between items-center border-b border-b-gray-200 p-4 lg:p-8">
          <div>
            <h3 className="font-bold">#{findOrder.orderNumber}</h3>
            <div className="flex flex-col mt-2 lg:flex-row lg:items-center lg:space-x-8">
              <p className="text-xs text-muted-foreground">
                Order Date: {findOrder.createdAt.toLocaleDateString()}
              </p>
              <div className="flex mt-4 space-x-2 lg:mt-0">
                {findOrder.status !== "FAILURE" ? (
                  <Badge
                    className="text-xs w-fit"
                    variant={findOrder.isPaid ? "default" : "destructive"}
                  >
                    {findOrder.isPaid ? "Sudah Bayar" : "Belum Bayar"}
                  </Badge>
                ) : null}
                {findOrder.isPaid ? (
                  <Badge
                    className="text-xs w-fit"
                    variant={findOrder.isPaid ? "default" : "destructive"}
                  >
                    {ORDER_STATUS_PHRASE[findOrder.status] || "Pending"}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 p-4">
          {findOrder.items.map((item) => (
            <div
              className={cn("flex items-start gap-6 p-3 relative", {
                "odd:border-b odd:border-b-gray-200":
                  findOrder.items.length > 1,
              })}
              key={item.id}
            >
              <Image
                src={item.caseOption.imageConfiguration.croppedImageUrl || ""}
                alt="custom case image"
                width={87}
                height={176}
                className="h-44 w-auto"
              />
              <div className="flex-1 relative h-44">
                <div className="mb-4">
                  <h3 className="font-bold">
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
          <div className="grid gap-8 grid-cols-1 lg:grid-cols-2">
            <div>
              <h3 className="font-bold">Pembayaran</h3>
              <div className="mt-1">
                <p className="capitalize">
                  <span className="font-medium">Metode Bayar: </span>
                  {findOrder.paymentMethod === "gopay"
                    ? "Gopay/Qris"
                    : findOrder.paymentMethod}
                </p>
                <p>
                  <span className="font-medium">Ongkos Kirim: </span>{" "}
                  {formatPrice(findOrder.courierRates)}
                </p>
                <p>
                  <span className="font-medium">Total Bayar: </span>
                  {formatPrice(findOrder.amount + findOrder.courierRates)}
                </p>
              </div>
            </div>
            <div>
              <h3 className="font-bold">Pengiriman</h3>
              <div className="mt-1">
                <p>
                  <span className="font-medium">Kurir: </span>
                  <span className="uppercase">{findOrder.courierCompany}</span>
                </p>
                <p>Penerima: {findOrder.shippingAddress.contactName}</p>
                <p>
                  <span className="font-medium">Alamat Pengiriman: </span>
                  {`${findOrder.shippingAddress.addressDetail}, ${findOrder.shippingAddress.district}, ${findOrder.shippingAddress.city}, ${findOrder.shippingAddress.province}. ${findOrder.shippingAddress.postalCode}`}
                </p>
              </div>
            </div>
          </div>
          <div className="mt-8">
            <h3 className="font-bold">Perjalanan Paket</h3>
            <div className="mt-8">
              <TrackingList trackingData={trackingData} />
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
