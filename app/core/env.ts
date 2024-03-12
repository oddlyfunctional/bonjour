import * as Sql from "@/app/lib/sql";
import { Config } from "./config";
import { Pool } from "pg";
import { HashingService, StaticPepper, hashingService } from "@/app/lib/hash";

export type Env = {
  sql: Sql.Sql;
  staticPepper: StaticPepper;
  hashingService: HashingService;
};

export const make = async (config: Config): Promise<Env> => {
  const pgClient = new Pool(config.sql);
  await pgClient.connect();

  return {
    sql: Sql.makePg(pgClient),
    staticPepper: config.staticPepper,
    hashingService: hashingService,
  };
};
