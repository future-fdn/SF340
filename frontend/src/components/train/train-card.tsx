"use client";

import TrainForm from "@/components/train/train-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ExpresswayCard() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Train Fare Calculator</CardTitle>
        <CardDescription>Calculate your train fare</CardDescription>
      </CardHeader>
      <CardContent>
        <TrainForm />
      </CardContent>
    </Card>
  );
}
