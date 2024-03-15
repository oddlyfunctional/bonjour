import { isSignedIn } from "@/app/actions/auth";
import { SignIn } from "@/app/components/SignIn";
import type { Locale } from "@/i18n";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { redirect } from "next/navigation";

import { Sacramento } from "next/font/google";

// If loading a variable font, you don't need to specify the font weight
const sacramento = Sacramento({ weight: "400", subsets: ["latin"] });

export default async function Home({
  params: { locale },
}: {
  params: { locale: Locale };
}) {
  const t = await getTranslations("ACCOUNT");
  if (await isSignedIn()) return redirect(`/${locale}/chat`);

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className={`mb-8 text-8xl font-bold ${sacramento.className}`}>
        Bonjour <span className="text-6xl">🥐</span>
      </h1>
      <SignIn />
      <Link href={`/${locale}/account/registration`} className="mt-4">
        {t("CREATE_ACCOUNT_LINK")}
      </Link>
    </div>
  );
}
