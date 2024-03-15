import { isSignedIn } from "@/app/actions/auth";
import { SignUp } from "@/app/components/SignUp";
import type { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Registration({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  if (await isSignedIn()) return redirect(`/${locale}/chat`);
  const t = await getTranslations("ACCOUNT");

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-semibold">{t("SIGN_UP_PAGE_TITLE")}</h1>
      <div className="mt-4 w-72">
        <SignUp />
      </div>
    </div>
  );
}
