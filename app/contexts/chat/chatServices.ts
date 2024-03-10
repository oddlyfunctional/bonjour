import { ChatId, UserId } from "@/app/contexts/core";
import * as Chat from "./chat";
import { Result, error } from "@/app/lib/result";

export const create = async (
  name: string,
  userId: UserId,
  repository: Chat.Repository,
): Promise<Chat.Chat> => {
  const event = Chat.create({ name }, userId);
  const chatId = await repository.created(event);
  return {
    ...event.chat,
    id: chatId,
  };
};

export type RemoveChatError = Chat.RemoveChatError | "ChatNotFound";
export const remove = async (
  chatId: ChatId,
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.ChatRemoved, RemoveChatError>> => {
  const chat = await repository.getById(chatId);
  if (chat.some) {
    const event = Chat.remove({ chat: chat.value }, userId);
    if (event.ok) {
      await repository.removed(event.value);
    }
    return event;
  } else {
    return error("ChatNotFound");
  }
};

export type ChangeAdminError = Chat.ChangeAdminError | "ChatNotFound";
export const changeAdmin = async (
  chatId: ChatId,
  newAdminId: UserId,
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.AdminChanged, ChangeAdminError>> => {
  const chat = await repository.getById(chatId);
  if (chat.some) {
    const event = Chat.changeAdmin({ chat: chat.value, newAdminId }, userId);
    if (event.ok) {
      await repository.removed(event.value);
    }
    return event;
  } else {
    return error("ChatNotFound");
  }
};

export type AddMemberError = Chat.AddMemberError | "ChatNotFound";
export const addMember = async (
  { chatId, newMemberId }: { chatId: ChatId; newMemberId: UserId },
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.MemberAdded, AddMemberError>> => {
  const chat = await repository.getById(chatId);
  if (chat.some) {
    const event = Chat.addMember({ chat: chat.value, newMemberId }, userId);
    if (event.ok) {
      await repository.memberAdded(event.value);
    }
    return event;
  } else {
    return error("ChatNotFound");
  }
};

export type RemoveMemberError = Chat.RemoveMemberError | "ChatNotFound";
export const RemoveMember = async (
  { chatId, memberId }: { chatId: ChatId; memberId: UserId },
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.MemberRemoved, RemoveMemberError>> => {
  const chat = await repository.getById(chatId);
  if (chat.some) {
    const event = Chat.removeMember({ chat: chat.value, memberId }, userId);
    if (event.ok) {
      await repository.memberRemoved(event.value);
    }
    return event;
  } else {
    return error("ChatNotFound");
  }
};
