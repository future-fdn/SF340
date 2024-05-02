"use client";

import { UseFormReturn } from "react-hook-form";

import DestinationPopover from "@/components/train/destination-popover";
import OriginPopover from "@/components/train/origin-popover";
import { FormField } from "@/components/ui/form";
import axios from "axios";
import { useEffect, useState } from "react";
import { env } from "../../env";

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
      station_name_th: string | null;
      line_name_th: string | null;
      code: string | null;
    }[]
  >();

  const [destinations, setDestinations] = useState<
    {
      station_name_th: string | null;
      line_name_th: string | null;
      code: string | null;
    }[]
  >();

  useEffect(() => {
    const fetchOrigins = async () => {
      const result = await axios
        .get(env.NEXT_PUBLIC_API_URL + "/trains")
        .then((response) => response.data);

      // @ts-ignore
      function extractKeys(data, whitelist) {
        // @ts-ignore
        const result = [];
        // @ts-ignore
        data.lines.forEach((line) => {
          // @ts-ignore
          line.stations.forEach((station) => {
            const filtered_station = {};
            // @ts-ignore
            whitelist.forEach((key) => {
              if (station.hasOwnProperty(key)) {
                // @ts-ignore
                filtered_station[key] = station[key];
              }
            });
            result.push(filtered_station);
          });
        });
        // @ts-ignore
        return result;
      }

      // Specified keys to whitelist
      const whitelistKeys = ["station_name_th", "line_name_th", "code"];

      // Extract whitelisted keys from the station_name_th objects
      const whitelistedData = extractKeys(result, whitelistKeys);
      setOrigins(whitelistedData);
      setDestinations(whitelistedData);
    };

    fetchOrigins();
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
