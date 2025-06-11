import en from './locales/en.json';
import no from './locales/no.json';

export const translations = {
  en,
  no,
} as const;

export type Language = keyof typeof translations;
export type TranslationKey = keyof typeof translations.en; 