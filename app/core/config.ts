import { ClientConfig } from "pg";
import { ZodError, ZodType, z } from "zod";
import { Result, ok, error } from "@/app/lib/result";
import { StaticPepper, makeStaticPepper } from "@/app/lib/hash";

export type MailerConfig = {
  noReplyAddress: string;
  accountVerificationTemplate: string;
};

export type Config = {
  sql: ClientConfig;
  staticPepper: StaticPepper;
  mailer: MailerConfig;
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

const mailerSchema: ZodType<MailerConfig> = z.object({
  noReplyAddress: z.string(),
  accountVerificationTemplate: z.string(),
});
const parseMailerConfig = (store: Store) =>
  mailerSchema.safeParse({
    noReplyAddress: store.NO_REPLY_ADDRESS,
    accountVerificationTemplate: store.ACCOUNT_VERIFICATION_TEMPLATE,
  });

export const make = (): Result<Config, ZodError> => {
  const sql = parseSqlConfig(process.env);
  const staticPepper = parseStaticPepper(process.env);
  const mailer = parseMailerConfig(process.env);

  if (!sql.success) return error(sql.error);
  if (!staticPepper.success) return error(staticPepper.error);
  if (!mailer.success) return error(mailer.error);

  return ok({
    sql: sql.data,
    staticPepper: makeStaticPepper(staticPepper.data),
    mailer: mailer.data,
  });
};
