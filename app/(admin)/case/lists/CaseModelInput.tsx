"use client";

import Image from "next/image";
import {
  Dispatch,
  SetStateAction,
  useTransition,
  useCallback,
  useState,
} from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { addModelSchema } from "./schema";
// import { createCaseColor } from "./actions";
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
import { HexColorPicker } from "react-colorful";
import { useToast } from "@/components/ui/use-toast";

import { FileRejection, useDropzone } from "react-dropzone";
import { ImageIcon, MousePointerSquareDashed, RefreshCcw } from "lucide-react";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";
import { createCaseModel } from "./actions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useQueryClient } from "@tanstack/react-query";

const allowedFiles = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg"],
  "image/jpg": [".jpg"],
};

export function CaseModelInput({
  openDialog,
  setOpenDialog,
}: {
  openDialog: boolean;
  setOpenDialog: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState(0);

  const form = useForm<z.infer<typeof addModelSchema>>({
    resolver: zodResolver(addModelSchema),
    defaultValues: {
      name: "",
      price: 0,
      url: "",
    },
  });

  const url = form.watch("url");

  const { startUpload, isUploading } = useUploadThing("uploadCaseModelImage", {
    onClientUploadComplete([data]) {
      const url = data.serverData?.url;
      form.setValue("url", url);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
    onUploadError(error) {
      if (error.code == "TOO_LARGE" || error.code == "BAD_REQUEST") {
        toast({
          title: "Upload error!",
          description: "Check your file, the maximum of file is 8MB",
          variant: "destructive",
        });
      }
    },
  });
  const onDropAccepted = useCallback(
    (acceptedFiles: File[]) => {
      startTransition(() => {
        startUpload(acceptedFiles);
      });
    },
    [startUpload]
  );

  const onDropRejected = useCallback(
    (acceptedFiles: FileRejection[]) => {
      toast({
        title: `${acceptedFiles[0].file.type} type is not supported.`,
        description: "Please choose a PNG, JPG, or JPEG image instead.",
        variant: "destructive",
      });
    },
    [toast]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected: onDropRejected,
    onDropAccepted,
    accept: allowedFiles,
    disabled: isUploading,
  });

  function onSubmit(values: z.infer<typeof addModelSchema>) {
    startTransition(() => {
      createCaseModel(values)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["case-models"] });
          setOpenDialog(false);
        })
        .catch((error) => {
          toast({
            title: "Terjadi Kesalahan",
            description: error.message || "Gagal menambahkan case model",
            variant: "destructive",
          });
          setOpenDialog(false);
        });
    });
  }

  return (
    <Dialog
      open={openDialog}
      onOpenChange={(open) => {
        setOpenDialog(open);
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Tambah Model Case</DialogTitle>
          <DialogDescription>Masukkan model case hp</DialogDescription>
        </DialogHeader>
        <ScrollArea className="relative h-[300px] overflow-x-visible overflow-y-auto rounded-none">
          <div className="grid gap-4 py-4 px-8">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nama model</FormLabel>
                      <FormControl>
                        <Input placeholder="Contoh: IPhone 11" {...field} />
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
                        <Input type="number" placeholder="0" {...field} />
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
                      <>
                        {url ? (
                          <div className="relative aspect-[70/144]">
                            <Image
                              src={form.getValues("url")}
                              fill
                              alt="image"
                            />
                          </div>
                        ) : (
                          <div>
                            <div
                              {...getRootProps()}
                              className="flex flex-col items-center justify-center aspect-video bg-gray-200/60 rounded-xl ring-1 ring-inset ring-gray-300 cursor-pointer"
                            >
                              <input {...getInputProps()} />
                              {isDragActive ? (
                                <>
                                  <MousePointerSquareDashed
                                    size={44}
                                    className="mb-3 text-gray-500"
                                  />
                                  <p>Drop the files here ...</p>
                                </>
                              ) : isUploading ? (
                                <>
                                  <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                                    <Progress
                                      value={uploadProgress}
                                      className="h-3 min-w-16"
                                    />
                                    <p>Uploading files...</p>
                                  </div>
                                </>
                              ) : isPending ? (
                                <>
                                  <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                                    <RefreshCcw
                                      size={44}
                                      className="text-gray-500"
                                    />
                                    <p>Redirecting, please wait...</p>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                                    <ImageIcon
                                      size={44}
                                      className="text-gray-500"
                                    />
                                    {/* <Progress value={20} className="h-3" /> */}
                                    <p>
                                      <span className="font-bold">
                                        Click to upload
                                      </span>{" "}
                                      or drag and drop your file (
                                      {Object.values(allowedFiles)
                                        .map((value) => value[0].split(".")[1])
                                        .join(", ")}
                                      )
                                    </p>
                                  </div>
                                  {/* <p className="mt-2 text-sm uppercase"></p> */}
                                </>
                              )}
                            </div>
                          </div>
                        )}
                      </>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-600/90"
                    disabled={isPending || !url}
                  >
                    Simpan
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
