/* eslint-disable @next/next/no-img-element */
"use client";

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
import { Minus, Plus } from "lucide-react";

import { formatPrice } from "@/lib/utils";

import { decreaseQuantity, increaseQuantity } from "./action";

type CartWithItem =
  | ({
      items: ({
        caseOption: CaseOption & {
          imageConfiguration: ImageConfiguration;
          caseModel: CaseModel;
          caseColor: CaseColor;
          caseMaterial: CaseMaterial;
          caseFinish: CaseFinish;
        };
      } & CartItem)[];
    } & Cart)
  | null;

export function CartItem({
  item,
  handleQuantityChange,
}: {
  item: {
    caseOption: CaseOption & {
      imageConfiguration: ImageConfiguration;
      caseColor: CaseColor;
      caseMaterial: CaseMaterial;
      caseFinish: CaseFinish;
      caseModel: CaseModel;
    };
  } & CartItem;
  // eslint-disable-next-line no-unused-vars
  handleQuantityChange: (caseOptionId: string, newQuantity: number) => void;
}) {
  const { caseModel, caseMaterial, caseFinish, imageConfiguration } =
    item.caseOption;
  const totalPrice = caseModel.price + caseMaterial.price + caseFinish.price;

  const queryClient = useQueryClient();

  const { mutate: decrease } = useMutation({
    mutationKey: ["decrease-quantity"],
    mutationFn: async ({ cartItemId }: { cartItemId: string }) =>
      await decreaseQuantity(cartItemId),
    onMutate: async ({ cartItemId }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartWithItem>(["cart"]);

      if (previousCart) {
        const updatedItems = previousCart.items.map((item) => {
          if (item.id === cartItemId) {
            const newQuantity = item.quantity - 1;
            handleQuantityChange(item.caseOptionId, newQuantity);
            return {
              ...item,
              quantity: newQuantity,
            };
          }
          return item;
        });

        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: updatedItems,
        });

        return { previousCart };
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  const { mutate: increase } = useMutation({
    mutationKey: ["increase-quantity"],
    mutationFn: async ({ cartItemId }: { cartItemId: string }) =>
      await increaseQuantity(cartItemId),
    onMutate: async ({ cartItemId }) => {
      await queryClient.cancelQueries({ queryKey: ["cart"] });
      const previousCart = queryClient.getQueryData<CartWithItem>(["cart"]);

      if (previousCart) {
        const updatedItems = previousCart.items.map((item) => {
          if (item.id === cartItemId) {
            const newQuantity = item.quantity + 1;
            handleQuantityChange(item.caseOptionId, newQuantity);
            return {
              ...item,
              quantity: newQuantity,
            };
          }
          return item;
        });

        queryClient.setQueryData(["cart"], {
          ...previousCart,
          items: updatedItems,
        });

        return { previousCart };
      }
    },
    onError: (err, variables, context) => {
      if (context?.previousCart) {
        queryClient.setQueryData(["cart"], context.previousCart);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] });
      queryClient.invalidateQueries({ queryKey: ["cart-count"] });
    },
  });

  return (
    <div className="flex items-start gap-6 border border-gray-300 p-3 relative">
      <div className="bg-gray-100 p-6 rounded-sm h-44">
        <div className="w-16 h-auto pointer-events-none relative z-[49] overflow-hidden">
          <img
            src={caseModel.edgeImgUrl || ""}
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
      </div>
      <div className="flex-1 text-xs relative h-44">
        <div className="mb-4">
          <h3 className="font-bold text-sm">
            {item.caseOption.caseModel.name} Case
          </h3>
        </div>
        <div>
          <p className="capitalize">color: {item.caseOption.caseColor.name}</p>
          <p className="capitalize">
            material: {item.caseOption.caseMaterial.name}
          </p>
          <p className="capitalize">
            finishing: {item.caseOption.caseFinish.name}
          </p>
        </div>

        <div className="absolute bottom-0 flex items-center justify-between w-full pr-3">
          <div className="w-full flex justify-between items-center">
            <div className="flex border border-gray-100">
              <button
                className="py-1 px-1"
                onClick={() => decrease({ cartItemId: item.id })}
              >
                <Minus className="w-4 h-4" />
              </button>
              <button className="border-x border-x-gray-100 px-2 py-1">
                {item.quantity}
              </button>
              <button
                className="py-1 px-1"
                onClick={() => increase({ cartItemId: item.id })}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <p className="font-medium">{formatPrice(totalPrice)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export const CartItemSkeleton = () => (
  <div className="flex items-start gap-6 border border-gray-200 p-3">
    <div className="bg-gray-100 p-6 rounded-sm animate-pulse">
      <div className="w-14 h-20 bg-gray-300"></div>
    </div>
    <div className="flex-1 h-full text-xs relative">
      <div>
        <div className="mb-4">
          <h3 className="font-bold text-sm bg-gray-300 h-4 w-24"></h3>
        </div>
        <div>
          <p className="capitalize bg-gray-300 h-3 w-24"></p>
          <p className="capitalize bg-gray-300 h-3 w-24"></p>
          <p className="capitalize bg-gray-300 h-3 w-24"></p>
        </div>
      </div>
      <div className="absolute bottom-0 pb-2 flex items-center justify-between w-full pr-8">
        <div className="flex border border-gray-100 bg-gray-300 h-8 w-24"></div>
        <p className="font-medium bg-gray-300 h-8 w-24"></p>
      </div>
    </div>
  </div>
);
