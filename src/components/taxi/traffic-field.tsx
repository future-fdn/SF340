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
      distance: number;
      traffic: number;
      type: string;
      is_airport?: boolean;
      is_commu?: boolean;
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
        name="traffic"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="traffic">In Traffic (mins)</FormLabel>
            <FormControl>
              <Input
                type="number"
                id="traffic"
                placeholder="Traffic"
                {...field}
              />
            </FormControl>

            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}
