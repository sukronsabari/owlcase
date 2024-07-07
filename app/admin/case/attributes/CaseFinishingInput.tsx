"use client";

import { Dispatch, SetStateAction, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addFinishingSchema } from "@/schemas/add-finisihing.schema";
import { createCaseFinishing } from "./actions";
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
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

export function CaseFinishingInput({
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof addFinishingSchema>>({
    resolver: zodResolver(addFinishingSchema),
    defaultValues: {
      name: "",
      price: 0,
      description: "",
    },
  });

  function onSubmit(values: z.infer<typeof addFinishingSchema>) {
    startTransition(() => {
      createCaseFinishing(values)
        .then(() => {
          setOpenDialog(false);
          form.reset();
        })
        .catch((error) => {
          setOpenDialog(false);
          toast({
            title: "Gagal menambahkan finishing case",
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
          <DialogTitle>Tambah Finishing</DialogTitle>
          <DialogDescription>Masukkan finishing untuk case</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nama finishing</FormLabel>
                    <FormControl>
                      <Input placeholder="Contoh: soft finishing" {...field} />
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
                        placeholder="Contoh: nyaman untuk di genggam"
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
