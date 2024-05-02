"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import GmapsForm from "./gmaps-form";

export default function GmapsCard() {
  return (
    <Card className="shadow-none">
      <CardHeader>
        <CardTitle>Google Map Expressway Fare Calculator</CardTitle>
        <CardDescription>
          Calculate your expressway fare with Google Maps Link
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GmapsForm />
      </CardContent>
    </Card>
  );
}
