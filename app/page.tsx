import Link from "next/link";
import { currentUser } from "@/app/actions/auth";
import { SignIn } from "@/app/components/SignIn";
import { SignOut } from "./components/SignOut";

export default async function Home() {
  const user = await currentUser();

  return (
    <div>
      <h1>Hello World</h1>
      {user.some ? (
        <SignOut />
      ) : (
        <>
          <SignIn />
          <p>
            <Link href="/account/registration">Create your account</Link>
          </p>
        </>
      )}
    </div>
  );
}
