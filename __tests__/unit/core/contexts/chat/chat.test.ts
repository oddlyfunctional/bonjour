import {
  addMember,
  changeAdmin,
  createChat,
  deleteChat,
  removeMember,
  updateChat,
} from "@/app/core/contexts/chat/chat";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("Chat", () => {
  const chatId = 1;
  const userId = 2;

  describe("createChat", () => {
    it("returns event", () => {
      expect(createChat({ name: "some chat" }, userId)).toEqual({
        chat: {
          name: "some chat",
          adminId: userId,
          members: [userId],
        },
      });
    });
  });

  describe("updateChat", () => {
    it("succeeds", () => {
      expect(
        updateChat(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            name: "new name",
          },
          userId,
        ),
      ).toEqual(ok({ chatId, name: "new name" }));
    });

    it("fails if user is not admin", () => {
      expect(
        updateChat(
          {
            chat: {
              id: chatId,
              adminId: -1,
              name: "some chat",
              members: [userId],
            },
            name: "new name",
          },
          userId,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("deleteChat", () => {
    it("succeeds", () => {
      expect(
        deleteChat(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
          },
          userId,
        ),
      ).toEqual(ok({ chatId }));
    });

    it("fails if user is not admin", () => {
      expect(
        deleteChat(
          {
            chat: {
              id: chatId,
              adminId: -1,
              name: "some chat",
              members: [userId],
            },
          },
          userId,
        ),
      ).toEqual(error("Unauthorized"));
    });
  });

  describe("changeAdmin", () => {
    const newAdminId = userId + 1;

    it("succeeds", () => {
      expect(
        changeAdmin(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId, newAdminId],
            },
            newAdminId: newAdminId,
          },
          userId,
        ),
      ).toEqual(ok({ chatId, adminId: newAdminId }));
    });

    it("fails if user is not admin", () => {
      expect(
        changeAdmin(
          {
            chat: {
              id: chatId,
              adminId: -1,
              name: "some chat",
              members: [userId, newAdminId],
            },
            newAdminId: newAdminId,
          },
          userId,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if new admin is not a member", () => {
      expect(
        changeAdmin(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            newAdminId: newAdminId,
          },
          userId,
        ),
      ).toEqual(error("NotAMember"));
    });

    it("fails if new admin is already the admin", () => {
      expect(
        changeAdmin(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            newAdminId: userId,
          },
          userId,
        ),
      ).toEqual(error("AlreadyAdmin"));
    });
  });

  describe("addMember", () => {
    const newMemberId = userId + 1;

    it("succeeds", () => {
      expect(
        addMember(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            newMemberId: newMemberId,
          },
          userId,
        ),
      ).toEqual(ok({ chatId, memberId: newMemberId }));
    });

    it("fails if user is not admin", () => {
      expect(
        addMember(
          {
            chat: {
              id: chatId,
              adminId: -1,
              name: "some chat",
              members: [userId],
            },
            newMemberId: newMemberId,
          },
          userId,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if new member is already a member", () => {
      expect(
        addMember(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            newMemberId: userId,
          },
          userId,
        ),
      ).toEqual(error("AlreadyAMember"));
    });
  });

  describe("removeMember", () => {
    const memberId = userId + 1;

    it("succeeds", () => {
      expect(
        removeMember(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId, memberId],
            },
            memberId: memberId,
          },
          userId,
        ),
      ).toEqual(ok({ chatId, memberId: memberId }));
    });

    it("fails if user is not admin", () => {
      expect(
        removeMember(
          {
            chat: {
              id: chatId,
              adminId: -1,
              name: "some chat",
              members: [userId],
            },
            memberId: memberId,
          },
          userId,
        ),
      ).toEqual(error("Unauthorized"));
    });

    it("fails if member to remove is not a member", () => {
      expect(
        removeMember(
          {
            chat: {
              id: chatId,
              adminId: userId,
              name: "some chat",
              members: [userId],
            },
            memberId: memberId,
          },
          userId,
        ),
      ).toEqual(error("NotAMember"));
    });
  });
});
