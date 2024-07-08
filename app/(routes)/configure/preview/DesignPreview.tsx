/* eslint-disable @next/next/no-img-element */
"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores";
import type {
  Cart,
  CartItem,
  CaseColor,
  CaseFinish,
  CaseMaterial,
  CaseModel,
  CaseOption,
  ImageConfiguration,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ArrowRight, Check, ShoppingCart } from "lucide-react";
import { useSession } from "next-auth/react";
import Confetti from "react-dom-confetti";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { LoginModal } from "@/components/LoginModal";
import { Spinner } from "@/components/Spinner";

import { addToCartAction } from "./actions";

type CaseOptionWithImage = CaseOption & {
  imageConfiguration: ImageConfiguration;
  caseModel: CaseModel;
  caseMaterial: CaseMaterial;
  caseFinish: CaseFinish;
  caseColor: CaseColor;
};

interface DesignPreviewProps {
  caseOption: CaseOptionWithImage;
}

type CartWithItem = Cart & {
  items: CartItem[];
};

export function DesignPreview({ caseOption }: DesignPreviewProps) {
  const router = useRouter();
  const session = useSession();
  const queryClient = useQueryClient();

  // const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [showConfetti, setShowConfetti] = useState(false);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [clearCheckoutItems, setCheckoutItem] = useCheckoutStore((state) => [
    state.clearCheckoutItems,
    state.setCheckoutItem,
  ]);

  const { imageConfiguration, caseModel, caseMaterial, caseFinish } =
    caseOption;
  const totalPrice = caseModel.price + caseMaterial.price + caseFinish.price;

  const { mutate: addToCart } = useMutation({
    mutationKey: ["add-to-cart-action"],
    mutationFn: async ({ caseOptionId }: { caseOptionId: string }) =>
      await addToCartAction(caseOptionId),
    onMutate: async ({ caseOptionId }) => {
      await queryClient.cancelQueries({ queryKey: ["cart-count"] });
      const previousCart = queryClient.getQueryData<CartWithItem>([
        "cart-count",
      ]);

      if (previousCart) {
        const existCart = previousCart.items.find(
          (item) => item.caseOptionId === caseOptionId
        );

        let updatedCartItems: CartItem[] = previousCart.items;

        if (existCart) {
          updatedCartItems = updatedCartItems.map((item) => {
            if (item.id === existCart.id) {
              return {
                ...item,
                quantity: item.quantity + 1,
              };
            }

            return item;
          });
        } else {
          updatedCartItems.push({
            id: new Date().getTime().toString(),
            cartId: previousCart.id,
            caseOptionId,
            createdAt: new Date(),
            updatedAt: new Date(),
            quantity: 1,
          });
        }
        queryClient.setQueryData(["cart-count"], {
          ...previousCart,
          items: updatedCartItems,
        });
      }

      return { previousCart };
    },
    onError: (err, variables, context) => {
      if (context && context.previousCart) {
        queryClient.setQueryData(["cart-count"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  const handleCheckout = () => {
    if (session.data?.user) {
      startTransition(() => {
        clearCheckoutItems();
        setCheckoutItem({
          caseOptionId: caseOption.id,
          quantity: 1,
        });
      });
      router.push("/checkout");
    } else {
      setOpenLoginModal(true);
    }
  };

  const handleAddToCart = () => {
    if (session?.data?.user) {
      addToCart({ caseOptionId: caseOption.id });
    } else {
      setOpenLoginModal(true);
    }
  };

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="bg-white">
      <div
        aria-hidden
        className="pointer-events-none select-none absolute inset-0 overflow-hidden flex justify-center"
      >
        <Confetti
          active={showConfetti}
          config={{ elementCount: 200, spread: 90 }}
        />
      </div>

      <LoginModal
        callbackUrl={`/configure/preview?caseOptionId=${caseOption.id}`}
        title="Login to continue"
        description="Your configuration was saved! Please login to complete your purchase"
        isOpen={openLoginModal}
        setIsOpen={setOpenLoginModal}
      />

      <div className="mt-20 px-4 flex flex-col items-center gap-8 md:flex-row md:items-start md:gap-10">
        <div className="w-60 h-full pointer-events-none relative z-[49] overflow-hidden">
          <img
            src={caseModel.edgeImgUrl}
            alt="phone image"
            className="pointer-events-none z-[49] select-none"
          />
          <div className="absolute -z-10 inset-0">
            <img
              src={imageConfiguration.croppedImageUrl || ""}
              alt="overlaying phone image"
              className="object-cover min-w-full min-h-full"
            />
          </div>
        </div>

        <div className="flex-1">
          <h3 className="text-3xl font-bold tracking-tight text-gray-900">
            Custom Case {caseModel.name}
          </h3>

          <div className="mt-3 flex items-center gap-1 5 text-base">
            <Check className="w-4 h-4 text-teal-600" />
            Tersedia dan siap untuk dikirim
          </div>

          <div className="text-base">
            <div className="grid grid-cols-1 gap-y-8 border-b border-gray-200 py-8 sm:grid-cols-2 sm:gap-x-6 sm:py-6 md:grid-cols-1 lg:grid-cols-2">
              <div>
                <p className="font-medium text-zinc-950">Ringkasan barang</p>
                <ol className="mt-3 text-zinc-700 list-disc list-inside">
                  <li>
                    Model:{" "}
                    <span className="capitalize">
                      {caseOption.caseModel.name}
                    </span>{" "}
                  </li>
                  <li>
                    Warna:{" "}
                    <span className="capitalize">
                      {caseOption.caseColor.name}
                    </span>
                  </li>
                  <li>
                    Material:{" "}
                    <span className="capitalize">
                      {caseOption.caseMaterial.name}
                    </span>
                  </li>
                  <li>
                    Finishing:{" "}
                    <span className="capitalize">
                      {caseOption.caseFinish.name}
                    </span>
                  </li>
                </ol>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <div className="bg-gray-50 p-6 sm:p-8">
              <div className="flow-root text-sm">
                <div className="flex items-center justify-between py-1 mt-2">
                  <div className="text-gray-600 capitalize">Harga model</div>
                  <div className="font-medium text-gray-900">
                    {formatPrice(caseModel.price)}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 mt-2">
                  <div className="text-gray-600 capitalize">
                    {caseMaterial.name} material
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatPrice(caseMaterial.price)}
                  </div>
                </div>

                <div className="flex items-center justify-between py-1 mt-2">
                  <div className="text-gray-600 capitalize">
                    {caseFinish.name} finishing
                  </div>
                  <div className="font-medium text-gray-900">
                    {formatPrice(caseFinish.price)}
                  </div>
                </div>

                <div className="my-2 h-px bg-gray-200" />

                <div className="flex items-center justify-between py-2">
                  <p className="font-semibold text-gray-900">Order Total</p>
                  <div className="font-semibold text-gray-900">
                    {formatPrice(totalPrice)}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4 pb-12">
              <Button variant="outline" onClick={handleAddToCart}>
                Tambah ke cart{" "}
                <ShoppingCart className="h-4 w-4 ml-1.5 inline" />
              </Button>
              <Button
                onClick={handleCheckout}
                className="px-4 bg-teal-600 hover:bg-teal-600/90 m:px-6 lg:px-8 min-w-[120px]"
                disabled={isPending}
              >
                {isPending ? (
                  <>
                    <Spinner />
                  </>
                ) : (
                  <>
                    Checkout <ArrowRight className="h-4 w-4 ml-1.5 inline" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
