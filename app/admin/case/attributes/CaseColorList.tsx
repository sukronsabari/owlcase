"use client";

import { Dispatch, SetStateAction, useState } from "react";
import type { CaseColor } from "@prisma/client";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";

import { deleteCaseColorById } from "./actions";
import { CaseColorInput } from "./CaseColorInput";

export function CaseColorList({
  caseColors,
  isEditColor,
  activeColor,
  setActiveColor,
}: {
  activeColor: CaseColor | null;
  setActiveColor: Dispatch<SetStateAction<CaseColor | null>>;
  caseColors: CaseColor[];
  isEditColor: boolean;
}) {
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedColor, setDeletedColor] = useState<CaseColor | null>(null);

  const handleDeletePress = (color: CaseColor) => {
    setOpenDeleteDialog(true);
    setDeletedColor(color);
  };

  const handleDelete = () => {
    if (deletedColor && deletedColor.id) {
      deleteCaseColorById(deletedColor.id)
        .then(() => {
          if (caseColors.length > 0) {
            setActiveColor(caseColors[0]);
          }
        })
        .catch((error) => {
          toast({
            title: "Gagal menghapus warna",
            description: error.message,
            variant: "destructive",
          });
        });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center lg:gap-5">
        {caseColors.map((color) => (
          <TooltipProvider key={color.id} delayDuration={100}>
            <Tooltip open={isEditColor ? false : undefined}>
              <TooltipTrigger asChild>
                <div
                  className="relative -m-0.5 flex items-center justify-center cursor-pointer rounded-sm p-0.5 active:ring-0 focus:ring-0 active:outline-none focus:outline-none border-2"
                  style={{
                    borderColor:
                      color.id === activeColor?.id
                        ? `${color.hex}`
                        : "transparent",
                  }}
                  onClick={() => setActiveColor(color)}
                >
                  <>
                    <span
                      className={`h-10 w-10 rounded-sm border border-black border-opacity-10 bg-[${color.hex}]`}
                      style={{ backgroundColor: `${color.hex}` }}
                    />
                    <Button
                      size="icon"
                      variant="outline"
                      className={cn(
                        "absolute -right-3 -top-3 w-6 h-6 rounded-full hover:bg-destructive hover:text-white",
                        isEditColor ? "inline-flex" : "hidden"
                      )}
                      onClick={() => handleDeletePress(color)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{color.name}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        ))}
        <Button
          variant="outline"
          size="icon"
          className="rounded-sm h-10 w-10"
          onClick={() => setOpenAddDialog(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <CaseColorInput
        openDialog={openAddDialog}
        setOpenDialog={setOpenAddDialog}
      />
      <ActionAlertDialog
        openDialog={openDeleteDialog}
        setOpenDialog={setOpenDeleteDialog}
        title="Anda yakin ingin menghapus item ini?"
        cancelText="Batal"
        actionText="Hapus"
        description="Jika anda setuju hal ini tidak dapat dibatalkan"
        action={handleDelete}
        cancelAction={() => setDeletedColor(null)}
      />
    </>
  );
}
