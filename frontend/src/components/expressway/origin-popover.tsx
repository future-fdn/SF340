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

interface OriginProps {
  field: ControllerRenderProps<
    { vehicle_type: string; origin: string; destination: string },
    "origin"
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

export default function OriginPopover({ field, form }: OriginProps) {
  const [open, setOpen] = useState(false);
  const [origins, setOrigins] =
    useState<{ toll_name: string | null; checkpoint_name: string | null }[]>();
  const [tollNames, setTollNames] = useState<{ toll_name: string | null }[]>();

  useEffect(() => {
    const fetchTollNames = async () => {
      const result = await axios
        .get(env.NEXT_PUBLIC_API_URL + "/tolls")
        .then((response: any) => response.data);

      // @ts-ignore
      function extractKeys(data, whitelist) {
        // @ts-ignore
        const result = [];
        // @ts-ignore
        data.tolls.forEach((toll) => {
          // @ts-ignore
          toll.checkpoints.forEach((checkpoint) => {
            const filtered_checkpoint = {};
            // @ts-ignore
            whitelist.forEach((key) => {
              if (checkpoint.hasOwnProperty(key)) {
                // @ts-ignore
                filtered_checkpoint[key] = checkpoint[key];
              }
            });
            result.push(filtered_checkpoint);
          });
        });
        // @ts-ignore
        return result;
      }

      // Specified keys to whitelist
      const whitelistKeys = ["toll_name", "checkpoint_name"];

      // Extract whitelisted keys from the station_name_th objects
      const whitelistedData = extractKeys(result, whitelistKeys);

      setTollNames(result.tolls);
      // @ts-ignore
      setOrigins(whitelistedData);
    };

    fetchTollNames();
  }, []);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel>Origin</FormLabel>
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
              {origins?.find(
                (origin) =>
                  origin.toll_name + "/" + origin.checkpoint_name ===
                  field.value,
              )?.toll_name &&
              origins?.find(
                (origin) =>
                  origin.toll_name + "/" + origin.checkpoint_name ===
                  field.value,
              )?.checkpoint_name ? (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint_name ===
                          field.value,
                      )?.toll_name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  >
                    {
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint_name ===
                          field.value,
                      )?.toll_name
                    }
                  </Badge>
                  <p className="w-full pl-2 text-left">
                    {
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint_name ===
                          field.value,
                      )?.checkpoint_name
                    }
                  </p>
                </>
              ) : (
                "Select origin"
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
              placeholder="Search origin..."
              className="h-9 font-thai text-sm"
            />
            <CommandList>
              <CommandEmpty>Origin not found.</CommandEmpty>
              {tollNames?.map((tollname) => (
                <CommandGroup heading={tollname.toll_name}>
                  {origins
                    ?.filter((obj) => obj.toll_name === tollname.toll_name)
                    .map((origin) => (
                      <CommandItem
                        value={origin.checkpoint_name ?? undefined}
                        key={origin.toll_name + "/" + origin.checkpoint_name}
                        onSelect={() => {
                          form.setValue(
                            "origin",
                            origin.toll_name + "/" + origin.checkpoint_name ??
                              "",
                          );
                          setOpen(false);
                        }}
                      >
                        {origin.checkpoint_name}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            origin.toll_name + "/" + origin.checkpoint_name ===
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
