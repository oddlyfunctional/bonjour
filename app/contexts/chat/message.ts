import { Result, ok, error } from "@/app/lib/result";
import { ChatId, MessageId, UserId } from "@/app/contexts/core";
import { Option } from "@/app/lib/option";

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
export const send = (cmd: SendMessage, userId: UserId): MessageSent => ({
  message: {
    chatId: cmd.chatId,
    authorId: userId,
    body: cmd.body,
    sentAt: new Date(),
    deliveryStatus: DeliveryStatus.Pending,
  },
});

export type UnsendMessage = {
  message: Message;
};
export type MessageUnsent = {
  messageId: MessageId;
};
export enum UnsendMessageError {
  Unauthorized,
  AlreadySeen,
}
export const unsend = (
  cmd: UnsendMessage,
  userId: UserId,
): Result<MessageUnsent, UnsendMessageError> => {
  if (userId !== cmd.message.authorId) {
    return error(UnsendMessageError.Unauthorized);
  }

  switch (cmd.message.deliveryStatus) {
    case DeliveryStatus.Pending:
    case DeliveryStatus.Sent:
      return ok({ messageId: cmd.message.id });
    case DeliveryStatus.Seen:
      return error(UnsendMessageError.AlreadySeen);
  }
};

export interface Repository {
  getById: (messageId: MessageId) => Promise<Option<Message>>;
  sent: (event: MessageSent) => Promise<MessageId>;
  unsent: (event: MessageUnsent) => Promise<void>;
}
