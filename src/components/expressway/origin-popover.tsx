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
import { TollType, getOrigins, getTollNames } from "@/server/actions/queries";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

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
  const [origins, setOrigins] = useState<TollType[]>();
  const [tollNames, setTollNames] = useState<{ toll_name: string | null }[]>();

  useEffect(() => {
    const fetchOrigins = async () => {
      const result = await getOrigins();
      setOrigins(result);
    };

    fetchOrigins();
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
                  origin.toll_name + "/" + origin.checkpoint === field.value,
              )?.toll_name &&
              origins?.find(
                (origin) =>
                  origin.toll_name + "/" + origin.checkpoint === field.value,
              )?.checkpoint ? (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint ===
                          field.value,
                      )?.toll_name
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  >
                    {
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint ===
                          field.value,
                      )?.toll_name
                    }
                  </Badge>
                  <p className="w-full pl-2 text-left">
                    {
                      origins?.find(
                        (origin) =>
                          origin.toll_name + "/" + origin.checkpoint ===
                          field.value,
                      )?.checkpoint
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
                        value={origin.checkpoint ?? undefined}
                        key={origin.toll_name + "/" + origin.checkpoint}
                        onSelect={() => {
                          form.setValue(
                            "origin",
                            origin.toll_name + "/" + origin.checkpoint ?? "",
                          );
                          setOpen(false);
                        }}
                      >
                        {origin.checkpoint}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            origin.toll_name + "/" + origin.checkpoint ===
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
