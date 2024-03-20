"use client";

import { UseFormReturn } from "react-hook-form";

import OriginPopover from "@/components/expressway/origin-popover";
import { FormField } from "@/components/ui/form";

interface OriginFieldProps {
  form: UseFormReturn<
    {
      vehicle_type: string;
      origin: string;
      destination: string;
    },
    any,
    undefined
  >;
}

export default function OriginField({ form }: OriginFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => <OriginPopover field={field} form={form} />}
      />
    </>
  );
}
