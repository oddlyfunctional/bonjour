import { redirect } from "next/navigation";
import { NextRequest } from "next/server";
import { load } from "@/app/core/startup";
import { verifyAccount } from "@/app/core/contexts/account/accountServices";
import * as AccountRepo from "@/app/core/contexts/account/accountRepository";
import { cookies } from "next/headers";

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get("token");
  if (token !== null) {
    const { env } = await load();
    const accountRepo = AccountRepo.make(env.sql);
    const accountVerified = await verifyAccount(token, accountRepo, env);
    if (accountVerified.ok) {
      cookies().set("sessionId", accountVerified.value.sessionId);
    }
  }

  redirect("/account/profile");
}
