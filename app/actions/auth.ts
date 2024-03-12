"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { load } from "@/app/core/startup";
import { error } from "@/app/lib/result";
import { none } from "@/app/lib/option";
import * as Account from "@/app/core/contexts/account/accountServices";
import * as AccountRepo from "@/app/core/contexts/account/accountRepository";
import * as AccountMailer from "@/app/core/contexts/account/accountMailer";

export const signUp = async (_state: unknown, form: FormData) => {
  const { env, config } = await load();
  const accountRepo = AccountRepo.make(env.sql);
  const accountMailer = AccountMailer.make(config, env.mailer);
  const params = {
    email: form.get("email") as string,
    password: form.get("password") as string,
  };
  const account = await Account.createAccount(
    params,
    accountRepo,
    accountMailer,
    env,
  );
  if (!account.ok)
    return {
      ok: false,
      error: account.error,
    };

  return {
    ok: true,
  };
};

export const signIn = async (_state: unknown, form: FormData) => {
  const { env } = await load();
  const accountRepo = AccountRepo.make(env.sql);

  const signedIn = await Account.signIn(
    {
      email: form.get("email") as string,
      password: form.get("password") as string,
    },
    accountRepo,
    env,
  );
  if (!signedIn.ok)
    return {
      error: signedIn.error,
    };

  cookies().set("sessionId", signedIn.value.sessionId);
  redirect("/");
};

export const signOut = async () => {
  const sessionId = cookies().get("sessionId")?.value;
  if (sessionId === undefined || sessionId === "")
    return error("AlreadySignedOut");

  const { env } = await load();
  const accountRepo = AccountRepo.make(env.sql);
  await Account.signOut(sessionId, accountRepo);
  cookies().delete("sessionId");
  redirect("/");
};

export const currentUser = async () => {
  const sessionId = cookies().get("sessionId")?.value;
  if (sessionId === undefined || sessionId == "") return none;

  const { env } = await load();
  const accountRepo = AccountRepo.make(env.sql);
  return await accountRepo.getBySessionId(sessionId);
};
