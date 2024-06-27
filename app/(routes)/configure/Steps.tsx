"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import { SectionWrapper } from "@/components/SectionWrapper";
import { cn } from "@/lib/utils";

const STEPS = [
  {
    name: "Step 1: Unggah Gambar",
    description: "Pilih gambar untuk case",
    url: "/upload",
  },
  {
    name: "Step 2: Desain Gambar",
    description: "Sesuaikan gambar anda",
    url: "/design",
  },
  {
    name: "Step 3: Hasil",
    description: "Preview hasil case anda",
    url: "/preview",
  },
];

export function Steps() {
  const pathname = usePathname();

  return (
    <>
      <>
        <ul className="bg-white lg:flex">
          {STEPS.map((step, index) => {
            const isCurrent = pathname.endsWith(step.url);
            const isCompleted = STEPS.slice(index + 1).some((step) =>
              pathname.endsWith(step.url)
            );
            const imgPath = `/images/owl/owl-${index + 1}.svg`;

            return (
              <li
                className="py-4 border-y border-y-gray-200 relative overflow-hidden lg:flex-1"
                key={index}
              >
                <span
                  className={cn(
                    "absolute top-0 left-0 w-1 h-full bg-gray-200 lg:top-auto lg:bottom-0 lg:w-full lg:h-1",
                    {
                      "bg-gray-500": isCurrent,
                      "bg-teal-600": isCompleted,
                    }
                  )}
                  aria-hidden
                />
                <div className="flex space-x-4 items-center pl-9">
                  <div className="flex">
                    <div className="w-20 h-20 overflow-hidden">
                      <Image
                        src={imgPath}
                        width={80}
                        height={80}
                        alt="menu image"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="font-medium">{step.name}</p>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>
                {index !== 0 ? (
                  <div className="absolute inset-0 hidden w-3 lg:block">
                    <svg
                      className="h-full w-full text-gray-300"
                      viewBox="0 0 12 82"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0.5 0V31L10.5 41L0.5 51V82"
                        stroke="currentcolor"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                ) : null}
              </li>
            );
          })}
        </ul>
      </>
    </>
  );
}
