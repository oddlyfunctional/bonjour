import { SessionId, UserId } from "@/app/core/core";
import { Sql } from "@/app/lib/sql";
import SQL from "sql-template-strings";
import { z } from "zod";
import {
  AccountCreated,
  AccountDeleted,
  AccountVerified,
  EmailUpdated,
  PasswordUpdated,
  Repository,
  SignedIn,
} from "./account";

const schema = z.object({
  id: z.number(),
  email: z.string(),
  passwordHash: z.string(),
  verified: z.boolean(),
});

export const make = (sql: Sql): Repository => {
  const insertSession = async ({
    userId,
    sessionId,
    lastSignedInAt,
  }: {
    userId: UserId;
    sessionId: SessionId;
    lastSignedInAt: Date;
  }) => {
    await sql.mutate(SQL`
    UPDATE users
    SET last_signed_in_at = ${lastSignedInAt}
    WHERE id = ${userId}
    `);
    await sql.mutate(SQL`
    INSERT INTO sessions (id, user_id)
    VALUES (${sessionId}, ${userId})
    `);
  };

  return {
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

      if (!account) return account;

      return {
        ...account,
        passwordHash: { _tag: "Hash", value: account.passwordHash },
      };
    },
    getByEmail: async (email: string) => {
      const account = await sql.queryOne(
        SQL`
        SELECT
          id,
          email,
          password_hash AS "passwordHash",
          verified
        FROM users
        WHERE
          email = ${email}
          AND deleted_at IS NULL
        `,
        schema,
      );

      if (!account) return account;

      return {
        ...account,
        passwordHash: { _tag: "Hash", value: account.passwordHash },
      };
    },
    getBySessionId: async (sessionId: SessionId) => {
      const account = await sql.queryOne(
        SQL`
        SELECT
          users.id,
          email,
          password_hash AS "passwordHash",
          verified
        FROM users
        INNER JOIN sessions
          ON sessions.user_id = users.id
        WHERE
          sessions.id = ${sessionId}
          AND deleted_at IS NULL
        `,
        schema,
      );

      if (!account) return account;

      return {
        ...account,
        passwordHash: { _tag: "Hash", value: account.passwordHash },
      };
    },
    getByVerificationToken: async (verificationToken: string) => {
      const account = await sql.queryOne(
        SQL`
        SELECT
          id,
          email,
          password_hash AS "passwordHash",
          verified
        FROM users
        WHERE
          verification_token = ${verificationToken}
          AND deleted_at IS NULL
        `,
        schema,
      );

      if (!account) return account;

      return {
        ...account,
        passwordHash: { _tag: "Hash", value: account.passwordHash },
      };
    },
    isEmailAvailable: async (email: string) => {
      const exists = await sql.queryOne(
        SQL`
        SELECT EXISTS(SELECT 1 FROM users WHERE email = ${email}) AS exists
        `,
        z.object({ exists: z.boolean() }),
      );

      return exists ? !exists.exists : true;
    },
    accountCreated: async (event: AccountCreated) => {
      const { id: userId } = await sql.insertOne(
        SQL`
        INSERT INTO users (
          email,
          password_hash,
          verification_token,
          verified
        ) VALUES (
          ${event.email},
          ${event.passwordHash.value},
          ${event.verificationToken},
          FALSE
        ) RETURNING id
        `,
        z.object({ id: z.number() }),
      );
      return userId;
    },
    signedIn: async (event: SignedIn) => insertSession(event),
    signOut: async (sessionId: SessionId) => {
      await sql.mutate(SQL`
      DELETE FROM sessions
      WHERE id = ${sessionId}
      `);
    },
    accountVerified: async (event: AccountVerified) => {
      await sql.mutate(SQL`
      UPDATE users SET
      verified = TRUE,
      verification_token = NULL
      WHERE id = ${event.userId}
      `);
      await insertSession(event);
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
  };
};
