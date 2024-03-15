import { ChatHeader } from "@/app/[locale]/chat/[id]/ChatHeader";
import { Messages } from "@/app/[locale]/chat/[id]/Messages";
import { NewMessage } from "@/app/[locale]/chat/[id]/NewMessage";
import type { UserId } from "@/app/core/core";

export const ChatWrapper = async ({
  currentUserId,
}: {
  currentUserId: UserId;
}) => {
  return (
    <>
      <ChatHeader />
      <Messages currentUserId={currentUserId} />
      <NewMessage currentUserId={currentUserId} />
    </>
  );
};
