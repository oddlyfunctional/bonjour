import { compare, hash } from "bcrypt";

export type Hash = { _tag: "Hash"; value: string };
export type StaticPepper = { _tag: "StaticPepper"; value: string };
export type HashingService = {
  hash: (data: string, staticPepper: StaticPepper) => Promise<Hash>;
  verify: (props: {
    data: string;
    hashed: string;
    staticPepper: StaticPepper;
  }) => Promise<boolean>;
};

export const makeStaticPepper = (value: string): StaticPepper => ({
  _tag: "StaticPepper",
  value,
});

export const hashingService: HashingService = {
  hash: async (data, staticPepper) => ({
    _tag: "Hash",
    value: await hash(data + staticPepper.value, 10),
  }),
  verify: ({ data, hashed, staticPepper }) =>
    compare(data + staticPepper.value, hashed),
};
