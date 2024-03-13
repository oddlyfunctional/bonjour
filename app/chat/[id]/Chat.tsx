import { getMessages } from "@/app/actions/message";
import { Messages } from "@/app/chat/[id]/Messages";
import { NewMessage } from "@/app/chat/[id]/NewMessage";
import type { Chat } from "@/app/core/contexts/chat/chat";
import type { UserId } from "@/app/core/core";

const ChatHeader = ({ chat }: { chat: Chat }) => {
  return (
    <div className="flex flex-col justify-between border-b p-2">
      <div className="font-semibold">{chat.name}</div>
      <div className="text-xs">Alice, Bob, Carl...</div>
    </div>
  );
};

export const ChatWrapper = async ({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: UserId;
}) => {
  const messages = await getMessages(chat.id);
  return (
    <>
      <ChatHeader chat={chat} />
      <Messages messages={messages} currentUserId={currentUserId} />
      <NewMessage chatId={chat.id} />
    </>
  );
};
