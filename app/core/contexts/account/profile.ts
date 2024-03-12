import { UserId } from "@/app/core/core";
import { Option } from "@/app/lib/option";
import { Result, ok, error } from "@/app/lib/result";

export type Profile = {
  ownerId: UserId;
  name: string;
  avatarUrl: Option<string>;
};

export type CreateProfile = {
  ownerId: UserId;
  name: string;
  avatarUrl: Option<string>;
};
export type ProfileCreated = {
  ownerId: UserId;
  name: string;
  avatarUrl: Option<string>;
};
export type CreateProfileError = "Unauthorized";
export const createProfile = (
  cmd: CreateProfile,
  userId: UserId,
): Result<ProfileCreated, CreateProfileError> => {
  if (userId !== cmd.ownerId) {
    return error("Unauthorized");
  }
  return ok(cmd);
};

export type UpdateProfile = {
  profile: Profile;
  name: Option<string>;
  avatarUrl: Option<string>;
};
export type ProfileUpdated = {
  ownerId: UserId;
  name: Option<string>;
  avatarUrl: Option<string>;
};
export type UpdateProfileError = "Unauthorized" | "NoChanges";
export const updateProfile = (
  cmd: UpdateProfile,
  userId: UserId,
): Result<ProfileUpdated, UpdateProfileError> => {
  if (userId !== cmd.profile.ownerId) {
    return error("Unauthorized");
  }
  if ([cmd.name, cmd.avatarUrl].every((x) => !x.some)) {
    return error("NoChanges");
  }
  return ok({
    ownerId: userId,
    name: cmd.name,
    avatarUrl: cmd.avatarUrl,
  });
};

export type Repository = {
  getByOwnerId: (ownerId: UserId) => Promise<Option<Profile>>;
  profileCreated: (event: ProfileCreated) => Promise<void>;
  profileUpdated: (event: ProfileUpdated) => Promise<void>;
};
