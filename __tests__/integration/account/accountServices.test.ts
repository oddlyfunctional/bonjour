import { beforeAll, describe, expect, test } from "@jest/globals";
import { Env } from "@/app/core/env";
import { start } from "@/app/core/startup";
import { Repository as UserRepository } from "@/app/core/contexts/account/account";
import * as UserRepo from "@/app/core/contexts/account/accountRepository";
import {
  createAccount,
  deleteAccount,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/accountServices";
import { randomBytes } from "crypto";
import { fail } from "assert";
import { none, some } from "@/app/lib/option";

describe("accountServices integration tests", () => {
  let world: {
    userRepo: UserRepository;
    env: Env;
  };
  beforeAll(async () => {
    const env = await start();
    const userRepo = UserRepo.make(env.sql);

    world = { userRepo, env };
  });

  test("account services", async () => {
    const { userRepo, env } = world;

    const email = "_" + randomBytes(10).toString("hex") + "@email.com";
    const password = randomBytes(10).toString("hex") + "aA1!";
    const userResult = await createAccount({ email, password }, userRepo, env);
    if (!userResult.ok) fail(userResult.error);
    const user = userResult.value;
    expect(await userRepo.getById(user.id)).toEqual(some(user));

    const accountVerified = await verifyAccount(user.id, userRepo);
    if (!accountVerified.ok) fail(accountVerified.error);
    expect(accountVerified.value).toEqual({ userId: user.id });
    user.verified = true;
    expect(await userRepo.getById(user.id)).toEqual(some(user));

    const newEmail = "_" + randomBytes(10).toString("hex") + "@email.com";
    const emailUpdated = await updateEmail(newEmail, user.id, userRepo);
    if (!emailUpdated.ok) fail(emailUpdated.error);
    expect(emailUpdated.value).toEqual({ userId: user.id, newEmail });
    user.email = newEmail;
    expect(await userRepo.getById(user.id)).toEqual(some(user));

    const newPassword = randomBytes(10).toString("hex") + "aA1!";
    const passwordUpdated = await updatePassword(
      newPassword,
      user.id,
      userRepo,
      env,
    );
    if (!passwordUpdated.ok) fail(passwordUpdated.error);
    user.passwordHash = passwordUpdated.value.newPasswordHash;
    expect(await userRepo.getById(user.id)).toEqual(some(user));

    const accountDeleted = await deleteAccount(user.id, userRepo);
    if (!accountDeleted.ok) fail(accountDeleted.error);
    expect(accountDeleted.value).toEqual({ userId: user.id });
    expect(await userRepo.getById(user.id)).toEqual(none);
  });
});
