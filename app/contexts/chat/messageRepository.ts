import { Sql } from "@/app/lib/sql";
import {
  DeliveryStatus,
  Message,
  MessageSent,
  MessageUnsent,
  Repository,
} from "./message";
import { MessageId } from "../core";
import { ZodType, z } from "zod";
import SQL from "sql-template-strings";

const parse: ZodType<Message> = z.object({
  id: z.bigint(),
  chatId: z.bigint(),
  authorId: z.bigint(),
  body: z.string(),
  sentAt: z.date(),
  deliveryStatus: z.nativeEnum(DeliveryStatus),
});

export const make = (sql: Sql): Repository => ({
  getById: (messageId: MessageId) =>
    sql.queryOne(
      SQL`
      SELECT
        id,
        chat_id AS chatId,
        author_id AS authorId,
        body,
        sent_at AS sentAt,
        delivery_status AS deliveryStatus
      FROM messages
      WHERE id = ${messageId}
    `,
      parse,
    ),
  sent: async ({ message }: MessageSent) => {
    const { insertedId: messageId } = await sql.insertOne(SQL`
      INSERT INTO messages (
        chat_id,
        author_id,
        body,
        sent_at,
        delivery_status
      ) VALUES (
        ${message.chatId},
        ${message.authorId},
        ${message.body},
        ${message.sentAt},
        ${message.deliveryStatus}
      ) RETURNING id
    `);
    return messageId;
  },
  unsent: async (event: MessageUnsent) => {
    await sql.mutate(SQL`
      DELETE FROM messages
      WHERE id = ${event.messageId}
    `);
  },
});
