"use client";

import Link from "next/link";
import { z } from "zod";
import { useEffect, useState, useTransition } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getReasonPhrase } from "http-status-codes";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { loginFormSchema } from "@/schemas/login";
import { LoginAction } from "@/actions/login";
import { OAuthButton } from "./OAuthButton";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export function LoginForm() {
  const session = useSession();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [urlError, setUrlError] = useState("");

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");
  const form = useForm<z.infer<typeof loginFormSchema>>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof loginFormSchema>) {
    startTransition(() => {
      LoginAction(values, "/").then(async (res) => {
        if (res && !res.success) {
          toast({
            title: getReasonPhrase(res.statusCode),
            description: res.message,
            variant: "destructive",
          });
        } else if (res && res.success) {
          session.update().then(() => {
            router.push(res?.data?.callbackUrl || "/");
          });
        }
      });
    });
  }

  useEffect(() => {
    const error =
      searchParams.get("error") === "OAuthAccountNotLinked"
        ? "Email already in use with different provider!"
        : "";

    if (error) {
      setUrlError(error);
    }
  }, [searchParams]);

  useEffect(() => {
    if (urlError) {
      toast({
        title: "Error",
        description: urlError,
        variant: "destructive",
      });
    }
  }, [urlError, toast]);

  return (
    <Form {...form}>
      <OAuthButton />
      <p className="text-muted-foreground text-center mt-4">Or</p>
      <Button onClick={() => session.update()}>Trigger Update</Button>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  {...field}
                  className="bg-gray-50 border-gray-300 ring-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  {...field}
                  className="bg-gray-50 border-gray-300 ring-gray-300"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full" disabled={isPending}>
          Sign in
        </Button>
      </form>
      <p className="mt-10 text-center">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="font-medium">
          Create one
        </Link>
      </p>
    </Form>
  );
}
