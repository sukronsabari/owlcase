"use client";

import { useState } from "react";
import type { CaseMaterial } from "@prisma/client";
import { Plus, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useToast } from "@/components/ui/use-toast";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";

import { deleteCaseMaterialById } from "./actions";
import { CaseMaterialInput } from "./CaseMaterialInput";

export function CaseMaterialList({
  caseMaterials,
  isEditMaterial,
}: {
  caseMaterials: CaseMaterial[];
  isEditMaterial: boolean;
}) {
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedMaterial, setDeletedMaterial] = useState<CaseMaterial | null>(
    null
  );

  const handleDeletePress = (material: CaseMaterial) => {
    setDeletedMaterial(material);
    setOpenDeleteDialog(true);
  };

  const handleDelete = () => {
    if (deletedMaterial && deletedMaterial.id) {
      deleteCaseMaterialById(deletedMaterial.id)
        .then(() => {})
        .catch((error) => {
          toast({
            title: "Gagal menghapus material",
            description: error.message || "Terjadi kesalahan server",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center lg:gap-5">
        {caseMaterials.map((material) => (
          <TooltipProvider key={material.id} delayDuration={100}>
            <Tooltip open={isEditMaterial ? false : undefined}>
              <TooltipTrigger asChild>
                <div
                  className={cn(
                    buttonVariants({ variant: "outline" }),
                    "capitalize hover:bg-white relative cursor-pointer"
                  )}
                >
                  <>
                    {material.name}
                    <Button
                      size="icon"
                      variant="outline"
                      className={cn(
                        "absolute -right-3 -top-3 w-6 h-6 rounded-full hover:bg-destructive hover:text-white",
                        isEditMaterial ? "inline-flex" : "hidden"
                      )}
                      onClick={() => handleDeletePress(material)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </>
                </div>
              </TooltipTrigger>
              {material.description && (
                <TooltipContent>
                  <p>{material.description}</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenAddDialog(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <CaseMaterialInput
        openDialog={openAddDialog}
        setOpenDialog={setOpenAddDialog}
      />
      <ActionAlertDialog
        openDialog={openDeleteDialog}
        setOpenDialog={setOpenDeleteDialog}
        title="Anda yakin ingin menghapus material ini?"
        cancelText="Batal"
        actionText="Hapus"
        description="Jika anda setuju hal ini tidak dapat dibatalkan"
        action={handleDelete}
      />
    </>
  );
}
