import { describe, expect, it } from "@jest/globals";
import { mock as mockClock } from "@/app/lib/clock";
import { send, unsend } from "@/app/contexts/chat/messageServices";
import { ok, error } from "@/app/lib/result";
import {
  DeliveryStatus,
  Message,
  Repository,
} from "@/app/contexts/chat/message";
import { Option, none, some } from "@/app/lib/option";

describe("messageServices", () => {
  const { setNow, clock } = mockClock();
  const now = new Date();
  setNow(now);

  const messageId = 1;
  const chatId = 2;
  const userId = 3;

  const message: Message = {
    id: messageId,
    chatId: chatId,
    authorId: userId,
    body: "some message",
    sentAt: now,
    deliveryStatus: DeliveryStatus.Sent,
  };

  let mockMessage: Option<Message> = none;
  let mockMessageId = messageId;
  const repository: Repository = {
    getById: async () => mockMessage,
    sent: async () => mockMessageId,
    unsent: async () => {},
  };

  describe("send", () => {
    it("succeeds", async () => {
      mockMessageId = messageId + 1;
      expect(
        await send({ body: "some message", chatId, userId }, repository, clock),
      ).toEqual({
        id: mockMessageId,
        chatId: chatId,
        authorId: userId,
        body: "some message",
        sentAt: now,
        deliveryStatus: DeliveryStatus.Pending,
      });
    });
  });

  describe("unsend", () => {
    it("succeeds", async () => {
      mockMessage = some(message);
      expect(await unsend(chatId, userId, repository)).toEqual(
        ok({ messageId }),
      );
    });

    it("fails if can't find message", async () => {
      mockMessage = none;
      expect(await unsend(chatId, userId, repository)).toEqual(
        error("MessageNotFound"),
      );
    });
  });
});
