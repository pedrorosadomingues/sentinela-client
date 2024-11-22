"use client";

import { usePathname, useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { LOCALES, LOCALE_TO_FLAG } from "@/constants/locales";

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = useLocale();

  const handleLocaleChange = (locale: string) => {
    const pathnameWithoutLocale = pathname.replace(
      new RegExp(`^/${currentLocale}`),
      ""
    );
    router.push(`/${locale}${pathnameWithoutLocale}`);
  };

  return (
    <div className="fixed right-0">
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

      <style jsx>
        {`
          div {
            display: flex;
            gap: 8px;
            z-index: 1000;
          }
          .flag-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            padding: 0;
            font-size: 24px;
          }
          .flag-button:disabled {
            opacity: 0.5;
            cursor: default;
          }
          .flag-button:hover:not(:disabled) {
            transform: scale(1.1);
          }
        `}
      </style>
    </div>
  );
}
