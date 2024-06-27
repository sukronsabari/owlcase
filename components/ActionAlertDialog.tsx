"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Dispatch, ReactNode, SetStateAction } from "react";

export function ActionAlertDialog({
  openDialog,
  setOpenDialog,
  title,
  description,
  cancelText = "Batal",
  actionText = "Lanjutkan",
  action,
  cancelAction = () => {},
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
  title: string;
  description?: string | ReactNode;
  cancelText?: string;
  actionText?: string;
  action: () => any;
  cancelAction?: () => any;
}) {
  return (
    <AlertDialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          {description && (
            <AlertDialogDescription>{description}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => cancelAction()}>
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => action()}
            className="bg-teal-600 hover:bg-teal-600/90"
          >
            {actionText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
