import { redirect } from "next/navigation";
import { currentUser } from "@/app/actions/auth";
import { getProfile } from "@/app/actions/profile";
import * as Option from "@/app/lib/option";
import Image from "next/image";

export default async function Profile() {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const profile = Option.toNullable(await getProfile());
  const avatarUrl = profile && Option.toNullable(profile.avatarUrl);

  return (
    <div>
      <h1>Profile</h1>
      <form>
        <input defaultValue={profile?.name} name="name" type="text" required />
        <input name="avatarUrl" type="file" />
        {avatarUrl && <Image src={avatarUrl} alt="avatar" />}
      </form>
    </div>
  );
}
