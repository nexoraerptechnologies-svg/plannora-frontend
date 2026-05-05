import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import translations, { type Language } from "./translations";

type TranslationObj = typeof translations.es;

// Flatten nested object keys with dot notation
type FlattenKeys<T, Prefix extends string = ""> = T extends object
  ? { [K in keyof T]: K extends string
      ? T[K] extends object
        ? T[K] extends string ? `${Prefix}${K}` : FlattenKeys<T[K], `${Prefix}${K}.`>
        : `${Prefix}${K}`
      : never
    }[keyof T]
  : never;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

function detectBrowserLanguage(): Language {
  const browserLang = navigator.language || (navigator as any).userLanguage || "es";
  return browserLang.startsWith("en") ? "en" : "es";
}

function getNestedValue(obj: any, path: string): string {
  const keys = path.split(".");
  let current = obj;
  for (const key of keys) {
    if (current === undefined || current === null) return path;
    current = current[key];
  }
  return typeof current === "string" ? current : path;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const stored = localStorage.getItem("planora-language") as Language | null;
    if (stored && (stored === "es" || stored === "en")) return stored;
    return detectBrowserLanguage();
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("planora-language", lang);
  }, []);

  const t = useCallback((key: string): string => {
    return getNestedValue(translations[language], key);
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslate() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslate must be used within LanguageProvider");
  return ctx;
}
