"use client";

import Image from "next/image";
import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";

import { cn } from "@/lib/utils";

import { SectionWrapper } from "@/components/SectionWrapper";
import { Phone } from "@/components/Phone";
import WhatPeopleBuyImg from "@/public/images/what-people-are-buying.png";

const PHONES = [
  "/images/testimonials/1.jpg",
  "/images/testimonials/2.jpg",
  "/images/testimonials/3.jpg",
  "/images/testimonials/4.jpg",
  "/images/testimonials/5.jpg",
  "/images/testimonials/6.jpg",
];

const splitArray = <T,>(array: Array<T>, numParts: number): Array<Array<T>> => {
  const result: Array<Array<T>> = [];
  for (let i = 0; i < array.length; i++) {
    const index = i % numParts;
    if (!result[index]) {
      result[index] = [];
    }
    result[index].push(array[i]);
  }
  return result;
};

interface ReviewProps {
  imgSrc: string;
  className?: string;
}

interface ReviewColumnProps {
  reviews: string[];
  msPerPixel: number;
  className?: string;
  reviewClassName?: (index: number) => string;
}

function Review({ imgSrc, className }: ReviewProps) {
  const POSSIBLE_ANIMATION_DELAYS = [0, 0.1, 0.2, 0.3, 0.4, 0.5];

  const animationDelay =
    POSSIBLE_ANIMATION_DELAYS[
      Math.floor(Math.random() * POSSIBLE_ANIMATION_DELAYS.length)
    ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, delay: animationDelay }}
      className={cn(
        "rounded-[2.25rem] bg-white p-4 opacity-0 shadow-xl shadow-slate-900/5 max-w-64",
        className
      )}
    >
      <Phone imgSrc={imgSrc} />
    </motion.div>
  );
}

function ReviewColumn({
  reviews,
  msPerPixel,
  className,
  reviewClassName,
  ...props
}: ReviewColumnProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new window.ResizeObserver(() => {
      setHeight(ref.current?.offsetHeight ?? 0);
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const cycleDuration = (height / 1000) * msPerPixel; // Calculate duration based on height and msPerPixel

  return (
    <motion.div
      ref={ref}
      initial={{ y: 0 }}
      animate={{ y: -height }}
      transition={{
        repeat: Infinity,
        duration: cycleDuration,
        ease: "linear",
      }}
      className="space-y-8 px-4 flex flex-col items-center"
      {...props}
    >
      <>
        {reviews.concat(reviews).map((imgSrc, index) => (
          <Review
            key={index}
            imgSrc={imgSrc}
            className={reviewClassName?.(index % reviews.length)}
          />
        ))}
      </>
    </motion.div>
  );
}

export function ReviewGrid() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.4 });

  const columns = splitArray(PHONES, 3);
  const column1 = columns[0];
  const column2 = columns[1];
  const column3 = splitArray(column2, 2);

  return (
    <div
      ref={containerRef}
      className="relative grid h-[49rem] max-h-[150vh] grid-cols-1 gap-8 items-center overflow-hidden md:grid-cols-2 lg:grid-cols-3"
    >
      {isInView && (
        <>
          <ReviewColumn
            reviews={[...column1, ...column3.flat(), ...column2]}
            reviewClassName={(reviewIndex) =>
              cn({
                "md:hidden": reviewIndex >= column1.length + column3[0].length,
                "lg:hidden": reviewIndex >= column1.length,
              })
            }
            msPerPixel={20}
          />
          <ReviewColumn
            reviews={[...column2, ...column3[1]]}
            className="hidden md:block"
            reviewClassName={(reviewIndex) =>
              reviewIndex >= column2.length ? "lg:hidden" : ""
            }
            msPerPixel={15}
          />
          <ReviewColumn
            reviews={column3.flat()}
            className="hidden md:block"
            msPerPixel={10}
          />
          <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-gray-100" />
          <div className="absolute bottom-0 inset-x-0 h-32 bg-gradient-to-t from-gray-100" />
        </>
      )}
    </div>
  );
}

export function Reviews() {
  return (
    <SectionWrapper className="relative max-w-5xl">
      <>
        <Image
          aria-hidden="true"
          src={WhatPeopleBuyImg}
          alt="what people buying img"
          className="absolute select-none hidden xl:block -left-32 top-1/3"
        />
        <ReviewGrid />
      </>
    </SectionWrapper>
  );
}
