"use client";

import { useRouter } from "next/navigation";
import { LogOut, ShoppingBag } from "lucide-react";
import { User } from "next-auth";
import { signOut } from "next-auth/react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { Button } from "./ui/button";

export function UserLoggedIn({ user }: { user: User }) {
  const router = useRouter();
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-transparent focus-visible:ring-transparent"
          >
            <Avatar>
              <AvatarFallback className="text-gray-900">
                {user.name?.slice(0, 1) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="z-[999999]">
          <DropdownMenuLabel>Menu</DropdownMenuLabel>
          <DropdownMenuSub>
            <DropdownMenuItem
              onClick={() => router.push("/orders")}
              className="py-3 cursor-pointer"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Pesanan Saya</span>
            </DropdownMenuItem>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            role="button"
            className="cursor-pointer py-2"
            onClick={() => signOut()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
