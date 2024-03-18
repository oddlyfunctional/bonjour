import {
  DeliveryStatus,
  sendMessage,
  unsendMessage,
} from "@/app/core/contexts/chat/message";
import { mock as mockClock } from "@/app/lib/clock";
import { error, ok } from "@/app/lib/result";
import { describe, expect, it } from "@jest/globals";

describe("Message", () => {
  const { setNow, clock } = mockClock();
  const now = new Date();
  setNow(now);

  const messageId = "some message id";
  const chatId = 2;
  const userId = 3;

  describe("sendMessage", () => {
    it("returns event", () => {
      expect(
        sendMessage(
          {
            id: messageId,
            body: "some message",
            chatId,
          },
          userId,
          clock,
        ),
      ).toStrictEqual({
        id: messageId,
        chatId,
        authorId: userId,
        body: "some message",
        sentAt: now.getTime(),
        deliveryStatus: DeliveryStatus.Pending,
      });
    });
  });

  describe("unsendMessage", () => {
    it("succeeds", () => {
      expect(
        unsendMessage(
          {
            message: {
              id: messageId,
              chatId,
              authorId: userId,
              body: "some message",
              sentAt: now.getTime(),
              deliveryStatus: DeliveryStatus.Pending,
            },
          },
          userId,
        ),
      ).toStrictEqual(ok({ messageId }));
    });

    it("fails if user is not author", () => {
      expect(
        unsendMessage(
          {
            message: {
              id: messageId,
              chatId,
              authorId: -1,
              body: "some message",
              sentAt: now.getTime(),
              deliveryStatus: DeliveryStatus.Pending,
            },
          },
          userId,
        ),
      ).toStrictEqual(error("Unauthorized"));
    });

    it("fails if message was seen", () => {
      expect(
        unsendMessage(
          {
            message: {
              id: messageId,
              chatId,
              authorId: userId,
              body: "some message",
              sentAt: now.getTime(),
              deliveryStatus: DeliveryStatus.Seen,
            },
          },
          userId,
        ),
      ).toStrictEqual(error("AlreadySeen"));
    });
  });
});
