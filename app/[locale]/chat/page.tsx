import { useTranslations } from "next-intl";

export default function ChatContainer() {
  const t = useTranslations("CHAT");
  return (
    <div className="flex h-full w-full items-center justify-center">
      {t("SELECT_A_CHAT")}
    </div>
  );
}
