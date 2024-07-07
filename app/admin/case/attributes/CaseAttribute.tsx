"use client";

import { useState } from "react";
import Image from "next/image";
import type { CaseColor, CaseFinish, CaseMaterial } from "@prisma/client";
import { Pencil, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/SectionWrapper";

import { CaseColorList } from "./CaseColorList";
import { CaseFinishList } from "./CaseFinishList";
import { CaseMaterialList } from "./CaseMaterialList";

export function CaseAttribute({
  caseColors,
  caseMaterials,
  caseFinishes,
}: {
  caseColors: CaseColor[];
  caseMaterials: CaseMaterial[];
  caseFinishes: CaseFinish[];
}) {
  const [activeColor, setActiveColor] = useState<CaseColor | null>(
    caseColors[0]
  );

  const [isEditColor, setIsEditColor] = useState(false);
  const [isEditMaterial, setIsEditMaterial] = useState(false);
  const [isEditFinish, setIsEditFinish] = useState(false);

  return (
    <SectionWrapper className="py-10 px-4">
      <>
        <h2 className="font-bold text-2xl mb-4">Case Atribut</h2>
        <div className="flex flex-col gap-8 border border-gray-300 p-8 lg:flex-row">
          <div className="relative max-w-[200px] mx-auto">
            <Image
              src="/images/phone-template.png"
              alt="case image"
              width={200}
              height={400}
              className="object-cover"
            />
            <div
              className="absolute inset-0 left-[3px] top-px right-[3px] bottom-px rounded-[29.5px] z-[-1]"
              style={{ backgroundColor: `${activeColor?.hex || "#FFF"}` }}
            />
          </div>
          <div className="flex-1">
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg">Daftar Warna Case</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditColor(!isEditColor)}
                >
                  {isEditColor ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CaseColorList
                caseColors={caseColors}
                isEditColor={isEditColor}
                activeColor={activeColor}
                setActiveColor={setActiveColor}
              />
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">Daftar Material Case</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditMaterial(!isEditMaterial)}
                >
                  {isEditMaterial ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CaseMaterialList
                caseMaterials={caseMaterials}
                isEditMaterial={isEditMaterial}
              />
            </div>
            <div className="mt-8">
              <div className="flex items-center justify-between mb-3">
                <h2 className="font-bold text-lg">Daftar Finishing Case</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsEditFinish(!isEditFinish)}
                >
                  {isEditFinish ? (
                    <X className="w-4 h-4" />
                  ) : (
                    <Pencil className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <CaseFinishList
                caseFinishes={caseFinishes}
                isEditFinish={isEditFinish}
              />
            </div>
          </div>
        </div>
      </>
    </SectionWrapper>
  );
}
