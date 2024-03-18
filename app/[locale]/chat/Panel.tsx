"use client";

import { ChatRow } from "@/app/[locale]/chat/ChatRow";
import { NewChat } from "@/app/[locale]/chat/NewChat";
import { updateProfile } from "@/app/actions/profile";
import { Avatar } from "@/app/components/Avatar";
import { Drawer } from "@/app/components/Drawer";
import { EditProfile } from "@/app/components/EditProfile";
import * as Icons from "@/app/components/Icons";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import { SignOut } from "@/app/components/SignOut";
import type { Profile } from "@/app/core/contexts/account/profile";
import type { Chat } from "@/app/core/contexts/chat/chat";
import type { UserId } from "@/app/core/core";
import { useTranslations } from "next-intl";
import { useState } from "react";

type DrawerContent =
  | null
  | { _tag: "Profile"; profile: Profile }
  | { _tag: "NewChat" };

const DrawerChildren = ({
  content,
  onFinished,
  currentUserId,
}: {
  content: DrawerContent;
  onFinished: () => void;
  currentUserId: UserId;
}) => {
  if (content === null) return null;

  switch (content._tag) {
    case "Profile":
      return (
        <>
          <div className="h-full">
            <EditProfile
              currentUserId={currentUserId}
              action={updateProfile}
              profile={content.profile}
              onSaved={onFinished}
            />
          </div>
          <div className="flex flex-row justify-between justify-self-end">
            <SignOut className="p-4" />
            <LanguageSelector />
          </div>
        </>
      );
    case "NewChat":
      // TODO: Select chat after being created
      return <NewChat onSaved={onFinished} />;
  }
};

export const Panel = ({
  profile,
  chats,
  currentUserId,
}: {
  profile: Profile;
  chats: Array<Chat>;
  currentUserId: UserId;
}) => {
  const [drawerContent, setDrawerContent] = useState<DrawerContent>(null);
  const t = useTranslations("CHAT");

  const drawerTitle = (content: DrawerContent) => {
    if (content === null) return "";

    switch (content._tag) {
      case "Profile":
        return t("PROFILE_DRAWER_TITLE");
      case "NewChat":
        return t("NEW_CHAT_DRAWER_TITLE");
    }
  };

  return (
    <div className="relative flex h-full w-full flex-col overflow-hidden">
      <Drawer
        title={drawerTitle(drawerContent)}
        open={drawerContent !== null}
        onClose={() => setDrawerContent(null)}
      >
        <DrawerChildren
          currentUserId={currentUserId}
          content={drawerContent}
          onFinished={() => setDrawerContent(null)}
        />
      </Drawer>
      <div className="flex flex-row items-center justify-between p-4">
        <Avatar
          userId={currentUserId}
          src={profile.avatarUrl}
          size="md"
          className="cursor-pointer"
          onClick={() => setDrawerContent({ _tag: "Profile", profile })}
          priority
        />
        <div>
          <Icons.ChatLeft
            className="cursor-pointer"
            onClick={() => setDrawerContent({ _tag: "NewChat" })}
          />
        </div>
      </div>
      <div className="flex flex-col divide-y divide-gray-300">
        {chats.map((chat) => (
          <ChatRow chat={chat} currentUserId={currentUserId} key={chat.id} />
        ))}
      </div>
    </div>
  );
};
