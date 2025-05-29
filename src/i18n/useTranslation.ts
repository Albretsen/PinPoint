import { useLocales } from 'expo-localization';
import { useMemo } from 'react';
import { Language, translations } from './translations';

export function useTranslation() {
  const locales = useLocales();
  
  // Get the first locale that matches our supported languages, or fallback to English
  const currentLanguage = useMemo(() => {
    const supportedLanguage = locales.find(locale => 
      locale.languageCode && Object.keys(translations).includes(locale.languageCode)
    );
    return (supportedLanguage?.languageCode as Language) || 'en';
  }, [locales]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return {
    t,
    currentLanguage,
  };
} 