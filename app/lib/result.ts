export type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };

export function ok<T, E>(value: T): Result<T, E> {
  return { ok: true, value };
}

export function error<T, E>(error: E): Result<T, E> {
  return { ok: false, error };
}
