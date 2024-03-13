import { currentUser } from "@/app/actions/auth";
import { getChats } from "@/app/actions/chat";
import { getProfile } from "@/app/actions/profile";
import { Panel } from "@/app/chat/Panel";
import { redirect } from "next/navigation";

export default async function Chats() {
  const user = await currentUser();
  if (!user.some) return redirect("/");
  const profile = await getProfile();
  if (!profile.some) return redirect("/account/profile");

  const chats = await getChats();
  return (
    <Panel
      chats={chats}
      profile={profile.value}
      currentUserId={user.value.id}
    />
  );
}