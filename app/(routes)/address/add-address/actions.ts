"use server";

import { prisma } from "@/lib/db";
import { z } from "zod";
import { addAddressFormSchema } from "./schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

interface BiteshipArea {
  id: string;
  name: string;
  country_name: string;
  country_code: string;
  administrative_division_level_1_name: string;
  administrative_division_level_1_type: string;
  administrative_division_level_2_name: string;
  administrative_division_level_2_type: string;
  administrative_division_level_3_name: string;
  administrative_division_level_3_type: string;
  postal_code: number;
}
interface BiteshipAddressResponse {
  success: boolean;
  areas: BiteshipArea[];
}

export async function saveAddress({
  contactName,
  phoneNumber,
  mapAreaId,
  addressDetail,
  isMainAddress,
}: z.infer<typeof addAddressFormSchema>) {
  const session = await auth();

  if (!session?.user.id) {
    throw new Error("Anda belum login, login terlebih dahulu!");
  }

  if (isMainAddress) {
    const mainAddress = await prisma.shippingAddress.findFirst({
      where: { isMainAddress: true },
    });

    if (mainAddress) {
      await prisma.shippingAddress.update({
        where: { id: mainAddress.id },
        data: {
          isMainAddress: false,
        },
      });
    }
  }

  const response = await fetch(
    `${process.env.BITESHIP_BASE_URL!}/v1/maps/areas/${mapAreaId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: process.env.BITESHIP_API_KEY!,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Terjadi kesalahan, periksa alamat yang anda pilih!");
  }

  const responseJson = (await response.json()) as BiteshipAddressResponse;
  const areas = responseJson.areas;

  await prisma.shippingAddress.create({
    data: {
      userId: session.user.id,
      isMainAddress,
      contactName,
      phoneNumber,
      mapAreaId,
      addressDetail,
      province: areas[0].administrative_division_level_1_name,
      city: areas[0].administrative_division_level_2_name,
      district: areas[0].administrative_division_level_3_name,
      postalCode: areas[0].postal_code.toString(),
    },
  });

  revalidatePath("/address");
  revalidatePath("/checkout");
}

export async function getAddressFromBiteshipAction(input: string) {
  const urlInput = input.split(" ").join("+");
  const response = await fetch(
    `${process.env
      .BITESHIP_BASE_URL!}/v1/maps/areas?countries=ID&input=${urlInput}&type=single`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: process.env.BITESHIP_API_KEY!,
      },
    }
  );

  const responseJson = (await response.json()) as BiteshipAddressResponse;
  return responseJson?.areas || [];
}
