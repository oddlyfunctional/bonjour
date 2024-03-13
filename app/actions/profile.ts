"use server";

import * as ProfileRepo from "@/app/core/contexts/account/profileRepository";
import * as Profile from "@/app/core/contexts/account/profileServices";
import { load } from "@/app/core/startup";
import * as Option from "@/app/lib/option";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "./auth";

export const getProfile = async () => {
  const user = await currentUser();
  if (!user.some) return Option.none;

  const { env } = await load();
  const profileRepo = ProfileRepo.make(env.sql);
  return profileRepo.getByOwnerId(user.value.id);
};

export const createProfile = async (form: FormData) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const profileRepo = ProfileRepo.make(env.sql);
  const result = await Profile.createProfile(
    {
      name: form.get("name") as string,
      // TODO: handle image upload
      avatarUrl: Option.none,
    },
    user.value.id,
    profileRepo,
  );
  if (!result.ok) return redirect("/");

  revalidatePath("/account/profile");
};

export const updateProfile = async (form: FormData) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const profileRepo = ProfileRepo.make(env.sql);
  const result = await Profile.updateProfile(
    {
      name: Option.from(form.get("name") as string | null),
      avatarUrl: Option.none,
    },
    user.value.id,
    profileRepo,
  );
  if (!result.ok) return redirect("/");

  revalidatePath("/account/profile");
};
