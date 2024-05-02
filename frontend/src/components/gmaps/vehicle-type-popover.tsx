"use client";

import { Button } from "@/components/ui/button";
import { Command, CommandGroup, CommandItem } from "@/components/ui/command";
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

interface VehicleTypePopoverProps {
  field: ControllerRenderProps<
    { vehicle_type: string; url: string },
    "vehicle_type"
  >;
  form: UseFormReturn<
    {
      vehicle_type: string;
      url: string;
    },
    any,
    undefined
  >;
}

export default function VehicleTypePopover({
  field,
  form,
}: VehicleTypePopoverProps) {
  const [open, setOpen] = useState(false);
  const vehicleTypes = [
    { id: 1, vehicle_type: 4, vehicle_label: "รถยนต์ 4 ล้อ" },
    { id: 2, vehicle_type: 6, vehicle_label: "รถยนต์ตั้งแต่ 6 ล้อขึ้นไป" },
    { id: 3, vehicle_type: 8, vehicle_label: "รถยนต์ตั้งแต่ 8 ล้อขึ้นไป" },
    { id: 4, vehicle_type: 10, vehicle_label: "รถยนต์มากกว่า 10 ล้อ" },
  ];

  return (
    <FormItem className="flex w-full flex-col">
      <FormLabel>Vehicle Type</FormLabel>
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
              {field.value
                ? vehicleTypes?.find(
                    (vehicleType) => vehicleType.vehicle_label === field.value,
                  )?.vehicle_label
                : "Select vehicle type"}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="popover-content-width-same-as-its-trigger p-0 font-thai">
          <Command>
            <CommandGroup>
              {vehicleTypes?.map((vehicleType) => (
                <CommandItem
                  value={vehicleType.vehicle_label ?? undefined}
                  key={vehicleType.id}
                  onSelect={() => {
                    form.setValue(
                      "vehicle_type",
                      vehicleType.vehicle_label ?? "",
                    );
                    setOpen(false);
                  }}
                >
                  {vehicleType.vehicle_label}
                  <CheckIcon
                    className={cn(
                      "ml-auto h-4 w-4",
                      vehicleType.vehicle_label === field.value
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>
      <FormMessage />
    </FormItem>
  );
}
