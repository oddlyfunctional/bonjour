"use server";

import { load } from "@/app/core/startup";
import { none } from "@/app/lib/option";
import { currentUser } from "./auth";
import * as ProfileRepo from "@/app/core/contexts/account/profileRepository";

export const getProfile = async () => {
  const user = await currentUser();
  if (!user.some) return none;

  const { env } = await load();
  const profileRepo = ProfileRepo.make(env.sql);
  return profileRepo.getByOwnerId(user.value.id);
};
