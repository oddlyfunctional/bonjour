import { EditProfile } from "@/app/account/profile/EditProfile";
import { currentUser } from "@/app/actions/auth";
import {
  createProfile,
  getProfile,
  updateProfile,
} from "@/app/actions/profile";
import * as Option from "@/app/lib/option";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await currentUser();
  if (!user.some) return redirect("/");

  const profile = Option.toUndefined(await getProfile());
  const action = profile ? updateProfile : createProfile;

  return (
    <div className="p-4">
      <h1 className="text-5xl font-bold">Profile</h1>
      <EditProfile
        action={action}
        profile={profile}
        onSaved={redirect("/chat")}
      />
    </div>
  );
}
