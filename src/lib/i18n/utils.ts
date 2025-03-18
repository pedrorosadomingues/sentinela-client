/* eslint-disable @typescript-eslint/no-explicit-any */
import enMessages from "@/../messages/en.json";
import ptMessages from "@/../messages/pt.json";
import esMessages from "@/../messages/es.json";

const localeMessages: Record<string, any> = {
  en: enMessages,
  pt: ptMessages,
  es: esMessages,
};

export function getLocaleMessages(locale: string) {
  return localeMessages[locale] || localeMessages.en;
}
