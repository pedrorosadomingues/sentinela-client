/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALES, LOCALE_TO_FLAG } from "@/constants/locales";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";

export default function LanguageSwitcher() {
  const { user, setUser } = useUserStore();

  const [isOpen, setIsOpen] = useState(false);
  const [localUser, setLocalUser] = useState(user);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();
  const text = useTranslations("language_switcher");

  const handleLocaleChange = (locale: string) => {
    const pathnameWithoutLocale = pathname.replace(
      new RegExp(`^/${currentLocale}`),
      ""
    );
    router.push(`/${locale}${pathnameWithoutLocale}`);
    setIsOpen(false);
  };

  useEffect(() => {
    setLocalUser(null);
  }, [user]);

  if (!localUser) {
    return ( 
      <div className="fixed right-[60px] top-0 p-4 z-[400]">
        <button
          className="bg-transparent border-0 text-2xl cursor-pointer"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          <span className="text-[16px] text-black">{text("change")}</span>
        </button>

        {isOpen && (
          <div className="absolute top-10 right-0 flex flex-col gap-2 bg-white border border-gray-300 rounded p-2 z-[1000]">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                disabled={locale === currentLocale}
                className="bg-transparent border-0 cursor-pointer p-0 text-2xl transition-transform duration-200 hover:scale-110 disabled:opacity-50 disabled:cursor-default"
              >
                <span role="img" aria-label={locale}>
                  {LOCALE_TO_FLAG[locale as keyof typeof LOCALE_TO_FLAG]}
                </span>
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }
}
