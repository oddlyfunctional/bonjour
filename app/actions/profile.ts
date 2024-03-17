"use server";

import * as ProfileRepo from "@/app/core/contexts/account/profileRepository";
import * as Profile from "@/app/core/contexts/account/profileServices";
import { load } from "@/app/core/startup";
import * as Option from "@/app/lib/option";
import { getLocale } from "next-intl/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { currentUser } from "./auth";

export const getProfile = async () => {
  const { env } = await load();
  const user = await currentUser();
  const profileRepo = ProfileRepo.make(env.sql);
  return profileRepo.getByOwnerId(user.id);
};

export const createProfile = async (form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const profileRepo = ProfileRepo.make(env.sql);

  const validatedProfile = z
    .object({
      name: z.string(),
      avatarUrl: z.nullable(z.string()),
    })
    .safeParse({
      name: form.get("name"),
      avatarUrl: form.get("avatarUrl"),
    });
  if (!validatedProfile.success) throw validatedProfile.error;
  const result = await Profile.createProfile(
    {
      name: validatedProfile.data.name,
      avatarUrl: Option.from(validatedProfile.data.avatarUrl),
    },
    user.id,
    profileRepo,
  );

  const locale = await getLocale();
  if (!result.ok) return redirect(`/${locale}`);
  revalidatePath(`/${locale}/account/profile`);
};

export const updateProfile = async (form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const profileRepo = ProfileRepo.make(env.sql);

  const validatedProfile = z
    .object({
      name: z.nullable(z.string()),
      avatarUrl: z.nullable(z.string()),
    })
    .safeParse({
      name: form.get("name"),
      avatarUrl: form.get("avatarUrl"),
    });
  if (!validatedProfile.success) throw validatedProfile.error;
  const result = await Profile.updateProfile(
    {
      name: Option.from(validatedProfile.data.name),
      avatarUrl: Option.from(validatedProfile.data.avatarUrl),
    },
    user.id,
    profileRepo,
  );

  const locale = await getLocale();
  if (!result.ok) return redirect(`/${locale}`);
  revalidatePath(`/${locale}/account/profile`);
};
