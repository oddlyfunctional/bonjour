import { ChatId, UserId } from "@/app/core/core";
import * as Option from "@/app/lib/option";
import { Sql } from "@/app/lib/sql";
import SQL from "sql-template-strings";
import { ZodType, z } from "zod";
import {
  AdminChanged,
  Chat,
  ChatCreated,
  ChatDeleted,
  MemberAdded,
  MemberRemoved,
  Repository,
  type ChatUpdated,
} from "./chat";

const schema: ZodType<Chat> = z.object({
  id: z.number(),
  adminId: z.number(),
  name: z.string(),
  members: z.array(z.number()),
});

export const make = (sql: Sql): Repository => ({
  getById: (chatId: ChatId) =>
    sql.queryOne(
      SQL`
      SELECT
        id,
        admin_id AS "adminId",
        name,
        ARRAY(
          SELECT user_id
          FROM chats_users
          WHERE chat_id = id
        ) AS members
      FROM chats
      WHERE id = ${chatId}
    `,
      schema,
    ),
  getAllByUserId: (userId: UserId) =>
    sql.query(
      SQL`
      SELECT
        id,
        admin_id AS "adminId",
        name,
        ARRAY(
          SELECT user_id
          FROM chats_users
          WHERE chat_id = id
        ) AS members
      FROM chats
      INNER JOIN chats_users
        ON chats_users.chat_id = chats.id
      WHERE
        chats_users.user_id = ${userId}
      `,
      schema,
    ),
  getMembers: async (chatId: ChatId, userId: UserId) => {
    const members = await sql.query(
      SQL`
      SELECT
        users.id AS "userId",
        profiles.name,
        profiles.avatar_url AS "avatarUrl"
      FROM users
      INNER JOIN chats_users AS filter
        ON filter.chat_id = ${chatId}
        AND filter.user_id = ${userId}
      INNER JOIN chats_users
        ON chats_users.user_id = users.id
      INNER JOIN profiles
        ON users.profile_id = profiles.id
      WHERE chats_users.chat_id = ${chatId}
    `,
      z.object({
        userId: z.number(),
        name: z.string(),
        avatarUrl: z.nullable(z.string()),
      }),
    );
    return members.map((member) => ({
      ...member,
      avatarUrl: Option.from(member.avatarUrl),
    }));
  },
  chatCreated: async ({ chat }: ChatCreated) => {
    const { id: chatId } = await sql.insertOne(
      SQL`
      INSERT INTO chats (
        admin_id,
        name
      ) VALUES (
        ${chat.adminId},
        ${chat.name}
      ) RETURNING id
    `,
      z.object({ id: z.number() }),
    );
    const insertMembersStatement = SQL`
      INSERT INTO chats_users (
        chat_id,
        user_id
      ) VALUES`;
    for (let memberId of chat.members) {
      insertMembersStatement.append(SQL`(${chatId}, ${memberId})`);
    }
    await sql.mutate(insertMembersStatement);
    return chatId;
  },
  chatUpdated: async (event: ChatUpdated) => {
    await sql.mutate(SQL`
      UPDATE chats
      SET name = ${event.name}
      WHERE id = ${event.chatId}
    `);
  },
  chatDeleted: async (event: ChatDeleted) => {
    await sql.mutate(SQL`
      DELETE FROM chats
      WHERE id = ${event.chatId}
    `);
  },
  adminChanged: async (event: AdminChanged) => {
    await sql.mutate(SQL`
      UPDATE chats
      SET admin_id = ${event.adminId}
      WHERE id = ${event.chatId}
    `);
  },
  memberAdded: async (event: MemberAdded) => {
    await sql.mutate(SQL`
      INSERT INTO chats_users (
        chat_id,
        user_id
      ) VALUES (
        ${event.chatId},
        ${event.memberId}
      )
    `);
  },
  memberRemoved: async (event: MemberRemoved) => {
    await sql.mutate(SQL`
      DELETE FROM chats_users
      WHERE
        chat_id = ${event.chatId}
        AND user_id = ${event.memberId}
    `);
  },
});
