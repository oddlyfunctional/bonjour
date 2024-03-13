"use client";
import { Chat } from "@/app/core/contexts/chat/chat";
import { UserId } from "@/app/core/core";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ChatRow = ({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: UserId;
}) => {
  const pathname = usePathname();
  const href = `/chat/${chat.id}`;
  const isCurrent = pathname == href;
  return (
    <Link href={href} className={"p-2" + (isCurrent ? " bg-blue-100" : "")}>
      <div>{chat.name}</div>
    </Link>
  );
};
