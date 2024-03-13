"use server";
import { currentUser } from "./auth";
import { load } from "@/app/core/startup";
import * as Chat from "@/app/core/contexts/chat/chatServices";
import * as ChatRepo from "@/app/core/contexts/chat/chatRepository";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { ChatId } from "@/app/core/core";

export const getChats = async () => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const chatRepo = ChatRepo.make(env.sql);
  return await chatRepo.getAllByUserId(user.value.id);
};

export const getChat = async (chatId: ChatId) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const chatRepo = ChatRepo.make(env.sql);
  const chat = await chatRepo.getById(chatId);
  if (!chat.some || !chat.value.members.includes(user.value.id)) redirect("/");

  return chat.value;
};

export const createChat = async (form: FormData) => {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const { env } = await load();
  const chatRepo = ChatRepo.make(env.sql);
  await Chat.createChat(form.get("name") as string, user.value.id, chatRepo);

  revalidatePath("/chat");
};
