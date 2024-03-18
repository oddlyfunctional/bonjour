"use client";

import { signUp } from "@/app/actions/auth";
import { SubmitError } from "@/app/components/ErrorMessage";
import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useFormState, useFormStatus } from "react-dom";

const initialState: Awaited<ReturnType<typeof signUp>> = {
  ok: false,
};

export const SignUp = () => {
  const [state, action] = useFormState(signUp, initialState);
  const status = useFormStatus();
  const locale = useLocale();
  const t = useTranslations("ACCOUNT");

  if (state.ok) {
    return (
      <div className="text-center">
        <h1>{t("VERIFY_YOUR_ACCOUNT")}</h1>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col">
      <input
        name="email"
        type="email"
        placeholder={t("EMAIL_PLACEHOLDER")}
        className="mb-4 rounded p-2 outline"
      />
      <input
        name="password"
        type="password"
        placeholder={t("PASSWORD_PLACEHOLDER")}
        className="mb-4 rounded p-2 outline"
      />
      <button
        disabled={status.pending}
        type="submit"
        className="mb-2 w-full rounded bg-black p-2 text-white hover:bg-gray-500"
      >
        {t("SIGN_UP_BUTTON")}
      </button>
      <div className="mt-4 text-center">
        <Link href={`/${locale}`}>{t("ALREADY_REGISTERED")}</Link>
      </div>

      {state.error && <SubmitError error={t("ERRORS." + state.error)} />}
    </form>
  );
};
