"use client";

import { createChat } from "@/app/actions/chat";
import { useRef } from "react";

export const NewChat = ({ onSaved }: { onSaved: () => void }) => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (form) => {
        await createChat(form);
        onSaved();
      }}
      className="flex flex-col p-2"
    >
      <label className="flex flex-col">
        <span className="font-semibold">Chat name:</span>
        <input
          type="text"
          name="name"
          placeholder="Type the new chat name"
          required
          className="mt-2 rounded p-2"
        />
      </label>
      <button
        type="submit"
        className="mt-2 rounded bg-black p-2 text-white hover:bg-gray-600"
      >
        Create
      </button>
    </form>
  );
};
