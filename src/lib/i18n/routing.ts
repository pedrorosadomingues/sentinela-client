import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const availableLocales = ["en", "pt", "es"];

export const routing = defineRouting({
  locales: availableLocales,
  defaultLocale: "pt",
  localeDetection: false,
});

export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
