import { makeUser } from "@/__tests__/factories";
import { Account } from "@/app/core/contexts/account/account";
import { Chat } from "@/app/core/contexts/chat/chat";
import * as ChatRepo from "@/app/core/contexts/chat/chatRepository";
import { createChat } from "@/app/core/contexts/chat/chatServices";
import { Repository as MessageRepository } from "@/app/core/contexts/chat/message";
import * as MessageRepo from "@/app/core/contexts/chat/messageRepository";
import {
  sendMessage,
  unsendMessage,
} from "@/app/core/contexts/chat/messageServices";
import { load } from "@/app/core/startup";
import * as Clock from "@/app/lib/clock";
import { none } from "@/app/lib/option";
import { beforeAll, describe, expect, test } from "@jest/globals";

describe("messageServices integration tests", () => {
  const mockClock = Clock.mock();

  let world: {
    user: Account;
    chat: Chat;
    msgRepo: MessageRepository;
  };
  beforeAll(async () => {
    const { env, config } = await load();
    const chatRepo = ChatRepo.make(env.sql);
    const msgRepo = MessageRepo.make(env.sql);

    const user = await makeUser(config, env);
    const chat = await createChat("some chat", user.id, chatRepo);

    world = {
      user,
      chat,
      msgRepo,
    };
  });

  test("message services", async () => {
    const { user, chat, msgRepo } = world;
    const now = new Date();
    mockClock.setNow(now);
    const msg = await sendMessage(
      { body: "some message", chatId: chat.id },
      user.id,
      msgRepo,
      mockClock.clock,
    );
    expect(await msgRepo.getById(msg.id)).toEqual(msg);

    const unsent = await unsendMessage(msg.id, user.id, msgRepo);
    if (!unsent.ok) throw new Error(unsent.error);
    expect(unsent.value).toEqual({ messageId: msg.id });
    expect(await msgRepo.getById(msg.id)).toEqual(none);
  });
});
