import { Phone } from "@/components/Phone";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/db";
import getSession from "@/lib/getSession";
import Image from "next/image";
import { redirect } from "next/navigation";

export default async function OrderListPage() {
  const session = await getSession();

  const callbackUrl = encodeURIComponent(`/dashboard`);
  if (!session?.user.id) {
    redirect(`/?callbackUrl=${callbackUrl}`);
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: session.user.id,
      isPaid: true,
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
    },
  });

  return (
    <SectionWrapper className="min-h-screen py-8">
      <>
        <div className="w-full max-w-[600px] mx-auto mb-8">
          <h2 className="font-bold text-2xl text-center">Pesanan Anda</h2>
        </div>
        <div className="flex flex-wrap gap-8 justify-center items-center">
          {orders && orders.length ? (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white shadow-md p-4 w-full max-w-[600px]"
              >
                <div className="flex justify-between items-center">
                  <h3 className="font-bold">Order ID: {order.id}</h3>
                  <Button variant="outline" size="sm">
                    Lacak
                  </Button>
                </div>

                <p className="mb-6">
                  Tanggal Order: {order.createdAt.toLocaleDateString()}
                </p>
                {order.items.map((item) => (
                  <div
                    className="flex items-start gap-6 border border-gray-300 p-3 relative"
                    key={item.id}
                  >
                    <div className="bg-gray-100 p-6 rounded-sm h-36 w-[70.5px] relative">
                      <Image
                        src={
                          item.caseOption.imageConfiguration.croppedImageUrl ||
                          ""
                        }
                        fill
                        className="min-h-full min-w-full"
                        alt="your custom image"
                      />
                    </div>
                    <div className="flex-1 text-xs relative h-36">
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
                    </div>
                  </div>
                ))}
              </div>
            ))
          ) : (
            <p className="text-center font-medium">
              Belum ada pesanan yang dibayar, pesan sekarang!
            </p>
          )}
        </div>
      </>
    </SectionWrapper>
  );
}
