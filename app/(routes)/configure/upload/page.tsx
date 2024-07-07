import { Metadata } from "next";

import { UploadForm } from "./UploadPage";

export const metadata: Metadata = {
  title: "Upload Image",
};

export default async function UploadPage() {
  return <UploadForm />;
}
