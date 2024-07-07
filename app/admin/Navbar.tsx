"use client";

import { Button } from "@/components/ui/button";
import { useNavigationStore } from "@/stores";
import { Menu } from "lucide-react";

export function Navbar() {
  const [togleIsOpen] = useNavigationStore((state) => [state.toggleIsOpen]);

  return (
    <div className="flex sticky z-[45] top-0 left-0 xl:hidden items-center justify-between bg-white/75 backdrop-blur-lg px-6 h-16 xl:px-">
      <div></div>
      <Button variant="ghost" size="icon" onClick={() => togleIsOpen()}>
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  );
}
