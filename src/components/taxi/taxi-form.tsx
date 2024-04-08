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
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { cn } from "../../lib/utils";
import AirportField from "./airport-checkbox";
import CommunicationField from "./commu-checkbox";
import DistanceField from "./distance-field";
import TrafficField from "./traffic-field";
import TypeField from "./type-field";
import { taxi_types } from "./type-popover";

export const FormSchema = z.object({
  distance: z
    .number({ required_error: "Please specify distance", coerce: true })
    .int()
    .positive()
    .min(1),
  traffic: z
    .number({
      required_error: "Please specify how long is traffic",
      coerce: true,
    })
    .int()
    .positive()
    .min(1),
  type: z.string({
    required_error: "Please specify vehicle type",
  }),
  is_airport: z.boolean().optional(),
  is_commu: z.boolean().optional(),
});

export default function TaxiForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });

  const [fareTotal, setFare] = useState(0);
  const [error, setError] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFare(0);
    setError(false);
    let fare = 0;
    const distance = data.distance;
    const traffic = data.traffic;

    const rates = [
      { maxDistance: 1, rate: data.type.startsWith("1.") ? 40.0 : 35.0 },
      { maxDistance: 10, rate: 6.5 },
      { maxDistance: 20, rate: 7.0 },
      { maxDistance: 40, rate: 8.0 },
      { maxDistance: 60, rate: 8.5 },
      { maxDistance: 80, rate: 9.0 },
      { maxDistance: Infinity, rate: 10.5 },
    ];

    let remainingDistance = distance;

    for (const { maxDistance, rate } of rates) {
      if (remainingDistance <= maxDistance) {
        fare += remainingDistance * rate;
        break;
      } else {
        fare += maxDistance * rate;
        remainingDistance -= maxDistance;
      }
    }

    fare += traffic * 3;
    fare += data.is_airport ? 50 : 0;
    fare += data.is_commu ? 20 : 0;

    setFare(fare);
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          onChange={() => setFare(0)}
          className="space-y-6"
        >
          <DistanceField form={form} />
          <TrafficField form={form} />
          <TypeField form={form} />
          <div className="space-y-2">
            <AirportField form={form} />
            <CommunicationField form={form} />
          </div>
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
            <p className="font-thai font-semibold">
              Distance Traveled: {form.getValues("distance")} kilometer(s)
              <br />
              In Traffic: {form.getValues("traffic")} minute(s)
              <br />
              Taxi Type: {taxi_types[form.getValues("type")]}
            </p>
            <br />
            <br />

            <div className="space-y-1">
              <div
                className={cn(
                  "flex gap-2",
                  form.getValues("is_airport")
                    ? "text-emerald-500"
                    : "text-destructive",
                )}
              >
                {form.getValues("is_airport") ? <CheckIcon /> : <Cross1Icon />}
                <p className="font-thai text-xs">
                  จ้างจากท่าอากาศยานดอนเมือง หรือท่าอากาศยานสุวรรณภูมิ ณ
                  จุดที่ได้จัดไว้เป็นการเฉพาะ
                </p>
                {form.getValues("is_airport") && (
                  <p className="w-[100px] text-end text-slate-400">
                    <br />+ 50 THB
                  </p>
                )}
              </div>
              <div
                className={cn(
                  "flex gap-2",
                  form.getValues("is_commu")
                    ? "text-emerald-500"
                    : "text-destructive",
                )}
              >
                {form.getValues("is_commu") ? <CheckIcon /> : <Cross1Icon />}
                <p className="font-thai text-xs">
                  จ้างผ่านศูนย์บริการสื่อสารหรือระบบสื่อสารทางอิเล็กทรอนิกส์
                </p>
                {form.getValues("is_commu") && (
                  <p className="w-[140px] text-end text-slate-400">
                    <br />+ 20 THB
                  </p>
                )}
              </div>
            </div>
            <br />
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
