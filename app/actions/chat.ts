"use server";
import * as ChatRepo from "@/app/core/contexts/chat/chatRepository";
import * as Chat from "@/app/core/contexts/chat/chatServices";
import { ChatId } from "@/app/core/core";
import { load } from "@/app/core/startup";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";
import { z } from "zod";
import { currentUser } from "./auth";

export const getChats = async () => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  return await chatRepo.getAllByUserId(user.id);
};

export const createChat = async (form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  const chat = await Chat.createChat(
    form.get("name") as string,
    user.id,
    chatRepo,
  );

  const locale = await getLocale();
  redirect(`/${locale}/chat/${chat.id}`);
};

export const updateChat = async (chatId: ChatId, form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  const validatedBody = z.object({ name: z.string() }).safeParse({
    name: form.get("name"),
  });
  if (!validatedBody.success) throw validatedBody.error;
  await Chat.updateChat(
    { chatId, name: validatedBody.data.name },
    user.id,
    chatRepo,
  );

  const chat = await chatRepo.getById(chatId);
  if (!chat) throw `Failed to find chat ${chatId}`;
  return chat;
};

export const getMembers = async (chatId: ChatId) => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  return await chatRepo.getMembers(chatId, user.id);
};
