"use server";

import { ChatId } from "@/app/core/core";
import { currentUser } from "./auth";
import { redirect } from "next/navigation";
import { load } from "@/app/core/startup";
import * as MessageRepo from "@/app/core/contexts/chat/messageRepository";
import * as Message from "../core/contexts/chat/messageServices";
import { revalidatePath } from "next/cache";

export const getMessages = async (chatId: ChatId) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const messageRepo = MessageRepo.make(env.sql);
  return await messageRepo.getAllByChatId(chatId, user.value.id);
};

export const sendMessage = async (chatId: ChatId, form: FormData) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const messageRepo = MessageRepo.make(env.sql);
  await Message.sendMessage(
    {
      chatId,
      body: form.get("body") as string,
    },
    user.value.id,
    messageRepo,
    env.clock,
  );

  revalidatePath(`/chat/${chatId}`);
};
