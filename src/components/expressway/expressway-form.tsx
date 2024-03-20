import DestinationField from "@/components/expressway/destination-field";
import OriginField from "@/components/expressway/origin-field";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { getExpresswayFare } from "../../server/actions/queries";
import VehicleTypeField from "./vehicle-type-field";

export const FormSchema = z.object({
  vehicle_type: z.string({
    required_error: "Please select vehicle type.",
  }),
  origin: z.string({
    required_error: "Please select origin.",
  }),
  destination: z.string({
    required_error: "Please select destination.",
  }),
});

export default function ExpresswayForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [fareTotal, setFare] = useState(0);
  const [error, setError] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFare(0);
    setError(false);
    let fare = 0;

    const result = await getExpresswayFare(data.origin, data.destination);

    if (result[0] === undefined || result[1] === undefined) {
      setError(true);
      return;
    }

    if (data.vehicle_type == "รถยนต์ 4 ล้อ")
      fare = (result[0]?.four_wheeler ?? 0) + (result[1]?.four_wheeler ?? 0);
    else if (data.vehicle_type == "รถยนต์ตั้งแต่ 6 ล้อขึ้นไป")
      fare = (result[0]?.six_wheeler ?? 0) + (result[1]?.six_wheeler ?? 0);
    else if (data.vehicle_type == "รถยนต์ตั้งแต่ 8 ล้อขึ้นไป")
      fare = (result[0]?.eight_wheeler ?? 0) + (result[1]?.eight_wheeler ?? 0);
    else if (data.vehicle_type == "รถยนต์มากกว่า 10 ล้อ")
      fare = (result[0]?.ten_wheeler ?? 0) + (result[1]?.ten_wheeler ?? 0);

    setFare(fare);
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <VehicleTypeField form={form} />
          <OriginField form={form} />
          <DestinationField form={form} />
          <div className="flex justify-end gap-2">
            <AlertDialogTrigger asChild>
              <Button variant="outline" disabled={fareTotal == 0}>
                Show Result
              </Button>
            </AlertDialogTrigger>
            <Button type="submit">Calculate</Button>
          </div>
        </form>
      </Form>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Expressway Fare Result</AlertDialogTitle>
          <AlertDialogDescription>
            <p className="font-semibold">
              {form.getValues("origin")} {"->"} {form.getValues("destination")}
            </p>
            {error ? (
              <p className="text-xl font-extrabold text-destructive">
                An error has occured
              </p>
            ) : (
              <p className="text-xl font-extrabold">
                Total Fare: {fareTotal} THB
              </p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Done</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
