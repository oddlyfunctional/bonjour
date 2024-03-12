import { randomUUID } from "crypto";

export type Random = {
  uuid: () => string;
};

export const Random: Random = {
  uuid: () => randomUUID(),
};

export const mock = () => {
  let uuid: string;
  const setUuid = (u: string) => (uuid = u);
  const random: Random = {
    uuid: () => uuid,
  };

  return { setUuid, random };
};
