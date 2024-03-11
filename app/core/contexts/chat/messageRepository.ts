import { ZodType, z } from "zod";
import SQL from "sql-template-strings";
import { Sql } from "@/app/lib/sql";
import { MessageId } from "@/app/core/core";
import {
  DeliveryStatus,
  Message,
  MessageSent,
  MessageUnsent,
  Repository,
} from "./message";

const schema: ZodType<Message> = z.object({
  id: z.number(),
  chatId: z.number(),
  authorId: z.number(),
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
      schema,
    ),
  sent: async ({ message }: MessageSent) => {
    const { id: messageId } = await sql.insertOne(
      SQL`
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
    `,
      z.object({ id: z.number() }),
    );
    return messageId;
  },
  unsent: async (event: MessageUnsent) => {
    await sql.mutate(SQL`
      DELETE FROM messages
      WHERE id = ${event.messageId}
    `);
  },
});
