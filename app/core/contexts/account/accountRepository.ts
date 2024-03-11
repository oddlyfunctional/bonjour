import { Sql } from "@/app/lib/sql";
import {
  AccountCreated,
  AccountDeleted,
  AccountVerified,
  EmailUpdated,
  PasswordUpdated,
  Repository,
} from "./account";
import { z } from "zod";
import SQL from "sql-template-strings";
import { UserId } from "@/app/core/core";
import { some } from "@/app/lib/option";

const schema = z.object({
  id: z.number(),
  email: z.string(),
  passwordHash: z.string(),
  verified: z.boolean(),
});

export const make = (sql: Sql): Repository => ({
  getById: async (userId: UserId) => {
    const account = await sql.queryOne(
      SQL`
      SELECT
        id,
        email,
        password_hash AS "passwordHash",
        verified
      FROM users
      WHERE
        id = ${userId}
        AND deleted_at IS NULL
    `,
      schema,
    );

    if (!account.some) {
      return account;
    }
    return some({
      ...account.value,
      passwordHash: { _tag: "Hash", value: account.value.passwordHash },
    });
  },
  accountCreated: async (event: AccountCreated) => {
    const { id: userId } = await sql.insertOne(
      SQL`
        INSERT INTO users (
          email,
          password_hash,
          verified
        ) VALUES (
          ${event.email},
          ${event.passwordHash.value},
          ${event.verified}
        ) RETURNING id
      `,
      z.object({ id: z.number() }),
    );
    return userId;
  },
  accountVerified: async (event: AccountVerified) => {
    await sql.mutate(SQL`
      UPDATE users
      SET verified = TRUE
      WHERE id = ${event.userId}
    `);
  },
  accountDeleted: async (event: AccountDeleted) => {
    await sql.mutate(SQL`
      UPDATE users
      SET deleted_at = NOW()
      WHERE id = ${event.userId}
    `);
  },
  emailUpdated: async (event: EmailUpdated) => {
    await sql.mutate(SQL`
      UPDATE users
      SET email = ${event.newEmail}
      WHERE id = ${event.userId}
    `);
  },
  passwordUpdated: async (event: PasswordUpdated) => {
    await sql.mutate(SQL`
      UPDATE users
      SET password_hash = ${event.newPasswordHash.value}
      WHERE id = ${event.userId}
    `);
  },
});
