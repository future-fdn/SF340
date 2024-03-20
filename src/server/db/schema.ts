// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import { index, int, sqliteTableCreator, text } from "drizzle-orm/sqlite-core";
import { db } from ".";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = sqliteTableCreator((name) => `sf340_${name}`);

export const toll_fares = createTable(
  "toll_fares",
  {
    id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    toll_name: text("toll_name", { length: 256 }),
    checkpoint: text("checkpoint", { length: 256 }),
    four_wheeler: int("four_wheeler", { mode: "number" }),
    six_wheeler: int("six_wheeler", { mode: "number" }),
    eight_wheeler: int("eight_wheeler", { mode: "number" }),
    ten_wheeler: int("ten_wheeler", { mode: "number" }),
    out_checkpoint: text("out_checkpoint", { mode: "text" }),
  },
  (example) => ({
    nameIndex: index("toll_name_idx").on(example.toll_name),
  }),
);

export const toll_connections = createTable("toll_connections", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  toll_connections: text("toll_connections", { mode: "json" }),
});

export const vehicle_types = createTable("vehicle_types", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  vehicle_type: int("vehicle_type", { mode: "number" }),
  vehicle_label: text("vehicle_label", { mode: "text" }),
});

export const train_fares = createTable("train_fares", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  origin_line_name: text("origin_line_name", { mode: "text" }),
  origin_code: text("origin_code", { mode: "text" }),
  origin: text("origin", { mode: "text" }),
  origin_th: text("origin_th", { mode: "text" }),
  origin_lat_long: text("origin_lat_long", { mode: "text" }),
  dest_line_name: text("dest_line_name", { mode: "text" }),
  dest_code: text("dest_code", { mode: "text" }),
  dest: text("dest", { mode: "text" }),
  dest_th: text("dest_th", { mode: "text" }),
  dest_lat_long: text("dest_lat_long", { mode: "text" }),
  fare: int("fare", { mode: "number" }),
});

export const train_connections = createTable("train_connections", {
  id: int("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  train_connections: text("train_connections", { mode: "json" }),
});
