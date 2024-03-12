import { describe, expect, it } from "@jest/globals";
import {
  Account,
  createAccount,
  deleteAccount,
  signIn,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/account";
import * as Clock from "@/app/lib/clock";
import { Hash, HashingService, makeStaticPepper } from "@/app/lib/hash";
import { ok, error } from "@/app/lib/result";
import * as Random from "@/app/lib/random";

describe("Account", () => {
  const makeHash = (value: string): Hash => ({
    _tag: "Hash",
    value,
  });

  let mockHash = "some hash";
  let mockVerify = true;
  const hashingService: HashingService = {
    hash: async () => makeHash(mockHash),
    verify: async () => mockVerify,
  };

  const mockClock = Clock.mock();
  const mockRandom = Random.mock();

  const verifiedAccount: Account = {
    id: 1,
    email: "valid@email.com",
    passwordHash: makeHash("hashed password"),
    verified: true,
  };

  const staticPepper = makeStaticPepper("some static pepper");

  describe("createAccount", () => {
    it("returns event", async () => {
      mockHash = "hashed password";
      expect(
        await createAccount(
          {
            email: verifiedAccount.email,
            password: "safePassword123!",
            staticPepper,
          },
          hashingService,
        ),
      ).toEqual(
        ok({
          email: verifiedAccount.email,
          passwordHash: makeHash("hashed password"),
          verified: false,
        }),
      );
    });

    it("fails if email is invalid", async () => {
      expect(
        await createAccount(
          {
            email: "INVALID EMAIL",
            password: "safePassword123!",
            staticPepper,
          },
          hashingService,
        ),
      ).toEqual(error("InvalidEmail"));
    });

    it("fails if password is too short", async () => {
      expect(
        await createAccount(
          {
            email: verifiedAccount.email,
            password: "short",
            staticPepper,
          },
          hashingService,
        ),
      ).toEqual(error("PasswordTooShort"));
    });

    it("fails if password is invalid", async () => {
      expect(
        await createAccount(
          {
            email: verifiedAccount.email,
            password: "invalidpassword",
            staticPepper,
          },
          hashingService,
        ),
      ).toEqual(error("PasswordNotSafe"));
    });
  });

  describe("signIn", () => {
    it("returns event", async () => {
      const now = new Date();
      mockClock.setNow(now);
      mockVerify = true;
      mockRandom.setUuid("some session id");
      expect(
        await signIn(
          {
            account: verifiedAccount,
            password: "some password",
            staticPepper,
          },
          hashingService,
          mockClock.clock,
          mockRandom.random,
        ),
      ).toEqual(
        ok({
          userId: verifiedAccount.id,
          sessionId: "some session id",
          lastSignedInAt: now,
        }),
      );
    });

    it("fails if password is wrong", async () => {
      mockVerify = false;
      expect(
        await signIn(
          {
            account: verifiedAccount,
            password: "wrong password",
            staticPepper,
          },
          hashingService,
          mockClock.clock,
          mockRandom.random,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if account is not verified", async () => {
      mockVerify = true;
      expect(
        await signIn(
          {
            account: { ...verifiedAccount, verified: false },
            password: "some password",
            staticPepper,
          },
          hashingService,
          mockClock.clock,
          mockRandom.random,
        ),
      ).toEqual(error("NotVerified"));
    });

    it("fails with unauthorized if both password is wrong and account is not verified", async () => {
      mockVerify = false;
      expect(
        await signIn(
          {
            account: { ...verifiedAccount, verified: false },
            password: "wrong password",
            staticPepper,
          },
          hashingService,
          mockClock.clock,
          mockRandom.random,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("verifyAccount", () => {
    it("returns event", () => {
      expect(
        verifyAccount(
          {
            account: { ...verifiedAccount, verified: false },
          },
          verifiedAccount.id,
        ),
      ).toEqual(ok({ userId: verifiedAccount.id }));
    });

    it("fails if not the same user", () => {
      expect(
        verifyAccount(
          {
            account: { ...verifiedAccount, verified: false },
          },
          verifiedAccount.id + 1,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if already verified", () => {
      expect(
        verifyAccount(
          {
            account: verifiedAccount,
          },
          verifiedAccount.id,
        ),
      ).toEqual(error("AlreadyVerified"));
    });
  });

  describe("deleteAccount", () => {
    it("returns event", () => {
      expect(
        deleteAccount(
          {
            account: verifiedAccount,
          },
          verifiedAccount.id,
        ),
      ).toEqual(ok({ userId: verifiedAccount.id }));
    });

    it("fails if not the same user", () => {
      expect(
        deleteAccount(
          {
            account: verifiedAccount,
          },
          verifiedAccount.id + 1,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("updateEmail", () => {
    it("returns event", () => {
      expect(
        updateEmail(
          {
            account: verifiedAccount,
            newEmail: "new@email.com",
          },
          verifiedAccount.id,
        ),
      ).toEqual(ok({ userId: verifiedAccount.id, newEmail: "new@email.com" }));
    });

    it("fails if not the same user", () => {
      expect(
        updateEmail(
          {
            account: verifiedAccount,
            newEmail: "new@email.com",
          },
          verifiedAccount.id + 1,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if new email is invalid", () => {
      expect(
        updateEmail(
          {
            account: verifiedAccount,
            newEmail: "invalidemail",
          },
          verifiedAccount.id,
        ),
      ).toEqual(error("InvalidEmail"));
    });

    it("fails if account is not verified", () => {
      expect(
        updateEmail(
          {
            account: { ...verifiedAccount, verified: false },
            newEmail: "new@email.com",
          },
          verifiedAccount.id,
        ),
      ).toEqual(error("NotVerified"));
    });
  });

  describe("updatePassword", () => {
    it("returns event", async () => {
      mockHash = "hashed password";
      expect(
        await updatePassword(
          {
            account: verifiedAccount,
            newPassword: "safePassword123!",
            staticPepper,
          },
          verifiedAccount.id,
          hashingService,
        ),
      ).toEqual(
        ok({
          userId: verifiedAccount.id,
          newPasswordHash: makeHash("hashed password"),
        }),
      );
    });

    it("fails if not the same user", async () => {
      expect(
        await updatePassword(
          {
            account: verifiedAccount,
            newPassword: "safePassword123!",
            staticPepper,
          },
          verifiedAccount.id + 1,
          hashingService,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if new password is too short", async () => {
      expect(
        await updatePassword(
          {
            account: verifiedAccount,
            newPassword: "short",
            staticPepper,
          },
          verifiedAccount.id,
          hashingService,
        ),
      ).toEqual(error("PasswordTooShort"));
    });

    it("fails if new password is invalid", async () => {
      expect(
        await updatePassword(
          {
            account: verifiedAccount,
            newPassword: "invalidpassword",
            staticPepper,
          },
          verifiedAccount.id,
          hashingService,
        ),
      ).toEqual(error("PasswordNotSafe"));
    });

    it("fails if account is not verified", async () => {
      expect(
        await updatePassword(
          {
            account: { ...verifiedAccount, verified: false },
            newPassword: "safePassword123!",
            staticPepper,
          },
          verifiedAccount.id,
          hashingService,
        ),
      ).toEqual(error("NotVerified"));
    });
  });
});
