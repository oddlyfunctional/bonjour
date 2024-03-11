export interface Clock {
  now: () => Date;
}

export const Clock: Clock = {
  now: () => new Date(),
};

export const mock = () => {
  let now: Date;
  const setNow = (d: Date) => (now = d);
  const clock: Clock = {
    now: () => now,
  };

  return { setNow, clock };
};
