import { UserId } from "@/app/core/core";
import { Option } from "@/app/lib/option";
import { Result, ok, error } from "@/app/lib/result";
import * as Profile from "./profile";

export const createProfile = async (
  { name, avatarUrl }: { name: string; avatarUrl: Option<string> },
  userId: UserId,
  repository: Profile.Repository,
): Promise<Result<Profile.Profile, Profile.CreateProfileError>> => {
  const event = Profile.createProfile(
    { ownerId: userId, name, avatarUrl },
    userId,
  );
  if (!event.ok) return event;
  await repository.profileCreated(event.value);
  return ok(event.value);
};

export const updateProfile = async (
  changes: { name: Option<string>; avatarUrl: Option<string> },
  userId: UserId,
  repository: Profile.Repository,
): Promise<
  Result<Profile.ProfileUpdated, Profile.UpdateProfileError | "ProfileNotFound">
> => {
  const profile = await repository.getByOwnerId(userId);
  if (!profile.some) return error("ProfileNotFound");

  const event = Profile.updateProfile(
    { profile: profile.value, ...changes },
    userId,
  );
  if (!event.ok) return event;

  await repository.profileUpdated(event.value);
  return ok(event.value);
};
