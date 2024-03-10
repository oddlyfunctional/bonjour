import * as Message from "./message";
import { ChatId, MessageId, UserId } from "@/app/contexts/core";
import { Result, error } from "@/app/lib/result";

export const send = async (
  body: string,
  chatId: ChatId,
  userId: UserId,
  repository: Message.Repository,
) => {
  const event = Message.send({ body, chatId }, userId);
  const messageId = await repository.sent(event);
  const message: Message.Message = {
    ...event.message,
    id: messageId,
  };

  return message;
};

export type UnsendMessageError = Message.UnsendMessageError | "MessageNotFound";
export const unsend = async (
  messageId: MessageId,
  userId: UserId,
  repository: Message.Repository,
): Promise<Result<Message.MessageUnsent, UnsendMessageError>> => {
  const message = await repository.getById(messageId);

  if (message.some) {
    const event = Message.unsend({ message: message.value }, userId);

    if (event.ok) {
      await repository.unsent(event.value);
    }

    return event;
  } else {
    return error("MessageNotFound");
  }
};
