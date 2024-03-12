import { randomBytes } from "crypto";
import { Env } from "@/app/core/env";
import { Config } from "@/app/core/config";
import { createAccount } from "@/app/core/contexts/account/accountServices";
import * as UserRepo from "@/app/core/contexts/account/accountRepository";
import * as AccountMailer from "@/app/core/contexts/account/accountMailer";

export const makeUser = async (config: Config, env: Env) => {
  const userRepo = UserRepo.make(env.sql);
  const accountMailer = AccountMailer.make(config, env.mailer);
  const user = await createAccount(
    {
      email: "_" + randomBytes(10).toString("hex") + "@email.com",
      password: randomBytes(10).toString("hex") + "aA1!",
    },
    userRepo,
    accountMailer,
    env,
  );
  if (!user.ok) {
    throw new Error(user.error);
  }
  return user.value;
};
