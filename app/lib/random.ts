import { randomBytes, randomUUID } from "crypto";

export type Random = {
  nextUuid: () => string;
  nextString: (length: number) => string;
};

export const Random: Random = {
  nextUuid: () => randomUUID(),
  nextString: (length) =>
    randomBytes((length % 2 == 0 ? length : length + 1) / 2)
      .toString("hex")
      .slice(0, length),
};

export const mock = () => {
  let nextUuid: string;
  const setNextUuid = (u: string) => (nextUuid = u);

  let nextString: string;
  const setNextString = (s: string) => (nextString = s);

  const random: Random = {
    nextUuid: () => nextUuid,
    nextString: () => nextString,
  };

  return { setNextUuid, setNextString, random };
};
