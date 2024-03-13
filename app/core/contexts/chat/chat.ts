import { Result, ok, error } from "@/app/lib/result";
import { Option } from "@/app/lib/option";
import { ChatId, UserId } from "@/app/core/core";

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
export const createChat = (cmd: CreateChat, userId: UserId): ChatCreated => ({
  chat: {
    ...cmd,
    adminId: userId,
    members: [userId],
  },
});

export type DeleteChat = {
  chat: Chat;
};
export type ChatDeleted = {
  chatId: ChatId;
};
export type DeleteChatError = "Unauthorized";

export const deleteChat = (
  cmd: DeleteChat,
  userId: UserId,
): Result<ChatDeleted, DeleteChatError> => {
  if (cmd.chat.adminId === userId) {
    return ok({ chatId: cmd.chat.id });
  } else {
    return error("Unauthorized");
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
export type ChangeAdminError = "Unauthorized" | "NotAMember" | "AlreadyAdmin";

export const changeAdmin = (
  cmd: ChangeAdmin,
  userId: UserId,
): Result<AdminChanged, ChangeAdminError> => {
  if (cmd.chat.adminId !== userId) {
    return error("Unauthorized");
  }

  if (!cmd.chat.members.includes(cmd.newAdminId)) {
    return error("NotAMember");
  }

  if (cmd.newAdminId === cmd.chat.adminId) {
    return error("AlreadyAdmin");
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
export type AddMemberError = "Unauthorized" | "AlreadyAMember";

export const addMember = (
  cmd: AddMember,
  userId: UserId,
): Result<MemberAdded, AddMemberError> => {
  if (cmd.chat.adminId !== userId) {
    return error("Unauthorized");
  }

  if (cmd.chat.members.includes(cmd.newMemberId)) {
    return error("AlreadyAMember");
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
export type RemoveMemberError = "Unauthorized" | "NotAMember";

export const removeMember = (
  cmd: RemoveMember,
  userId: UserId,
): Result<MemberRemoved, RemoveMemberError> => {
  if (cmd.chat.adminId !== userId) {
    return error("Unauthorized");
  }

  if (!cmd.chat.members.includes(cmd.memberId)) {
    return error("NotAMember");
  }

  return ok({
    chatId: cmd.chat.id,
    memberId: cmd.memberId,
  });
};

export interface Repository {
  getById: (chatId: ChatId) => Promise<Option<Chat>>;
  getAllByUserId: (userId: UserId) => Promise<Array<Chat>>;
  chatCreated: (event: ChatCreated) => Promise<ChatId>;
  chatDeleted: (event: ChatDeleted) => Promise<void>;
  adminChanged: (event: AdminChanged) => Promise<void>;
  memberAdded: (event: MemberAdded) => Promise<void>;
  memberRemoved: (event: MemberRemoved) => Promise<void>;
}
