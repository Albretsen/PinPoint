import { useLanguageStore } from '@/src/store/languageStore';
import { useLocales } from 'expo-localization';
import { useMemo } from 'react';
import { Language, translations } from './translations';

export function useTranslation() {
  const locales = useLocales();
  const { language, setLanguage } = useLanguageStore();
  
  // Get the first locale that matches our supported languages, or fallback to English
  const systemLanguage = useMemo(() => {
    const supportedLanguage = locales.find(locale => 
      locale.languageCode && Object.keys(translations).includes(locale.languageCode)
    );
    return (supportedLanguage?.languageCode as Language) || 'en';
  }, [locales]);

  // Initialize language from system settings if not set
  useMemo(() => {
    if (!language) {
      setLanguage(systemLanguage);
    }
  }, [language, systemLanguage, setLanguage]);

  const t = (key: string) => {
    const keys = key.split('.');
    let value: any = translations[language];
    
    for (const k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    
    return value || key;
  };

  return {
    t,
    currentLanguage: language,
    setLanguage,
  };
} 