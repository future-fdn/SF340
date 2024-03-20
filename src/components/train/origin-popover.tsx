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
import { getTrainLines } from "@/server/actions/queries";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { ControllerRenderProps, UseFormReturn } from "react-hook-form";

interface OriginProps {
  field: ControllerRenderProps<
    { origin: string; destination: string },
    "origin"
  >;
  form: UseFormReturn<
    {
      origin: string;
      destination: string;
    },
    any,
    undefined
  >;
  origins: {
    station: string | null;
    line_name: string | null;
    code: string | null;
  }[];
}

export default function OriginPopover({ field, form, origins }: OriginProps) {
  const [open, setOpen] = useState(false);

  const [lineNames, setLineNames] = useState<
    {
      line_name: string | null;
    }[]
  >();

  useEffect(() => {
    const fetchLineNames = async () => {
      const result = await getTrainLines();
      setLineNames(result);
    };

    fetchLineNames();
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
              {origins?.find((origin) => origin.code === field.value)?.code ? (
                <>
                  <Badge
                    variant="outline"
                    className={cn(
                      origins?.find((origin) => origin.code === field.value)
                        ?.line_name
                        ? "opacity-100"
                        : "opacity-0",
                      "mr-1",
                    )}
                  >
                    {
                      origins?.find((origin) => origin.code === field.value)
                        ?.line_name
                    }
                  </Badge>
                  <Badge
                    variant="outline"
                    className={cn(
                      origins?.find((origin) => origin.code === field.value)
                        ?.code
                        ? "opacity-100"
                        : "opacity-0",
                    )}
                  >
                    {
                      origins?.find((origin) => origin.code === field.value)
                        ?.code
                    }
                  </Badge>
                  <p className="w-full pl-2 text-left">
                    {
                      origins?.find((origin) => origin.code === field.value)
                        ?.station
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
              {lineNames?.map((linename) => (
                <CommandGroup heading={linename.line_name}>
                  {origins
                    ?.filter((obj) => obj.line_name === linename.line_name)
                    .map((origin) => (
                      <CommandItem
                        value={origin.station ?? undefined}
                        key={origin.code}
                        onSelect={() => {
                          form.setValue("origin", origin.code ?? "");
                          setOpen(false);
                        }}
                      >
                        {origin.station}
                        <CheckIcon
                          className={cn(
                            "ml-auto h-4 w-4",
                            origin.code === field.value
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
