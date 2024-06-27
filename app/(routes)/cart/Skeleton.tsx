"use client";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/Spinner";

export const CartSummarySkeleton = () => {
  return (
    <div className="hidden lg:block bg-gray-100 border p-4 col-span-1 h-fit mt-8 sticky top-20">
      <div className="flow-root text-xs py-1">
        <div className="flex items-center justify-between py-1 mt-1">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-10 rounded"></div>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-10 rounded"></div>
        </div>
        <div className="flex items-center justify-between mt-3">
          <div className="bg-gray-300 h-4 w-20 rounded font-bold"></div>
          <div className="bg-gray-300 h-4 w-10 rounded font-bold"></div>
        </div>
        <div className="flex justify-end mt-3">
          <Button
            size="sm"
            className="px-4 bg-teal-600 hover:bg-teal-600/90 m:px-6 lg:px-8 min-w-[120px] text-xs w-full"
            disabled={true}
          >
            <div className="hidden">
              <Spinner />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};

export const CartMobileSummarySkeleton = () => {
  return (
    <div className="p-4 bg-white shadow-lg border-t border-t-gray-200 w-full min-h-24 fixed z-50 bottom-0 left-0 lg:hidden">
      <div className="flow-root text-xs py-1 max-w-screen-sm mx-auto">
        <div className="flex items-center justify-between py-1 mt-1">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-10 rounded"></div>
        </div>
        <div className="flex items-center justify-between py-1">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-10 rounded"></div>
        </div>
        <div className="flex items-center justify-between py-1 pb-3">
          <div className="bg-gray-300 h-4 w-20 rounded"></div>
          <div className="bg-gray-300 h-4 w-10 rounded"></div>
        </div>
        <div className="absolute h-px w-full bg-gray-100"></div>
        <div className="flex justify-end mt-3">
          <Button
            size="sm"
            className="px-4 bg-teal-600 hover:bg-teal-600/90 m:px-6 lg:px-8 min-w-[120px] text-xs"
            disabled={true}
          >
            <div className="hidden">
              <Spinner />
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
};
