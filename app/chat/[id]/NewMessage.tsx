"use client";
import { Send } from "@/app/components/Icons";
import { DeliveryStatus, type Message } from "@/app/core/contexts/chat/message";
import type { ChatId, UserId } from "@/app/core/core";
import { useChannel } from "@/app/lib/hooks";
import { useRef } from "react";

export const NewMessage = ({
  chatId,
  currentUserId,
}: {
  chatId: ChatId;
  currentUserId: UserId;
}) => {
  const formRef = useRef<HTMLFormElement>(null);
  const channelRef = useChannel(`chat:${chatId}`);

  const submit = async (formData: FormData) => {
    // TODO: store in local store and check for new messages
    // if they are already present
    const message: Message = {
      id: crypto.randomUUID(),
      authorId: currentUserId,
      body: formData.get("body") as string,
      chatId,
      sentAt: new Date(),
      deliveryStatus: DeliveryStatus.Pending,
    };
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
        placeholder="What are you thinking?"
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
