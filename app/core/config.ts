import { ClientConfig } from "pg";
import { ZodError, ZodType, z } from "zod";
import { Result, ok, error } from "../lib/result";

export type Config = {
  sql: ClientConfig;
};

const sqlSchema: ZodType<ClientConfig> = z.object({
  user: z.optional(z.string()),
  database: z.optional(z.string()),
  password: z.optional(z.string()),
  port: z.optional(z.number()),
  host: z.optional(z.string()),
});
const parseSqlConfig = (store: { [key: string]: string | undefined }) =>
  sqlSchema.safeParse({
    user: store.PG_USER,
    database: store.PG_DATABASE,
    password: store.PG_PASSWORD,
    port: store.PG_PORT,
    host: store.PG_HOST,
  });

export const make = (): Result<Config, ZodError> => {
  const sql = parseSqlConfig(process.env);
  if (sql.success) {
    return ok({ sql: sql.data });
  }
  return error(sql.error);
};
