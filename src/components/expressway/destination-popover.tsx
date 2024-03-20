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
import {
  TollType,
  getDestinations,
  getTollNames,
} from "@/server/actions/queries";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

interface DestinationProps {
  field: ControllerRenderProps<
    { vehicle_type: string; origin: string; destination: string },
    "destination"
  >;
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

export default function DestinationPopover({ field, form }: DestinationProps) {
  const [open, setOpen] = useState(false);
  const [destinations, setDestinations] = useState<TollType[]>();
  const [tollNames, setTollNames] = useState<{ toll_name: string | null }[]>();

  useEffect(() => {
    const fetchDestinations = async () => {
      const result = await getDestinations();
      setDestinations(result);
    };

    fetchDestinations();
  }, []);

  useEffect(() => {
    const fetchTollNames = async () => {
      const result = await getTollNames();
      setTollNames(result);
    };

    fetchTollNames();
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
                (destination) =>
                  destination.toll_name + "/" + destination.checkpoint ===
                  field.value,
              )?.toll_name &&
              destinations?.find(
                (destination) =>
                  destination.toll_name + "/" + destination.checkpoint ===
                  field.value,
              )?.checkpoint ? (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      destinations?.find(
                        (destination) =>
                          destination.toll_name +
                            "/" +
                            destination.checkpoint ===
                          field.value,
                      )?.toll_name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  >
                    {
                      destinations?.find(
                        (destination) =>
                          destination.toll_name +
                            "/" +
                            destination.checkpoint ===
                          field.value,
                      )?.toll_name
                    }
                  </Badge>
                  <p className="w-full pl-2 text-left">
                    {
                      destinations?.find(
                        (destination) =>
                          destination.toll_name +
                            "/" +
                            destination.checkpoint ===
                          field.value,
                      )?.checkpoint
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
              {tollNames?.map((tollname) => (
                <CommandGroup heading={tollname.toll_name}>
                  {destinations
                    ?.filter((obj) => obj.toll_name === tollname.toll_name)
                    .map((destination) => (
                      <CommandItem
                        value={destination.checkpoint ?? undefined}
                        key={
                          destination.toll_name + "/" + destination.checkpoint
                        }
                        onSelect={() => {
                          form.setValue(
                            "destination",
                            destination.toll_name +
                              "/" +
                              destination.checkpoint ?? "",
                          );
                          setOpen(false);
                        }}
                      >
                        {destination.checkpoint}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            destination.toll_name +
                              "/" +
                              destination.checkpoint ===
                              field.value
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
