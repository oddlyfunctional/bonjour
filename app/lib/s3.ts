import type { Random } from "@/app/lib/random";
import { Result, error, ok } from "@/app/lib/result";
import { S3Client } from "@aws-sdk/client-s3";
import {
  createPresignedPost,
  type PresignedPost,
} from "@aws-sdk/s3-presigned-post";

export type AwsConfig = {
  region: string;
  accessKeyId: string;
  secretAccessKey: string;
};

export const MAX_FILE_SIZE = 1024 * 1024 * 2; // 2MB

export const makeClient = (config: AwsConfig) =>
  new S3Client({
    region: config.region,
    credentials: {
      accessKeyId: config.accessKeyId,
      secretAccessKey: config.secretAccessKey,
    },
  });

export type Folder = "avatars";

export const makePresignedPost = async (
  client: S3Client,
  {
    bucket,
    folder,
  }: {
    bucket: string;
    folder: Folder;
  },
  random: Random,
): Promise<Result<PresignedPost, unknown>> => {
  try {
    const response = await createPresignedPost(client, {
      Bucket: bucket,
      Key: `uploads/${folder}/${random.nextUuid()}`,
      Conditions: [
        { bucket: bucket },
        ["content-length-range", 0, MAX_FILE_SIZE],
        ["starts-with", "$Content-Type", "image/"],
        { acl: "public-read" },
      ],
      Expires: 60 * 2,
      Fields: {
        ACL: "public-read",
      },
    });
    return ok(response);
  } catch (e) {
    console.error(e);
    return error(e);
  }
};

export const upload = async (config: PresignedPost, file: File) => {
  const f = new FormData();
  f.append("Content-Type", file.type);
  for (let fieldKey in config.fields) {
    f.append(fieldKey, config.fields[fieldKey]);
  }
  f.append("file", file);

  const response = await fetch(config.url, {
    method: "post",
    body: f,
  });

  if (response.ok) {
    return config.url + config.fields.key;
  } else {
    throw new Error(`Failed to upload: ${response.status}`);
  }
};
