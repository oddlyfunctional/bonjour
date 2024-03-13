"use client";

import { useRef } from "react";
import { createChat } from "@/app/actions/chat";

export const NewChat = () => {
  const ref = useRef<HTMLFormElement>(null);
  return (
    <form
      ref={ref}
      action={async (form) => {
        await createChat(form);
        ref.current?.reset();
      }}
      className="text-black"
    >
      <input type="text" name="name" placeholder="Chat name" required />
      <button type="submit">Create</button>
    </form>
  );
};
