import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { CheckIcon } from "@radix-ui/react-icons";
import { UseFormReturn } from "react-hook-form";
import { useState } from "react";

interface DropdownProps {
  file: any;
  formControl: UseFormReturn<any>;
  valid: string;
  description: string;
  select: string;
  empty?: string;
  search?: string;
  label: string;
}

export default function Dropdown(value: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={value.formControl.control}
      name={value.valid}
      render={({ field }) => (
        <FormItem className="flex w-full flex-col">
          <FormLabel>{value.label}</FormLabel>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant="outline"
                  role="combobox"
                  className={cn(
                    "justify-between font-thai text-base",
                    !field.value && "text-muted-foreground",
                  )}
                >
                  {field.value
                    ? (Object.keys(value.file).length > 0 &&
                      Object.keys(value.file).every((i) => !/^-?\d+$/.test(i))
                        ? Object.keys(value.file)
                        : [undefined]
                      ).map(
                        (key) =>
                          (typeof key !== "string"
                            ? value.file
                            : value.file[key]
                          ).find((list: any) => {
                            return list.value === field.value;
                          })?.label,
                      )
                    : value.select}
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-[564.71px] p-0">
              <Command>
                {(value.search || value.empty) && (
                  <>
                    <CommandInput
                      placeholder={value.search}
                      className="h-9 font-thai text-base"
                    />
                    <CommandEmpty>{value.empty}</CommandEmpty>
                  </>
                )}
                <CommandList>
                  {(Object.keys(value.file).length > 0 &&
                  Object.keys(value.file).every((i) => !/^-?\d+$/.test(i))
                    ? Object.keys(value.file)
                    : [undefined]
                  ).map((key) => (
                    <CommandGroup
                      key={crypto.randomUUID()}
                      className="font-thai"
                      heading={
                        typeof key === "string" && (
                          <div className={"text-sm"}>{key}</div>
                        )
                      }
                    >
                      {(typeof key !== "string"
                        ? value.file
                        : value.file[key]
                      ).map((list: any) => (
                        <CommandItem
                          value={list.label}
                          key={crypto.randomUUID()}
                          onSelect={() => {
                            value.formControl.setValue(value.valid, list.value);
                            setOpen(false);
                          }}
                          className="text-base"
                        >
                          {list.label}
                          <CheckIcon
                            className={cn(
                              "ml-auto h-4 w-4",
                              list.value === field.value
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
          <FormDescription>{value.description}</FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
