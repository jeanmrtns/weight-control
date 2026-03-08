/**
 * Flat message keys for type-safe translations.
 * Use dot notation: "home.title", "nav.people"
 */
export type MessageKey = string;

export type Locale = "pt-BR" | "en-US" | "es-ES";

export const LOCALES: { value: Locale; flag: string; label: string }[] = [
  { value: "pt-BR", flag: "🇧🇷", label: "Português (BR)" },
  { value: "en-US", flag: "🇺🇸", label: "English (US)" },
  { value: "es-ES", flag: "🇪🇸", label: "Español (ES)" },
];

export const DEFAULT_LOCALE: Locale = "pt-BR";

export const LOCALE_STORAGE_KEY = "weight-control-locale";
