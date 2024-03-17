import { StaticPepper, makeStaticPepper } from "@/app/lib/hash";
import { Result, error, ok } from "@/app/lib/result";
import type { AwsConfig } from "@/app/lib/s3";
import { ClientConfig } from "pg";
import { ZodError, ZodType, z } from "zod";

export type MailerConfig = {
  noReplyAddress: string;
  accountVerificationTemplate: string;
};

export type S3Config = {
  bucket: string;
};

export type Config = {
  sql: ClientConfig;
  staticPepper: StaticPepper;
  mailer: MailerConfig;
  aws: AwsConfig;
  s3: S3Config;
};

type Store = Record<string, string | undefined>;

const sqlSchema: ZodType<ClientConfig> = z.object({
  connectionString: z.string(),
});
const parseSqlConfig = (store: Store) =>
  sqlSchema.safeParse({
    connectionString: store.DATABASE_URL,
  });

const parseStaticPepper = (store: Store) =>
  z.string().safeParse(store.STATIC_PEPPER);

const mailerSchema: ZodType<MailerConfig> = z.object({
  noReplyAddress: z.string(),
  accountVerificationTemplate: z.string(),
});
const parseMailerConfig = (store: Store) =>
  mailerSchema.safeParse({
    noReplyAddress: store.NO_REPLY_ADDRESS,
    accountVerificationTemplate: store.ACCOUNT_VERIFICATION_TEMPLATE,
  });

const awsSchema: ZodType<AwsConfig> = z.object({
  region: z.string(),
  accessKeyId: z.string(),
  secretAccessKey: z.string(),
});
const parseAwsConfig = (store: Store) =>
  awsSchema.safeParse({
    region: store.AWS_REGION,
    accessKeyId: store.AWS_ACCESS_KEY_ID,
    secretAccessKey: store.AWS_SECRET_ACCESS_KEY,
  });

const s3Schema: ZodType<S3Config> = z.object({
  bucket: z.string(),
});
const parseS3Config = (store: Store) =>
  s3Schema.safeParse({
    bucket: store.S3_BUCKET,
  });

export const make = (): Result<Config, ZodError> => {
  const sql = parseSqlConfig(process.env);
  const staticPepper = parseStaticPepper(process.env);
  const mailer = parseMailerConfig(process.env);
  const aws = parseAwsConfig(process.env);
  const s3 = parseS3Config(process.env);

  if (!sql.success) return error(sql.error);
  if (!staticPepper.success) return error(staticPepper.error);
  if (!mailer.success) return error(mailer.error);
  if (!aws.success) return error(aws.error);
  if (!s3.success) return error(s3.error);

  return ok({
    sql: sql.data,
    staticPepper: makeStaticPepper(staticPepper.data),
    mailer: mailer.data,
    aws: aws.data,
    s3: s3.data,
  });
};
