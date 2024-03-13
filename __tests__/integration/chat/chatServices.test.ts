import { beforeAll, describe, expect, test } from "@jest/globals";
import * as ChatRepo from "@/app/core/contexts/chat/chatRepository";
import { Account } from "@/app/core/contexts/account/account";
import { Repository as ChatRepository } from "@/app/core/contexts/chat/chat";
import { load } from "@/app/core/startup";
import { makeUser } from "@/__tests__/factories";
import {
  addMember,
  changeAdmin,
  createChat,
  removeChat,
  removeMember,
} from "@/app/core/contexts/chat/chatServices";
import { fail } from "assert";
import { Env } from "@/app/core/env";
import { none, some } from "@/app/lib/option";
import { Config } from "@/app/core/config";

describe("chatServices integration tests", () => {
  let world: {
    user: Account;
    chatRepo: ChatRepository;
    config: Config;
    env: Env;
  };
  beforeAll(async () => {
    const { env, config } = await load();
    const chatRepo = ChatRepo.make(env.sql);

    const user = await makeUser(config, env);

    world = {
      user,
      chatRepo,
      config,
      env,
    };
  });

  test("chat services", async () => {
    const { user, chatRepo, config, env } = world;

    const chat = await createChat("some chat", user.id, chatRepo);
    expect(await chatRepo.getById(chat.id)).toEqual(some(chat));

    const newAdmin = await makeUser(config, env);
    const memberAdded = await addMember(
      { chatId: chat.id, newMemberId: newAdmin.id },
      user.id,
      chatRepo,
    );
    if (!memberAdded.ok) fail(memberAdded.error);
    expect(memberAdded.value).toEqual({
      chatId: chat.id,
      memberId: newAdmin.id,
    });
    (chat.members = [user.id, newAdmin.id]),
      expect(await chatRepo.getById(chat.id)).toEqual(some(chat));

    const adminChanged = await changeAdmin(
      {
        chatId: chat.id,
        newAdminId: newAdmin.id,
      },
      user.id,
      chatRepo,
    );
    if (!adminChanged.ok) fail(adminChanged.error);
    expect(adminChanged.value).toEqual({
      chatId: chat.id,
      adminId: newAdmin.id,
    });
    chat.adminId = newAdmin.id;
    expect(await chatRepo.getById(chat.id)).toEqual(some(chat));

    const memberRemoved = await removeMember(
      { chatId: chat.id, memberId: user.id },
      newAdmin.id,
      chatRepo,
    );
    if (!memberRemoved.ok) fail(memberRemoved.error);
    expect(memberRemoved.value).toEqual({ chatId: chat.id, memberId: user.id });
    chat.members = [newAdmin.id];
    expect(await chatRepo.getById(chat.id)).toEqual(some(chat));

    const chatRemoved = await removeChat(chat.id, newAdmin.id, chatRepo);
    if (!chatRemoved.ok) fail(chatRemoved.error);
    expect(chatRemoved.value).toEqual({ chatId: chat.id });
    expect(await chatRepo.getById(chat.id)).toEqual(none);
  });
});
