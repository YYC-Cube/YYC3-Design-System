// path: src/types/language.d.ts
/**
 * YYC\u00b3 Design System \u2014 Language / i18n Type Definitions
 */

export type Locale = 'zh' | 'en';

/**
 * Translation function supporting two call signatures:
 * 1. Key-based:  t('nav.home')        \u2192 looks up locale JSON
 * 2. Inline:     t('\u9996\u9875', 'Home')    \u2192 returns based on current locale (legacy)
 */
export type TFunction = {
  (key: string): string;
  (zh: string, en: string): string;
};

export interface LanguageContextValue {
  /** Current active locale */
  lang: Locale;
  /** Set locale explicitly */
  setLang: (lang: Locale) => void;
  /** Toggle between zh and en */
  toggleLang: () => void;
  /** Translation function */
  t: TFunction;
}

/**
 * Locale JSON structure.
 * Organized by namespace: nav, common, theme, overview, components, etc.
 * Each namespace contains flat key-value pairs (string values)
 * or nested objects for deeper grouping.
 */
export interface LocaleNamespaces {
  nav: Record<string, string>;
  common: Record<string, string>;
  theme: Record<string, string>;
  lang: Record<string, string>;
  overview: Record<string, string>;
  components: Record<string, string>;
  playground: Record<string, string>;
  tokens: Record<string, string>;
  tokenManager: Record<string, string>;
  storybook: Record<string, string>;
  build: Record<string, string>;
  footer: Record<string, string>;
  notFound: Record<string, string>;
  alignment: Record<string, string>;
}
