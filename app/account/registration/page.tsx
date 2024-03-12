import { currentUser } from "@/app/actions/auth";
import { redirect } from "next/navigation";
import { SignUp } from "@/app/components/SignUp";

export default async function Registration() {
  const user = await currentUser();
  if (user.some) {
    return redirect("/");
  }

  return <SignUp />;
}
