import { ZodType, z } from "zod";
import SQL from "sql-template-strings";
import { Sql } from "@/app/lib/sql";
import { ChatId, UserId } from "@/app/core/core";
import {
  AdminChanged,
  Chat,
  ChatCreated,
  ChatDeleted,
  MemberAdded,
  MemberRemoved,
  Repository,
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
