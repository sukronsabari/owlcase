"use client";

import { User } from "next-auth";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
          <DropdownMenuItem
            role="button"
            className="cursor-pointer"
            onClick={() => router.push("/order")}
          >
            Pesanan Saya
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            role="button"
            className="cursor-pointer"
            onClick={() => signOut()}
          >
            Logout
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
