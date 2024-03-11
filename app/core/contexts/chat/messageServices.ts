import { Clock } from "@/app/lib/clock";
import { Result, error } from "@/app/lib/result";
import { ChatId, MessageId, UserId } from "@/app/core/core";
import * as Message from "./message";

export const send = async (
  {
    body,
    chatId,
  }: {
    body: string;
    chatId: ChatId;
  },
  userId: UserId,
  repository: Message.Repository,
  clock: Clock,
) => {
  const event = Message.send({ body, chatId }, userId, clock);
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
