"use client";

import { createChat } from "@/app/actions/chat";
import { useTranslations } from "next-intl";
import { useRef } from "react";

export const NewChat = ({ onSaved }: { onSaved: () => void }) => {
  const ref = useRef<HTMLFormElement>(null);
  const t = useTranslations("CHAT");
  return (
    <form
      ref={ref}
      action={async (form) => {
        await createChat(form);
        onSaved();
      }}
      className="flex flex-col p-2"
    >
      <input
        type="text"
        name="name"
        placeholder={t("CHAT_NAME_PLACEHOLDER")}
        required
        className="mt-2 rounded p-2"
      />
      <button
        type="submit"
        className="mt-2 rounded bg-black p-2 text-white hover:bg-gray-600"
      >
        {t("CREATE_CHAT_BUTTON")}
      </button>
    </form>
  );
};
