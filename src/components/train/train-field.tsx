"use client";

import { UseFormReturn } from "react-hook-form";

import DestinationPopover from "@/components/train/destination-popover";
import OriginPopover from "@/components/train/origin-popover";
import { FormField } from "@/components/ui/form";
import { useEffect, useState } from "react";
import { getTrainStations } from "../../server/actions/queries";

interface OriginFieldProps {
  form: UseFormReturn<
    {
      origin: string;
      destination: string;
    },
    any,
    undefined
  >;
}

export default function TrainField({ form }: OriginFieldProps) {
  const [origins, setOrigins] = useState<
    {
      station: string | null;
      line_name: string | null;
      code: string | null;
    }[]
  >();

  const [destinations, setDestinations] = useState<
    {
      station: string | null;
      line_name: string | null;
      code: string | null;
    }[]
  >();

  useEffect(() => {
    const fetchOrigins = async () => {
      const result = await getTrainStations();
      setOrigins(result);
    };

    fetchOrigins();
  }, []);

  useEffect(() => {
    const fetchDestinations = async () => {
      const result = await getTrainStations();
      setDestinations(result);
    };

    fetchDestinations();
  }, []);

  return (
    <>
      <FormField
        control={form.control}
        name="origin"
        render={({ field }) => (
          <OriginPopover field={field} form={form} origins={origins!} />
        )}
      />
      <FormField
        control={form.control}
        name="destination"
        render={({ field }) => (
          <DestinationPopover
            field={field}
            form={form}
            destinations={destinations!}
          />
        )}
      />
    </>
  );
}
