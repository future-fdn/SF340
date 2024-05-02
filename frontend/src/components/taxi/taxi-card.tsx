"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import TaxiForm from "./taxi-form";

export default function TaxiCard() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Taxi Fare Calculator</CardTitle>
        <CardDescription>Calculate your taxi fare</CardDescription>
      </CardHeader>
      <CardContent>
        <TaxiForm />
      </CardContent>
    </Card>
  );
}
