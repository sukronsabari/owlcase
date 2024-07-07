"use server";

import { revalidatePath } from "next/cache";
import { addColorSchema } from "@/schemas/add-color.schema";
import { addFinishingSchema } from "@/schemas/add-finisihing.schema";
import { addMaterialSchema } from "@/schemas/add-material.schema";
import { z } from "zod";

import { prisma } from "@/lib/db";

export async function createCaseColor(payload: z.infer<typeof addColorSchema>) {
  const result = addColorSchema.safeParse(payload);

  if (!result.success) {
    throw new Error("Terjadi kesalahan, periksa input yang anda masukkan!");
  }

  await prisma.caseColor.create({
    data: {
      name: payload.name,
      hex: payload.hex,
    },
  });

  revalidatePath("/case/attributes");
}

export async function createCaseMaterial(
  payload: z.infer<typeof addMaterialSchema>
) {
  const result = addMaterialSchema.safeParse(payload);

  if (!result.success) {
    throw new Error("Terjadi kesalahan, periksa input yang anda masukkan!");
  }

  await prisma.caseMaterial.create({
    data: {
      name: payload.name,
      price: payload.price,
      description: payload.description,
    },
  });

  revalidatePath("/case/attributes");
}

export async function createCaseFinishing(
  payload: z.infer<typeof addFinishingSchema>
) {
  const result = addFinishingSchema.safeParse(payload);

  if (!result.success) {
    throw new Error("Terjadi kesalahan, periksa input yang anda masukkan!");
  }

  await prisma.caseFinish.create({
    data: {
      name: payload.name,
      price: payload.price,
      description: payload.description,
    },
  });

  revalidatePath("/case/attributes");
}

export async function deleteCaseColorById(id: string) {
  const findCaseColor = await prisma.caseColor.findUnique({
    where: { id },
  });

  if (!findCaseColor) {
    throw new Error("Terjadi kesalahan, case color tidak ditemukan!");
  }

  await prisma.caseColor.delete({
    where: { id },
  });

  revalidatePath("/case/attributes");
}

export async function deleteCaseMaterialById(id: string) {
  const findCaseMaterial = await prisma.caseMaterial.findUnique({
    where: { id },
  });

  if (!findCaseMaterial) {
    throw new Error("Terjadi kesalahan, case material tidak ditemukan!");
  }

  await prisma.caseMaterial.delete({
    where: { id },
  });

  revalidatePath("/case/attributes");
}

export async function deleteCaseFinishById(id: string) {
  const findCaseFinish = await prisma.caseFinish.findUnique({
    where: { id },
  });

  if (!findCaseFinish) {
    throw new Error("Terjadi kesalahan, case finishing ini tidak ditemukan!");
  }

  await prisma.caseFinish.delete({
    where: { id },
  });

  revalidatePath("/case/attributes");
}
