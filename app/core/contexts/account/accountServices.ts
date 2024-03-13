import { SessionId, UserId } from "@/app/core/core";
import { Env } from "@/app/core/env";
import { Result, error, ok } from "@/app/lib/result";
import * as Account from "./account";
import { AccountMailer } from "./accountMailer";

export const createAccount = async (
  { email, password }: { email: string; password: string },
  repository: Account.Repository,
  mailer: AccountMailer,
  env: Env,
): Promise<
  Result<Account.Account, Account.CreateAccountError | "EmailAlreadyTaken">
> => {
  if (!(await repository.isEmailAvailable(email)))
    return error("EmailAlreadyTaken");

  const event = await Account.createAccount(
    {
      email,
      password,
      staticPepper: env.staticPepper,
    },
    env.hashingService,
    env.random,
  );

  if (!event.ok) return event;

  const id = await repository.accountCreated(event.value);
  await mailer.sendAccountVerificationEmail({
    email: event.value.email,
    token: event.value.verificationToken,
  });

  return ok({
    id,
    email: event.value.email,
    passwordHash: event.value.passwordHash,
    verified: false,
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
  if (!account) return error("Unauthorized");

  const event = await Account.signIn(
    { account: account, password, staticPepper: env.staticPepper },
    env.hashingService,
    env.clock,
    env.random,
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
  verificationToken: string,
  repository: Account.Repository,
  env: Env,
): Promise<
  Result<
    Account.AccountVerified,
    Account.VerifyAccountError | "AccountNotFound"
  >
> => {
  const account = await repository.getByVerificationToken(verificationToken);
  if (!account) return error("AccountNotFound");

  const event = Account.verifyAccount(
    { account: account },
    account.id,
    env.random,
    env.clock,
  );
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
  if (!account) return error("AccountNotFound");

  const event = Account.deleteAccount({ account }, userId);
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
  if (!account) return error("AccountNotFound");

  const event = Account.updateEmail({ account, newEmail }, userId);
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
  if (!account) return error("AccountNotFound");

  const event = await Account.updatePassword(
    {
      account,
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
