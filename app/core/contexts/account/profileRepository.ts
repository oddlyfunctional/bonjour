import { UserId } from "@/app/core/core";
import * as Option from "@/app/lib/option";
import { Sql, joinStatements } from "@/app/lib/sql";
import SQL from "sql-template-strings";
import { z } from "zod";
import { ProfileCreated, ProfileUpdated, Repository } from "./profile";

const schema = z.object({
  ownerId: z.number(),
  name: z.string(),
  avatarUrl: z.nullable(z.string()),
});

export const make = (sql: Sql): Repository => ({
  getByOwnerId: async (ownerId: UserId) => {
    const profile = await sql.queryOne(
      SQL`
      SELECT
        users.id AS "ownerId",
        profiles.name,
        profiles.avatar_url AS "avatarUrl"
      FROM profiles
      INNER JOIN users
        ON users.profile_id = profiles.id
      WHERE
        users.id = ${ownerId}
      `,
      schema,
    );
    return Option.map(profile, (p) => ({
      ...p,
      avatarUrl: Option.from(p.avatarUrl),
    }));
  },
  profileCreated: async (event: ProfileCreated) => {
    const { profileId } = await sql.insertOne(
      SQL`
      INSERT INTO profiles (name, avatar_url)
      VALUES (${event.name}, ${event.avatarUrl})
      RETURNING id AS "profileId"
      `,
      z.object({ profileId: z.number() }),
    );
    await sql.mutate(
      SQL`
      UPDATE users
      SET profile_id = ${profileId}
      WHERE id = ${event.ownerId}
      `,
    );
  },
  profileUpdated: async (event: ProfileUpdated) => {
    const statement = SQL`UPDATE profiles SET `;
    const changes = [];
    if (event.name) changes.push(SQL`name = ${event.name}`);
    if (event.avatarUrl) changes.push(SQL`avatar_url = ${event.avatarUrl}`);
    statement.append(joinStatements(changes, ", "));
    statement.append(SQL`
      FROM users
      WHERE
        profiles.id = users.profile_id
        AND users.id = ${event.ownerId}
    `);

    await sql.mutate(statement);
  },
});
