"use client";

import { signIn } from "@/app/actions/auth";
import { SubmitError } from "@/app/components/SubmitError";
import { useTranslations } from "next-intl";
import { useFormState, useFormStatus } from "react-dom";

const initialState: { error: string | null } = {
  error: null,
};

export const SignIn = () => {
  const [state, action] = useFormState(signIn, initialState);
  const status = useFormStatus();
  const t = useTranslations("ACCOUNT");

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
        {t("SIGN_IN_BUTTON")}
      </button>

      {state.error && <SubmitError error={t("ERRORS." + state.error)} />}
    </form>
  );
};
