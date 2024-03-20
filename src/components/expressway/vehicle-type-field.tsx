"use client";

import { UseFormReturn } from "react-hook-form";

import VehicleTypePopover from "@/components/expressway/vehicle-type-popover";
import { FormField } from "@/components/ui/form";

interface VehicleTypeFieldProps {
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

export default function VehicleTypeField({ form }: VehicleTypeFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="vehicle_type"
        render={({ field }) => <VehicleTypePopover field={field} form={form} />}
      />
    </>
  );
}
