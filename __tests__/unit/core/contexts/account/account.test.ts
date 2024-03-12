import {
  Account,
  createAccount,
  deleteAccount,
  updateEmail,
  updatePassword,
  verifyAccount,
} from "@/app/core/contexts/account/account";
import {
  Hash,
  HashingService,
  StaticPepper,
  makeStaticPepper,
} from "@/app/lib/hash";
import { ok, error } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("Account", () => {
  const makeHash = (value: string): Hash => ({
    _tag: "Hash",
    value,
  });

  const mockHashingService =
    (returnValue: string): HashingService =>
    async (_data: string, _pepper: StaticPepper) =>
      makeHash(returnValue);

  const verifiedAccount: Account = {
    id: 1,
    email: "valid@email.com",
    passwordHash: makeHash("hashed password"),
    verified: true,
  };

  const staticPepper = makeStaticPepper("some static pepper");

  describe("createAccount", () => {
    it("returns event", async () => {
      expect(
        await createAccount(
          {
            email: verifiedAccount.email,
            password: "safePassword123!",
            staticPepper,
          },
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
        ),
      ).toEqual(error("PasswordNotSafe"));
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
      expect(
        await updatePassword(
          {
            account: verifiedAccount,
            newPassword: "safePassword123!",
            staticPepper,
          },
          verifiedAccount.id,
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
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
          mockHashingService("hashed password"),
        ),
      ).toEqual(error("NotVerified"));
    });
  });
});
