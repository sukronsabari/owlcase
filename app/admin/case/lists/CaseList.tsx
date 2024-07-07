"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import React from "react";
import { CaseMaterialSelector } from "./CaseMaterialSelector";
import { CaseFinishSelector } from "./CaseFinishSelector";
import { useRouter } from "next/navigation";

import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button, buttonVariants } from "@/components/ui/button";
import { SectionWrapper } from "@/components/SectionWrapper";
import type {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  CaseModel,
} from "@prisma/client";
import Image from "next/image";
import { Plus } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { CaseColorSelector } from "./CaseColorSelector";
import { useState } from "react";
import { Popover, PopoverContent } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { getCaseModels } from "./actions";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CaseList({
  caseColors,
  caseMaterials,
  caseFinishes,
}: {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
}) {
  const router = useRouter();
  const { data: caseModels, isLoading } = useQuery({
    queryKey: ["case-models"],
    queryFn: async () => await getCaseModels(),
  });

  return (
    <SectionWrapper className="px-4 py-10">
      <>
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-2xl">Case List</h2>
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/admin/case/lists/add")}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-1 gap-4 justify-center">
            {caseModels?.length &&
              caseModels.map((item) => (
                <div
                  className="flex justify-between gap-4 p-4 rounded-sm border border-gray-400 max-w-4xl"
                  key={item.id}
                >
                  <div className="relative">
                    <Image
                      src={item.url}
                      alt="case image"
                      width={200}
                      height={400}
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-bold text-xl mt-4">{item.name}</h2>
                    <p className="font-medium text-lg">
                      {formatPrice(item.price)}
                    </p>
                    <div>
                      <p className="font-medium my-4">Warna Tersedia: </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {item.caseColors.map((color) => (
                          <>
                            <TooltipProvider key={color.id} delayDuration={100}>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <button
                                    className="rounded-full border border-white h-10 w-10"
                                    style={{ backgroundColor: color.hex }}
                                  />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{color.name}</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </>
                        ))}

                        <CaseColorSelector
                          caseModel={item}
                          caseColorsInCaseModel={item.caseColors}
                          caseColors={caseColors}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium my-4">Material Tersedia: </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {item.caseMaterials.map((material) => (
                          <TooltipProvider
                            key={material.id}
                            delayDuration={100}
                          >
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "capitalize hover:bg-white"
                                  )}
                                >
                                  {material.name}
                                </button>
                              </TooltipTrigger>
                              {material.description && (
                                <TooltipContent>
                                  <p>{material.description}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        <CaseMaterialSelector
                          caseModel={item}
                          caseMaterials={caseMaterials}
                          caseMaterialsInCaseModel={item.caseMaterials}
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-medium my-4">Finishing Tersedia: </p>
                      <div className="flex flex-wrap items-center gap-3">
                        {item.caseFinishes.map((finish) => (
                          <TooltipProvider key={finish.id} delayDuration={100}>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <button
                                  className={cn(
                                    buttonVariants({ variant: "outline" }),
                                    "capitalize hover:bg-white"
                                  )}
                                >
                                  {finish.name}
                                </button>
                              </TooltipTrigger>
                              {finish.description && (
                                <TooltipContent>
                                  <p>{finish.description}</p>
                                </TooltipContent>
                              )}
                            </Tooltip>
                          </TooltipProvider>
                        ))}
                        <CaseFinishSelector
                          caseModel={item}
                          caseFinishes={caseFinishes}
                          caseFinishesInCaseModel={item.caseFinishes}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
        {/* <CaseModelInput
          openDialog={openAddCaseModel}
          setOpenDialog={setOpenAddCaseModel}
        /> */}
      </>
    </SectionWrapper>
  );
}

const Skeleton = () => {
  return (
    <div className="grid grid-cols-1 gap-4 justify-center">
      {[1, 2, 3].map((item) => (
        <div
          className="flex justify-between gap-4 p-4 rounded-sm border border-gray-400 max-w-4xl animate-pulse"
          key={item}
        >
          <div className="relative w-52 h-52 bg-gray-300"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-300 rounded w-1/2 mt-4"></div>
            <div className="h-6 bg-gray-300 rounded w-1/4 mt-2"></div>
            <div className="mt-4">
              <p className="font-medium my-4">Warna Tersedia:</p>
              <div className="flex flex-wrap items-center gap-3">
                {[1, 2, 3].map((color) => (
                  <div
                    key={color}
                    className="rounded-full border border-white h-10 w-10 bg-gray-300"
                  />
                ))}
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium my-4">Material Tersedia:</p>
              <div className="flex flex-wrap items-center gap-3">
                {[1, 2, 3].map((material) => (
                  <div
                    key={material}
                    className="h-8 bg-gray-300 rounded w-24"
                  />
                ))}
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="w-4 h-4 bg-gray-400"></span>
                </div>
              </div>
            </div>
            <div className="mt-4">
              <p className="font-medium my-4">Finishing Tersedia:</p>
              <div className="flex flex-wrap items-center gap-3">
                {[1, 2, 3].map((finish) => (
                  <div key={finish} className="h-8 bg-gray-300 rounded w-24" />
                ))}
                <div className="h-10 w-10 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="w-4 h-4 bg-gray-400"></span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
