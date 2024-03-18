import {
  DeliveryStatus,
  Message,
  Repository,
} from "@/app/core/contexts/chat/message";
import {
  sendMessage,
  unsendMessage,
} from "@/app/core/contexts/chat/messageServices";
import { mock as mockClock } from "@/app/lib/clock";
import { Option, none } from "@/app/lib/option";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("messageServices", () => {
  const { setNow, clock } = mockClock();
  const now = new Date();
  setNow(now);

  const messageId = "some message id";
  const chatId = 2;
  const userId = 3;

  const message: Message = {
    id: messageId,
    chatId: chatId,
    authorId: userId,
    body: "some message",
    sentAt: now.getTime(),
    deliveryStatus: DeliveryStatus.Sent,
  };

  let mockMessage: Option<Message> = none;
  const repository: Repository = {
    getById: async () => mockMessage,
    getAllByChatId: async () => [],
    messageSent: async () => {},
    messageUnsent: async () => {},
  };

  describe("sendMessage", () => {
    it("succeeds", async () => {
      expect(
        await sendMessage(
          { id: messageId, body: "some message", chatId },
          userId,
          repository,
          clock,
        ),
      ).toEqual({
        id: messageId,
        chatId: chatId,
        authorId: userId,
        body: "some message",
        sentAt: now.getTime(),
        deliveryStatus: DeliveryStatus.Pending,
      });
    });
  });

  describe("unsendMessage", () => {
    it("succeeds", async () => {
      mockMessage = message;
      expect(await unsendMessage(messageId, userId, repository)).toEqual(
        ok({ messageId }),
      );
    });

    it("fails if can't find message", async () => {
      mockMessage = none;
      expect(await unsendMessage(messageId, userId, repository)).toEqual(
        error("MessageNotFound"),
      );
    });
  });
});
