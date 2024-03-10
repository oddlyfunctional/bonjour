import { Result, ok, error } from "@/app/lib/result";
import { ChatId, UserId } from "@/app/contexts/core";
import { Option } from "@/app/lib/option";

export type Chat = {
  id: ChatId;
  adminId: UserId;
  name: string;
  members: Array<UserId>;
};

export type CreateChat = {
  name: string;
};
export type ChatCreated = {
  chat: {
    name: string;
    adminId: UserId;
    members: Array<UserId>;
  };
};
export const create = (cmd: CreateChat, userId: UserId): ChatCreated => ({
  chat: {
    ...cmd,
    adminId: userId,
    members: [userId],
  },
});

export type RemoveChat = {
  chat: Chat;
};
export type ChatRemoved = {
  chatId: ChatId;
};
export enum RemoveChatError {
  Unauthorized,
}

export const remove = (
  cmd: RemoveChat,
  userId: UserId,
): Result<ChatRemoved, RemoveChatError> => {
  if (cmd.chat.adminId === userId) {
    return ok({ chatId: cmd.chat.id });
  } else {
    return error(RemoveChatError.Unauthorized);
  }
};

export type ChangeAdmin = {
  chat: Chat;
  newAdminId: UserId;
};
export type AdminChanged = {
  chatId: ChatId;
  adminId: UserId;
};
export enum ChangeAdminError {
  Unauthorized,
  NotAMember,
  AlreadyAdmin,
}
export const changeAdmin = (
  cmd: ChangeAdmin,
  userId: UserId,
): Result<AdminChanged, ChangeAdminError> => {
  if (cmd.chat.adminId !== userId) {
    return error(ChangeAdminError.Unauthorized);
  }

  if (!cmd.chat.members.includes(cmd.newAdminId)) {
    return error(ChangeAdminError.NotAMember);
  }

  if (cmd.newAdminId === cmd.chat.adminId) {
    return error(ChangeAdminError.AlreadyAdmin);
  }

  return ok({
    chatId: cmd.chat.id,
    adminId: cmd.newAdminId,
  });
};

export type AddMember = {
  chat: Chat;
  newMemberId: UserId;
};
export type MemberAdded = {
  chatId: ChatId;
  memberId: UserId;
};
export enum AddMemberError {
  Unauthorized,
  AlreadyAMember,
}
export const addMember = (
  cmd: AddMember,
  userId: UserId,
): Result<MemberAdded, AddMemberError> => {
  if (cmd.chat.adminId !== userId) {
    return error(AddMemberError.Unauthorized);
  }

  if (cmd.chat.members.includes(cmd.newMemberId)) {
    return error(AddMemberError.AlreadyAMember);
  }

  return ok({
    chatId: cmd.chat.id,
    memberId: cmd.newMemberId,
  });
};

export type RemoveMember = {
  chat: Chat;
  memberId: UserId;
};
export type MemberRemoved = {
  chatId: ChatId;
  memberId: UserId;
};
export enum RemoveMemberError {
  Unauthorized,
  NotAMember,
}
export const removeMember = (
  cmd: RemoveMember,
  userId: UserId,
): Result<MemberRemoved, RemoveMemberError> => {
  if (cmd.chat.adminId !== userId) {
    return error(RemoveMemberError.Unauthorized);
  }

  if (!cmd.chat.members.includes(cmd.memberId)) {
    return error(RemoveMemberError.NotAMember);
  }

  return ok({
    chatId: cmd.chat.id,
    memberId: cmd.memberId,
  });
};

export interface Repository {
  getById: (chatId: ChatId) => Promise<Option<Chat>>;
  created: (event: ChatCreated) => Promise<ChatId>;
  removed: (event: ChatRemoved) => Promise<void>;
  adminChanged: (event: AdminChanged) => Promise<void>;
  memberAdded: (event: MemberAdded) => Promise<void>;
  memberRemoved: (event: MemberRemoved) => Promise<void>;
}