/* eslint-disable @next/next/no-img-element */
"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ImageIcon, MousePointerSquareDashed, RefreshCcw } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import useUploadCaseModelImage from "@/hooks/useUploadCaseModelImage";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/components/ui/use-toast";
import { SectionWrapper } from "@/components/SectionWrapper";

import { createCaseModel } from "./actions";
import { addCaseModelSchema } from "./schema";

const allowedFiles = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg"],
  "image/jpg": [".jpg"],
};

export function AddCaseModel() {
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm<z.infer<typeof addCaseModelSchema>>({
    resolver: zodResolver(addCaseModelSchema),
    defaultValues: {
      name: "",
      price: 0,
      url: "",
      edgeImgUrl: "",
    },
  });

  const url = form.watch("url");
  const edgeImgUrl = form.watch("edgeImgUrl");

  const caseImageUpload = useUploadCaseModelImage({ form, fieldName: "url" });
  const edgeImageUpload = useUploadCaseModelImage({
    form,
    fieldName: "edgeImgUrl",
  });

  const onSubmit = (values: z.infer<typeof addCaseModelSchema>) => {
    startTransition(() => {
      createCaseModel(values)
        .then(() => {
          form.reset();
          router.push("/admin/case/lists");
        })
        .catch((error) => {
          toast({
            title: "Terjadi Kesalahan",
            description: error.message || "Gagal menambahkan case model",
            variant: "destructive",
          });
          form.reset();
        });
    });
  };

  return (
    <SectionWrapper className="py-10 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-[600px] mx-auto"
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
            name="url"
            render={({}) => (
              <FormItem>
                <FormLabel className="font-bold">Case Image</FormLabel>
                {url ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img src={url} alt="image" className="h-full" />
                  </div>
                ) : (
                  <div>
                    <div
                      {...caseImageUpload.getRootProps()}
                      className="flex flex-col items-center justify-center aspect-video bg-gray-200/60 rounded-xl ring-1 ring-inset ring-gray-300 cursor-pointer"
                    >
                      <input {...caseImageUpload.getInputProps()} />
                      {caseImageUpload.isDragActive ? (
                        <>
                          <MousePointerSquareDashed
                            size={44}
                            className="mb-3 text-gray-500"
                          />
                          <p>Drop the files here ...</p>
                        </>
                      ) : caseImageUpload.isUploading ? (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <Progress
                              value={caseImageUpload.uploadProgress}
                              className="h-3 min-w-16"
                            />
                            <p>Uploading files...</p>
                          </div>
                        </>
                      ) : caseImageUpload.isPending ? (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <RefreshCcw size={44} className="text-gray-500" />
                            <p>Redirecting, please wait...</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <ImageIcon size={44} className="text-gray-500" />
                            <p>
                              <span className="font-bold">Click to upload</span>{" "}
                              or drag and drop your file (
                              {Object.values(allowedFiles)
                                .map((value) => value[0].split(".")[1])
                                .join(", ")}
                              )
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="edgeImgUrl"
            render={({}) => (
              <FormItem>
                <FormLabel className="font-bold">Case Image Edge</FormLabel>
                {edgeImgUrl ? (
                  <div className="relative aspect-video overflow-hidden">
                    <img src={edgeImgUrl} alt="image" className="h-full" />
                  </div>
                ) : (
                  <div>
                    <div
                      {...edgeImageUpload.getRootProps()}
                      className="flex flex-col items-center justify-center aspect-video bg-gray-200/60 rounded-xl ring-1 ring-inset ring-gray-300 cursor-pointer"
                    >
                      <input {...edgeImageUpload.getInputProps()} />
                      {edgeImageUpload.isDragActive ? (
                        <>
                          <MousePointerSquareDashed
                            size={44}
                            className="mb-3 text-gray-500"
                          />
                          <p>Drop the files here ...</p>
                        </>
                      ) : edgeImageUpload.isUploading ? (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <Progress
                              value={edgeImageUpload.uploadProgress}
                              className="h-3 min-w-16"
                            />
                            <p>Uploading files...</p>
                          </div>
                        </>
                      ) : edgeImageUpload.isPending ? (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <RefreshCcw size={44} className="text-gray-500" />
                            <p>Redirecting, please wait...</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
                            <ImageIcon size={44} className="text-gray-500" />
                            <p>
                              <span className="font-bold">Click to upload</span>{" "}
                              or drag and drop your file (
                              {Object.values(allowedFiles)
                                .map((value) => value[0].split(".")[1])
                                .join(", ")}
                              )
                            </p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                )}
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="bg-teal-600 hover:bg-teal-600/90"
            disabled={isPending || !url || !edgeImgUrl}
          >
            Simpan
          </Button>
        </form>
      </Form>
    </SectionWrapper>
  );
}
