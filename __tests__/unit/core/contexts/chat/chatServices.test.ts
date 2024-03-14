import { Chat, Repository } from "@/app/core/contexts/chat/chat";
import {
  addMember,
  changeAdmin,
  createChat,
  removeChat,
  removeMember,
} from "@/app/core/contexts/chat/chatServices";
import { Option, none } from "@/app/lib/option";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("chatServices", () => {
  const chatId = 1;
  const userId = 2;
  const anotherUserId = 3;

  const chat: Chat = {
    id: chatId,
    adminId: userId,
    name: "some chat",
    members: [userId, anotherUserId],
  };

  let mockChat: Option<Chat> = none;
  let mockChatId = chatId;
  const repository: Repository = {
    getById: async () => mockChat,
    getAllByUserId: async () => [],
    getMembers: async () => [],
    chatCreated: async () => mockChatId,
    chatDeleted: async () => {},
    adminChanged: async () => {},
    memberAdded: async () => {},
    memberRemoved: async () => {},
  };

  describe("createChat", () => {
    it("succeeds", async () => {
      mockChatId = chatId + 1;
      expect(await createChat("some chat", userId, repository)).toEqual({
        id: mockChatId,
        name: "some chat",
        adminId: userId,
        members: [userId],
      });
    });
  });

  describe("removeChat", () => {
    it("succeeds", async () => {
      mockChat = chat;
      expect(await removeChat(chatId, userId, repository)).toEqual(
        ok({ chatId }),
      );
    });

    it("fails if can't find chat", async () => {
      mockChat = none;
      expect(await removeChat(chatId, userId, repository)).toEqual(
        error("ChatNotFound"),
      );
    });
  });

  describe("changeAdmin", () => {
    it("succeeds", async () => {
      mockChat = chat;
      expect(
        await changeAdmin(
          { chatId, newAdminId: anotherUserId },
          userId,
          repository,
        ),
      ).toEqual(ok({ chatId, adminId: anotherUserId }));
    });

    it("fails if can't find chat", async () => {
      mockChat = none;
      expect(
        await changeAdmin(
          { chatId, newAdminId: anotherUserId },
          userId,
          repository,
        ),
      ).toEqual(error("ChatNotFound"));
    });
  });

  describe("addMember", () => {
    const newMemberId = anotherUserId + 1;

    it("succeeds", async () => {
      mockChat = chat;
      expect(
        await addMember(
          {
            chatId,
            newMemberId,
          },
          userId,
          repository,
        ),
      ).toEqual(ok({ chatId, memberId: newMemberId }));
    });

    it("fails if can't find chat", async () => {
      mockChat = none;
      expect(
        await addMember(
          {
            chatId,
            newMemberId,
          },
          userId,
          repository,
        ),
      ).toEqual(error("ChatNotFound"));
    });
  });

  describe("removeMember", () => {
    it("succeeds", async () => {
      mockChat = chat;
      expect(
        await removeMember(
          { chatId, memberId: anotherUserId },
          userId,
          repository,
        ),
      ).toEqual(ok({ chatId, memberId: anotherUserId }));
    });

    it("fails if can't find chat", async () => {
      mockChat = none;
      expect(
        await removeMember(
          {
            chatId,
            memberId: anotherUserId,
          },
          userId,
          repository,
        ),
      ).toEqual(error("ChatNotFound"));
    });
  });
});
