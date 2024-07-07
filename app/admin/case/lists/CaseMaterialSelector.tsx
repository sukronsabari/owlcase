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

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import { connectCaseMaterialToCaseModel } from "./actions";

type CaseModelWithItem = {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
} & CaseModel;

export function CaseMaterialSelector({
  caseModel,
  caseMaterials,
  caseMaterialsInCaseModel,
}: {
  caseModel: CaseModelWithItem;
  caseMaterials: CaseMaterial[];
  caseMaterialsInCaseModel: CaseMaterial[];
}) {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMaterials, setSelectedMaterials] = useState<CaseMaterial[]>(
    caseMaterialsInCaseModel
  );

  const queryClient = useQueryClient();

  const { mutate: handleConnectCaseMaterialToCaseModel } = useMutation({
    mutationKey: ["connect-material-to-model"],
    mutationFn: async () =>
      await connectCaseMaterialToCaseModel(
        caseModel.id,
        selectedMaterials.map((material) => material.id)
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
              caseMaterials: selectedMaterials,
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

  const handleToggleMaterial = (material: CaseMaterial) => {
    if (selectedMaterials.some((selected) => selected.id === material.id)) {
      setSelectedMaterials(
        selectedMaterials.filter((selected) => selected.id !== material.id)
      );
    } else {
      setSelectedMaterials([...selectedMaterials, material]);
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
            <h4 className="font-medium leading-none">Daftar material</h4>
            <p className="text-sm text-muted-foreground">
              Pilih material untuk case ini.
            </p>
          </div>
          <div className="flex flex-wrap gap-4">
            {caseMaterials.map((material) => (
              <button
                key={material.id}
                className={cn(
                  buttonVariants({ variant: "outline" }),
                  "capitalize hover:bg-white relative cursor-pointer",
                  {
                    "ring-1 ring-teal-600": selectedMaterials.some(
                      (selected) => selected.id === material.id
                    ),
                  }
                )}
                onClick={() => handleToggleMaterial(material)}
              >
                <>{material.name}</>
              </button>
            ))}
          </div>
          <div className="flex justify-end">
            <Button
              className="bg-teal-600 hover:bg-teal-600/90 rounded-sm"
              size="sm"
              onClick={() => {
                handleConnectCaseMaterialToCaseModel();
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
