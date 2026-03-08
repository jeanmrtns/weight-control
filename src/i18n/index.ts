import type { Locale } from "./types";
import { ptBR } from "./messages/pt-BR";
import { enUS } from "./messages/en-US";
import { esES } from "./messages/es-ES";

const messagesMap: Record<Locale, Record<string, string>> = {
  "pt-BR": ptBR,
  "en-US": enUS,
  "es-ES": esES,
};

export function getMessages(locale: Locale): Record<string, string> {
  return messagesMap[locale] ?? ptBR;
}

export type { Locale };
export { LOCALES, DEFAULT_LOCALE, LOCALE_STORAGE_KEY } from "./types";
