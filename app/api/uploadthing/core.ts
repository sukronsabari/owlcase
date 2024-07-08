import sharp from "sharp";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

import { prisma } from "@/lib/db";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .input(z.object({ imageConfigId: z.string().optional() }))
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      //   // This code runs on your server before upload
      //   const user = await auth(req);

      //   // If you throw, the user will not be able to upload
      //   if (!user) throw new UploadThingError("Unauthorized");

      //   // Whatever is returned here is accessible in onUploadComplete as `metadata`
      //   return { userId: user.id };

      return { input };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      const imageConfigId = metadata.input?.imageConfigId;

      const res = await fetch(file.url);
      const buffer = await res.arrayBuffer();

      const imgMetadata = await sharp(buffer).metadata();
      const { width, height } = imgMetadata;

      if (!imageConfigId) {
        const imageConfig = await prisma.imageConfiguration.create({
          data: {
            url: file.url,
            width: width || 500,
            height: height || 500,
          },
        });

        return { imageConfigId: imageConfig.id };
      } else {
        const croppedImageConfig = await prisma.imageConfiguration.update({
          where: { id: imageConfigId },
          data: {
            croppedImageUrl: file.url,
          },
        });

        return { imageConfigId: croppedImageConfig.id };
      }
    }),
  uploadCaseModelImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 1 },
    // eslint-disable-next-line no-unused-vars
  }).onUploadComplete(async ({ metadata, file }) => {
    return { url: file.url };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
