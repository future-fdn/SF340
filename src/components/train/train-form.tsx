import TrainField from "@/components/train/train-field";
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
import { getTrainFare } from "@/server/actions/queries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

export const FormSchema = z.object({
  origin: z.string({
    required_error: "Please select origin.",
  }),
  destination: z.string({
    required_error: "Please select destination.",
  }),
});

export default function TrainForm() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  });
  const [fareTotal, setFare] = useState(0);
  const [error, setError] = useState(false);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setFare(0);
    setError(false);
    let fare = 0;

    const result = await getTrainFare(data.origin, data.destination);

    if (result[0] === undefined) {
      setError(true);
      return;
    }

    fare = result[0]?.fare ?? 0;

    setFare(fare);
  }

  return (
    <AlertDialog>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <TrainField form={form} />
          <div className="flex justify-end gap-2">
            <AlertDialogTrigger asChild>
              <Button
                variant="outline"
                disabled={
                  !(form.getValues("destination") && form.getValues("origin"))
                }
              >
                Show Result
              </Button>
            </AlertDialogTrigger>
            <Button type="submit">Calculate</Button>
          </div>
        </form>
      </Form>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Train Fare Result</AlertDialogTitle>
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
