import { currentUser } from "@/app/actions/auth";
import { getChat } from "@/app/actions/chat";
import { ChatWrapper } from "@/app/chat/[id]/Chat";
import { ChatId } from "@/app/core/core";
import { redirect } from "next/navigation";

export default async function Chat({
  params: { id },
}: {
  params: { id: ChatId };
}) {
  const user = await currentUser();
  if (!user.some) return redirect("/");
  const chat = await getChat(id);

  return (
    <div className="flex h-full w-full flex-col">
      <ChatWrapper chat={chat} currentUserId={user.value.id} />
    </div>
  );
}
