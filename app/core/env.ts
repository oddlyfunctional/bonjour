import * as Sql from "@/app/lib/sql";
import { Config } from "./config";
import { Pool } from "pg";
import { StaticSalt } from "@/app/lib/hash";

export type Env = {
  sql: Sql.Sql;
  staticSalt: StaticSalt;
};

export const make = async (config: Config): Promise<Env> => {
  const pgClient = new Pool(config.sql);
  await pgClient.connect();

  return {
    sql: Sql.makePg(pgClient),
    staticSalt: config.staticSalt,
  };
};
