"use client";
import { useAppSelector } from "@/app/lib/hooks";
import { chatSelector } from "@/store/chatSlice";
import { fullMembersSelector } from "@/store/membersSlice";
import { useMemo } from "react";

export const ChatHeader = () => {
  const chat = useAppSelector(chatSelector);
  const members = useAppSelector(fullMembersSelector);
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
