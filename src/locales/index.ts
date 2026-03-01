/**
 * YYC³ Design System — Unified Locale Exports
 *
 * Usage:
 *   import { zhLocale, enLocale, type LocaleData, type LocaleKey } from '../../locales';
 *
 * This module provides:
 *   - Typed locale JSON data for zh and en
 *   - LocaleData type representing the full locale structure
 *   - LocaleKey utility type for dot-notation key strings
 *   - Helper to get all available keys (for IDE autocomplete validation)
 */
import zhLocale from './zh.json';
import enLocale from './en.json';

export { zhLocale, enLocale };

/** Full locale JSON shape (matches both zh.json and en.json) */
export type LocaleData = typeof zhLocale;

/** Top-level namespace names */
export type LocaleNamespace = keyof LocaleData;

/**
 * Dot-notation key type for t('namespace.key') calls.
 * Example: 'nav.home' | 'common.confirm' | 'overview.heroTitle' | ...
 */
export type LocaleKey = {
  [NS in keyof LocaleData]: LocaleData[NS] extends Record<string, string>
    ? `${NS & string}.${keyof LocaleData[NS] & string}`
    : never;
}[keyof LocaleData];

/**
 * Extracts all keys for a given namespace.
 * Example: LocaleKeysOf<'nav'> → 'home' | 'overview' | 'components' | ...
 */
export type LocaleKeysOf<NS extends LocaleNamespace> = keyof LocaleData[NS] & string;

/**
 * Utility: get all available locale keys as an array (runtime).
 * Useful for validation, testing, or documentation generation.
 */
export function getAllLocaleKeys(): string[] {
  const keys: string[] = [];
  for (const [ns, values] of Object.entries(zhLocale)) {
    if (typeof values === 'object' && values !== null) {
      for (const key of Object.keys(values as Record<string, unknown>)) {
        keys.push(`${ns}.${key}`);
      }
    }
  }
  return keys;
}

/**
 * Utility: check if a string is a valid locale key.
 */
export function isValidLocaleKey(key: string): boolean {
  const [ns, ...rest] = key.split('.');
  const subKey = rest.join('.');
  const nsData = (zhLocale as Record<string, unknown>)[ns];
  if (!nsData || typeof nsData !== 'object') return false;
  return subKey in (nsData as Record<string, unknown>);
}
