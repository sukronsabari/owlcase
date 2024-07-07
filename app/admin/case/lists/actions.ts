"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { UserRole } from "@prisma/client";

import { prisma } from "@/lib/db";

export async function getCaseModels() {
  const caseModels = await prisma.caseModel.findMany({
    include: {
      caseColors: true,
      caseMaterials: true,
      caseFinishes: true,
    },
  });

  return caseModels;
}

export async function connectCaseColorsToCaseModel(
  caseModelId: string,
  colorIds: string[]
) {
  if (!colorIds.length) return;

  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Hanya admin yang dapat melakukan aksi ini");
  }

  const findCaseModel = await prisma.caseModel.findUnique({
    where: { id: caseModelId },
    select: {
      caseColors: true,
    },
  });
  const findCaseColors = await prisma.caseColor.findMany({
    where: {
      id: {
        in: colorIds,
      },
    },
  });

  if (!findCaseModel) {
    throw new Error("Terjadi kesalahan, case model tidak ditemukan!");
  }
  if (findCaseColors.length !== colorIds.length) {
    throw new Error(
      "Terjadi kesalahan, terdapat warna yang tidak tersedia, tolong periksa kembali!"
    );
  }

  const currentColorIds =
    findCaseModel.caseColors.map((color) => color.id) || [];

  const colorsToDisconnect = currentColorIds.filter(
    (id) => !colorIds.includes(id)
  );

  const updatedCaseModel = await prisma.caseModel.update({
    where: { id: caseModelId },
    data: {
      caseColors: {
        disconnect: colorsToDisconnect.map((id) => ({ id })),
        connect: findCaseColors.map((color) => ({ id: color.id })),
      },
    },
    include: {
      caseColors: true,
    },
  });

  revalidatePath("/case/lists");

  return updatedCaseModel;
}

export async function connectCaseMaterialToCaseModel(
  caseModelId: string,
  materialIds: string[]
) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Hanya admin yang dapat melakukan aksi ini");
  }

  const findCaseModel = await prisma.caseModel.findUnique({
    where: { id: caseModelId },
    include: {
      caseMaterials: true,
    },
  });

  if (!findCaseModel) {
    throw new Error("Terjadi kesalahan, case model tidak ditemukan!");
  }

  const findCaseMaterials = await prisma.caseMaterial.findMany({
    where: {
      id: {
        in: materialIds,
      },
    },
  });

  if (findCaseMaterials.length !== materialIds.length) {
    throw new Error(
      "Terjadi kesalahan, terdapat material yang tidak tersedia, tolong periksa kembali!"
    );
  }

  const currentMaterialIds = findCaseModel.caseMaterials.map(
    (material) => material.id
  );
  const materialsToDisconnect = currentMaterialIds.filter(
    (id) => !materialIds.includes(id)
  );

  const updatedCaseModel = await prisma.caseModel.update({
    where: { id: caseModelId },
    data: {
      caseMaterials: {
        disconnect: materialsToDisconnect.map((id) => ({ id })),
        connect: findCaseMaterials.map((material) => ({ id: material.id })),
      },
    },
    include: {
      caseMaterials: true,
    },
  });

  revalidatePath("/case/lists");

  return updatedCaseModel;
}

export async function connectCaseFinishToCaseModel(
  caseModelId: string,
  finishIds: string[]
) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, silahkan login terlebih dahulu");
  }

  if (session.user.role !== UserRole.ADMIN) {
    throw new Error("Hanya admin yang dapat melakukan aksi ini");
  }

  const findCaseModel = await prisma.caseModel.findUnique({
    where: { id: caseModelId },
    include: {
      caseFinishes: true,
    },
  });

  if (!findCaseModel) {
    throw new Error("Terjadi kesalahan, case model tidak ditemukan!");
  }

  const findCaseFinishes = await prisma.caseFinish.findMany({
    where: {
      id: {
        in: finishIds,
      },
    },
  });

  if (findCaseFinishes.length !== finishIds.length) {
    throw new Error(
      "Terjadi kesalahan, terdapat finishing yang tidak tersedia, tolong periksa kembali!"
    );
  }

  const currentFinishIds = findCaseModel.caseFinishes.map(
    (finish) => finish.id
  );
  const finishesToDisconnect = currentFinishIds.filter(
    (id) => !finishIds.includes(id)
  );

  const updatedCaseModel = await prisma.caseModel.update({
    where: { id: caseModelId },
    data: {
      caseFinishes: {
        disconnect: finishesToDisconnect.map((id) => ({ id })),
        connect: findCaseFinishes.map((finish) => ({ id: finish.id })),
      },
    },
    include: {
      caseFinishes: true,
    },
  });

  revalidatePath("/case/lists");

  return updatedCaseModel;
}
