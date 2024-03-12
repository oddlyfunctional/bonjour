import { Account, Repository } from "@/app/core/contexts/account/account";
import {
  createAccount,
  deleteAccount,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/accountServices";
import { Env } from "@/app/core/env";
import { Hash, HashingService, makeStaticPepper } from "@/app/lib/hash";
import { Option, none, some } from "@/app/lib/option";
import { ok, error } from "@/app/lib/result";
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
  const repository: Repository = {
    getById: async () => mockAccount,
    accountCreated: async () => mockUserId,
    accountVerified: async () => {},
    accountDeleted: async () => {},
    emailUpdated: async () => {},
    passwordUpdated: async () => {},
  };

  let mockHash = "some hash";
  const hashingService: HashingService = async () => makeHash(mockHash);

  const env: Env = {
    staticPepper: makeStaticPepper("some static pepper"),
    hashingService,
    sql: null as any,
  };

  describe("createAccount", () => {
    it("succeeds", async () => {
      mockUserId = userId + 1;
      mockHash = "hashed password";

      expect(
        await createAccount(
          {
            email: "valid@email.com",
            password: "safePassword123!",
          },
          repository,
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
    });
  });

  describe("verifyAccount", () => {
    it("succeeds", async () => {
      mockAccount = some({ ...verifiedAccount, verified: false });
      expect(await verifyAccount(verifiedAccount.id, repository)).toEqual(
        ok({
          userId: verifiedAccount.id,
        }),
      );
    });

    it("fails if can't find account", async () => {
      mockAccount = none;
      expect(await verifyAccount(verifiedAccount.id, repository)).toEqual(
        error("AccountNotFound"),
      );
    });
  });

  describe("deleteAccount", () => {
    it("succeeds", async () => {
      mockAccount = some({ ...verifiedAccount, verified: false });
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
      mockAccount = some(verifiedAccount);
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
      mockAccount = some(verifiedAccount);
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
