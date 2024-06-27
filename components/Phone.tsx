import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import PhoneDark from "../public/images/phone-template-dark-edges.png";
import PhoneWhite from "../public/images/phone-template-white-edges.png";

interface PhoneProps extends HTMLAttributes<HTMLDivElement> {
  imgSrc: string;
  dark?: boolean;
  className?: string;
}

export function Phone({ dark, imgSrc, className, ...props }: PhoneProps) {
  return (
    <div
      className={cn(
        "relative z-20 pointer-events-none overflow-hidden",
        className
      )}
      {...props}
    >
      {dark ? (
        <Image
          src={PhoneDark}
          className="pointer-events-none select-none"
          alt="phone image"
        />
      ) : (
        <Image
          src={PhoneWhite}
          className="pointer-events-none select-none"
          alt="phone image"
        />
      )}
      <div className="absolute -z-10 inset-0">
        <Image
          src={imgSrc}
          fill
          alt="overlaying phone image"
          className="object-cover min-w-full min-h-full"
          sizes="(min-width: 100%), (min-height: 100%)"
        />
      </div>
    </div>
  );
}
