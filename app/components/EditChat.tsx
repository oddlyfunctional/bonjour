"use client";

import type { Chat } from "@/app/core/contexts/chat/chat";
import { useTranslations } from "next-intl";

export const EditChat = ({
  chat,
  onSaved,
  action,
}: {
  chat?: Chat;
  onSaved: () => void;
  action: (formData: FormData) => Promise<void>;
}) => {
  const t = useTranslations("CHAT");
  return (
    <form
      action={async (form) => {
        await action(form);
        onSaved();
      }}
      className="flex flex-col p-2"
    >
      <input
        type="text"
        name="name"
        defaultValue={chat?.name}
        placeholder={t("CHAT_NAME_PLACEHOLDER")}
        autoFocus
        required
        className="mt-2 rounded p-2"
      />
      <button
        type="submit"
        className="mt-2 rounded bg-black p-2 text-white hover:bg-gray-600"
      >
        {t(chat ? "SAVE_CHAT_BUTTON" : "CREATE_CHAT_BUTTON")}
      </button>
    </form>
  );
};
