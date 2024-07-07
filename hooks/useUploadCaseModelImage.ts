import { useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { FileRejection, useDropzone } from "react-dropzone";
import { useTransition } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useUploadThing } from "@/lib/uploadthing";

const allowedFiles = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg"],
  "image/jpg": [".jpg"],
};
const useUploadCaseModelImage = ({
  form,
  fieldName,
}: {
  form: UseFormReturn<any, any, undefined>;
  fieldName: string;
}) => {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const [uploadProgress, setUploadProgress] = useState(0);

  const { startUpload, isUploading } = useUploadThing("uploadCaseModelImage", {
    onClientUploadComplete([data]) {
      const url = data.serverData?.url;
      form.setValue(fieldName, url);
    },
    onUploadProgress(p) {
      setUploadProgress(p);
    },
    onUploadError(error) {
      if (error.code === "TOO_LARGE" || error.code === "BAD_REQUEST") {
        toast({
          title: "Upload error!",
          description: "Check your file, the maximum file size is 8MB",
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
    onDropRejected,
    onDropAccepted,
    accept: allowedFiles,
    disabled: isUploading,
  });

  return {
    getRootProps,
    getInputProps,
    isDragActive,
    isUploading,
    isPending,
    uploadProgress,
  };
};

export default useUploadCaseModelImage;
