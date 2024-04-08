"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandItem, CommandList } from "@/components/ui/command";
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
import { useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

export const taxi_types: Record<string, string> = {
  "1.1": "รถแท็กซี่เก๋งสามตอน",
  "1.2": "รถแท็กซี่เก๋งสามตอนแวน",
  "1.3": "รถแท็กซี่นั่งสามตอน",
  "1.4": "รถแท็กซี่นั่งสามตอนแวน",
  "2": "รถแท็กซี่ธรรมดา",
};

interface TypeProps {
  field: ControllerRenderProps<
    {
      distance: number;
      traffic: number;
      type: string;
      is_airport?: boolean;
      is_commu?: boolean;
    },
    "type"
  >;
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

export default function TypePopover({ field, form }: TypeProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel>Taxi Type</FormLabel>
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
              <p className="w-full text-left">
                {taxi_types[field.value] ?? "Select taxi type"}
              </p>
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent
          align="end"
          className="popover-content-width-same-as-its-trigger p-0 font-thai"
        >
          <Command>
            <CommandList>
              <CommandItem
                value={"รถแท็กซี่ธรรมดา"}
                key={"2"}
                onSelect={() => {
                  form.setValue("type", "2");
                  setOpen(false);
                }}
              >
                {"รถแท็กซี่ธรรมดา"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    "2" === field.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              <CommandItem
                value={"รถเก๋งสามตอน"}
                key={"1.1"}
                onSelect={() => {
                  form.setValue("type", "1.1");
                  setOpen(false);
                }}
              >
                {"รถเก๋งสามตอน"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    "1.1" === field.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              <CommandItem
                value={"รถเก๋งสามตอนแวน"}
                key={"1.2"}
                onSelect={() => {
                  form.setValue("type", "1.2");
                  setOpen(false);
                }}
              >
                {"รถเก๋งสามตอนแวน"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    "1.2" === field.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              <CommandItem
                value={"รถยนต์นั่งสามตอน"}
                key={"1.3"}
                onSelect={() => {
                  form.setValue("type", "1.3");
                  setOpen(false);
                }}
              >
                {"รถยนต์นั่งสามตอน"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    "1.3" === field.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
              <CommandItem
                value={"ถยนต์นั่งสามตอนแวน"}
                key={"1.4"}
                onSelect={() => {
                  form.setValue("type", "1.4");
                  setOpen(false);
                }}
              >
                {"รถยนต์นั่งสามตอนแวน"}
                <CheckIcon
                  className={cn(
                    "ml-auto h-4 w-4",
                    "1.4" === field.value ? "opacity-100" : "opacity-0",
                  )}
                />
              </CommandItem>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
