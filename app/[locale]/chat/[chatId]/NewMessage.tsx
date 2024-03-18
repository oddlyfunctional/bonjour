"use client";
import { Send } from "@/app/components/Icons";
import { DeliveryStatus, type Message } from "@/app/core/contexts/chat/message";
import type { UserId } from "@/app/core/core";
import { useAppDispatch, useAppSelector, useChannel } from "@/app/lib/hooks";
import { currentChatSelector } from "@/store/chatsSlice";
import { messageSent } from "@/store/messagesSlice";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export const NewMessage = ({ currentUserId }: { currentUserId: UserId }) => {
  const chat = useAppSelector(currentChatSelector);
  if (!chat) throw new Error("This component cannot be used without a chat");
  const dispatch = useAppDispatch();
  const formRef = useRef<HTMLFormElement>(null);
  const channelRef = useChannel(`chat:${chat.id}`);
  const t = useTranslations("CHAT");

  const submit = async (formData: FormData) => {
    const message: Message = {
      id: crypto.randomUUID(),
      authorId: currentUserId,
      body: formData.get("body") as string,
      chatId: chat.id,
      sentAt: new Date(),
      deliveryStatus: DeliveryStatus.Pending,
    };
    dispatch(messageSent(message));
    channelRef.current?.push("message", {
      sessionId: "session-id", // TODO: replace with actual session id
      message,
    });

    formRef.current?.reset();
  };

  return (
    <form ref={formRef} action={submit} className="flex w-full flex-row">
      <textarea
        name="body"
        placeholder={t("MESSAGE_PLACEHOLDER")}
        className="m-2 grow resize-none p-2"
        required
        onKeyDown={(ev) => {
          if (ev.key === "Enter" && !ev.shiftKey) {
            ev.preventDefault();
            formRef.current?.requestSubmit();
          }
        }}
      />
      <button type="submit" className="w-10 p-2">
        <Send />
      </button>
    </form>
  );
};
