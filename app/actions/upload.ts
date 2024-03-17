"use server";

import { load } from "@/app/core/startup";
import { makePresignedPost, type Folder } from "@/app/lib/s3";

export const getPresignedPost = async (folder: Folder) => {
  const { env, config } = await load();
  const response = await makePresignedPost(
    env.s3,
    {
      ...config.s3,
      folder,
    },
    env.random,
  );
  if (!response.ok) throw response.error;
  return response.value;
};
