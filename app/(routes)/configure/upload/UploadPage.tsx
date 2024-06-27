"use client";

import { useCallback, useState, useTransition } from "react";
import { FileRejection, useDropzone } from "react-dropzone";
import { ImageIcon, MousePointerSquareDashed, RefreshCcw } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { Progress } from "@/components/ui/progress";

const allowedFiles = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg"],
  "image/jpg": [".jpg"],
};

export function UploadForm() {
  const router = useRouter();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    onClientUploadComplete([data]) {
      const configId = data.serverData.imageConfigId;
      startTransition(() =>
        router.push(`/configure/design?imageConfigId=${configId}`)
      );
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
      startUpload(acceptedFiles, { imageConfigId: undefined });
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

  return (
    <div
      {...getRootProps()}
      className="my-16 flex flex-col items-center justify-center aspect-video bg-gray-200/60 rounded-xl ring-1 ring-inset ring-gray-300 cursor-pointer"
    >
      <input {...getInputProps()} />
      {isDragActive ? (
        <>
          <MousePointerSquareDashed size={44} className="mb-3 text-gray-500" />
          <p>Drop the files here ...</p>
        </>
      ) : isUploading ? (
        <>
          <div className="flex flex-col items-center justify-center text-center text-sm gap-3 mx-6">
            <Progress value={uploadProgress} className="h-3 min-w-16" />
            <p>Uploading files...</p>
          </div>
        </>
      ) : isPending ? (
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
            {/* <Progress value={20} className="h-3" /> */}
            <p>
              <span className="font-bold">Click to upload</span> or drag and
              drop your file
            </p>
          </div>
          <p className="mt-2 text-sm uppercase">
            {Object.values(allowedFiles)
              .map((value) => value[0].split(".")[1])
              .join(", ")}
          </p>
        </>
      )}
    </div>
  );
}
