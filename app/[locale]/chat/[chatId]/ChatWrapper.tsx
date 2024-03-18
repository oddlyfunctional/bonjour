import { ChatHeader } from "@/app/[locale]/chat/[chatId]/ChatHeader";
import { Messages } from "@/app/[locale]/chat/[chatId]/Messages";
import { NewMessage } from "@/app/[locale]/chat/[chatId]/NewMessage";
import type { UserId } from "@/app/core/core";

export const ChatWrapper = async ({
  currentUserId,
}: {
  currentUserId: UserId;
}) => {
  return (
    <>
      <ChatHeader currentUserId={currentUserId} />
      <Messages currentUserId={currentUserId} />
      <NewMessage currentUserId={currentUserId} />
    </>
  );
};
