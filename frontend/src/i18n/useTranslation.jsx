import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import en from './en.json';
import vi from './vi.json';

const dictionaries = { en, vi };
const I18nContext = createContext();

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('en');

  useEffect(() => {
    const saved = localStorage.getItem('twlan2_lang');
    if (saved && dictionaries[saved]) {
      setLang(saved);
    }
  }, []);

  const changeLanguage = (newLang) => {
    if (dictionaries[newLang]) {
      setLang(newLang);
      localStorage.setItem('twlan2_lang', newLang);
    }
  };

  const t = useCallback((key) => {
    const keys = key.split('.');
    let result = dictionaries[lang];
    for (const k of keys) {
      if (result && result[k]) {
        result = result[k];
      } else {
        return key;
      }
    }
    return result;
  }, [lang]);

  return (
    <I18nContext.Provider value={{ lang, changeLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
