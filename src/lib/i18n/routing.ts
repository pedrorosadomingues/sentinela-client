import { defineRouting, LocalePrefix } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const localePrefix = 'never' as LocalePrefix;
export const locales = ["en", "pt", "es"];

export const routing = defineRouting({
  locales,
  localePrefix,
  defaultLocale: 'en'
});


export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);