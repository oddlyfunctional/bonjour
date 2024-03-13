"use server";
import * as ChatRepo from "@/app/core/contexts/chat/chatRepository";
import * as Chat from "@/app/core/contexts/chat/chatServices";
import { ChatId } from "@/app/core/core";
import { load } from "@/app/core/startup";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { currentUser } from "./auth";

export const getChats = async () => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  return await chatRepo.getAllByUserId(user.id);
};

export const getChat = async (chatId: ChatId) => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  const chat = await chatRepo.getById(chatId);
  if (!chat.some || !chat.value.members.includes(user.id)) redirect("/");

  return chat.value;
};

export const createChat = async (form: FormData) => {
  const { env } = await load();
  const user = await currentUser();
  const chatRepo = ChatRepo.make(env.sql);
  await Chat.createChat(form.get("name") as string, user.id, chatRepo);

  revalidatePath("/chat");
};
