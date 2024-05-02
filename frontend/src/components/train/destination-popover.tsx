"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  FormControl,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";
import { env } from "../../env";

interface DestinationProps {
  field: ControllerRenderProps<
    { origin: string; destination: string },
    "destination"
  >;
  form: UseFormReturn<
    {
      origin: string;
      destination: string;
    },
    any,
    undefined
  >;
  destinations: {
    station_name_th: string | null;
    line_name_th: string | null;
    code: string | null;
  }[];
}

export default function DestinationPopover({
  field,
  form,
  destinations,
}: DestinationProps) {
  const [open, setOpen] = useState(false);
  const [lineNames, setLineNames] = useState<
    {
      line_name_th: string | null;
    }[]
  >();

  useEffect(() => {
    const fetchLineNames = async () => {
      const result = await axios
        .get(env.NEXT_PUBLIC_API_URL + "/trains")
        .then((response: any) => response.data);

      setLineNames(result.lines);
    };

    fetchLineNames();
  }, []);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel>Destination</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant="outline"
              role="combobox"
              className={cn(
                "w-full justify-between",
                !field.value && "text-muted-foreground",
              )}
            >
              {destinations?.find(
                (destination) => destination.code === field.value,
              )?.code ? (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      destinations?.find(
                        (destination) => destination.code === field.value,
                      )?.code
                        ? "opacity-100"
                        : "opacity-0",
                      "mr-1",
                    )}
                  >
                    {
                      destinations?.find(
                        (destination) => destination.code === field.value,
                      )?.line_name_th
                    }
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      destinations?.find(
                        (destination) => destination.code === field.value,
                      )?.code
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  >
                    {
                      destinations?.find(
                        (destination) => destination.code === field.value,
                      )?.code
                    }
                  </Badge>
                  <p className="w-full pl-2 text-left">
                    {
                      destinations?.find(
                        (destination) => destination.code === field.value,
                      )?.station_name_th
                    }
                  </p>
                </>
              ) : (
                "Select destination"
              )}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="popover-content-width-same-as-its-trigger p-0 font-thai"
        >
          <Command>
            <CommandInput
              placeholder="Search destination..."
              className="h-9 font-thai text-sm"
            />
            <CommandList>
              <CommandEmpty>Destination not found.</CommandEmpty>
              {lineNames?.map((linename) => (
                <CommandGroup heading={linename.line_name_th}>
                  {destinations
                    ?.filter(
                      (obj) => obj.line_name_th === linename.line_name_th,
                    )
                    .map((destination) => (
                      <CommandItem
                        value={destination.station_name_th ?? undefined}
                        key={destination.code}
                        onSelect={() => {
                          form.setValue("destination", destination.code ?? "");
                          setOpen(false);
                        }}
                      >
                        {destination.station_name_th}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            destination.code === field.value
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                      </CommandItem>
                    ))}
                </CommandGroup>
              ))}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
