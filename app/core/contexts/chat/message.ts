import { ChatId, MessageId, UserId } from "@/app/core/core";
import { Clock } from "@/app/lib/clock";
import { Option } from "@/app/lib/option";
import { Result, error, ok } from "@/app/lib/result";

export enum DeliveryStatus {
  Pending = "Pending",
  Sent = "Sent",
  Seen = "Seen",
}

export type Message = {
  id: MessageId;
  chatId: ChatId;
  authorId: UserId;
  body: string;
  sentAt: number; // it's simpler to serialize/deserialize without using Date
  deliveryStatus: DeliveryStatus;
};

export type SendMessage = {
  id: MessageId;
  body: string;
  chatId: ChatId;
};
export type MessageSent = {
  id: MessageId;
  chatId: ChatId;
  authorId: UserId;
  body: string;
  sentAt: number;
  deliveryStatus: DeliveryStatus;
};
export const sendMessage = (
  cmd: SendMessage,
  userId: UserId,
  clock: Clock,
): MessageSent => ({
  id: cmd.id,
  chatId: cmd.chatId,
  authorId: userId,
  body: cmd.body,
  sentAt: clock.now().getTime(),
  deliveryStatus: DeliveryStatus.Pending,
});

export type UnsendMessage = {
  message: Message;
};
export type MessageUnsent = {
  messageId: MessageId;
};
export type UnsendMessageError = "Unauthorized" | "AlreadySeen";
export const unsendMessage = (
  cmd: UnsendMessage,
  userId: UserId,
): Result<MessageUnsent, UnsendMessageError> => {
  if (userId !== cmd.message.authorId) {
    return error("Unauthorized");
  }

  switch (cmd.message.deliveryStatus) {
    case DeliveryStatus.Pending:
    case DeliveryStatus.Sent:
      return ok({ messageId: cmd.message.id });
    case DeliveryStatus.Seen:
      return error("AlreadySeen");
  }
};

export interface Repository {
  getById: (messageId: MessageId) => Promise<Option<Message>>;
  getAllByChatId: (chatId: ChatId, userId: UserId) => Promise<Array<Message>>;
  messageSent: (event: MessageSent) => Promise<void>;
  messageUnsent: (event: MessageUnsent) => Promise<void>;
}
