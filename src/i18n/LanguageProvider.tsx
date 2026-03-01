/**
 * @file YYC³ 语言上下文提供者
 * @description 双语系统：支持中英文切换，localStorage持久化，键盘快捷键Ctrl+Alt+L
 * @module i18n
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import React, { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react';

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

interface LanguageProviderProps {
  children: React.ReactNode;
  locales?: {
    zh: Record<string, unknown>;
    en: Record<string, unknown>;
  };
}

export function LanguageProvider({ children, locales }: LanguageProviderProps) {
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

  const localesMemo = useMemo(
    () => locales || { zh: {} as Record<string, unknown>, en: {} as Record<string, unknown> },
    [locales]
  );

  const t: TFunction = useCallback(
    (...args: [string] | [string, string]): string => {
      if (args.length === 2) {
        return lang === 'zh' ? args[0] : args[1];
      }
      const key = args[0];
      const resolved = resolveKey(localesMemo[lang], key);
      if (resolved !== undefined) return resolved;
      const otherLang = lang === 'zh' ? 'en' : 'zh';
      const fallback = resolveKey(localesMemo[otherLang], key);
      return fallback !== undefined ? fallback : key;
    },
    [lang, localesMemo]
  ) as TFunction;

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
