import { hash } from "bcrypt";

export type Hash = { _tag: "Hash"; value: string };
export type StaticSalt = { _tag: "StaticSalt"; value: string };
export type HashingService = (
  data: string,
  staticSalt: StaticSalt,
) => Promise<Hash>;

export const makeStaticSalt = (value: string): StaticSalt => ({
  _tag: "StaticSalt",
  value,
});

export const hashingService: HashingService = async (data, staticSalt) => ({
  _tag: "Hash",
  value: await hash(data, staticSalt.value),
});
