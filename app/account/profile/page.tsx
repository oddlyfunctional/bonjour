import { CreateProfile } from "@/app/account/profile/CreateProfile";
import { currentUser } from "@/app/actions/auth";
import { getProfile } from "@/app/actions/profile";
import { redirect } from "next/navigation";

export default async function Profile() {
  const user = await currentUser();
  const profile = await getProfile();
  if (profile) return redirect("/chat");

  return (
    <div className="p-4">
      <h1 className="text-5xl font-bold">Profile</h1>
      <CreateProfile currentUserId={user.id} />
    </div>
  );
}
