"use client";

import { UseFormReturn } from "react-hook-form";

import DestinationPopover from "@/components/expressway/destination-popover";
import { FormField } from "@/components/ui/form";

interface DestinationFieldProps {
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

export default function DestinationField({ form }: DestinationFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => <DestinationPopover field={field} form={form} />}
      />
    </>
  );
}
