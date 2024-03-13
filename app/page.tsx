import { isSignedIn } from "@/app/actions/auth";
import { SignIn } from "@/app/components/SignIn";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Home() {
  if (await isSignedIn()) return redirect("/chat");

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <h1 className="mb-8 text-8xl font-bold">Bonjour 🥐</h1>
      <SignIn />
      <Link href="/account/registration" className="mt-4">
        Create account
      </Link>
    </div>
  );
}
