type Ok<T> = { ok: true; value: T };
type Error<E> = { ok: false; error: E };
export type Result<T, E> = Ok<T> | Error<E>;

export function ok<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function error<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}
