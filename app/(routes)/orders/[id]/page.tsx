import { SectionWrapper } from "@/components/SectionWrapper";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ORDER_STATUS_PHRASE } from "@/lib/constants";
import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { cn, formatPrice } from "@/lib/utils";
import { TrackingData } from "./type";

export default async function OrderDetailPage({
  params,
}: {
  params: { id: string };
}) {
  if (!params.id) {
    notFound();
  }

  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/orders`);

  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
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
              imageConfiguration: true,
              caseModel: true,
              caseColor: true,
              caseMaterial: true,
              caseFinish: true,
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

  if (findOrder.trackingId) {
    const response = await fetch(
      `${process.env.BITESHIP_BASE_URL!}/v1/trackings/${findOrder.trackingId}`
    );

    trackingData = await response.json();
  }

  return (
    <SectionWrapper className="px-4 py-10 md:px-20 lg:px-44 xl:px-28 min-h-screen bg-white">
      <div key={findOrder.id}>
        <div className="flex justify-between items-center border-b border-b-gray-200 p-4 lg:p-8">
          <div>
            <h3 className="font-bold">#{findOrder.orderNumber}</h3>
            <div className="flex flex-col mt-2 lg:flex-row lg:items-center lg:space-x-8">
              <p className="text-xs text-muted-foreground">
                Order Date: {findOrder.createdAt.toLocaleDateString()}
              </p>
              <div className="flex mt-4 space-x-2 lg:mt-0">
                <Badge
                  className="text-xs w-fit"
                  variant={findOrder.isPaid ? "default" : "destructive"}
                >
                  {findOrder.isPaid ? "Sudah Bayar" : "Belum Bayar"}
                </Badge>
                <Badge
                  className="text-xs w-fit"
                  variant={findOrder.isPaid ? "default" : "destructive"}
                >
                  {ORDER_STATUS_PHRASE[findOrder.status] || "Pending"}
                </Badge>
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
              <h3 className="font-bold text-sm">Pengiriman</h3>
              <div className="text-xs mt-1">
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
        </div>
      </div>
      {trackingData ? (
        <div className="mt-8 p-4 lg:p-8">
          <h2 className="font-bold text-lg">Perjalanan Paket</h2>
          <div>
            <div className="relative border-l-2 border-gray-200 pl-4">
              {trackingData
                ? trackingData?.history.map((item, index) => (
                    <div key={index} className="mb-8 relative">
                      <div className="absolute -left-3.5 top-1 w-7 h-7 bg-white border-2 border-gray-200 rounded-full flex items-center justify-center">
                        <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(item.updated_at).toLocaleDateString("id-ID")}
                      </div>
                      <div className="mt-2">
                        <p className="text-lg">{item.note}</p>
                        {item.status === "delivered" && (
                          <div className="mt-2">
                            <p>
                              <strong>Courier Service:</strong>{" "}
                              {trackingData.courier.company},{" "}
                              {trackingData.courier.driver_name}
                            </p>
                            <p>
                              <strong>Estimated Delivery Date:</strong>{" "}
                              {new Date(item.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                      <div className="mt-2">
                        <a
                          href={trackingData.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:underline"
                        >
                          See Details
                        </a>
                      </div>
                    </div>
                  ))
                : null}
            </div>
          </div>
        </div>
      ) : null}
    </SectionWrapper>
  );
}
