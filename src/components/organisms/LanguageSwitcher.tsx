"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALES, LOCALE_TO_FLAG } from "@/constants/locales";
import { useEffect, useState } from "react";
import { useUserStore } from "@/zustand-stores";

export default function LanguageSwitcher() {
  const { user } = useUserStore();
  const [isOpen, setIsOpen] = useState(false);

  const [localUser, setLocalUser] = useState(user);

  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (locale: string) => {
    const pathnameWithoutLocale = pathname.replace(
      new RegExp(`^/${currentLocale}`),
      ""
    );
    router.push(`/${locale}${pathnameWithoutLocale}`);
    setIsOpen(false); // Opcional: fechar o dropdown após a seleção
  };

  useEffect(() => {
    if (user) {
      setLocalUser(user);
    } else {
      setLocalUser(null);
    }
  }, [user]);

  if (!localUser) {
    return (
      <div className="fixed right-[60px] top-0 p-4 z-[40]">
        <button
          className="menu-button "
          onClick={() => setIsOpen((prev) => !prev)}
        >
          🌐 <span className="text-[12px]">Trocar idioma</span>
        </button>

        {isOpen && (
          <div className="language-dropdown">
            {LOCALES.map((locale) => (
              <button
                key={locale}
                onClick={() => handleLocaleChange(locale)}
                disabled={locale === currentLocale}
                className="flag-button"
              >
                <span role="img" aria-label={locale}>
                  {LOCALE_TO_FLAG[locale as keyof typeof LOCALE_TO_FLAG]}
                </span>
              </button>
            ))}
          </div>
        )}

        <style jsx>{`
          .menu-button {
            background: transparent;
            border: none;
            font-size: 24px;
            cursor: pointer;
          }

          .language-dropdown {
            position: absolute;
            top: 40px;
            right: 0;
            display: flex;
            flex-direction: column;
            gap: 8px;
            background: #fff;
            border: 1px solid #ccc;
            border-radius: 4px;
            padding: 8px;
            z-index: 1000;
          }

          .flag-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            font-size: 24px;
            transition: transform 0.2s;
          }

          .flag-button:disabled {
            opacity: 0.5;
            cursor: default;
          }

          .flag-button:hover:not(:disabled) {
            transform: scale(1.1);
          }
        `}</style>
      </div>
    );
  }
}
