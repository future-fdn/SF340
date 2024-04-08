// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import { sql } from "drizzle-orm";
import {
  index,
  integer,
  json,
  pgTableCreator,
  text,
} from "drizzle-orm/pg-core";
import { db } from ".";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `sf340_${name}`);

export const toll_fares = createTable(
  "toll_fares",
  {
    id: integer("id").primaryKey(),
    toll_name: text("toll_name"),
    checkpoint: text("checkpoint"),
    four_wheeler: integer("four_wheeler"),
    six_wheeler: integer("six_wheeler"),
    eight_wheeler: integer("eight_wheeler"),
    ten_wheeler: integer("ten_wheeler"),
    out_checkpoint: text("out_checkpoint"),
  },
  (example) => ({
    nameIndex: index("toll_name_idx").on(example.toll_name),
  }),
);

export const toll_connections = createTable("toll_connections", {
  id: integer("id").primaryKey(),
  toll_connections: json("toll_connections"),
});

export const vehicle_types = createTable("vehicle_types", {
  id: integer("id").primaryKey(),
  vehicle_type: integer("vehicle_type"),
  vehicle_label: text("vehicle_label"),
});

export const train_fares = createTable("train_fares", {
  id: integer("id").primaryKey(),
  origin_line_name: text("origin_line_name"),
  origin_code: text("origin_code"),
  origin: text("origin"),
  origin_th: text("origin_th"),
  origin_lat_long: text("origin_lat_long"),
  dest_line_name: text("dest_line_name"),
  dest_code: text("dest_code"),
  dest: text("dest"),
  dest_th: text("dest_th"),
  dest_lat_long: text("dest_lat_long"),
  fare: integer("fare"),
});

export const train_connections = createTable("train_connections", {
  id: integer("id").primaryKey(),
  train_connections: text("train_connections"),
});
