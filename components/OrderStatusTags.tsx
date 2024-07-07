"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { Badge } from "./ui/badge";

interface Status {
  name: string;
  value: string;
}

interface OrderStatusTagsProps {
  tags: Status[];
}

export function OrderStatusTags({ tags }: OrderStatusTagsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const activeTag = searchParams.get("status") || tags[0].value;

  const setFilter = (tagValue: string) => {
    const newParams = new URLSearchParams();
    newParams.set("status", tagValue);
    router.push(`?${newParams.toString()}`);
  };

  return (
    <div className="space-y-4 w-full overflow-x-auto whitespace-nowrap no-scrollbar">
      {/* <div className="w-full"> */}
      {tags.map((tag) => (
        <Badge
          variant={activeTag === tag.value ? "default" : "outline"}
          key={tag.value}
          onClick={() => setFilter(tag.value)}
          className="cursor-pointer line-clamp-1 inline-flex py-2 ml-4 scrol"
        >
          {tag.name}
        </Badge>
      ))}
      {/* </div> */}
    </div>
  );
}
