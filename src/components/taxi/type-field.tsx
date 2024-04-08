"use client";

import { UseFormReturn } from "react-hook-form";

import { FormField } from "@/components/ui/form";
import TypePopover from "./type-popover";

interface TypeFieldProps {
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

export default function TypeField({ form }: TypeFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="type"
        render={({ field }) => <TypePopover field={field} form={form} />}
      />
    </>
  );
}
