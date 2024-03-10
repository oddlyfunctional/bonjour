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
