import { describe, expect, it } from "@jest/globals";
import { mock as mockClock } from "@/app/lib/clock";
import { ok, error } from "@/app/lib/result";
import {
  DeliveryStatus,
  sendMessage,
  unsendMessage,
} from "@/app/core/contexts/chat/message";

describe("Message", () => {
  const { setNow, clock } = mockClock();
  const now = new Date();
  setNow(now);

  const messageId = 1;
  const chatId = 2;
  const userId = 3;

  describe("sendMessage", () => {
    it("returns event", () => {
      expect(
        sendMessage(
          {
            body: "some message",
            chatId,
          },
          userId,
          clock,
        ),
      ).toStrictEqual({
        message: {
          chatId,
          authorId: userId,
          body: "some message",
          sentAt: now,
          deliveryStatus: DeliveryStatus.Pending,
        },
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
              sentAt: now,
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
              sentAt: now,
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
              sentAt: now,
              deliveryStatus: DeliveryStatus.Seen,
            },
          },
          userId,
        ),
      ).toStrictEqual(error("AlreadySeen"));
    });
  });
});
