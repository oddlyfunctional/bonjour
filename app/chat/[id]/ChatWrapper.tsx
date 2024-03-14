import { getMembers } from "@/app/actions/chat";
import { getMessages } from "@/app/actions/message";
import { ChatHeader } from "@/app/chat/[id]/ChatHeader";
import { Messages } from "@/app/chat/[id]/Messages";
import { NewMessage } from "@/app/chat/[id]/NewMessage";
import type { Chat, MemberReadModel } from "@/app/core/contexts/chat/chat";
import type { UserId } from "@/app/core/core";

export const ChatWrapper = async ({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: UserId;
}) => {
  const messages = await getMessages(chat.id);
  const membersList = await getMembers(chat.id);
  const members: Map<UserId, MemberReadModel> = membersList.reduce(
    (map, member) => {
      map.set(member.userId, member);
      return map;
    },
    new Map(),
  );

  return (
    <>
      <ChatHeader chat={chat} members={membersList} />
      <Messages
        chatId={chat.id}
        messages={messages}
        members={members}
        currentUserId={currentUserId}
      />
      <NewMessage chatId={chat.id} currentUserId={currentUserId} />
    </>
  );
};
