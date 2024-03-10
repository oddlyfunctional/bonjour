import { Result, ok, error } from "@/app/lib/result";

enum DeliveryStatus {
  Pending,
  Sent,
  Seen,
}

type Message = {
  id: MessageId;
  chatId: ChatId;
  authorId: UserId;
  body: string;
  sentAt: Date;
  deliveryStatus: DeliveryStatus;
};

type MessageSent = {
  message: {
    chatId: ChatId;
    authorId: UserId;
    body: string;
    sentAt: Date;
    deliveryStatus: DeliveryStatus;
  };
};

export const send = (
  body: string,
  userId: UserId,
  chatId: ChatId,
): MessageSent => ({
  message: {
    chatId,
    authorId: userId,
    body,
    sentAt: new Date(),
    deliveryStatus: DeliveryStatus.Pending,
  },
});

type MessageUnsent = {
  messageId: MessageId;
};
enum UnsendMessageError {
  Unauthorized,
  AlreadySeen,
}

export const unsend = (
  message: Message,
  userId: UserId,
): Result<MessageUnsent, UnsendMessageError> => {
  if (userId !== message.authorId) {
    return error(UnsendMessageError.Unauthorized);
  }

  switch (message.deliveryStatus) {
    case DeliveryStatus.Pending:
    case DeliveryStatus.Sent:
      return ok({ messageId: message.id });
    case DeliveryStatus.Seen:
      return error(UnsendMessageError.AlreadySeen);
  }
};
