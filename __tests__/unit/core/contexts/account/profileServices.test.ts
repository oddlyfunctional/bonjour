import { Profile, Repository } from "@/app/core/contexts/account/profile";
import {
  createProfile,
  updateProfile,
} from "@/app/core/contexts/account/profileServices";
import { Option, none } from "@/app/lib/option";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

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
      mockProfile = profile;
      expect(
        await updateProfile(
          { name: "Jane Doe", avatarUrl: "some url" },
          userId,
          repository,
        ),
      ).toEqual(
        ok({
          ownerId: userId,
          name: "Jane Doe",
          avatarUrl: "some url",
        }),
      );
    });

    it("fails if can't find profile", async () => {
      mockProfile = none;
      expect(
        await updateProfile(
          { name: "Jane Doe", avatarUrl: "some url" },
          userId,
          repository,
        ),
      ).toEqual(error("ProfileNotFound"));
    });
  });
});
