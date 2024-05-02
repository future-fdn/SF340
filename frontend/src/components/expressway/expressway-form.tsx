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
import axios from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { env } from "../../env";
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

    const result = await axios
      .get(
        env.NEXT_PUBLIC_API_URL +
          `/tolls/calculate?origin=${data.origin}&dest=${data.destination}&wheel=${data.vehicle_type.replace(/\D/g, "")}`,
      )
      .then((response) => response.data)
      .catch((error) => setError(true));

    fare = result.fare ?? 0;

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
            <h2 className="text-lg font-bold">
              {(form.getValues("origin") ?? "").split("/")[0]}
            </h2>
            <p className="mb-2 text-sm font-medium">
              {(form.getValues("origin") ?? "").split("/")[1]}
            </p>
            <h2 className="text-lg font-bold">
              {(form.getValues("destination") ?? "").split("/")[0]}
            </h2>
            <p className="mb-2 text-sm font-medium">
              {(form.getValues("destination") ?? "").split("/")[1]}
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          {error ? (
            <p className="text-xl font-extrabold text-destructive">
              An error has occured
            </p>
          ) : (
            <p className="text-xl font-extrabold">
              Total Fare: {fareTotal} THB
            </p>
          )}
          <AlertDialogCancel>Done</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
