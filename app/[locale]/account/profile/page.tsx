import { CreateProfile } from "@/app/[locale]/account/profile/CreateProfile";
import { currentUser } from "@/app/actions/auth";
import { getProfile } from "@/app/actions/profile";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

export default async function Profile({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const user = await currentUser();
  const profile = await getProfile();
  if (profile) return redirect(`/${locale}/chat`);
  const t = await getTranslations("PROFILE");

  return (
    <div className="p-4">
      <h1 className="text-5xl font-bold">{t("CREATE_PROFILE_PAGE_TITLE")}</h1>
      <CreateProfile currentUserId={user.id} />
    </div>
  );
}
