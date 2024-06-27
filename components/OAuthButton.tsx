"use client";

import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/Icons";
import { useSearchParams } from "next/navigation";

export function OAuthButton({ callbackUrl }: { callbackUrl?: string }) {
  const searchParams = useSearchParams();
  const url = callbackUrl || (searchParams.get("callbackUrl") ?? "/");

  const handleClick = async (provider: "google" | "github") => {
    await signIn(provider);
  };
  return (
    <div className="space-y-3">
      <Button
        type="button"
        onClick={() => signIn("google", { callbackUrl: url })}
        variant="ghost"
        size="lg"
        className="w-full space-x-3 bg-gray-100 text-gray-900"
      >
        <Icons.google className="w-5 h-5" />
        <span>Continue with Google</span>
      </Button>
      <Button
        type="button"
        onClick={() => signIn("github", { callbackUrl: url })}
        variant="ghost"
        size="lg"
        className="w-full space-x-3 bg-gray-100 text-gray-900"
      >
        <Icons.github className="w-6 h-6" />
        <span>Continue with Github</span>
      </Button>
    </div>
  );
}
