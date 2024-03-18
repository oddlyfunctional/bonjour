"use client";
import { Chat } from "@/app/core/contexts/chat/chat";
import type { Route } from "next";
import { useLocale } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const ChatRow = ({ chat }: { chat: Chat }) => {
  const pathname = usePathname();
  const locale = useLocale();
  const href = `/${locale}/chat/${chat.id}` as Route;
  const isCurrent = pathname == href;
  return (
    <Link href={href} className={"p-2" + (isCurrent ? " bg-blue-100" : "")}>
      <div>{chat.name}</div>
    </Link>
  );
};
