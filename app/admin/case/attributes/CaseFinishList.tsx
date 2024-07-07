"use client";

import { Plus, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import { CaseFinishingInput } from "./CaseFinishingInput";
import { ActionAlertDialog } from "@/components/ActionAlertDialog";
import type { CaseFinish } from "@prisma/client";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { deleteCaseFinishById } from "./actions";
import { useToast } from "@/components/ui/use-toast";

export function CaseFinishList({
  caseFinishes,
  isEditFinish,
}: {
  isEditFinish: boolean;
  caseFinishes: CaseFinish[];
}) {
  const { toast } = useToast();
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [deletedFinish, setDeletedFinish] = useState<CaseFinish | null>(null);

  const handleBtnDelete = (finish: CaseFinish) => {
    setOpenDeleteDialog(true);
    setDeletedFinish(finish);
  };

  const handleDelete = () => {
    if (deletedFinish && deletedFinish.id) {
      deleteCaseFinishById(deletedFinish.id)
        .then(() => {})
        .catch((error) => {
          toast({
            title: "Gagal menghapus finishing",
            description: error.message || "Terjadi kesalahan server",
            variant: "destructive",
          });
        });
    }
  };

  return (
    <>
      <div className="flex flex-wrap gap-4 items-center">
        {caseFinishes.map((item) => (
          <div
            key={item.id}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "capitalize hover:bg-white relative"
            )}
          >
            <>
              {item.name}
              <Button
                size="icon"
                variant="outline"
                className={cn(
                  "absolute -right-3 -top-3 w-6 h-6 rounded-full hover:bg-destructive hover:text-white",
                  isEditFinish ? "inline-flex" : "hidden"
                )}
                onClick={() => handleBtnDelete(item)}
              >
                <X className="w-4 h-4" />
              </Button>
            </>
          </div>
        ))}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setOpenAddDialog(true)}
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
      <CaseFinishingInput
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
        cancelAction={() => setDeletedFinish(null)}
      />
    </>
  );
}
