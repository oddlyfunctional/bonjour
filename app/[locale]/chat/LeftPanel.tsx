"use client";

import { ChatRow } from "@/app/[locale]/chat/ChatRow";
import { Avatar } from "@/app/components/Avatar";
import { Drawer } from "@/app/components/Drawer";
import * as Icons from "@/app/components/Icons";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { fullChatsSelector } from "@/store/chatsSlice";
import { currentUserSelector } from "@/store/currentUserSlice";
import { open, type DrawerContent } from "@/store/drawerSlice";
import { useLocale, useTranslations } from "next-intl";
import { redirect } from "next/navigation";

export const LeftPanel = () => {
  const { account, profile } = useAppSelector(currentUserSelector);
  const locale = useLocale();
  if (!profile) return redirect(`/${locale}/account/profile`);
  const chats = useAppSelector(fullChatsSelector);
  const dispatch = useAppDispatch();
  const openDrawer = (content: DrawerContent) => dispatch(open(content));
  const t = useTranslations("CHAT");

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Drawer />
      <div className="flex flex-row items-center justify-between p-4">
        <Avatar
          userId={account.id}
          src={profile.avatarUrl}
          size="md"
          className="cursor-pointer"
          onClick={() => openDrawer({ _tag: "Profile", profile })}
          priority
        />
        <div>
          <Icons.ChatLeft
            className="cursor-pointer"
            onClick={() => openDrawer({ _tag: "NewChat" })}
          />
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-300">
        {chats.map((chat) => (
          <ChatRow chat={chat} key={chat.id} />
        ))}
      </div>
    </div>
  );
};
