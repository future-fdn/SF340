import { redirect } from "next/navigation";

export default function Taxi() {
  redirect("/expressway");
  return <div>Taxi</div>;
}
