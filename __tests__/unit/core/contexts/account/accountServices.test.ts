import { Config } from "@/app/core/config";
import { Account, Repository } from "@/app/core/contexts/account/account";
import * as AccountMailer from "@/app/core/contexts/account/accountMailer";
import {
  createAccount,
  deleteAccount,
  signIn,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/accountServices";
import { Env } from "@/app/core/env";
import * as Clock from "@/app/lib/clock";
import { Hash, HashingService, makeStaticPepper } from "@/app/lib/hash";
import * as Mailer from "@/app/lib/mailer";
import { Option, none } from "@/app/lib/option";
import * as Random from "@/app/lib/random";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

const makeHash = (value: string): Hash => ({
  _tag: "Hash",
  value: value,
});

describe("accountServices", () => {
  const userId = 1;
  const verifiedAccount: Account = {
    id: userId,
    email: "valid@email.com",
    passwordHash: makeHash("hashed password"),
    verified: true,
  };

  let mockUserId = 1;
  let mockAccount: Option<Account> = none;
  let mockIsEmailAvailable = true;
  const repository: Repository = {
    getById: async () => mockAccount,
    getByEmail: async () => mockAccount,
    getBySessionId: async () => mockAccount,
    getByVerificationToken: async () => mockAccount,
    isEmailAvailable: async () => mockIsEmailAvailable,
    accountCreated: async () => mockUserId,
    signedIn: async () => {},
    signOut: async () => {},
    accountVerified: async () => {},
    accountDeleted: async () => {},
    emailUpdated: async () => {},
    passwordUpdated: async () => {},
  };

  let mockHash = "some hash";
  let mockVerify = true;
  const hashingService: HashingService = {
    hash: async () => makeHash(mockHash),
    verify: async () => mockVerify,
  };

  const mockClock = Clock.mock();
  const mockRandom = Random.mock();
  const mockMailer = Mailer.mock();

  const config = {
    mailer: {
      noReplyAddress: "no-reply",
      accountVerificationTemplate: "verification-template",
    },
  } as Config;

  const mailer = AccountMailer.make(config, mockMailer.mailer);

  const env: Env = {
    staticPepper: makeStaticPepper("some static pepper"),
    hashingService,
    clock: mockClock.clock,
    random: mockRandom.random,
    mailer: mockMailer.mailer,

    // won't be used, should fail if accessed
    sql: null as any,
    s3: null as any,
  };

  describe("createAccount", () => {
    it.only("succeeds", async () => {
      mockUserId = userId + 1;
      mockHash = "hashed password";
      mockIsEmailAvailable = true;
      const token = "some verification token";
      mockRandom.setNextString(token);

      expect(
        await createAccount(
          {
            email: "valid@email.com",
            password: "safePassword123!",
          },
          repository,
          mailer,
          env,
        ),
      ).toEqual(
        ok({
          id: mockUserId,
          email: "valid@email.com",
          passwordHash: makeHash(mockHash),
          verified: false,
        }),
      );

      expect(mockMailer.getLastEmail()).toEqual({
        to: ["valid@email.com"],
        from: "no-reply",
        subject: "Verify your Bonjour account",
        template: "verification-template",
        params: { token },
      });
    });

    it("fails if email is already taken", async () => {
      mockIsEmailAvailable = false;
      expect(
        await createAccount(
          {
            email: "valid@email.com",
            password: "safePassword123!",
          },
          repository,
          mailer,
          env,
        ),
      ).toEqual(error("EmailAlreadyTaken"));
    });
  });

  describe("signIn", () => {
    const now = new Date();

    it("succeeds", async () => {
      mockAccount = verifiedAccount;
      mockClock.setNow(now);
      mockRandom.setNextUuid("some session id");
      mockVerify = true;

      expect(
        await signIn(
          { email: verifiedAccount.email, password: "some password" },
          repository,
          env,
        ),
      ).toEqual(
        ok({
          userId: verifiedAccount.id,
          sessionId: "some session id",
          lastSignedInAt: now,
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      mockVerify = true;
      expect(
        await signIn(
          { email: verifiedAccount.email, password: "some password" },
          repository,
          env,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("verifyAccount", () => {
    it("succeeds", async () => {
      mockAccount = { ...verifiedAccount, verified: false };
      expect(await verifyAccount("some token", repository, env)).toEqual(
        ok({
          userId: verifiedAccount.id,
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      expect(await verifyAccount("some token", repository, env)).toEqual(
        error("AccountNotFound"),
      );
    });
  });

  describe("deleteAccount", () => {
    it("succeeds", async () => {
      mockAccount = { ...verifiedAccount, verified: false };
      expect(await deleteAccount(verifiedAccount.id, repository)).toEqual(
        ok({
          userId: verifiedAccount.id,
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      expect(await deleteAccount(verifiedAccount.id, repository)).toEqual(
        error("AccountNotFound"),
      );
    });
  });

  describe("updateEmail", () => {
    it("succeeds", async () => {
      mockAccount = verifiedAccount;
      expect(
        await updateEmail("new@email.com", verifiedAccount.id, repository),
      ).toEqual(
        ok({
          userId: verifiedAccount.id,
          newEmail: "new@email.com",
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      expect(
        await updateEmail("new@email.com", verifiedAccount.id, repository),
      ).toEqual(error("AccountNotFound"));
    });
  });

  describe("updatePassword", () => {
    it("succeeds", async () => {
      mockAccount = verifiedAccount;
      mockHash = "hashed password";
      expect(
        await updatePassword(
          "newPassword123!",
          verifiedAccount.id,
          repository,
          env,
        ),
      ).toEqual(
        ok({
          userId: verifiedAccount.id,
          newPasswordHash: makeHash(mockHash),
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      expect(
        await updatePassword(
          "newPassword123!",
          verifiedAccount.id,
          repository,
          env,
        ),
      ).toEqual(error("AccountNotFound"));
    });
  });
});
