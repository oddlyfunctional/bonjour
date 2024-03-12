import * as Sql from "@/app/lib/sql";
import { Config } from "./config";
import { Pool } from "pg";
import { HashingService, StaticPepper, hashingService } from "@/app/lib/hash";
import { Clock } from "@/app/lib/clock";
import { Random } from "@/app/lib/random";
import * as Mailer from "@/app/lib/mailer";

export type Env = {
  sql: Sql.Sql;
  staticPepper: StaticPepper;
  hashingService: HashingService;
  clock: Clock;
  random: Random;
  mailer: Mailer.Mailer;
};

export const make = async (config: Config): Promise<Env> => {
  const pgClient = new Pool(config.sql);
  await pgClient.connect();

  return {
    sql: Sql.makePg(pgClient),
    staticPepper: config.staticPepper,
    hashingService: hashingService,
    clock: Clock,
    random: Random,
    // TODO: replace with actual mailer before deploy
    mailer: Mailer.dryRun,
  };
};
