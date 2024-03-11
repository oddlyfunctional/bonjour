import { ClientConfig } from "pg";
import { ZodError, ZodType, z } from "zod";
import { Result, ok, error } from "@/app/lib/result";
import { StaticSalt, makeStaticSalt } from "@/app/lib/hash";

export type Config = {
  sql: ClientConfig;
  staticSalt: StaticSalt;
};

type Store = { [key: string]: string | undefined };

const sqlSchema: ZodType<ClientConfig> = z.object({
  connectionString: z.string(),
});
const parseSqlConfig = (store: Store) =>
  sqlSchema.safeParse({
    connectionString: store.DATABASE_URL,
  });

const parseStaticSalt = (store: Store) =>
  z.string().safeParse(store.STATIC_SALT);

export const make = (): Result<Config, ZodError> => {
  const sql = parseSqlConfig(process.env);
  if (!sql.success) {
    return error(sql.error);
  }
  const staticSalt = parseStaticSalt(process.env);
  if (!staticSalt.success) {
    return error(staticSalt.error);
  }

  return ok({
    sql: sql.data,
    staticSalt: makeStaticSalt(staticSalt.data),
  });
};
