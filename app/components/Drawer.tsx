"use client";
import { createChat, updateChat } from "@/app/actions/chat";
import { updateProfile } from "@/app/actions/profile";
import { EditChat } from "@/app/components/EditChat";
import { EditProfile } from "@/app/components/EditProfile";
import * as Icons from "@/app/components/Icons";
import { LanguageSelector } from "@/app/components/LanguageSelector";
import { SignOut } from "@/app/components/SignOut";
import { useAppDispatch, useAppSelector } from "@/app/lib/hooks";
import { updateChat as updateChatActionCreator } from "@/store/chatsSlice";
import { currentUserSelector } from "@/store/currentUserSlice";
import { close, drawerSelector, type DrawerContent } from "@/store/drawerSlice";
import { useTranslations } from "next-intl";

const DrawerContent = ({
  content,
  closeDrawer,
}: {
  content: DrawerContent;
  closeDrawer: () => void;
}) => {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector(currentUserSelector);
  if (content === null) return null;

  switch (content._tag) {
    case "Profile":
      return (
        <>
          <div className="h-full">
            <EditProfile
              action={updateProfile}
              profile={content.profile}
              onSaved={closeDrawer}
              currentUserId={currentUser.account.id}
            />
          </div>
          <div className="flex flex-row justify-between justify-self-end">
            <SignOut className="p-4" />
            <LanguageSelector />
          </div>
        </>
      );
    case "NewChat":
      return <EditChat action={createChat} onSaved={closeDrawer} />;
    case "EditChat":
      return (
        <EditChat
          chat={content.chat}
          action={async (formData) => {
            const chat = await updateChat(content.chat.id, formData);
            dispatch(updateChatActionCreator(chat));
          }}
          onSaved={closeDrawer}
        />
      );
  }
};

const DrawerTitle = ({ content }: { content: DrawerContent }) => {
  const t = useTranslations("DRAWER");
  if (content === null) return null;

  switch (content._tag) {
    case "Profile":
      return <h2>{t("PROFILE_TITLE")}</h2>;
    case "NewChat":
      return <h2>{t("NEW_CHAT_TITLE")}</h2>;
    case "EditChat":
      return <h2>{t("EDIT_CHAT_TITLE")}</h2>;
  }
};

export const Drawer = () => {
  const { open, content } = useAppSelector(drawerSelector);
  const closeDrawer = () => dispatch(close());
  const dispatch = useAppDispatch();
  return (
    <div
      className={`absolute left-0 top-0 z-10 flex h-full w-full flex-col border-r bg-gray-200 transition-transform${open ? "" : " -translate-x-full"}`}
    >
      <div className="flex flex-row border-b bg-gray-800 p-4 text-white">
        <button onClick={closeDrawer}>
          <Icons.ArrowLeft />
        </button>
        <div className="w-full text-center">
          <DrawerTitle content={content} />
        </div>
      </div>
      <DrawerContent content={content} closeDrawer={closeDrawer} />
    </div>
  );
};
