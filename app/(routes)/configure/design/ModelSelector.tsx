"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { ChevronsUpDown, Check } from "lucide-react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Command,
  CommandInput,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { CaseColor, CaseFinish, CaseMaterial, CaseModel } from "@prisma/client";

type CaseModelWithVariants = CaseModel & {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
};

interface ModelSelectorProps {
  selectedModel: CaseModelWithVariants;
  handleModelChange: (modelId: string) => void;
  caseModels: CaseModelWithVariants[];
}

export function ModelSelector({
  selectedModel,
  handleModelChange,
  caseModels,
}: ModelSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {selectedModel.name}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search phone model..." />
          <CommandEmpty>No phone model found.</CommandEmpty>
          <CommandGroup>
            <CommandList>
              {caseModels.map((model) => (
                <CommandItem
                  key={model.id}
                  value={model.id}
                  onSelect={(modelId) => {
                    handleModelChange(modelId);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedModel.id === model.id
                        ? "opacity-100"
                        : "opacity-0"
                    )}
                  />
                  {model.name}
                </CommandItem>
              ))}
            </CommandList>
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}