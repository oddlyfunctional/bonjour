import { SessionId, UserId } from "@/app/core/core";
import { Env } from "@/app/core/env";
import { Result, ok, error } from "@/app/lib/result";
import * as Account from "./account";
import { Clock } from "@/app/lib/clock";
import { Random } from "@/app/lib/random";

export const createAccount = async (
  { email, password }: { email: string; password: string },
  repository: Account.Repository,
  env: Env,
): Promise<Result<Account.Account, Account.CreateAccountError>> => {
  const event = await Account.createAccount(
    {
      email,
      password,
      staticPepper: env.staticPepper,
    },
    env.hashingService,
  );

  if (!event.ok) {
    return event;
  }

  const id = await repository.accountCreated(event.value);

  return ok({
    ...event.value,
    id,
  });
};

export const signIn = async (
  {
    email,
    password,
  }: {
    email: string;
    password: string;
  },
  repository: Account.Repository,
  env: Env,
): Promise<Result<Account.SignedIn, Account.SignInError>> => {
  const account = await repository.getByEmail(email);
  if (!account.some) {
    return error("Unauthorized");
  }

  const event = await Account.signIn(
    { account: account.value, password, staticPepper: env.staticPepper },
    env.hashingService,
    Clock,
    Random,
  );
  if (!event.ok) {
    return event;
  }

  await repository.signedIn(event.value);
  return event;
};

export const signOut = (sessionId: SessionId, repository: Account.Repository) =>
  repository.signOut(sessionId);

export const verifyAccount = async (
  userId: UserId,
  repository: Account.Repository,
): Promise<
  Result<
    Account.AccountVerified,
    Account.VerifyAccountError | "AccountNotFound"
  >
> => {
  const account = await repository.getById(userId);
  if (!account.some) {
    return error("AccountNotFound");
  }

  const event = Account.verifyAccount({ account: account.value }, userId);
  if (!event.ok) {
    return event;
  }

  await repository.accountVerified(event.value);
  return event;
};

export const deleteAccount = async (
  userId: UserId,
  repository: Account.Repository,
): Promise<
  Result<Account.AccountDeleted, Account.DeleteAccountError | "AccountNotFound">
> => {
  const account = await repository.getById(userId);
  if (!account.some) {
    return error("AccountNotFound");
  }

  const event = Account.deleteAccount({ account: account.value }, userId);
  if (!event.ok) {
    return event;
  }

  await repository.accountDeleted(event.value);
  return event;
};

export const updateEmail = async (
  newEmail: string,
  userId: UserId,
  repository: Account.Repository,
): Promise<
  Result<Account.EmailUpdated, Account.UpdateEmailError | "AccountNotFound">
> => {
  const account = await repository.getById(userId);
  if (!account.some) {
    return error("AccountNotFound");
  }

  const event = Account.updateEmail(
    { account: account.value, newEmail },
    userId,
  );
  if (!event.ok) {
    return event;
  }

  await repository.emailUpdated(event.value);
  return event;
};

export const updatePassword = async (
  newPassword: string,
  userId: UserId,
  repository: Account.Repository,
  env: Env,
): Promise<
  Result<
    Account.PasswordUpdated,
    Account.UpdatePasswordError | "AccountNotFound"
  >
> => {
  const account = await repository.getById(userId);
  if (!account.some) {
    return error("AccountNotFound");
  }

  const event = await Account.updatePassword(
    {
      account: account.value,
      newPassword,
      staticPepper: env.staticPepper,
    },
    userId,
    env.hashingService,
  );
  if (!event.ok) {
    return event;
  }

  await repository.passwordUpdated(event.value);
  return event;
};
