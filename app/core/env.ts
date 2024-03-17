import { Clock } from "@/app/lib/clock";
import { HashingService, StaticPepper, hashingService } from "@/app/lib/hash";
import * as Mailer from "@/app/lib/mailer";
import { Random } from "@/app/lib/random";
import { makeClient } from "@/app/lib/s3";
import * as Sql from "@/app/lib/sql";
import type { S3Client } from "@aws-sdk/client-s3";
import { Pool } from "pg";
import { Config } from "./config";

export type Env = {
  sql: Sql.Sql;
  staticPepper: StaticPepper;
  hashingService: HashingService;
  clock: Clock;
  random: Random;
  mailer: Mailer.Mailer;
  s3: S3Client;
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
    s3: makeClient(config.aws),
    // TODO: replace with actual mailer before deploy
    mailer: Mailer.dryRun,
  };
};
