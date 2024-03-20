import Dropdown from "@/components/dropdown";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import vehicle_types from "../../public/vehicle_types.json";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import React, { useState } from "react";
import fares from "../../public/toll_fares.json";

const FormSchema = z.object({
  fares_start: z.string({
    required_error: "Please select an origin.",
  }),
  fares_end: z.string({
    required_error: "Please select a destination.",
  }),
  vehicle_type: z.string({
    required_error: "Please select a vehicle type.",
  }),
});

export default function Directions() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [fareTotal, setFare] = useState(0);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    setFare(0);
    let fare = 0;
    const { fares_start, fares_end, vehicle_type } = data;
    Object.keys(fares).forEach((key: string) => {
      // @ts-ignore
      const fareValues = Object.values(fares[key]);
      for (let i = 0; i < fareValues.length; i++) {
        const value = fareValues[i];
        // @ts-ignore
        if (value.value === fares_start) {
          // @ts-ignore
          if (value.fare) {
            // @ts-ignore
            fare += value["fare"][vehicle_type];
          } else {
            // @ts-ignore
            if (value.fares) {
              // @ts-ignore
              fare += value[fares_end]["fare"][vehicle_type];
            }
          }
        }
        // @ts-ignore
        if (value.value === fares_end) {
          // @ts-ignore
          if (value.fare) {
            // @ts-ignore
            fare += value["fare"][vehicle_type];
          }
        }
      }
    });
    setFare(fare);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex w-1/3 flex-col space-y-6"
      >
        <Dropdown
          file={vehicle_types}
          formControl={form}
          valid={"vehicle_type"}
          description={
            "This is the vehicle type necessary to calculate toll fare."
          }
          select={"Select vehicle type"}
          label={"Vehicle Type"}
        />
        <Dropdown
          file={fares}
          formControl={form}
          valid={"fares_start"}
          description={"This is the origin tollway checkpoint."}
          select={"Select origin"}
          empty={"No origin found."}
          search={"Search origin..."}
          label={"Origin"}
        />
        <Dropdown
          file={fares}
          formControl={form}
          valid={"fares_end"}
          description={"This is the destination tollway checkpoint."}
          select={"Select destination"}
          empty={"No destination found."}
          search={"Search destination..."}
          label={"Destination"}
        />
        <Button type="submit">Calculate</Button>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" disabled={fareTotal == 0}>
              Show Result
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Total Toll Fare</AlertDialogTitle>
              <AlertDialogDescription className="text-base">
                {fareTotal} THB
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction>Dismiss</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </form>
    </Form>
  );
}
