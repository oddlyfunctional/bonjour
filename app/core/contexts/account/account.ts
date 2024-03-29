import { Result, ok, error } from "@/app/lib/result";
import { Option } from "@/app/lib/option";
import { SessionId, UserId } from "@/app/core/core";
import { Hash, HashingService, StaticPepper } from "@/app/lib/hash";
import { Clock } from "@/app/lib/clock";
import { Random } from "@/app/lib/random";

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
  staticPepper: StaticPepper;
};
export type AccountCreated = {
  email: string;
  passwordHash: Hash;
  verificationToken: string;
};
export type CreateAccountError = InvalidEmailError | InvalidPasswordError;

export const createAccount = async (
  cmd: CreateAccount,
  hashingService: HashingService,
  random: Random,
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
    passwordHash: await hashingService.hash(password.value, cmd.staticPepper),
    verificationToken: random.nextString(32),
  });
};

export type SignIn = {
  account: Account;
  password: string;
  staticPepper: StaticPepper;
};
export type SignedIn = {
  userId: UserId;
  sessionId: SessionId;
  lastSignedInAt: Date;
};
export type SignInError = AuthorizationError | "NotVerified";
export const signIn = async (
  cmd: SignIn,
  hashingService: HashingService,
  clock: Clock,
  random: Random,
): Promise<Result<SignedIn, SignInError>> => {
  if (
    !(await hashingService.verify({
      data: cmd.password,
      hashed: cmd.account.passwordHash.value,
      staticPepper: cmd.staticPepper,
    }))
  ) {
    return error("Unauthorized");
  }

  if (!cmd.account.verified) {
    return error("NotVerified");
  }

  return ok({
    userId: cmd.account.id,
    sessionId: random.nextUuid(),
    lastSignedInAt: clock.now(),
  });
};

export type VerifyAccount = {
  account: Account;
};
export type AccountVerified = {
  userId: UserId;
  sessionId: SessionId;
  lastSignedInAt: Date;
};
export type VerifyAccountError = AuthorizationError | "AlreadyVerified";
export const verifyAccount = (
  cmd: VerifyAccount,
  userId: UserId,
  random: Random,
  clock: Clock,
): Result<AccountVerified, VerifyAccountError> => {
  if (userId !== cmd.account.id) {
    return error("Unauthorized");
  }
  if (cmd.account.verified) {
    return error("AlreadyVerified");
  }
  return ok({
    userId: cmd.account.id,
    sessionId: random.nextUuid(),
    lastSignedInAt: clock.now(),
  });
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
  staticPepper: StaticPepper;
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
    newPasswordHash: await hashingService.hash(
      newPassword.value,
      cmd.staticPepper,
    ),
  });
};

export type Repository = {
  getById: (userId: UserId) => Promise<Option<Account>>;
  getByEmail: (email: string) => Promise<Option<Account>>;
  getBySessionId: (sessionId: SessionId) => Promise<Option<Account>>;
  getByVerificationToken: (
    verificationToken: string,
  ) => Promise<Option<Account>>;
  isEmailAvailable: (email: string) => Promise<boolean>;
  accountCreated: (event: AccountCreated) => Promise<UserId>;
  signedIn: (event: SignedIn) => Promise<void>;
  signOut: (sessionId: SessionId) => Promise<void>;
  accountVerified: (event: AccountVerified) => Promise<void>;
  accountDeleted: (event: AccountDeleted) => Promise<void>;
  emailUpdated: (event: EmailUpdated) => Promise<void>;
  passwordUpdated: (event: PasswordUpdated) => Promise<void>;
};
