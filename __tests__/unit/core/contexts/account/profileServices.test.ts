import { describe, expect, it } from "@jest/globals";
import { Profile, Repository } from "@/app/core/contexts/account/profile";
import {
  createProfile,
  updateProfile,
} from "@/app/core/contexts/account/profileServices";
import { Option, none, some } from "@/app/lib/option";
import { ok, error } from "@/app/lib/result";

describe("profileServices", () => {
  const userId = 1;
  const profile: Profile = {
    ownerId: userId,
    name: "John Doe",
    avatarUrl: none,
  };

  let mockProfile: Option<Profile> = none;
  const repository: Repository = {
    getByOwnerId: async () => mockProfile,
    profileCreated: async () => {},
    profileUpdated: async () => {},
  };

  describe("createProfile", () => {
    it("succeeds", async () => {
      expect(
        await createProfile(
          { name: "Jane Doe", avatarUrl: none },
          userId,
          repository,
        ),
      ).toEqual(
        ok({
          ownerId: userId,
          name: "Jane Doe",
          avatarUrl: none,
        }),
      );
    });
  });

  describe("updateProfile", () => {
    it("succeeds", async () => {
      mockProfile = some(profile);
      expect(
        await updateProfile(
          { name: some("Jane Doe"), avatarUrl: some("some url") },
          userId,
          repository,
        ),
      ).toEqual(
        ok({
          ownerId: userId,
          name: some("Jane Doe"),
          avatarUrl: some("some url"),
        }),
      );
    });

    it("fails if can't find profile", async () => {
      mockProfile = none;
      expect(
        await updateProfile(
          { name: some("Jane Doe"), avatarUrl: some("some url") },
          userId,
          repository,
        ),
      ).toEqual(error("ProfileNotFound"));
    });
  });
});
