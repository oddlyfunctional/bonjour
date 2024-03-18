import { Main } from "@/app/[locale]/chat/Main";
import { currentUser } from "@/app/actions/auth";
import { getChats } from "@/app/actions/chat";
import { getProfile } from "@/app/actions/profile";
import { makeListState } from "@/store";
import { useTranslations } from "next-intl";

export default async function ChatContainer() {
  const account = await currentUser();
  const profile = await getProfile();
  const chats = await getChats();
  const t = useTranslations("CHAT");
  return (
    <Main
      initialState={{
        currentUser: { account, profile },
        members: { map: {}, order: [] },
        messages: { map: {}, order: [] },
        chats: {
          ...makeListState(chats, (c) => c.id),
          currentChat: null,
        },
        drawer: { open: false, content: null },
      }}
    >
      <div className="flex h-full w-full items-center justify-center">
        {t("SELECT_A_CHAT")}
      </div>
    </Main>
  );
}
