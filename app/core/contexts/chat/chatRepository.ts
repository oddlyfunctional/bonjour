import { ZodType, z } from "zod";
import SQL from "sql-template-strings";
import { Sql } from "@/app/lib/sql";
import { ChatId } from "@/app/core/core";
import {
  AdminChanged,
  Chat,
  ChatCreated,
  ChatRemoved,
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
        admin_id AS adminId,
        name,
        members
      FROM chats
      WHERE id = ${chatId}
    `,
      schema,
    ),
  created: async ({ chat }: ChatCreated) => {
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
      )`;
    for (let memberId of chat.members) {
      insertMembersStatement.append(SQL`(${chatId}, ${memberId})`);
    }
    await sql.mutate(insertMembersStatement);
    return chatId;
  },
  removed: async (event: ChatRemoved) => {
    await sql.mutate(SQL`
      DELETE FROM chats
      WHERE id = ${event.chatId}
    `);
  },
  adminChanged: async (event: AdminChanged) => {
    await sql.mutate(SQL`
      UPDATE chats
      SET admin_id = ${event.adminId}
      WHERE chat_id = ${event.chatId}
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