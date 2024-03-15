import * as AccountRepo from "@/app/core/contexts/account/accountRepository";
import { verifyAccount } from "@/app/core/contexts/account/accountServices";
import { load } from "@/app/core/startup";
import { getLocale } from "next-intl/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  const locale = await getLocale();
  const token = req.nextUrl.searchParams.get("token");
  if (token !== null) {
    const { env } = await load();
    const accountRepo = AccountRepo.make(env.sql);
    const accountVerified = await verifyAccount(token, accountRepo, env);
    if (accountVerified.ok) {
      cookies().set("sessionId", accountVerified.value.sessionId);
      redirect(`/${locale}/account/profile`);
    }
  }
  redirect(`/${locale}`);
}
