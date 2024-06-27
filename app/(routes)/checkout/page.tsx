"use client";

import {
  useState,
  useTransition,
  useSyncExternalStore,
  useEffect,
} from "react";
import Image from "next/image";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

import BriImg from "@/public/images/banks/bri.png";
import BcaImg from "@/public/images/banks/bca.png";
import BniImg from "@/public/images/banks/bni.png";
import CimbImg from "@/public/images/banks/cimb.png";
import QrisImg from "@/public/images/banks/qris.png";

import JneImg from "@/public/images/couriers/jne.png";
import JntImg from "@/public/images/couriers/jnt.png";
import SicepatImg from "@/public/images/couriers/sicepat.png";
import AnterajaImg from "@/public/images/couriers/anteraja.png";
import DefaultCourierImg from "@/public/images/couriers/default.png";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn, formatPrice } from "@/lib/utils";
import { SectionWrapper } from "@/components/SectionWrapper";

import type {
  CaseModel,
  CaseColor,
  CaseMaterial,
  CaseFinish,
  ImageConfiguration,
  CaseOption,
  CartItem,
  Cart,
} from "@prisma/client";
import { CheckoutItem, useCheckoutStore } from "@/stores";
import { useShallow } from "zustand/react/shallow";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/Spinner";
import Link from "next/link";
import { Phone } from "@/components/Phone";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  createOrder,
  getAddresses,
  getCaseOptions,
  getCourierPricing,
} from "./actions";
import { Plus } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Pricing } from "./types";

const banks = [
  {
    payment_type: "bank_transfer",
    name: "bri",
    img: BriImg,
  },
  {
    payment_type: "bank_transfer",
    name: "bca",
    img: BcaImg,
  },
  {
    payment_type: "bank_transfer",
    name: "bni",
    img: BniImg,
  },
  {
    payment_type: "bank_transfer",
    name: "cimb",
    img: CimbImg,
  },
] as const;

const ewallet = [
  {
    payment_type: "gopay",
    name: "qris/gopay",
    img: QrisImg,
  },
] as const;

const courierImgs = [
  {
    name: "jne",
    img: JneImg,
  },
  {
    name: "jnt",
    img: JntImg,
  },
  {
    name: "sicepat",
    img: SicepatImg,
  },
  {
    name: "anteraja",
    img: AnterajaImg,
  },
] as const;

