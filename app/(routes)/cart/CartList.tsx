"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useCheckoutStore } from "@/stores";
import type {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  CaseModel,
  CaseOption,
  ImageConfiguration,
} from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";

import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { SectionWrapper } from "@/components/SectionWrapper";
import { Spinner } from "@/components/Spinner";

import { getCart } from "./action";
import { CartItem as CartItemComponent, CartItemSkeleton } from "./CartItem";
import { CartMobileSummarySkeleton, CartSummarySkeleton } from "./Skeleton";

type CaseOptionWithAttr = CaseOption & {
  imageConfiguration: ImageConfiguration;
  caseColor: CaseColor;
  caseModel: CaseModel;
  caseMaterial: CaseMaterial;
  caseFinish: CaseFinish;
};

export function CartList() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [selectedCart, setSelectedCart] = useState<
    {
      caseOption: CaseOptionWithAttr;
      caseOptionId: string;
      quantity: number;
    }[]
  >([]);
  const [clearCheckoutItems, setCheckoutItems, checkoutItems] =
    useCheckoutStore((state) => [
      state.clearCheckoutItems,
      state.setCheckoutItems,
      state.checkoutItems,
    ]);

  const { data: cart, isLoading } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => await getCart(),
  });

  const total =
    selectedCart.reduce((total, item) => {
      const qty = item.quantity;
      const { caseModel, caseMaterial, caseFinish } = item.caseOption;
      const itemPrice = caseModel.price + caseMaterial.price + caseFinish.price;
      return total + qty * itemPrice;
    }, 0) || 0;

  const handleCheckout = () => {
    startTransition(() => {
      clearCheckoutItems();
      setCheckoutItems(
        selectedCart.map((selected) => ({
          caseOptionId: selected.caseOptionId,
          quantity: selected.quantity,
        }))
      );
      router.push("/checkout");
    });
  };

  const handleQuantityChange = (caseOptionId: string, newQuantity: number) => {
    setSelectedCart((prev) => {
      return prev.map((item) =>
        item.caseOptionId === caseOptionId
          ? { ...item, quantity: newQuantity }
          : item
      );
    });
  };

  if (isLoading) {
    return (
      <SectionWrapper className="py-8 min-h-screen bg-white">
        <h2 className="text-3xl font-medium">Your carts</h2>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          <div className="lg:col-span-3">
            <div className="mt-8 pb-32 grid grid-cols-1 gap-3">
              {isLoading &&
                [1, 2, 3, 4, 5, 6, 7, 8].map((_, index) => (
                  <CartItemSkeleton key={index} />
                ))}
            </div>
          </div>
          <CartSummarySkeleton />
          <CartMobileSummarySkeleton />
        </div>
      </SectionWrapper>
    );
  }

  return (
    <SectionWrapper className="py-8 min-h-screen bg-white">
      <h2 className="text-3xl font-medium">Your carts</h2>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-3">
          <div className="mt-8 pb-32 grid grid-cols-1 gap-3">
            {isLoading &&
              Array(5)
                .fill(0)
                .map((_, index) => <CartItemSkeleton key={index} />)}

            {cart && cart.items.length
              ? cart.items.map((item) => (
                  <div className="flex items-center gap-3" key={item.id}>
                    <Checkbox
                      className="border border-gray-300 data-[state=checked]:bg-teal-600 h-5 w-5"
                      checked={selectedCart.some(
                        (selected) =>
                          selected.caseOptionId === item.caseOptionId
                      )}
                      onCheckedChange={(checked) => {
                        return checked
                          ? setSelectedCart((prev) => [
                              ...prev,
                              {
                                caseOption: item.caseOption,
                                caseOptionId: item.caseOptionId,
                                quantity: item.quantity,
                              },
                            ])
                          : setSelectedCart((prev) =>
                              prev.filter(
                                (c) => c.caseOptionId !== item.caseOptionId
                              )
                            );
                      }}
                    />
                    <div className="flex-1">
                      <CartItemComponent
                        handleQuantityChange={handleQuantityChange}
                        item={item}
                      />
                    </div>
                  </div>
                ))
              : "No cart"}
          </div>
        </div>
        {cart?.items.length ? (
          <div className="hidden lg:block bg-gray-100 border p-4 col-span-1 h-fit mt-8 sticky top-20">
            <div className="flow-root text-xs py-1">
              <div className="flex items-center justify-between mt-3">
                <div className="text-gray-900 capitalize font-bold">Total</div>
                <div className="font-bold text-gray-900">
                  {formatPrice(total)}
                </div>
              </div>

              <div className="flex justify-end mt-3">
                <Button
                  onClick={handleCheckout}
                  size="sm"
                  className="px-4 bg-teal-600 hover:bg-teal-600/90 m:px-6 lg:px-8 min-w-[120px] text-xs w-full"
                  disabled={isPending || !selectedCart.length}
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
        ) : null}
        {/* MOBILE */}
        <div className="p-4 bg-white shadow-lg border-t border-t-gray-200 w-full min-h-24 fixed z-50 bottom-0 left-0 lg:hidden">
          <div className="flow-root text-xs py-1 max-w-screen-sm mx-auto">
            <div className="flex items-center justify-between py-1 pb-3">
              <div className="text-gray-900 capitalize">Total</div>
              <div className="font-medium text-gray-900">
                {formatPrice(total)}
              </div>
            </div>

            <div className="absolute h-px w-full bg-gray-100"></div>

            <div className="flex justify-end mt-3">
              <Button
                onClick={handleCheckout}
                size="sm"
                className="px-4 bg-teal-600 hover:bg-teal-600/90 m:px-6 lg:px-8 min-w-[120px] text-xs"
                disabled={isPending || !selectedCart.length}
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
    </SectionWrapper>
  );
}
