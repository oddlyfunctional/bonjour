export type Option<T> = T | undefined;

export const map = <A, B>(o: Option<A>, f: (o: A) => B) => {
  if (o != undefined) {
    return f(o);
  } else {
    return undefined;
  }
};
export const from = <T>(value: T | undefined | null): Option<T> => {
  if (value === null) return undefined;
  return value;
};
export const none: Option<never> = undefined;
