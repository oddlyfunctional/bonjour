"use client";
import type { Chat, MemberReadModel } from "@/app/core/contexts/chat/chat";
import { useMemo } from "react";

export const ChatHeader = ({
  chat,
  members,
}: {
  chat: Chat;
  members: Array<MemberReadModel>;
}) => {
  const names = useMemo(
    () => members.slice(0, 4).map((member) => member.name),
    [members],
  );
  return (
    <div className="flex flex-col justify-between border-b p-2">
      <div className="font-semibold">{chat.name}</div>
      <div className="text-xs">
        {names.join(", ") + (members.length > names.length ? "..." : "")}
      </div>
    </div>
  );
};
