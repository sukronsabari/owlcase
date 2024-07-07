"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { addMaterialSchema } from "@/schemas/add-material.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

import { createCaseMaterial } from "./actions";

export function CaseMaterialInput({
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addMaterialSchema>>({
    resolver: zodResolver(addMaterialSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof addMaterialSchema>) {
    startTransition(() => {
      createCaseMaterial(values)
        .then(() => {
          setOpenDialog(false);
          form.reset();
        })
        .catch((error) => {
          setOpenDialog(false);
          toast({
            title: "Gagal menambahkan case material",
            description: error.message,
            variant: "destructive",
          });
        });
    });
  }

  return (
    <Dialog open={openDialog} onOpenChange={(open) => setOpenDialog(open)}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Material</DialogTitle>
          <DialogDescription>Masukkan material untuk case</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama material</FormLabel>
                    <FormControl>
                      <Input placeholder="Material" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Harga</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Deskripsi</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Contoh: tidak meninggalkan sidik jari"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-teal-600 hover:bg-teal-600/90"
                  disabled={isPending}
                >
                  Simpan
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
