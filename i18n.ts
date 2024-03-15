import { getRequestConfig } from "next-intl/server";
import { notFound } from "next/navigation";

// Can be imported from a shared config
export type Locale = "en" | "pt" | "fr";
export const locales: Array<Locale> = ["en", "pt", "fr"];

export default getRequestConfig(async ({ locale }) => {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) notFound();

  return {
    messages: (
      await (locale === "en"
        ? // When using Turbopack, this will enable HMR for `en`
          import("./i18n/en.json")
        : import(`./i18n/${locale}.json`))
    ).default,
  };
});
