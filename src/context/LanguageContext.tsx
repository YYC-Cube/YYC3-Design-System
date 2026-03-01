/**
 * YYC³ Design System — Language Context
 *
 * Token Reference:
 *   - Persists to localStorage("yyc3-lang")
 *   - Sets html[lang] attribute for accessibility
 *   - Keyboard shortcut: Ctrl+Alt+L toggles zh ↔ en
 *
 * Supports two call signatures:
 *   t('nav.home')          → key-based lookup from locale JSON
 *   t('首页', 'Home')      → inline fallback (legacy)
 */
import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';
import zhLocale from '../locales/zh.json';
import enLocale from '../locales/en.json';

export type Language = 'zh' | 'en';

type TFunction = {
  (key: string): string;
  (zh: string, en: string): string;
};

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: TFunction;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

// Default t function for when provider is not yet available
const defaultT: TFunction = ((...args: [string] | [string, string]): string => {
  if (args.length === 2) return args[0];
  return args[0];
}) as TFunction;

const defaultContext: LanguageContextType = {
  lang: 'zh',
  setLang: () => {},
  toggleLang: () => {},
  t: defaultT,
};

// Resolve dot-notation key from nested object
function resolveKey(obj: Record<string, unknown>, path: string): string | undefined {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return typeof current === 'string' ? current : undefined;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  return ctx ?? defaultContext;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    const saved = localStorage.getItem('yyc3-lang');
    return (saved as Language) || 'zh';
  });

  useEffect(() => {
    localStorage.setItem('yyc3-lang', lang);
    document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-CN' : 'en');
  }, [lang]);

  const setLang = useCallback((l: Language) => setLangState(l), []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => (prev === 'zh' ? 'en' : 'zh'));
  }, []);

  const locales = useMemo(
    () => ({ zh: zhLocale as Record<string, unknown>, en: enLocale as Record<string, unknown> }),
    []
  );

  const t: TFunction = useCallback(
    (...args: [string] | [string, string]): string => {
      if (args.length === 2) {
        // Legacy inline: t('中文', 'English')
        return lang === 'zh' ? args[0] : args[1];
      }
      // Key-based: t('nav.home')
      const key = args[0];
      const resolved = resolveKey(locales[lang], key);
      if (resolved !== undefined) return resolved;
      // Fallback: try other locale, or return key itself
      const otherLang = lang === 'zh' ? 'en' : 'zh';
      const fallback = resolveKey(locales[otherLang], key);
      return fallback !== undefined ? fallback : key;
    },
    [lang, locales]
  ) as TFunction;

  // Keyboard shortcut: Ctrl+Alt+L
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        toggleLang();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleLang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
