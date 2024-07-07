"use server";

import { unstable_cache } from "next/cache";
import { getRegencies, Province } from "idn-area-data";

export const fetchProvinces = unstable_cache(async () => {
  const response = await fetch(
    "https://idn-area.up.railway.app/provinces?limit=38"
  );
  const provinces = await response.json();

  return provinces.data as Province[];
}, ["get-provinces"]);

export const fetchCityByProvince = async (provinceName: string) => {
  const provinces = await fetchProvinces();

  const findProvince = provinces.find(
    (province) => province.name === provinceName
  );

  if (!findProvince) {
    throw new Error("Province not found!");
  }

  const regencies = await getRegencies({ transform: true });
  const availabelRegencies = regencies.filter(
    (regency) => regency.provinceCode === findProvince?.code
  );

  return availabelRegencies;
};
