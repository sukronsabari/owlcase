"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { addColorSchema } from "@/schemas/add-color.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { HexColorPicker } from "react-colorful";
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

import { createCaseColor } from "./actions";

export function CaseColorInput({
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addColorSchema>>({
    resolver: zodResolver(addColorSchema),
    defaultValues: {
      name: "",
      hex: "#000000",
    },
  });

  const watch = form.watch;
  const currentColor = watch("hex");

  function onSubmit(values: z.infer<typeof addColorSchema>) {
    startTransition(() => {
      createCaseColor(values)
        .then(() => {
          setOpenDialog(false);
          form.reset();
        })
        .catch((error) => {
          setOpenDialog(false);
          toast({
            title: "Gagal menambahkan case color",
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
          <DialogTitle>Tambah Warna</DialogTitle>
          <DialogDescription>Masukkan warna untuk case</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama warna</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: Black" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <div className="w-full overflow-hidden">
                  <HexColorPicker
                    className="!w-full"
                    color={currentColor}
                    onChange={(color) => form.setValue("hex", color)}
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <div
                    style={{ backgroundColor: currentColor }}
                    className="w-16 h-16 rounded-sm"
                  ></div>
                  <FormField
                    control={form.control}
                    name="hex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hex</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
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
