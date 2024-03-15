import { ChatWrapper } from "@/app/[locale]/chat/[id]/ChatWrapper";
import { currentUser } from "@/app/actions/auth";
import { getChat } from "@/app/actions/chat";
import { ChatId } from "@/app/core/core";

export default async function Chat({
  params: { id },
}: {
  params: { id: ChatId };
}) {
  const user = await currentUser();
  const chat = await getChat(id);

  return (
    <div className="flex h-full w-full flex-col">
      <ChatWrapper chat={chat} currentUserId={user.id} />
    </div>
  );
}