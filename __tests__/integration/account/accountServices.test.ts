import { Repository as UserRepository } from "@/app/core/contexts/account/account";
import * as AccountMailer from "@/app/core/contexts/account/accountMailer";
import * as UserRepo from "@/app/core/contexts/account/accountRepository";
import {
  createAccount,
  deleteAccount,
  signIn,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/accountServices";
import { UserId } from "@/app/core/core";
import { Env } from "@/app/core/env";
import { load } from "@/app/core/startup";
import { none } from "@/app/lib/option";
import { beforeAll, describe, expect, test } from "@jest/globals";
import { fail } from "assert";
import { randomBytes } from "crypto";
import SQL from "sql-template-strings";
import { z } from "zod";

describe("accountServices integration tests", () => {
  let world: {
    userRepo: UserRepository;
    accountMailer: AccountMailer.AccountMailer;
    env: Env;
  };
  beforeAll(async () => {
    const { env, config } = await load();
    const userRepo = UserRepo.make(env.sql);
    const accountMailer = AccountMailer.make(config, env.mailer);

    world = { userRepo, accountMailer, env };
  });

  const getVerificationToken = async (userId: UserId, env: Env) => {
    const result = await env.sql.queryOne(
      SQL`
      SELECT verification_token AS "verificationToken" FROM users
      WHERE id = ${userId}
      `,
      z.object({ verificationToken: z.nullable(z.string()) }),
    );
    if (!result) fail("could not retrieve verification token");

    return result.verificationToken;
  };

  test("account services", async () => {
    const { userRepo, accountMailer, env } = world;

    const email = "_" + randomBytes(10).toString("hex") + "@email.com";
    const password = randomBytes(10).toString("hex") + "aA1!";
    const userResult = await createAccount(
      { email, password },
      userRepo,
      accountMailer,
      env,
    );
    if (!userResult.ok) fail(userResult.error);
    const user = userResult.value;
    expect(await userRepo.getById(user.id)).toEqual(user);

    const accountVerified = await verifyAccount(
      (await getVerificationToken(user.id, env)) as string,
      userRepo,
      env,
    );
    if (!accountVerified.ok) fail(accountVerified.error);
    expect(accountVerified.value.userId).toEqual(user.id);
    user.verified = true;
    expect(await userRepo.getById(user.id)).toEqual(user);
    expect(await getVerificationToken(user.id, env)).toEqual(null);

    const signedIn = await signIn({ email, password }, userRepo, env);
    if (!signedIn.ok) fail(signedIn.error);
    expect(await userRepo.getBySessionId(signedIn.value.sessionId)).toEqual(
      user,
    );

    const newEmail = "_" + randomBytes(10).toString("hex") + "@email.com";
    const emailUpdated = await updateEmail(newEmail, user.id, userRepo);
    if (!emailUpdated.ok) fail(emailUpdated.error);
    expect(emailUpdated.value).toEqual({ userId: user.id, newEmail });
    user.email = newEmail;
    expect(await userRepo.getById(user.id)).toEqual(user);

    const newPassword = randomBytes(10).toString("hex") + "aA1!";
    const passwordUpdated = await updatePassword(
      newPassword,
      user.id,
      userRepo,
      env,
    );
    if (!passwordUpdated.ok) fail(passwordUpdated.error);
    user.passwordHash = passwordUpdated.value.newPasswordHash;
    expect(await userRepo.getById(user.id)).toEqual(user);

    const accountDeleted = await deleteAccount(user.id, userRepo);
    if (!accountDeleted.ok) fail(accountDeleted.error);
    expect(accountDeleted.value).toEqual({ userId: user.id });
    expect(await userRepo.getById(user.id)).toEqual(none);
  });
});
