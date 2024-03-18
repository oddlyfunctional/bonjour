"use client";
import { locales } from "@/i18n";
import type { Route } from "next";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";

export const LanguageSelector = () => {
  const languageNames = useMemo(
    () => new Intl.DisplayNames(locales, { type: "language" }),
    [],
  );
  const currentLocale = useLocale();
  const router = useRouter();
  const fullPathname = usePathname();

  return (
    <select
      className="cursor-pointer bg-transparent outline-none"
      defaultValue={currentLocale}
      onChange={(ev) => {
        const newLocale = ev.currentTarget.value;
        const pathname = fullPathname.split("/").slice(2).join("/"); // remove locale from the URL
        router.replace(`/${newLocale}/${pathname}` as Route);
        router.refresh();
      }}
    >
      {locales.map((locale) => (
        <option value={locale} key={locale}>
          {languageNames.of(locale)}
        </option>
      ))}
    </select>
  );
};
