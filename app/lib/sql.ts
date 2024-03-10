import { ZodType } from "zod";
import { Option } from "./option";
import type { SQLStatement } from "sql-template-strings";

export interface Sql {
  query: <T>(sql: SQLStatement, parse: ZodType<T>) => Promise<Array<T>>;
  queryOne: <T>(sql: SQLStatement, parse: ZodType<T>) => Promise<Option<T>>;
  insertOne: (sql: SQLStatement) => Promise<{ insertedId: BigInt }>;
  mutate: <T>(
    sql: SQLStatement,
  ) => Promise<{ rows: Array<T>; rowsCount: BigInt }>;
}
