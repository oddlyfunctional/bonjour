type Some<T> = {
  some: true;
  value: T;
};
type None = { some: false };
export type Option<T> = Some<T> | None;

export const some = <T,>(value: T): Option<T> => ({
  some: true,
  value,
});
export const none: Option<never> = { some: false };
export const map = <A, B>(o: Option<A>, f: (o: A) => B) => {
  if (o.some) {
    return some(f(o.value));
  } else {
    return none;
  }
};
export const from = <T,>(value: T | undefined | null): Option<T> => {
  if (value == null) {
    return none;
  } else {
    return some(value);
  }
};
export const toNullable = <T,>(o: Option<T>): T | null => {
  if (o.some) {
    return o.value;
  } else {
    return null;
  }
};
