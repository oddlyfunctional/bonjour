import { StoreProvider } from "@/app/StoreProvider";
import { ChatWrapper } from "@/app/[locale]/chat/[id]/ChatWrapper";
import { currentUser } from "@/app/actions/auth";
import { getChat, getMembers } from "@/app/actions/chat";
import { getMessages } from "@/app/actions/message";
import { ChatId } from "@/app/core/core";

const makeState = <T, K extends string | number>(
  items: Array<T>,
  by: (item: T) => K,
) => {
  const map = items.reduce((map: Record<string | number, T>, item) => {
    map[by(item)] = item;
    return map;
  }, {});

  const order = items.map((item) => by(item));

  return { map, order };
};

export default async function Chat({
  params: { id },
}: {
  params: { id: ChatId };
}) {
  const user = await currentUser();
  const chat = await getChat(id);
  const messages = await getMessages(chat.id);
  const members = await getMembers(chat.id);

  // For now only the chat has the need for keeping
  // state on the client-side, so I'm only adding
  // the `StoreProvider` here.
  return (
    <StoreProvider
      initialState={{
        chat,
        messages: makeState(messages, (m) => m.id),
        members: makeState(members, (m) => m.userId),
      }}
    >
      <div className="flex h-full w-full flex-col">
        <ChatWrapper currentUserId={user.id} />
      </div>
    </StoreProvider>
  );
}
