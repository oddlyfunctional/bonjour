import { hash } from "bcrypt";

export type Hash = { _tag: "Hash"; value: string };
export type StaticPepper = { _tag: "StaticPepper"; value: string };
export type HashingService = (
  data: string,
  staticPepper: StaticPepper,
) => Promise<Hash>;

export const makeStaticPepper = (value: string): StaticPepper => ({
  _tag: "StaticPepper",
  value,
});

export const hashingService: HashingService = async (data, staticPepper) => ({
  _tag: "Hash",
  value: await hash(data + staticPepper.value, 10),
});
