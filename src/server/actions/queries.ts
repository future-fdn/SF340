"use server";

import { db } from "@/server/db";
import {
  toll_fares,
  train_connections,
  train_fares,
  vehicle_types,
} from "@/server/db/schema";
import { InferSelectModel, and, eq } from "drizzle-orm";

export type VehicleType = InferSelectModel<typeof vehicle_types>;
export type TrainFares = InferSelectModel<typeof train_fares>;
export type ExpresswayFare = InferSelectModel<typeof toll_fares>;
export type TrainConnectionType = {
  id: number;
  train_connections: Array<string>;
};
export type TollType = {
  toll_name: string | null;
  checkpoint: string | null;
};
export type LineType = {
  code: string | null;
};

export async function getVehicleTypes() {
  const result: VehicleType[] = await db.query.vehicle_types.findMany();

  return result;
}

export async function getOrigins() {
  const result: TollType[] = await db
    .selectDistinct({
      toll_name: toll_fares.toll_name,
      checkpoint: toll_fares.checkpoint,
    })
    .from(toll_fares);

  return result;
}

export async function getDestinations() {
  const result: TollType[] = await db
    .selectDistinct({
      toll_name: toll_fares.toll_name,
      checkpoint: toll_fares.checkpoint,
    })
    .from(toll_fares);

  return result;
}

export async function getTollNames() {
  const result: { toll_name: string | null }[] = await db
    .selectDistinct({
      toll_name: toll_fares.toll_name,
    })
    .from(toll_fares);

  return result;
}

export async function getTrainStations() {
  const result: {
    station: string | null;
    line_name: string | null;
    code: string | null;
  }[] = await db
    .selectDistinct({
      station: train_fares.origin_th,
      line_name: train_fares.origin_line_name,
      code: train_fares.origin_code,
    })
    .from(train_fares);

  return result;
}

export async function getTrainLines() {
  const result: {
    line_name: string | null;
  }[] = await db
    .selectDistinct({
      line_name: train_fares.origin_line_name,
    })
    .from(train_fares);

  return result;
}

export async function getTrainFare(origin: string, dest: string) {
  const result: TrainFares[] = await db
    .select()
    .from(train_fares)
    .where(
      and(eq(train_fares.origin_code, origin), eq(train_fares.dest_code, dest)),
    );

  return result;
}

export async function getExpresswayFare(origin: string, dest: string) {
  const result: ExpresswayFare[] = await db
    .select()
    .from(toll_fares)
    .where(
      and(
        // @ts-ignore
        eq(toll_fares.toll_name, origin.split("/")[0]),
        // @ts-ignore
        eq(toll_fares.checkpoint, origin.split("/")[1]),
      ),
    );

  const result2: ExpresswayFare[] = await db
    .select()
    .from(toll_fares)
    .where(
      and(
        // @ts-ignore
        eq(toll_fares.toll_name, dest.split("/")[0]),
        // @ts-ignore
        eq(toll_fares.checkpoint, dest.split("/")[1]),
      ),
    );

  return [result[0], result2[0]];
}

export async function filterTrainDest(
  origin: {
    station: string | null;
    line_name: string | null;
    code: string | null;
  },
  dest: {
    station: string | null;
    line_name: string | null;
    code: string | null;
  }[],
) {
  const result: TrainFares[] = await db
    .select()
    .from(train_fares)
    .where(eq(train_fares.origin_code, origin.code ?? ""));

  return result;
}
