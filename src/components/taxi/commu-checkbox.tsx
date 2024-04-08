"use client";

import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";

interface CommunicationFieldProps {
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

export default function CommunicationField({ form }: CommunicationFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="is_commu"
        render={({ field }) => (
          <FormItem className="flex gap-1.5 space-y-0 leading-none">
            <FormControl>
              <Checkbox
                id="is_commu"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="ml-2">
              <label
                htmlFor="is_commu"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                กรณีการจ้างผ่านศูนย์บริการสื่อสารหรือระบบสื่อสารทางอิเล็กทรอนิกส์
              </label>
              <p className="text-sm text-muted-foreground">
                เก็บค่าโดยสารเพิ่มอีก 20 บาท
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
