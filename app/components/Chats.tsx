import { redirect } from "next/navigation";
import { getChats } from "@/app/actions/chat";
import { Chat } from "@/app/core/contexts/chat/chat";
import { currentUser } from "@/app/actions/auth";
import { UserId } from "@/app/core/core";
import { NewChat } from "./NewChat";

const ChatRow = ({
  chat,
  currentUserId,
}: {
  chat: Chat;
  currentUserId: UserId;
}) => {
  return (
    <div>
      {chat.name}
      {chat.adminId === currentUserId && "*"}
    </div>
  );
};

export default async function Chats() {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const chats = await getChats();
  return (
    <div className="flex flex-col">
      <NewChat />
      {chats.map((chat) => (
        <ChatRow chat={chat} currentUserId={user.value.id} key={chat.id} />
      ))}
    </div>
  );
}
