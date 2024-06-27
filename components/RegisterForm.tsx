"use client";

import Link from "next/link";
import { z } from "zod";
import { useTransition } from "react";
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
import { registerFormSchema } from "@/schemas/register";
import { registerAction } from "@/actions/register";
import { useToast } from "@/components/ui/use-toast";
import { OAuthButton } from "./OAuthButton";

export function RegisterForm() {
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const form = useForm<z.infer<typeof registerFormSchema>>({
    resolver: zodResolver(registerFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof registerFormSchema>) {
    startTransition(() => {
      registerAction(values).then((res) => {
        if (res.success) {
          toast({
            title: getReasonPhrase(res.statusCode),
            description: res.message,
          });

          form.reset();
        } else {
          toast({
            title: getReasonPhrase(res.statusCode),
            description: res.message,
            variant: "destructive",
          });
        }
      });
    });
  }

  return (
    <Form {...form}>
      <OAuthButton callbackUrl="/" />
      <p className="text-muted-foreground text-center mt-4">Or</p>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input
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
          Create your account
        </Button>
      </form>
      <p className="mt-10 text-center">
        Already have an account?{" "}
        <Link href="/auth/login" className="font-medium">
          Sign in
        </Link>
      </p>
    </Form>
  );
}
