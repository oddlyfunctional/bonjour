import { Panel } from "@/app/[locale]/chat/Panel";
import { currentUser } from "@/app/actions/auth";
import { getChats } from "@/app/actions/chat";
import { getProfile } from "@/app/actions/profile";
import { getLocale } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Chats() {
  const user = await currentUser();
  const profile = await getProfile();
  const locale = await getLocale();
  if (!profile) return redirect(`/${locale}/account/profile`);

  const chats = await getChats();
  return <Panel chats={chats} profile={profile} currentUserId={user.id} />;
}
