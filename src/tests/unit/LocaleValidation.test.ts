/**
 * YYC³ Design System — Locale Validation Unit Tests
 */
import { validateLocales, formatReport, assertLocalesValid } from '../../locale-validation';

describe('Locale Validation', () => {
  it('generates a valid report', () => {
    const report = validateLocales();
    expect(report).toHaveProperty('namespacesChecked');
    expect(report).toHaveProperty('totalKeys');
    expect(report).toHaveProperty('missingInEn');
    expect(report).toHaveProperty('missingInZh');
    expect(report).toHaveProperty('isValid');
    expect(report).toHaveProperty('timestamp');
    expect(report.namespacesChecked).toBeGreaterThan(0);
    expect(report.totalKeys).toBeGreaterThan(0);
  });

  it('detects all namespaces', () => {
    const report = validateLocales();
    expect(report.namespacesChecked).toBeGreaterThanOrEqual(12);
  });

  it('has no missing keys between zh and en', () => {
    const report = validateLocales();
    if (report.missingInEn.length > 0) {
      console.warn('Missing in en.json:', report.missingInEn);
    }
    if (report.missingInZh.length > 0) {
      console.warn('Missing in zh.json:', report.missingInZh);
    }
    expect(report.isValid).toBe(true);
  });

  it('formats report as readable string', () => {
    const report = validateLocales();
    const formatted = formatReport(report);
    expect(formatted).toContain('YYC');
    expect(formatted).toContain('Namespaces checked');
    expect(formatted).toContain('Total keys');
  });

  it('assertLocalesValid does not throw when valid', () => {
    expect(() => assertLocalesValid()).not.toThrow();
  });
});
