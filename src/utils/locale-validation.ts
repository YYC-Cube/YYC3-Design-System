/**
 * YYC³ Design System — Locale Validation Utility
 *
 * Automatically detects key differences between zh.json and en.json.
 * Run at build time or in CI to ensure both locale files stay in sync.
 *
 * Usage:
 *   import { validateLocales, formatReport } from './locale-validation';
 *   const report = validateLocales();
 *   console.log(formatReport(report));
 *
 * Five-High Alignment:
 *   - High Consistency: ensures zh/en locale files have identical key structures
 *   - High Accessibility: missing translations degrade UX for bilingual users
 */

import zhLocale from '../locales/zh.json';
import enLocale from '../locales/en.json';

export interface LocaleValidationReport {
  /** Total namespaces checked */
  namespacesChecked: number;
  /** Total keys checked */
  totalKeys: number;
  /** Keys present in zh.json but missing in en.json */
  missingInEn: string[];
  /** Keys present in en.json but missing in zh.json */
  missingInZh: string[];
  /** Namespaces present in zh.json but missing in en.json */
  missingNamespacesInEn: string[];
  /** Namespaces present in en.json but missing in zh.json */
  missingNamespacesInZh: string[];
  /** Keys where the value is identical in both locales (potential untranslated) */
  identicalValues: string[];
  /** Keys where the value is empty string */
  emptyValues: { key: string; locale: 'zh' | 'en' }[];
  /** Whether validation passed (no missing keys) */
  isValid: boolean;
  /** Timestamp of validation */
  timestamp: string;
}

/**
 * Extract all dot-notation keys from a nested object.
 */
function extractKeys(obj: Record<string, unknown>, prefix = ''): string[] {
  const keys: string[] = [];
  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      keys.push(...extractKeys(value as Record<string, unknown>, fullKey));
    } else {
      keys.push(fullKey);
    }
  }
  return keys;
}

/**
 * Get the value at a dot-notation path in a nested object.
 */
function getValueAtPath(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== 'object') return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

/**
 * Validate zh.json and en.json locale files.
 * Returns a comprehensive report of all discrepancies.
 */
export function validateLocales(): LocaleValidationReport {
  const zh = zhLocale as Record<string, unknown>;
  const en = enLocale as Record<string, unknown>;

  const zhKeys = extractKeys(zh);
  const enKeys = extractKeys(en);
  const zhKeySet = new Set(zhKeys);
  const enKeySet = new Set(enKeys);

  // Find missing keys
  const missingInEn = zhKeys.filter((k) => !enKeySet.has(k));
  const missingInZh = enKeys.filter((k) => !zhKeySet.has(k));

  // Find missing namespaces
  const zhNamespaces = Object.keys(zh);
  const enNamespaces = Object.keys(en);
  const missingNamespacesInEn = zhNamespaces.filter((ns) => !enNamespaces.includes(ns));
  const missingNamespacesInZh = enNamespaces.filter((ns) => !zhNamespaces.includes(ns));

  // Find identical values (potential untranslated strings)
  const allKeys = [...new Set([...zhKeys, ...enKeys])];
  const identicalValues: string[] = [];
  const emptyValues: { key: string; locale: 'zh' | 'en' }[] = [];

  for (const key of allKeys) {
    const zhVal = getValueAtPath(zh, key);
    const enVal = getValueAtPath(en, key);

    if (typeof zhVal === 'string' && typeof enVal === 'string') {
      // Skip keys that are intentionally identical (e.g., technical terms, brand names)
      const skipPatterns = [
        /^[\d.]+$/, // version numbers
        /^[A-Z_]+$/, // constants
        /oklch|hex|css|json|yaml|scss|typescript|react/i, // technical terms
      ];
      const isSkippable = skipPatterns.some((p) => p.test(zhVal) && p.test(enVal));

      if (zhVal === enVal && zhVal.length > 2 && !isSkippable) {
        identicalValues.push(key);
      }

      if (zhVal === '') emptyValues.push({ key, locale: 'zh' });
      if (enVal === '') emptyValues.push({ key, locale: 'en' });
    }
  }

  return {
    namespacesChecked: Math.max(zhNamespaces.length, enNamespaces.length),
    totalKeys: allKeys.length,
    missingInEn,
    missingInZh,
    missingNamespacesInEn,
    missingNamespacesInZh,
    identicalValues,
    emptyValues,
    isValid: missingInEn.length === 0 && missingInZh.length === 0,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Format a validation report as a human-readable string.
 */
export function formatReport(report: LocaleValidationReport): string {
  const lines: string[] = [
    '═══════════════════════════════════════════════',
    '  YYC\u00b3 Locale Validation Report',
    `  ${report.timestamp}`,
    '═══════════════════════════════════════════════',
    '',
    `  Namespaces checked: ${report.namespacesChecked}`,
    `  Total keys:         ${report.totalKeys}`,
    `  Status:             ${report.isValid ? '\u2705 VALID' : '\u274c INVALID'}`,
    '',
  ];

  if (report.missingNamespacesInEn.length > 0) {
    lines.push('  \u274c Missing namespaces in en.json:');
    report.missingNamespacesInEn.forEach((ns) => lines.push(`     - ${ns}`));
    lines.push('');
  }

  if (report.missingNamespacesInZh.length > 0) {
    lines.push('  \u274c Missing namespaces in zh.json:');
    report.missingNamespacesInZh.forEach((ns) => lines.push(`     - ${ns}`));
    lines.push('');
  }

  if (report.missingInEn.length > 0) {
    lines.push(`  \u274c Missing keys in en.json (${report.missingInEn.length}):`);
    report.missingInEn.slice(0, 20).forEach((k) => lines.push(`     - ${k}`));
    if (report.missingInEn.length > 20)
      lines.push(`     ... and ${report.missingInEn.length - 20} more`);
    lines.push('');
  }

  if (report.missingInZh.length > 0) {
    lines.push(`  \u274c Missing keys in zh.json (${report.missingInZh.length}):`);
    report.missingInZh.slice(0, 20).forEach((k) => lines.push(`     - ${k}`));
    if (report.missingInZh.length > 20)
      lines.push(`     ... and ${report.missingInZh.length - 20} more`);
    lines.push('');
  }

  if (report.identicalValues.length > 0) {
    lines.push(
      `  \u26a0\ufe0f  Potentially untranslated (identical values, ${report.identicalValues.length}):`
    );
    report.identicalValues.slice(0, 10).forEach((k) => lines.push(`     - ${k}`));
    if (report.identicalValues.length > 10)
      lines.push(`     ... and ${report.identicalValues.length - 10} more`);
    lines.push('');
  }

  if (report.emptyValues.length > 0) {
    lines.push(`  \u26a0\ufe0f  Empty values (${report.emptyValues.length}):`);
    report.emptyValues.forEach((e) => lines.push(`     - ${e.key} [${e.locale}]`));
    lines.push('');
  }

  if (report.isValid && report.identicalValues.length === 0 && report.emptyValues.length === 0) {
    lines.push('  \u2705 All locale keys are in sync. No issues found.');
  }

  lines.push('');
  lines.push('═══════════════════════════════════════════════');
  return lines.join('\n');
}

/**
 * Run validation and throw if invalid (for CI use).
 */
export function assertLocalesValid(): void {
  const report = validateLocales();
  if (!report.isValid) {
    throw new Error(
      `Locale validation failed!\n` +
        `Missing in en.json: ${report.missingInEn.length} keys\n` +
        `Missing in zh.json: ${report.missingInZh.length} keys\n` +
        `Run formatReport(validateLocales()) for details.`
    );
  }
}
