"use server";

import { auth } from "@/auth";
import { addCaseModelSchema } from "./schema";
import { UserRole } from "@prisma/client";
import { prisma } from "@/lib/db";
import { z } from "zod";
import { revalidatePath } from "next/cache";

export async function createCaseModel({
  name,
  price,
  url,
  edgeImgUrl,
}: z.infer<typeof addCaseModelSchema>) {
  const result = addCaseModelSchema.safeParse({ name, price, url, edgeImgUrl });

  if (!result.success) {
    throw new Error("Masukkan nama model, price upload gambar dengan benar!");
  }

  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Hanya admin yang dapat melakukan aksi ini");
  }

  await prisma.caseModel.create({
    data: {
      name,
      price,
      url,
      edgeImgUrl,
    },
  });

  revalidatePath("/admin/case/lists");
}