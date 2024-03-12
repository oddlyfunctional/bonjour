import { ClientConfig } from "pg";
import { ZodError, ZodType, z } from "zod";
import { Result, ok, error } from "@/app/lib/result";
import { StaticPepper, makeStaticPepper } from "@/app/lib/hash";

export type Config = {
  sql: ClientConfig;
  staticPepper: StaticPepper;
};

type Store = { [key: string]: string | undefined };

const sqlSchema: ZodType<ClientConfig> = z.object({
  connectionString: z.string(),
});
const parseSqlConfig = (store: Store) =>
  sqlSchema.safeParse({
    connectionString: store.DATABASE_URL,
  });

const parseStaticPepper = (store: Store) =>
  z.string().safeParse(store.STATIC_PEPPER);

export const make = (): Result<Config, ZodError> => {
  const sql = parseSqlConfig(process.env);
  if (!sql.success) {
    return error(sql.error);
  }
  const staticPepper = parseStaticPepper(process.env);
  if (!staticPepper.success) {
    return error(staticPepper.error);
  }

  return ok({
    sql: sql.data,
    staticPepper: makeStaticPepper(staticPepper.data),
  });
};
