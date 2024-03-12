import { describe, expect, it } from "@jest/globals";
import {
  Profile,
  createProfile,
  updateProfile,
} from "@/app/core/contexts/account/profile";
import { none, some } from "@/app/lib/option";
import { ok, error } from "@/app/lib/result";

describe("Profile", () => {
  const userId = 1;
  const profile: Profile = {
    ownerId: userId,
    name: "John Doe",
    avatarUrl: none,
  };

  describe("createProfile", () => {
    it("returns event", () => {
      expect(
        createProfile(
          {
            ownerId: userId,
            name: "John Doe",
            avatarUrl: some("http://storage.com/avatar.jpg"),
          },
          userId,
        ),
      ).toEqual(
        ok({
          ownerId: userId,
          name: "John Doe",
          avatarUrl: some("http://storage.com/avatar.jpg"),
        }),
      );
    });

    it("fails if user is not owner of profile", () => {
      expect(
        createProfile(
          {
            ownerId: userId,
            name: "John Doe",
            avatarUrl: some("http://storage.com/avatar.jpg"),
          },
          userId + 1,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("updateProfile", () => {
    it("returns event", () => {
      expect(
        updateProfile(
          {
            profile,
            name: some("Jane Doe"),
            avatarUrl: some("http://storage.com/avatar.jpg"),
          },
          userId,
        ),
      ).toEqual(
        ok({
          ownerId: userId,
          name: some("Jane Doe"),
          avatarUrl: some("http://storage.com/avatar.jpg"),
        }),
      );
    });

    it("fails if user is not owner of profile", () => {
      expect(
        updateProfile(
          {
            profile: {
              ownerId: userId,
              name: "John Doe",
              avatarUrl: none,
            },
            name: some("Jane Doe"),
            avatarUrl: some("http://storage.com/avatar.jpg"),
          },
          userId + 1,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if there are no changes", () => {
      expect(
        updateProfile(
          {
            profile: {
              ownerId: userId,
              name: "John Doe",
              avatarUrl: none,
            },
            name: none,
            avatarUrl: none,
          },
          userId,
        ),
      ).toEqual(error("NoChanges"));
    });
  });
});
