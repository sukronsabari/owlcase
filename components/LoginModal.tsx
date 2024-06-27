"use client";

import type { Dispatch, SetStateAction } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";
import { Icons } from "./Icons";

export function LoginModal({
  isOpen,
  setIsOpen,
  title,
  description,
  callbackUrl,
}: {
  isOpen: boolean;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  title: string;
  description: string;
  callbackUrl?: string | undefined;
}) {
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <div className="flex items-end justify-center">
            <DialogTitle className="text-3xl text-center font-bold tracking-tight text-gray-900">
              {title}
            </DialogTitle>
            <div className="relative w-10 h-10 mb-2">
              <Image
                src="/images/owl/owl-3.svg"
                alt="snake image"
                className="object-contain"
                fill
              />
            </div>
          </div>
          <DialogDescription className="text-base text-center py-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 justify-start">
          <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full justify-start"
          >
            <Icons.google className="w-5 h-5 mr-3 inline-block" />
            Continue with google
          </Button>
          {/* <Button
            variant="outline"
            onClick={() => signIn("google", { callbackUrl })}
            className="w-full justify-start"
          >
            <Icons.github className="w-5 h-5 mr-3 inline-block" />
            Continue with github
          </Button> */}
        </div>
        <p className="mt-4 text-muted-foreground text-xs">
          By creating an account, you agree to our{" "}
          <span className="text-gray-900">Terms of Service</span> and{" "}
          <span className="text-gray-900">Privacy Policy.</span>
        </p>
      </DialogContent>
    </Dialog>
  );
}
