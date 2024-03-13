import { Pool } from "pg";
import { SQL, type SQLStatement } from "sql-template-strings";
import { ZodType } from "zod";
import { Option, none } from "./option";

export interface Sql {
  query: <T>(sql: SQLStatement, schema: ZodType<T>) => Promise<Array<T>>;
  queryOne: <T>(sql: SQLStatement, schema: ZodType<T>) => Promise<Option<T>>;
  insertOne: <T>(sql: SQLStatement, schema: ZodType<T>) => Promise<T>;
  mutate: <T>(
    sql: SQLStatement,
  ) => Promise<{ rows: Array<T>; rowCount: number }>;
  close: () => Promise<void>;
}

class EmptyResultSet extends Error {
  public sql: SQLStatement;

  constructor(sql: SQLStatement) {
    super("EmptyResultSet");
    this.sql = sql;
  }
}

class MoreThanOneRow extends Error {
  public sql: SQLStatement;

  constructor(sql: SQLStatement) {
    super("MoreThanOneRow");
    this.sql = sql;
  }
}

export const makePg = (client: Pool): Sql => {
  const query = async <T>(sql: SQLStatement, schema: ZodType<T>) => {
    const result = await client.query(sql);
    return result.rows.map((x) => schema.parse(x));
  };
  const queryOne = async <T>(sql: SQLStatement, schema: ZodType<T>) => {
    const rows = await query(sql, schema);
    if (rows.length === 0) {
      return none;
    } else if (rows.length === 1) {
      return rows[0];
    } else {
      throw new MoreThanOneRow(sql);
    }
  };
  const mutate = async (sql: SQLStatement) => {
    const { rows, rowCount } = await client.query(sql);
    return { rows: rows || [], rowCount: rowCount || 0 };
  };
  const insertOne = async <T>(sql: SQLStatement, schema: ZodType<T>) => {
    const { rows } = await mutate(sql);
    if (rows.length === 0) {
      throw new EmptyResultSet(sql);
    }
    if (rows.length > 1) {
      throw new MoreThanOneRow(sql);
    }
    return schema.parse(rows[0]);
  };

  return {
    query,
    queryOne,
    mutate,
    insertOne,
    close: () => client.end(),
  };
};

export const joinStatements = (
  statements: Array<SQLStatement>,
  separator: string,
) => {
  const joined = SQL``;
  statements.forEach((statement, i) => {
    joined.append(statement);
    if (i < statements.length - 1) joined.append(separator);
  });
  return joined;
};
