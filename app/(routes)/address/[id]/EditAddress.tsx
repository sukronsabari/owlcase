"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import AsyncSelect from "react-select/async";
import { SingleValue } from "react-select";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCallback, useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { SectionWrapper } from "@/components/SectionWrapper";
import debounce from "debounce";

import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { editAddressFormSchema } from "./schema";
import type { ShippingAddress } from "@prisma/client";
import { getAddressFromBiteshipAction } from "../add-address/actions";
import { editAddressAction } from "./actions";

export function EditAddress({ address }: { address: ShippingAddress }) {
  const router = useRouter();
  const { toast } = useToast();
  const [addressInput, setAddressInput] = useState("");
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof editAddressFormSchema>>({
    resolver: zodResolver(editAddressFormSchema),
    defaultValues: {
      contactName: address.contactName,
      phoneNumber: address.phoneNumber,
      mapAreaId: address.mapAreaId,
      isMainAddress: address.isMainAddress,
      addressDetail: address.addressDetail,
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

  function onSubmit(values: z.infer<typeof editAddressFormSchema>) {
    startTransition(() => {
      editAddressAction({ ...values, id: address.id })
        .then(() => {
          router.push("/address");
        })
        .catch((error) => {
          toast({
            title: "Ups, something went wrong!",
            description: error?.message || "Gagal mengedit alamat",
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
              defaultInputValue={`${address.district}, ${address.city}, ${address.province}. ${address.postalCode}`}
              onChange={(
                newValue: SingleValue<{
                  value: string;
                  label: string;
                }>
              ) => handleSelectAddressChange(newValue)}
              loadOptions={loadAddressOptions}
              noOptionsMessage={() =>
                addressInput
                  ? "Lokasi tidak ditemukan."
                  : "Masukkan lokasi untuk mencari"
              }
              styles={{
                control: (base, props) => ({
                  ...base,
                  backgroundColor: "hsla(0, 0%, 100%, 1) !important",
                }),
                input: (base, props) => ({
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
                placeholder: (base, props) => ({
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
