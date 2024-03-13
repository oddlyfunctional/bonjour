import { ChatId, UserId } from "@/app/core/core";
import { Result, error } from "@/app/lib/result";
import * as Chat from "./chat";

export const createChat = async (
  name: string,
  userId: UserId,
  repository: Chat.Repository,
): Promise<Chat.Chat> => {
  const event = Chat.createChat({ name }, userId);
  const chatId = await repository.chatCreated(event);
  return {
    ...event.chat,
    id: chatId,
  };
};

export type RemoveChatError = Chat.DeleteChatError | "ChatNotFound";
export const removeChat = async (
  chatId: ChatId,
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.ChatDeleted, RemoveChatError>> => {
  const chat = await repository.getById(chatId);
  if (!chat) return error("ChatNotFound");

  const event = Chat.deleteChat({ chat }, userId);
  if (event.ok) {
    await repository.chatDeleted(event.value);
  }
  return event;
};

export type ChangeAdminError = Chat.ChangeAdminError | "ChatNotFound";
export const changeAdmin = async (
  {
    chatId,
    newAdminId,
  }: {
    chatId: ChatId;
    newAdminId: UserId;
  },
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.AdminChanged, ChangeAdminError>> => {
  const chat = await repository.getById(chatId);
  if (!chat) return error("ChatNotFound");

  const event = Chat.changeAdmin({ chat, newAdminId }, userId);
  if (event.ok) {
    await repository.adminChanged(event.value);
  }
  return event;
};

export type AddMemberError = Chat.AddMemberError | "ChatNotFound";
export const addMember = async (
  { chatId, newMemberId }: { chatId: ChatId; newMemberId: UserId },
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.MemberAdded, AddMemberError>> => {
  const chat = await repository.getById(chatId);
  if (!chat) return error("ChatNotFound");

  const event = Chat.addMember({ chat, newMemberId }, userId);
  if (event.ok) {
    await repository.memberAdded(event.value);
  }
  return event;
};

export type RemoveMemberError = Chat.RemoveMemberError | "ChatNotFound";
export const removeMember = async (
  { chatId, memberId }: { chatId: ChatId; memberId: UserId },
  userId: UserId,
  repository: Chat.Repository,
): Promise<Result<Chat.MemberRemoved, RemoveMemberError>> => {
  const chat = await repository.getById(chatId);
  if (!chat) return error("ChatNotFound");

  const event = Chat.removeMember({ chat, memberId }, userId);
  if (event.ok) {
    await repository.memberRemoved(event.value);
  }
  return event;
};
