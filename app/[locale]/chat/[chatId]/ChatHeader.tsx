"use client";
import type { UserId } from "@/app/core/core";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { currentChatSelector } from "@/store/chatsSlice";
import { open } from "@/store/drawerSlice";
import { fullMembersSelector } from "@/store/membersSlice";
import { useMemo } from "react";

export const ChatHeader = ({ currentUserId }: { currentUserId: UserId }) => {
  const chat = useAppSelector(currentChatSelector);
  if (!chat) throw new Error("This component cannot be used without a chat");
  const members = useAppSelector(fullMembersSelector);
  const names = useMemo(
    () => members.slice(0, 4).map((member) => member.name),
    [members],
  );
  const dispatch = useAppDispatch();
  const editChat = () => dispatch(open({ _tag: "EditChat", chat }));
  const isAdmin = chat.adminId === currentUserId;
  const content = (
    <div className="flex flex-col justify-between border-b p-2">
      <div className="font-semibold">{chat.name}</div>
      <div className="text-xs">
        {names.join(", ") + (members.length > names.length ? "..." : "")}
      </div>
    </div>
  );

  if (isAdmin) {
    return <button onClick={editChat}>{content}</button>;
  } else {
    return content;
  }
};
