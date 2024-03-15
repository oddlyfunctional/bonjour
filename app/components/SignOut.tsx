"use client";
import { signOut } from "@/app/actions/auth";
import { useTranslations } from "next-intl";
import { useState } from "react";

export const SignOut = (props: React.ComponentPropsWithoutRef<"button">) => {
  const t = useTranslations("ACCOUNT");
  const [clicked, setClicked] = useState(false);
  return (
    <button
      disabled={clicked}
      onClick={() => {
        setClicked(true);
        signOut();
      }}
      {...props}
    >
      {t("SIGN_OUT_BUTTON")}
    </button>
  );
};
