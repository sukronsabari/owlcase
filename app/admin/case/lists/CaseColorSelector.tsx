"use client";

import { useState } from "react";
import type {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  CaseModel,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { connectCaseColorsToCaseModel } from "./actions";

type CaseModelWithItem = {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
} & CaseModel;

export function CaseColorSelector({
  caseModel,
  caseColors,
  caseColorsInCaseModel,
}: {
  caseModel: CaseModelWithItem;
  caseColors: CaseColor[];
  caseColorsInCaseModel: CaseColor[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedColors, setSelectedColors] = useState<CaseColor[]>(
    caseColorsInCaseModel
  );

  const queryClient = useQueryClient();

  const { mutate: handleConnectCaseColorToCaseModel } = useMutation({
    mutationKey: ["connect-color-to-model"],
    mutationFn: async () =>
      await connectCaseColorsToCaseModel(
        caseModel.id,
        selectedColors.map((color) => color.id)
      ),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["case-models"] });
      const previousCaseModel = queryClient.getQueryData<CaseModelWithItem[]>([
        "case-models",
      ]);

      if (previousCaseModel?.length) {
        const updatedCaseModel = previousCaseModel.map((model) => {
          if (model.id === caseModel.id) {
            return {
              ...model,
              caseColors: selectedColors,
            };
          }

          return model;
        });

        queryClient.setQueryData(["case-models"], updatedCaseModel);

        return { previousCaseModel };
      }
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(["case-models"], context?.previousCaseModel);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["case-models"] });
    },
  });

  const handleToggleColor = (color: CaseColor) => {
    if (selectedColors.some((selected) => selected.id === color.id)) {
      setSelectedColors(
        selectedColors.filter((selected) => selected.id !== color.id)
      );
    } else {
      setSelectedColors([...selectedColors, color]);
    }
  };

  return (
    <Popover open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Daftar warna</h4>
            <p className="text-sm text-muted-foreground">
              Pilih warna - warna yang tersedia untuk case ini.
            </p>
          </div>
          <div className="flex flex-wrap gap-4 lg:gap-5">
            {caseColors.map((color) => (
              <button
                key={color.id}
                className="relative -m-0.5 flex items-center justify-center cursor-pointer rounded-sm p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2"
                style={{
                  borderColor: selectedColors.some(
                    (selected) => selected.id === color.id
                  )
                    ? `${color.hex}`
                    : "transparent",
                }}
                onClick={() => handleToggleColor(color)}
              >
                <span
                  className={`h-10 w-10 rounded-sm border border-black border-opacity-10 bg-[${color.hex}]`}
                  style={{ backgroundColor: `${color.hex}` }}
                />
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-teal-600 hover:bg-teal-600/90 rounded-sm"
              size="sm"
              onClick={() => {
                handleConnectCaseColorToCaseModel();
                setOpenDialog(false);
              }}
            >
              Simpan
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
