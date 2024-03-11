import * as Sql from "@/app/lib/sql";
import { Config } from "./config";
import { Pool } from "pg";

export type Env = {
  sql: Sql.Sql;
};

export const make = async (config: Config): Promise<Env> => {
  const pgClient = new Pool(config.sql);
  await pgClient.connect();

  return {
    sql: Sql.makePg(pgClient),
  };
};
