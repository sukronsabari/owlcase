"use server";

import { prisma } from "@/lib/db";

export interface SaveCaseConfig {
  colorId: string;
  finishId: string;
  materialId: string;
  modelId: string;
  imageConfigId: string;
}
export async function saveCaseOption({
  colorId,
  finishId,
  materialId,
  modelId,
  imageConfigId,
}: SaveCaseConfig): Promise<string> {
  const phoneModel = await prisma.caseModel.findUnique({
    where: {
      id: modelId,
    },
    include: {
      caseColors: { where: { id: colorId } },
      caseMaterials: { where: { id: materialId } },
      caseFinishes: { where: { id: finishId } },
    },
  });

  if (!phoneModel) {
    throw new Error(
      "Tidak dapat menemukan case model, silakan pilih model lain!"
    );
  }

  const { caseColors, caseFinishes, caseMaterials } = phoneModel;
  if (!caseColors.length || !caseFinishes.length || !caseMaterials.length) {
    throw new Error(
      "Terdapat atribut case yang tidak valid, periksa warna, material, dan finishing yang ada pilih!"
    );
  }

  const findImageConfig = await prisma.imageConfiguration.findUnique({
    where: { id: imageConfigId },
  });

  if (!findImageConfig) {
    throw new Error(
      "Tidak dapat menemukan gambar anda, tolong upload ulang gambar anda!"
    );
  }

  const caseOption = await prisma.caseOption.create({
    data: {
      imageConfigurationId: imageConfigId,
      caseModelId: modelId,
      caseColorId: colorId,
      caseMaterialId: materialId,
      caseFinishId: finishId,
    },
  });

  return caseOption.id;
}
