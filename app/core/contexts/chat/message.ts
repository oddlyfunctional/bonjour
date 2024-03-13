import { Result, ok, error } from "@/app/lib/result";
import { Option } from "@/app/lib/option";
import { Clock } from "@/app/lib/clock";
import { ChatId, MessageId, UserId } from "@/app/core/core";

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
  sentAt: Date;
  deliveryStatus: DeliveryStatus;
};

export type SendMessage = {
  body: string;
  chatId: ChatId;
};
export type MessageSent = {
  message: {
    chatId: ChatId;
    authorId: UserId;
    body: string;
    sentAt: Date;
    deliveryStatus: DeliveryStatus;
  };
};
export const sendMessage = (
  cmd: SendMessage,
  userId: UserId,
  clock: Clock,
): MessageSent => ({
  message: {
    chatId: cmd.chatId,
    authorId: userId,
    body: cmd.body,
    sentAt: clock.now(),
    deliveryStatus: DeliveryStatus.Pending,
  },
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
  messageSent: (event: MessageSent) => Promise<MessageId>;
  messageUnsent: (event: MessageUnsent) => Promise<void>;
}
