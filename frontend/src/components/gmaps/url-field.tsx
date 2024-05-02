"use client";

import { UseFormReturn } from "react-hook-form";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "../ui/input";

interface TrafficFieldProps {
  form: UseFormReturn<
    {
      url: string;
      vehicle_type: string;
    },
    any,
    undefined
  >;
}

export default function TrafficField({ form }: TrafficFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="url"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="traffic">URL (maps.app.goo.gl)</FormLabel>
            <FormControl>
              <Input type="text" id="url" placeholder="Url" {...field} />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
