"use client";

import ExpresswayForm from "@/components/expressway/expressway-form";
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
        <CardTitle>Expressway Fare Calculator</CardTitle>
        <CardDescription>Calculate your expressway fare</CardDescription>
      </CardHeader>
      <CardContent>
        <ExpresswayForm />
      </CardContent>
    </Card>
  );
}
