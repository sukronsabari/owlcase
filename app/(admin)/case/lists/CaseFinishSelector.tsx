"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { Plus } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type {
  CaseColor,
  CaseFinish,
  CaseMaterial,
  CaseModel,
} from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  connectCaseColorsToCaseModel,
  connectCaseFinishToCaseModel,
  connectCaseMaterialToCaseModel,
} from "./actions";
import { cn } from "@/lib/utils";

type CaseModelWithItem = {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
} & CaseModel;

export function CaseFinishSelector({
  caseModel,
  caseFinishes,
  caseFinishesInCaseModel,
}: {
  caseModel: CaseModelWithItem;
  caseFinishes: CaseFinish[];
  caseFinishesInCaseModel: CaseFinish[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFinishes, setSelectedFinishes] = useState<CaseFinish[]>(
    caseFinishesInCaseModel
  );

  const queryClient = useQueryClient();

  const { mutate: handleConnectCaseFinishToCaseModel } = useMutation({
    mutationKey: ["connect-finish-to-model"],
    mutationFn: async () =>
      await connectCaseFinishToCaseModel(
        caseModel.id,
        selectedFinishes.map((selected) => selected.id)
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
              caseFinishes: selectedFinishes,
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

  const handleToggleFinish = (finish: CaseFinish) => {
    if (selectedFinishes.some((selected) => selected.id === finish.id)) {
      setSelectedFinishes(
        selectedFinishes.filter((selected) => selected.id !== finish.id)
      );
    } else {
      setSelectedFinishes([...selectedFinishes, finish]);
    }
  };

  return (
    <Popover open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="icon">
          <Plus className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Daftar finishing</h4>
            <p className="text-sm text-muted-foreground">
              Pilih finishing untuk case ini.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {caseFinishes.map((caseFinish) => (
              <button
                key={caseFinish.id}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "capitalize hover:bg-white relative cursor-pointer",
                  {
                    "ring-1 ring-teal-600": selectedFinishes.some(
                      (selected) => selected.id === caseFinish.id
                    ),
                  }
                )}
                onClick={() => handleToggleFinish(caseFinish)}
              >
                <>{caseFinish.name}</>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-teal-600 hover:bg-teal-600/90 rounded-sm"
              size="sm"
              onClick={() => {
                handleConnectCaseFinishToCaseModel();
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
