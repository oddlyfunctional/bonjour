import { ChatId, MessageId, UserId } from "@/app/core/core";
import { Clock } from "@/app/lib/clock";
import { Result, error } from "@/app/lib/result";
import * as Message from "./message";

export const sendMessage = async (
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
  const event = Message.sendMessage({ body, chatId }, userId, clock);
  const messageId = await repository.messageSent(event);
  const message: Message.Message = {
    ...event.message,
    id: messageId,
  };

  return message;
};

export type UnsendMessageError = Message.UnsendMessageError | "MessageNotFound";
export const unsendMessage = async (
  messageId: MessageId,
  userId: UserId,
  repository: Message.Repository,
): Promise<Result<Message.MessageUnsent, UnsendMessageError>> => {
  const message = await repository.getById(messageId);

  if (message) {
    const event = Message.unsendMessage({ message: message }, userId);

    if (event.ok) {
      await repository.messageUnsent(event.value);
    }

    return event;
  } else {
    return error("MessageNotFound");
  }
};
