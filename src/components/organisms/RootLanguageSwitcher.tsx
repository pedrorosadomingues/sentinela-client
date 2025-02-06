/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALES, LOCALE_TO_FLAG } from "@/constants/locales";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand-stores";
import { useTranslations } from "next-intl";
import { Dropdown, DropdownItem, DropdownMenu } from "@heroui/react";

export default function LanguageSwitcher() {
  const { user } = useUserStore();

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
      <Dropdown placement="bottom-end" showArrow shouldBlockScroll={false}  className="fixed top-4 right-4 z-[1000] h-12">
        {[
          <DropdownMenu aria-label="Profile Actions" variant="flat" key="menu">
            <DropdownItem
              key="locale_switcher"
              isReadOnly
              className="cursor-default"
              textValue="Language Switcher"
              endContent={
                <select
                  className="z-10 mx-auto outline-none p-2 rounded-md text-tiny border-small bg-transparent text-default-500"
                  id="locale-switcher"
                  name="locale-switcher"
                  onChange={(e) => handleLocaleChange(e.target.value)}
                  value={currentLocale}
                >
                  {LOCALES.map((locale) => (
                    <option key={locale} value={locale}>
                      {LOCALE_TO_FLAG[locale as keyof typeof LOCALE_TO_FLAG]}
                    </option>
                  ))}
                </select>
              }
            >
              {text("change")}
            </DropdownItem>
          </DropdownMenu>
        ]}
      </Dropdown>
    );
  }
}
