import { Result, ok, error } from "@/app/lib/result";

type Chat = {
  id: ChatId;
  adminId: UserId;
  name: string;
  members: Array<UserId>;
};

type ChatCreated = {
  chat: {
    name: string;
    adminId: UserId;
    members: Array<UserId>;
  };
};

export const create = (name: string, userId: UserId): ChatCreated => ({
  chat: {
    name,
    adminId: userId,
    members: [userId],
  },
});

type ChatRemoved = {
  chatId: ChatId;
};

enum RemoveChatError {
  Unauthorized,
}

export const remove = (
  chat: Chat,
  userId: UserId,
): Result<ChatRemoved, RemoveChatError> => {
  if (chat.adminId === userId) {
    return ok({ chatId: chat.id });
  } else {
    return error(RemoveChatError.Unauthorized);
  }
};

type AdminChanged = {
  chatId: ChatId;
  adminId: UserId;
};

enum ChangeAdminError {
  Unauthorized,
  NotAMember,
  AlreadyAdmin,
}

export const changeAdmin = (
  chat: Chat,
  newAdminId: UserId,
  userId: UserId,
): Result<AdminChanged, ChangeAdminError> => {
  if (chat.adminId !== userId) {
    return error(ChangeAdminError.Unauthorized);
  }

  if (!chat.members.includes(newAdminId)) {
    return error(ChangeAdminError.NotAMember);
  }

  if (newAdminId === chat.adminId) {
    return error(ChangeAdminError.AlreadyAdmin);
  }

  return ok({
    chatId: chat.id,
    adminId: newAdminId,
  });
};

type MemberAdded = {
  chatId: ChatId;
  memberId: UserId;
};

enum AddMemberError {
  Unauthorized,
  AlreadyAMember,
}

export const addMember = (
  chat: Chat,
  newMemberId: UserId,
  userId: UserId,
): Result<MemberAdded, AddMemberError> => {
  if (chat.adminId !== userId) {
    return error(AddMemberError.Unauthorized);
  }

  if (chat.members.includes(newMemberId)) {
    return error(AddMemberError.AlreadyAMember);
  }

  return ok({
    chatId: chat.id,
    memberId: newMemberId,
  });
};

type MemberRemoved = {
  chatId: ChatId;
  memberId: UserId;
};

enum RemoveMemberError {
  Unauthorized,
  NotAMember,
}

export const removeMember = (
  chat: Chat,
  memberId: UserId,
  userId: UserId,
): Result<MemberRemoved, RemoveMemberError> => {
  if (chat.adminId !== userId) {
    return error(RemoveMemberError.Unauthorized);
  }

  if (!chat.members.includes(memberId)) {
    return error(RemoveMemberError.NotAMember);
  }

  return ok({
    chatId: chat.id,
    memberId: memberId,
  });
};
