import { currentUser } from "@/app/actions/auth";
import { SignUp } from "@/app/components/SignUp";
import { redirect } from "next/navigation";

export default async function Registration() {
  const user = await currentUser();
  if (user.some) {
    return redirect("/");
  }

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-4xl font-semibold">Create your account</h1>
      <div className="mt-4 w-72">
        <SignUp />
      </div>
    </div>
  );
}
