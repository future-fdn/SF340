"use client";

import { UseFormReturn } from "react-hook-form";

import { FormControl, FormField, FormItem } from "@/components/ui/form";
import { Checkbox } from "../ui/checkbox";

interface AirportFieldProps {
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

export default function AirportField({ form }: AirportFieldProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="is_airport"
        render={({ field }) => (
          <FormItem className="flex gap-1.5 space-y-0 leading-none">
            <FormControl>
              <Checkbox
                id="is_airport"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            </FormControl>
            <div className="ml-2">
              <label
                htmlFor="is_airport"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                กรณีการจ้างจากท่าอากาศยานดอนเมือง
                <br />
                หรือท่าอากาศยานสุวรรณภูมิ ณ จุดที่ได้จัดไว้เป็นการเฉพาะ
              </label>
              <p className="text-sm text-muted-foreground">
                เก็บค่าโดยสารเพิ่มอีก 50 บาท
              </p>
            </div>
          </FormItem>
        )}
      />
    </>
  );
}
