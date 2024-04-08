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

interface DistanceFieldProps {
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

export default function DistanceField({ form }: DistanceFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="distance"
        render={({ field }) => (
          <FormItem>
            <FormLabel htmlFor="distance">Distance (km)</FormLabel>
            <FormControl>
              <Input
                type="number"
                id="distance"
                placeholder="Distance"
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
