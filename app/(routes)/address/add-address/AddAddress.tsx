"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import debounce from "debounce";
import { useForm } from "react-hook-form";
import { SingleValue } from "react-select";
import AsyncSelect from "react-select/async";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { SectionWrapper } from "@/components/SectionWrapper";

import { getAddressFromBiteshipAction, saveAddress } from "./actions";
import { addAddressFormSchema } from "./schema";

export function AddAddress({ totalAddress }: { totalAddress: number }) {
  const router = useRouter();
  const { toast } = useToast();
  const [addressInput, setAddressInput] = useState("");
  const [isPending, startTransition] = useTransition();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl");

  const form = useForm<z.infer<typeof addAddressFormSchema>>({
    resolver: zodResolver(addAddressFormSchema),
    defaultValues: {
      contactName: "",
      phoneNumber: "",
      mapAreaId: "",
      isMainAddress: totalAddress === 0 ? true : false,
    },
  });

  const fetchAddressOptions = async (inputValue: string) => {
    if (!inputValue) {
      return [];
    }
    const data = await getAddressFromBiteshipAction(inputValue);
    return data.map((address) => ({
      value: address.id,
      label: address.name,
    }));
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadAddressOptions = useCallback(
    debounce((inputText, callback) => {
      fetchAddressOptions(inputText).then((options) => callback(options));
    }, 1000),
    []
  );

  const handleSelectAddressChange = (
    selectedOption: SingleValue<{
      value: string;
      label: string;
    }>
  ) => {
    if (!selectedOption) return;
    form.setValue("mapAreaId", selectedOption!.value!);
    setAddressInput(""); // Reset the input
  };

  function onSubmit(values: z.infer<typeof addAddressFormSchema>) {
    startTransition(() => {
      saveAddress(values)
        .then(() => {
          if (callbackUrl) {
            router.push(callbackUrl);
          } else {
            router.push("/address");
          }
        })
        .catch((error) => {
          toast({
            title: "Ups, something went wrong!",
            description:
              "Failed to adding address, please check your connection" ||
              error.message,
            variant: "destructive",
          });
        });
    });
  }

  return (
    <SectionWrapper className="px-6 py-8 max-w-screen-sm min-h-screen">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div>
            <h2 className="mb-3 font-medium text-sm">Kontak</h2>
            <div className="flex flex-col gap-1">
              <FormField
                control={form.control}
                name="contactName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="bg-gray-50 border-gray-300 ring-gray-300"
                        placeholder="Full name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        {...field}
                        className="bg-gray-50 border-gray-300 ring-gray-300"
                        placeholder="Phone number"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-medium">Alamat</h3>
            <AsyncSelect
              cacheOptions
              defaultOptions
              onInputChange={(value) => setAddressInput(value)}
              onChange={(
                newValue: SingleValue<{
                  value: string;
                  label: string;
                }>
              ) => handleSelectAddressChange(newValue)}
              loadOptions={loadAddressOptions}
              placeholder="Cari lokasi anda..."
              noOptionsMessage={() =>
                addressInput
                  ? "Lokasi tidak ditemukan."
                  : "Masukkan lokasi untuk mencari"
              }
              styles={{
                control: (base) => ({
                  ...base,
                  backgroundColor: "hsla(0, 0%, 100%, 1) !important",
                }),
                input: (base) => ({
                  ...base,
                  "& input": {
                    fontFamily: "recursive",
                    fontSize: "14px !important",
                    fontWeight: "400",
                    paddingLeft: ".75 rem",
                    paddingTop: ".5rem",
                    paddingBottom: ".5rem",
                    lineHeight: "40px",
                  },
                }),
                placeholder: (base) => ({
                  ...base,
                  fontSize: "14px !important",
                  fontWeight: "400 !important",
                }),
              }}
            />
            <FormField
              control={form.control}
              name="addressDetail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="text"
                      {...field}
                      className="bg-gray-50 border-gray-300 ring-gray-300"
                      placeholder="Nama jalan, Gedung, No. Rumah, Kelurahan"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="isMainAddress"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center space-x-4 pt-3">
                      <Label>Set as primary address</Label>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={totalAddress === 0}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isPending}>
            Save
          </Button>
        </form>
      </Form>
    </SectionWrapper>
  );
}
