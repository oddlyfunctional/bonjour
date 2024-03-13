"use client";
import { sendMessage } from "@/app/actions/message";
import { Send } from "@/app/components/Icons";
import type { ChatId } from "@/app/core/core";
import { useRef } from "react";

export const NewMessage = ({ chatId }: { chatId: ChatId }) => {
  const formRef = useRef<HTMLFormElement>(null);

  const submit = async (formData: FormData) => {
    await sendMessage(chatId, formData);
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
