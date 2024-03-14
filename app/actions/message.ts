"use server";

import * as MessageRepo from "@/app/core/contexts/chat/messageRepository";
import { ChatId, type uuid } from "@/app/core/core";
import { load } from "@/app/core/startup";
import { revalidatePath } from "next/cache";
import * as Message from "../core/contexts/chat/messageServices";
import { currentUser } from "./auth";

export const getMessages = async (chatId: ChatId) => {
  const { env } = await load();
  const user = await currentUser();
  const messageRepo = MessageRepo.make(env.sql);
  return await messageRepo.getAllByChatId(chatId, user.id);
};

export const sendMessage = async (id: uuid, chatId: ChatId, form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const messageRepo = MessageRepo.make(env.sql);
  await Message.sendMessage(
    {
      id,
      chatId,
      body: form.get("body") as string,
    },
    user.id,
    messageRepo,
    env.clock,
  );

  revalidatePath(`/chat/${chatId}`);
};
