"use client";

import { SectionWrapper } from "@/components/SectionWrapper";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { ShippingAddress } from "@prisma/client";
import { EllipsisVertical, Pencil, Plus, Trash } from "lucide-react";
import {
  DropdownMenuGroup,
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { deleteAddressAction } from "./actions";
import { useState } from "react";

export function AddressList({ addresses }: { addresses: ShippingAddress[] }) {
  const router = useRouter();
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const { mutate: deleteAddress } = useMutation({
    mutationKey: ["delete-address"],
    mutationFn: async ({ id }: { id: string }) => await deleteAddressAction(id),
  });

  return (
    <SectionWrapper className="max-w-5xl min-h-screen pb-20">
      <h2 className="text-2xl font-medium mt-8">Daftar Alamat</h2>
      <div className="mx-auto py-8 grid grid-cols-1">
        {addresses.length ? (
          addresses.map((address) => (
            <div
              key={address.id}
              className="p-4 border-b border-b-gray-300 relative md:p-6"
            >
              <div className="space-y-1">
                <p className="font-medium">
                  {address.contactName} |{" "}
                  <span className="text-muted-foreground">
                    {address.phoneNumber}
                  </span>
                </p>
                <p>{address.addressDetail}</p>
                <p>
                  {address.city}, {address.province}
                </p>
                <p className="mb-4">{address.postalCode}</p>

                {address.isMainAddress && (
                  <div>
                    <Badge className="bg-teal-600 hover:bg-teal-600">
                      Utama
                    </Badge>
                  </div>
                )}

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-0 right-0 focus-visible:ring-0 focus-visible:ring-offset-0"
                    >
                      <EllipsisVertical className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      onClick={() => router.push(`/address/${address.id}`)}
                    >
                      <>
                        <Pencil className="w-4 h-4 mr-1.5 inline" />
                        Edit
                      </>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setOpenDeleteDialog(true)}>
                      <>
                        <Trash className="w-4 h-4 mr-1.5 inline" />
                        Hapus
                      </>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* DELETE ADDRES DIALOG */}
                <AlertDialog
                  open={openDeleteDialog}
                  onOpenChange={setOpenDeleteDialog}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Anda yakin akan menghapus alamat ini?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Jika anda setuju, tindakan ini tidak bisa dibatalkan
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-destructive hover:bg-destructive/90"
                        onClick={() => deleteAddress({ id: address.id })}
                      >
                        Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))
        ) : (
          <div className="p-4 border-b border-b-gray-300 relative md:p-6">
            <div className="space-y-1">
              <p>Belum ada alamat</p>
            </div>
          </div>
        )}
      </div>
      <Button
        size="sm"
        className="bg-teal-600 hover:bg-teal-600/90 font-normal"
        onClick={() => router.push("/address/add-address")}
      >
        Tambah Alamat
        <Plus className="w-4 h-4 ml-1.5 inline" />
      </Button>
    </SectionWrapper>
  );
}
