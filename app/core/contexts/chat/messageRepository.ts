import { ChatId, MessageId, UserId } from "@/app/core/core";
import * as Option from "@/app/lib/option";
import { Sql } from "@/app/lib/sql";
import SQL from "sql-template-strings";
import { z } from "zod";
import {
  DeliveryStatus,
  MessageSent,
  MessageUnsent,
  Repository,
} from "./message";

export const schema = z.object({
  id: z.string(),
  chatId: z.number(),
  authorId: z.number(),
  body: z.string(),
  sentAt: z.date(),
  deliveryStatus: z.nativeEnum(DeliveryStatus),
});

export const make = (sql: Sql): Repository => ({
  getById: async (messageId: MessageId) => {
    const message = await sql.queryOne(
      SQL`
      SELECT
      id,
      chat_id AS "chatId",
      author_id AS "authorId",
      body,
      sent_at AS "sentAt",
      delivery_status AS "deliveryStatus"
      FROM messages
      WHERE id = ${messageId}
      `,
      schema,
    );

    return Option.map(message, (message) => ({
      ...message,
      sentAt: message.sentAt.getTime(),
    }));
  },
  getAllByChatId: async (chatId: ChatId, userId: UserId) => {
    const messages = await sql.query(
      SQL`
      SELECT
      messages.id,
      messages.chat_id AS "chatId",
      messages.author_id AS "authorId",
      messages.body,
      messages.sent_at AS "sentAt",
      messages.delivery_status AS "deliveryStatus"
      FROM messages
      INNER JOIN chats
      ON chats.id = messages.chat_id
      INNER JOIN chats_users
      ON chats_users.chat_id = chats.id
      WHERE
      chats.id = ${chatId}
      AND chats_users.user_id = ${userId}
      `,
      schema,
    );

    return messages.map((message) => ({
      ...message,
      sentAt: message.sentAt.getTime(),
    }));
  },
  messageSent: async (event: MessageSent) => {
    await sql.mutate(
      SQL`
      INSERT INTO messages (
        id,
        chat_id,
        author_id,
        body,
        sent_at,
        delivery_status
      ) VALUES (
        ${event.id},
        ${event.chatId},
        ${event.authorId},
        ${event.body},
        ${new Date(event.sentAt)},
        ${event.deliveryStatus}
      )
    `,
    );
  },
  messageUnsent: async (event: MessageUnsent) => {
    await sql.mutate(SQL`
      DELETE FROM messages
      WHERE id = ${event.messageId}
    `);
  },
});