export default function CheckoutPage() {
  const session = useSession();
  const router = useRouter();
  const user = session?.data?.user;

  const callbackUrl = encodeURIComponent("/checkout");
  if (!user && session.status !== "loading") {
    router.push(`/?callbackUrl=${callbackUrl}`);
  }

  const checkoutItems = useCheckoutStore((state) => state.checkoutItems);
  const replaceCheckoutItems = useCheckoutStore(
    useShallow((state) => state.replaceCheckoutItems)
  );

  let subtotalPrice = 0;

  const [openPaymentDialog, setOpenPaymentDialog] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<
    (typeof banks)[number] | (typeof ewallet)[number]
  >(ewallet[0]);
  const [selectedAddress, setSelectedAddress] = useState<string | null>(null);
  const [selectedCourier, setSelectedCourier] = useState<{
    price: number;
    courierCompany: string;
    courierType: string;
    courierInsurance: number;
    deliveryType: "now" | "scheduled" | "later";
  } | null>(null);

  const [courierPricing, setCourierPricing] = useState<Pricing[]>([]);
  const [isFetchingCourierPricing, setIsFetchingCourierPricing] =
    useState(false);

  const {
    data: caseOptions,
    isLoading: isLoadAddress,
    refetch,
  } = useQuery({
    queryKey: ["checkout-items", checkoutItems],
    queryFn: async ({ queryKey }) => {
      const [, checkoutItemsQuery] = queryKey;
      if (!checkoutItemsQuery || !checkoutItemsQuery.length) return [];
      return await getCaseOptions(
        (checkoutItemsQuery as CheckoutItem[]).map((item) => item.caseOptionId)
      );
    },
    enabled: checkoutItems && checkoutItems.length > 0,
  });

  const { data: addresses } = useQuery({
    queryKey: ["addresses"],
    queryFn: async () => await getAddresses(),
  });

  const { mutate: handleCreateOrder, isPending } = useMutation({
    mutationKey: ["create-order"],
    mutationFn: async () => {
      if (selectedAddress && selectedCourier && checkoutItems?.length) {
        return await createOrder({
          payment: {
            paymentType: selectedPayment.payment_type,
            bankName: selectedPayment.name,
          },
          addressId: selectedAddress!,
          checkoutItems,
          courier: {
            courierCompany: selectedCourier!.courierCompany!,
            courierInsurance: selectedCourier!.courierInsurance,
            courierType: selectedCourier!.courierType,
            deliveryType: selectedCourier!.deliveryType,
          },
        });
      }
    },
    onSuccess: (data, _, __) => {
      if (data) {
        router.push(`/payment-transaction/${data.transaction_id}`);
      }
    },
  });

  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "cart-items") {
        const newState = JSON.parse(event.newValue || "[]");
        const newCheckoutItems = newState?.state?.checkoutItems || [];

        replaceCheckoutItems(newCheckoutItems);
        refetch();
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [checkoutItems, refetch, replaceCheckoutItems]);

  useEffect(() => {
    if (selectedAddress && selectedAddress && checkoutItems?.length) {
      const fetchCourierPricing = async () => {
        setIsFetchingCourierPricing(true);
        const pricing = await getCourierPricing({
          addressId: selectedAddress!,
          checkoutItems,
        });

        setCourierPricing(pricing);
        setIsFetchingCourierPricing(false);
      };

      fetchCourierPricing();
    }
  }, [checkoutItems, selectedAddress]);

  useEffect(() => {
    if (addresses && addresses.length) {
      const mainAddress = addresses.find((address) => address.isMainAddress);

      if (mainAddress) {
        setSelectedAddress((prevAddress) =>
          prevAddress ? prevAddress : mainAddress.id
        );
      }
    }
  }, [addresses]);

  useEffect(() => {
    if (courierPricing.length) {
      setSelectedCourier({
        price: courierPricing[0].price,
        courierCompany: courierPricing[0].company,
        courierInsurance: 0,
        courierType: courierPricing[0].type,
        deliveryType: "now",
      });
    }
  }, [courierPricing]);

  if (session.status === "loading" || isLoadAddress) {
    return (
      <SectionWrapper className="min-h-screen py-16">
        <div className="flex justify-center">
          <Spinner className="text-gray-900 w-10 h-10" />
        </div>
      </SectionWrapper>
    );
  }

  if (!checkoutItems.length || !caseOptions?.length) {
    return (
      <SectionWrapper className="min-h-screen py-14">
        <div className="flex flex-col items-center gap-6">
          <div className="w-20 h-20 overflow-hidden">
            <Image
              src="/images/owl/owl-3.svg"
              width={80}
              height={80}
              alt="image"
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-center text-xl">
              Anda belum checkout barang
            </h2>
            <p className="text-center font-medium">
              Tolong checkout barang terlebih dahulu!
            </p>
            <div className="mt-4 text-center">
              <Button variant="outline" size="sm" asChild>
                <Link href="/configure/upload">Buat case sekarang</Link>
              </Button>
            </div>
          </div>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="grid grid-cols-1 lg:grid-cols-2 h-full min-h-screen">
        <div className="bg-gray-100 grainy-light max-h-[400px] p-8 flex flex-col lg:max-h-screen">
          <ScrollArea className="relative flex-1">
            <div className="w-full flex flex-wrap gap-8 justify-center">
              {caseOptions && caseOptions.length
                ? caseOptions?.map((caseOption) => {
                    const { caseModel, caseMaterial, caseFinish } = caseOption;
                    const price =
                      caseModel.price + caseMaterial.price + caseFinish.price;
                    const checkoutItem = checkoutItems.find(
                      (item) => caseOption.id === item.caseOptionId
                    );
                    if (!checkoutItem) return;
                    subtotalPrice += price * checkoutItem.quantity;

                    return (
                      <div
                        className="flex w-full items-start gap-6 border border-gray-300 bg-white p-3 relative max-w-[600px]"
                        key={caseOption.id}
                      >
                        <div className="bg-gray-100 p-6 rounded-sm h-44">
                          <Phone
                            imgSrc={
                              caseOption.imageConfiguration!.croppedImageUrl!
                            }
                            style={{
                              backgroundColor: caseOption.caseColor.hex,
                            }}
                            className="w-14"
                          />
                        </div>
                        <div className="flex-1 text-xs relative h-44">
                          <div className="mb-4">
                            <h3 className="font-bold text-sm">
                              {caseOption.caseModel.name} Case
                            </h3>
                          </div>
                          <div>
                            <p className="capitalize">
                              warna: {caseOption.caseColor.name}
                            </p>
                            <p className="capitalize">
                              material: {caseOption.caseMaterial.name}
                            </p>
                            <p className="capitalize">
                              finishing: {caseOption.caseFinish.name}
                            </p>
                          </div>

                          <div className="absolute bottom-0 flex items-center justify-between w-full pr-3">
                            <div className="w-full flex justify-between items-center">
                              <p className="font-medium">
                                {formatPrice(price)}
                              </p>
                              <p>{checkoutItem!.quantity}x</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                : null}
            </div>
          </ScrollArea>
        </div>
        <div className="bg-white px-4 py-6 lg:px-8 pb-20">
          <div className="max-w-3xl mx-auto">
            <h2 className="font-medium mb-3">Metode Pembayaran</h2>
            <div>
              <Tabs defaultValue="e-wallet">
                <TabsList className="flex w-fit bg-gray-100">
                  <TabsTrigger value="e-wallet">E-Wallet</TabsTrigger>
                  <TabsTrigger value="bank-transfer">Bank Transfer</TabsTrigger>
                </TabsList>
                <TabsContent value="bank-transfer">
                  <div className="flex flex-wrap gap-4 w-full pt-4">
                    {banks.map((bank) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={bank.name}
                      >
                        <Button
                          variant="outline"
                          className={cn(
                            "rounded-none h-20 border border-gray-100 hover:bg-transparent",
                            {
                              "border-teal-600": bank === selectedPayment,
                            }
                          )}
                          onClick={() => setSelectedPayment(bank)}
                        >
                          <Image
                            src={bank.img}
                            alt="bank bri image"
                            className="w-full h-full"
                          />
                        </Button>
                        <span className="uppercase text-xs font-medium mt-1">
                          Bank {bank.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value="e-wallet">
                  <div className="flex flex-wrap gap-4 w-full">
                    {ewallet.map((item) => (
                      <div
                        className="flex flex-col justify-center items-center"
                        key={item.name}
                      >
                        <Button
                          variant="outline"
                          className={cn(
                            "rounded-none h-20 border border-gray-100 hover:bg-transparent",
                            {
                              "border-teal-600": item === selectedPayment,
                            }
                          )}
                          onClick={() => setSelectedPayment(item)}
                        >
                          <Image
                            src={item.img}
                            alt="qris image"
                            className="w-full h-full"
                          />
                        </Button>
                        <span className="uppercase text-xs font-medium mt-1">
                          {item.name}
                        </span>
                      </div>
                    ))}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-medium">Alamat Pengiriman</h2>
                <TooltipProvider delayDuration={200}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() =>
                          router.push(
                            `/address/add-address?callbackUrl=${encodeURIComponent(
                              "/checkout"
                            )}`
                          )
                        }
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Tambah Alamat</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="h-[200px]">
                <ScrollArea className="relative h-[200px] overflow-x-auto rounded-none">
                  <RadioGroup
                    required
                    className="px-4"
                    onValueChange={(id) => setSelectedAddress(id)}
                    defaultValue={selectedAddress ? selectedAddress : undefined}
                  >
                    {addresses && addresses.length ? (
                      <>
                        {addresses.map((address) => (
                          <div
                            className="flex items-center space-x-2"
                            key={address.id}
                          >
                            <div className="w-4 h-4">
                              <RadioGroupItem
                                // checked={}
                                value={address.id}
                                id={address.id}
                                className="w-full h-full flex flex-auto justify-center items-center -m-0.5 p-0.5 text-teal-600 focus-visible:ring-teal-600 focus-visible:border-teal-600  border-gray-300"
                              />
                            </div>
                            <Label
                              htmlFor={address.id}
                              className="block border p-4 border-gray-300 flex-1 cursor-pointer"
                            >
                              <p>
                                {address.contactName} | {address.phoneNumber}
                              </p>
                              <p>
                                {address.addressDetail}, {address.district},{" "}
                                {address.city}, {address.province}.{" "}
                                {address.postalCode}
                              </p>
                            </Label>
                          </div>
                        ))}
                      </>
                    ) : (
                      <p className="py-6 text-muted-foreground text-center">
                        Belum ada alamat
                      </p>
                    )}
                  </RadioGroup>
                </ScrollArea>
              </div>
            </div>
            <div className="mt-8">
              <h2 className="font-medium mb-3">Pilih Pengiriman</h2>
              <ScrollArea className="relative h-[200px] overflow-x-auto rounded-none">
                <div className="flex flex-col gap-4 w-full pt-4">
                  {isFetchingCourierPricing ? (
                    new Array(3).fill(0).map((_, index) => (
                      <div className="w-full flex space-x-3 border" key={index}>
                        <Skeleton className="h-[96px] w-[96px] rounded-none" />
                        <div className="flex-1 flex flex-col justify-between p-3">
                          <div>
                            <Skeleton className="h-4 w-full rounded-sm" />
                            <Skeleton className="h-4 w-4/5 rounded-sm mt-1" />
                          </div>
                          <Skeleton className="h-4 w-12 rounded-sm" />
                        </div>
                      </div>
                    ))
                  ) : courierPricing && courierPricing.length ? (
                    courierPricing.map((courier) => {
                      const courierImg = courierImgs.find(
                        (img) => img.name === courier.courier_code
                      );

                      return (
                        <button
                          className={cn("flex w-full border border-gray-100", {
                            "border-teal-600":
                              courier.company ===
                                selectedCourier?.courierCompany &&
                              courier.type === selectedCourier.courierType,
                          })}
                          onClick={() =>
                            setSelectedCourier({
                              price: courier.price,
                              courierCompany: courier.company,
                              courierInsurance: 0,
                              courierType: courier.type,
                              deliveryType: "now",
                            })
                          }
                          key={`${courier.courier_code}-${courier.type}`}
                        >
                          <div
                            className={cn(
                              "rounded-none w-20 h-20 hover:bg-transparent"
                            )}
                          >
                            <Image
                              src={courierImg?.img || DefaultCourierImg}
                              alt="courier img"
                              className="w-full h-full"
                            />
                          </div>
                          <div className="py-3 pl-1 pr-3 flex-1 text-left">
                            <span className="uppercase text-xs font-medium mt-1">
                              {courier.courier_code} - {courier.type}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              Perkiraan tiba dalam: {courier.duration}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {formatPrice(courier.price)}
                            </p>
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <p className="text-muted-foreground">
                      Pilih alamat untuk melihat daftar jasa pengiriman
                    </p>
                  )}
                </div>
              </ScrollArea>
            </div>
            <div className="mt-8">
              <h2 className="font-medium mb-3">Rincian Pesanan</h2>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <p className="flex-1 text-sm">Subtotal produk</p>
                  <p className="text-sm">{formatPrice(subtotalPrice)}</p>
                </div>
                <div className="flex justify-between">
                  <p className="flex-1 text-sm">Subtotal pengiriman</p>
                  <p className="text-sm">
                    {formatPrice(selectedCourier?.price || 0)}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="flex-1">Total Pembayaran</p>
                  <p className="">
                    {formatPrice((selectedCourier?.price || 0) + subtotalPrice)}
                  </p>
                </div>
              </div>
              <div className="mt-8 flex justify-end ">
                <Button
                  className="bg-teal-600 hover:bg-teal-600/90"
                  disabled={
                    !selectedAddress ||
                    !selectedPayment ||
                    !selectedCourier ||
                    !checkoutItems?.length ||
                    isPending
                  }
                  onClick={() => handleCreateOrder()}
                >
                  Buat Pesanan
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
