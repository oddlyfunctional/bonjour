import { Main } from "@/app/[locale]/chat/Main";
import { ChatWrapper } from "@/app/[locale]/chat/[chatId]/ChatWrapper";
import { currentUser } from "@/app/actions/auth";
import { getChats, getMembers } from "@/app/actions/chat";
import { getMessages } from "@/app/actions/message";
import { getProfile } from "@/app/actions/profile";
import { ChatId } from "@/app/core/core";
import { makeListState } from "@/store";

export default async function Chat({
  params: { chatId },
}: {
  params: { chatId: ChatId };
}) {
  const account = await currentUser();
  const profile = await getProfile();
  const chats = await getChats();
  const messages = await getMessages(chatId);
  const members = await getMembers(chatId);

  return (
    <Main
      initialState={{
        currentUser: { account, profile },
        chats: {
          ...makeListState(chats, (c) => c.id),
          currentChat: chatId,
        },
        messages: { [chatId]: makeListState(messages, (m) => m.id) },
        members: makeListState(members, (m) => m.userId),
        drawer: { open: false, content: null },
      }}
    >
      <div className="flex h-full w-full flex-col">
        <ChatWrapper currentUserId={account.id} />
      </div>
    </Main>
  );
}
