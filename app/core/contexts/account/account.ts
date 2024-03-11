import { Result, ok, error } from "@/app/lib/result";
import { UserId } from "@/app/core/core";
import { Hash, HashingService, StaticSalt } from "@/app/lib/hash";

export type Account = {
  id: UserId;
  email: string;
  passwordHash: Hash;
  verified: boolean;
};

type AuthorizationError = "Unauthorized";

const digitsRegex = /[0-9]/;
const lowercaseRegex = /[a-z]/;
const uppercaseRegex = /[A-Z]/;
const specialCharactersRegex = /[~!@#$%^&*()\-+\[\]{}|:;"',./<>?]/;
type InvalidPasswordError = "PasswordTooShort" | "PasswordNotSafe";
const validatePassword = (
  password: string,
): Result<string, InvalidPasswordError> => {
  if (password.length < 8) {
    return error("PasswordTooShort");
  }
  if (
    [digitsRegex, lowercaseRegex, uppercaseRegex, specialCharactersRegex].some(
      (regex) => !regex.test(password),
    )
  ) {
    return error("PasswordNotSafe");
  }
  return ok(password);
};

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
type InvalidEmailError = "InvalidEmail";
const validateEmail = (email: string): Result<string, InvalidEmailError> => {
  if (!emailRegex.test(email)) {
    return error("InvalidEmail");
  }
  return ok(email);
};

export type CreateAccount = {
  email: string;
  password: string;
  staticSalt: StaticSalt;
};
export type AccountCreated = {
  email: string;
  passwordHash: Hash;
  verified: boolean;
};
export type CreateAccountError = InvalidEmailError | InvalidPasswordError;

export const createAccount = async (
  cmd: CreateAccount,
  hashingService: HashingService,
): Promise<Result<AccountCreated, CreateAccountError>> => {
  const password = validatePassword(cmd.password);
  if (!password.ok) {
    return password;
  }

  const email = validateEmail(cmd.email);
  if (!email.ok) {
    return email;
  }

  return ok({
    email: email.value,
    passwordHash: await hashingService(password.value, cmd.staticSalt),
    verified: false,
  });
};

export type VerifyAccount = {
  account: Account;
};
export type AccountVerified = {
  userId: UserId;
};
export type VerifyAccountError = AuthorizationError | "AlreadyVerified";
export const verifyAccount = (
  cmd: VerifyAccount,
  userId: UserId,
): Result<AccountVerified, VerifyAccountError> => {
  if (userId !== cmd.account.id) {
    return error("Unauthorized");
  }
  if (cmd.account.verified) {
    return error("AlreadyVerified");
  }
  return ok({ userId: cmd.account.id });
};

export type DeleteAccount = {
  account: Account;
};
export type AccountDeleted = {
  userId: UserId;
};
export type DeleteAccountError = AuthorizationError;
export const deleteAccount = (
  cmd: DeleteAccount,
  userId: UserId,
): Result<AccountDeleted, DeleteAccountError> => {
  if (userId !== cmd.account.id) {
    return error("Unauthorized");
  }
  return ok({ userId });
};

export type UpdateEmail = {
  account: Account;
  newEmail: string;
};
export type EmailUpdated = {
  userId: UserId;
  newEmail: string;
};
export type UpdateEmailError =
  | AuthorizationError
  | InvalidEmailError
  | "NotVerified";
export const updateEmail = (
  cmd: UpdateEmail,
  userId: UserId,
): Result<EmailUpdated, UpdateEmailError> => {
  if (userId !== cmd.account.id) {
    return error("Unauthorized");
  }

  if (!cmd.account.verified) {
    return error("NotVerified");
  }

  const newEmail = validateEmail(cmd.newEmail);
  if (!newEmail.ok) {
    return newEmail;
  }

  return ok({
    userId,
    newEmail: newEmail.value,
  });
};

export type UpdatePassword = {
  account: Account;
  newPassword: string;
  staticSalt: StaticSalt;
};
export type PasswordUpdated = {
  userId: UserId;
  newPasswordHash: Hash;
};
export type UpdatePasswordError =
  | AuthorizationError
  | InvalidPasswordError
  | "NotVerified";
export const updatePassword = async (
  cmd: UpdatePassword,
  userId: UserId,
  hashingService: HashingService,
): Promise<Result<PasswordUpdated, UpdatePasswordError>> => {
  if (userId !== cmd.account.id) {
    return error("Unauthorized");
  }

  if (!cmd.account.verified) {
    return error("NotVerified");
  }

  const newPassword = validatePassword(cmd.newPassword);
  if (!newPassword.ok) {
    return newPassword;
  }

  return ok({
    userId,
    newPasswordHash: await hashingService(newPassword.value, cmd.staticSalt),
  });
};
