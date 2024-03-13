import { makeUser } from "@/__tests__/factories";
import { Repository as ProfileRepository } from "@/app/core/contexts/account/profile";
import * as ProfileRepo from "@/app/core/contexts/account/profileRepository";
import {
  createProfile,
  updateProfile,
} from "@/app/core/contexts/account/profileServices";
import { UserId } from "@/app/core/core";
import { load } from "@/app/core/startup";
import { none } from "@/app/lib/option";
import { beforeAll, describe, expect, test } from "@jest/globals";
import { fail } from "assert";

describe("profileServices integration tests", () => {
  let world: {
    userId: UserId;
    profileRepo: ProfileRepository;
  };
  beforeAll(async () => {
    const { env, config } = await load();
    const user = await makeUser(config, env);
    const profileRepo = ProfileRepo.make(env.sql);

    world = {
      userId: user.id,
      profileRepo,
    };
  });

  test("profile services", async () => {
    const { userId, profileRepo } = world;

    const profileResult = await createProfile(
      { name: "John Doe", avatarUrl: none },
      userId,
      profileRepo,
    );
    if (!profileResult.ok) fail(profileResult.error);
    const profile = profileResult.value;
    expect(await profileRepo.getByOwnerId(userId)).toEqual(profile);

    const profileUpdated = await updateProfile(
      { name: "Jane Doe", avatarUrl: "some url" },
      userId,
      profileRepo,
    );
    if (!profileUpdated.ok) fail(profileUpdated.error);
    expect(profileUpdated.value).toEqual({
      ownerId: userId,
      name: "Jane Doe",
      avatarUrl: "some url",
    });
    profile.name = "Jane Doe";
    profile.avatarUrl = "some url";
    expect(await profileRepo.getByOwnerId(userId)).toEqual(profile);
  });
});
