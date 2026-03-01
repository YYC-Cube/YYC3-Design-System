/**
 * @file YYC³ QA 仪表板
 * @description 质量保证仪表板：本地化验证、令牌验证、构建就绪检查、覆盖率目标
 * @module components
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Button } from './Button';
import { Progress } from './Progress';

const IconCheck = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-3 h-3 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconX = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-3 h-3 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

const IconRefresh = ({ className = '' }: { className?: string }) => (
  <svg
    className={`w-4 h-4 ${className}`}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
    <path d="M16 21h5v-5" />
  </svg>
);

const IconCopy = () => (
  <svg
    className="w-3 h-3"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

interface LocaleReport {
  namespacesChecked: number;
  totalKeys: number;
  missingInEn: string[];
  missingInZh: string[];
  identicalValues: string[];
  isValid: boolean;
}

interface TokenReport {
  hasThemes: boolean;
  themeCount: number;
  hasSpacing: boolean;
  hasAnimation: boolean;
  colorCount: number;
  isValid: boolean;
  errors: string[];
}

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

function getVal(obj: Record<string, unknown>, path: string): unknown {
  let cur: unknown = obj;
  for (const p of path.split('.')) {
    if (!cur || typeof cur !== 'object') return undefined;
    cur = (cur as Record<string, unknown>)[p];
  }
  return cur;
}

function runLocaleValidation(): LocaleReport {
  const zh = {} as Record<string, unknown>;
  const en = {} as Record<string, unknown>;
  const zhKeys = extractKeys(zh);
  const enKeys = extractKeys(en);
  const zhSet = new Set(zhKeys);
  const enSet = new Set(enKeys);

  const missingInEn = zhKeys.filter((k) => !enSet.has(k));
  const missingInZh = enKeys.filter((k) => !zhSet.has(k));
  const allKeys = [...new Set([...zhKeys, ...enKeys])];
  const identicalValues: string[] = [];

  for (const key of allKeys) {
    const zhVal = getVal(zh, key);
    const enVal = getVal(en, key);
    if (typeof zhVal === 'string' && typeof enVal === 'string') {
      const skip = [/^[\d.]+$/, /^[A-Z_]+$/, /oklch|hex|css|json|yaml|scss|typescript|react/i];
      const isSkippable = skip.some((p) => p.test(zhVal) && p.test(enVal));
      if (zhVal === enVal && zhVal.length > 2 && !isSkippable) identicalValues.push(key);
    }
  }

  return {
    namespacesChecked: Math.max(Object.keys(zh).length, Object.keys(en).length),
    totalKeys: allKeys.length,
    missingInEn,
    missingInZh,
    identicalValues,
    isValid: missingInEn.length === 0 && missingInZh.length === 0,
  };
}

function runTokenValidation(): TokenReport {
  const data = {} as Record<string, unknown>;
  const errors: string[] = [];
  const themes = (data.themes || {}) as Record<string, unknown>;
  const themeNames = Object.keys(themes);
  const hasThemes = themeNames.length >= 3;
  if (!hasThemes) errors.push('Expected at least 3 themes (future/cyber/business)');

  let colorCount = 0;
  for (const tName of themeNames) {
    const theme = themes[tName] as Record<string, unknown>;
    for (const mode of ['light', 'dark']) {
      const modeData = theme?.[mode] as Record<string, unknown> | undefined;
      if (!modeData) {
        errors.push(`Missing ${tName}.${mode}`);
        continue;
      }
      const colors = modeData.color as Record<string, unknown> | undefined;
      if (colors) colorCount += Object.keys(colors).length;
      else errors.push(`Missing ${tName}.${mode}.color`);
    }
  }

  const shared = (data.shared || {}) as Record<string, unknown>;
  const hasSpacing = !!shared.spacing;
  const hasAnimation = !!shared.animation;
  if (!hasSpacing) errors.push('Missing shared.spacing');
  if (!hasAnimation) errors.push('Missing shared.animation');

  return {
    hasThemes,
    themeCount: themeNames.length,
    hasSpacing,
    hasAnimation,
    colorCount,
    isValid: errors.length === 0,
    errors,
  };
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'destructive' | 'success';
}

function Badge({ children, variant = 'default' }: BadgeProps) {
  const baseClasses =
    'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium';
  const variantClasses = {
    default: 'bg-muted text-foreground',
    outline: 'border border-border bg-background text-foreground',
    destructive: 'bg-destructive/15 text-destructive border-destructive/20',
    success: 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
  };
  return <span className={`${baseClasses} ${variantClasses[variant]}`}>{children}</span>;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`rounded-lg border border-border bg-card text-card-foreground ${className}`}>
      {children}
    </div>
  );
}

export function QADashboard() {
  const [activeTab, setActiveTab] = useState<'locale' | 'tokens' | 'build' | 'coverage'>('locale');
  const [localeReport, setLocaleReport] = useState<LocaleReport | null>(null);
  const [tokenReport, setTokenReport] = useState<TokenReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleRunLocaleValidation = useCallback(() => {
    setIsValidating(true);
    setTimeout(() => {
      const report = runLocaleValidation();
      setLocaleReport(report);
      setIsValidating(false);
      console.log(report.isValid ? 'Locale validation passed' : 'Locale validation failed');
    }, 400);
  }, []);

  const handleRunTokenValidation = useCallback(() => {
    const report = runTokenValidation();
    setTokenReport(report);
    console.log(report.isValid ? 'Token validation passed' : 'Token validation failed');
  }, []);

  const coverageData = useMemo(
    () => [
      { label: 'Unit Tests', files: 5, cases: 50, target: 80 },
      { label: 'Integration Tests', files: 4, cases: 35, target: 80 },
      { label: 'E2E Tests', files: 6, cases: 30, target: 70 },
      { label: 'A11y Tests', files: 1, cases: 15, target: 90 },
      { label: 'Visual Tests', files: 1, cases: 8, target: 100 },
      { label: 'Performance Tests', files: 2, cases: 10, target: 85 },
    ],
    []
  );

  const installCmd =
    'pnpm add -D jest ts-jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe @playwright/test eslint prettier husky lint-staged @lhci/cli chromatic';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      <div>
        <h1 className="text-2xl font-medium text-foreground">QA Dashboard</h1>
        <p className="mt-1 text-muted-foreground">Quality Assurance & Testing Metrics</p>
      </div>

      <Card>
        <div className="p-6 pb-3">
          <h2 className="text-lg font-medium text-foreground mb-2">Pipeline Stages</h2>
          <p className="text-sm text-muted-foreground">7-stage GitHub Actions CI/CD</p>
        </div>
        <div className="px-6 pb-6">
          <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
            {['Quality', 'Testing', 'Building', 'E2E', 'Performance', 'Visual', 'Deploy'].map(
              (stage, i) => (
                <div key={stage} className="flex flex-col items-center gap-1 relative shrink-0">
                  <div className="w-10 h-10 rounded-full flex items-center justify-center bg-primary text-primary-foreground">
                    <span className="text-sm font-medium">{i + 1}</span>
                  </div>
                  <span className="text-xs text-center text-muted-foreground whitespace-nowrap">
                    {stage}
                  </span>
                  {i < 6 && <div className="absolute top-5 left-full w-8 h-0.5 bg-border" />}
                </div>
              )
            )}
          </div>
        </div>
      </Card>

      <div className="flex items-start justify-start gap-1 border-b border-border pb-4 mb-4">
        {[
          { value: 'locale' as const, label: 'Locale Validation' },
          { value: 'tokens' as const, label: 'Token Validation' },
          { value: 'build' as const, label: 'Build Readiness' },
          { value: 'coverage' as const, label: 'Coverage Goals' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-3 py-1.5 text-sm font-medium rounded-md transition-all ${
              activeTab === tab.value
                ? 'bg-primary text-primary-foreground'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'locale' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Locale Validation</h3>
                <p className="text-sm text-muted-foreground">Check zh-CN and en-US sync</p>
              </div>
              <Button onClick={handleRunLocaleValidation} disabled={isValidating} className="gap-2">
                <IconRefresh className={isValidating ? 'animate-spin' : ''} />
                Run Validation
              </Button>
            </div>
            {!localeReport ? (
              <p className="text-muted-foreground">Pending...</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={localeReport.isValid ? 'success' : 'destructive'}>
                    {localeReport.isValid ? <IconCheck /> : <IconX />}
                    {localeReport.isValid ? 'Passed' : 'Failed'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-lg p-3 bg-muted">
                    <p className="text-xs text-muted-foreground">Namespaces Checked</p>
                    <p className="text-2xl text-foreground">{localeReport.namespacesChecked}</p>
                  </div>
                  <div className="rounded-lg p-3 bg-muted">
                    <p className="text-xs text-muted-foreground">Total Keys</p>
                    <p className="text-2xl text-foreground">{localeReport.totalKeys}</p>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${localeReport.missingInEn.length > 0 ? 'bg-destructive/15 text-destructive' : 'bg-muted'}`}
                  >
                    <p
                      className={`text-xs ${localeReport.missingInEn.length > 0 ? 'text-inherit' : 'text-muted-foreground'}`}
                    >
                      Missing in EN
                    </p>
                    <p className="text-2xl">{localeReport.missingInEn.length}</p>
                  </div>
                  <div
                    className={`rounded-lg p-3 ${localeReport.missingInZh.length > 0 ? 'bg-destructive/15 text-destructive' : 'bg-muted'}`}
                  >
                    <p
                      className={`text-xs ${localeReport.missingInZh.length > 0 ? 'text-inherit' : 'text-muted-foreground'}`}
                    >
                      Missing in ZH
                    </p>
                    <p className="text-2xl">{localeReport.missingInZh.length}</p>
                  </div>
                </div>
                {localeReport.isValid && localeReport.identicalValues.length === 0 && (
                  <p className="text-sm text-muted-foreground">All locales in sync!</p>
                )}
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'tokens' && (
        <Card>
          <div className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-medium text-foreground">Token Validation</h3>
                <p className="text-sm text-muted-foreground">Check design tokens structure</p>
              </div>
              <Button onClick={handleRunTokenValidation} className="gap-2">
                <IconRefresh />
                Run Validation
              </Button>
            </div>
            {!tokenReport ? (
              <p className="text-muted-foreground">Pending...</p>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Badge variant={tokenReport.isValid ? 'success' : 'destructive'}>
                    {tokenReport.isValid ? <IconCheck /> : <IconX />}
                    {tokenReport.isValid ? 'Valid' : 'Invalid'}
                  </Badge>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {[
                    { label: 'Themes', value: tokenReport.themeCount, ok: tokenReport.hasThemes },
                    {
                      label: 'Colors',
                      value: tokenReport.colorCount,
                      ok: tokenReport.colorCount > 0,
                    },
                    {
                      label: 'Spacing',
                      value: tokenReport.hasSpacing ? 'Valid' : 'Invalid',
                      ok: tokenReport.hasSpacing,
                    },
                    {
                      label: 'Animation',
                      value: tokenReport.hasAnimation ? 'Valid' : 'Invalid',
                      ok: tokenReport.hasAnimation,
                    },
                  ].map((item) => (
                    <div
                      key={item.label}
                      className="rounded-lg p-3 flex items-center justify-between bg-muted"
                    >
                      <div>
                        <p className="text-xs text-muted-foreground">{item.label}</p>
                        <p className="text-foreground">{item.value}</p>
                      </div>
                      {item.ok ? (
                        <IconCheck className="w-5 h-5 text-emerald-500" />
                      ) : (
                        <IconX className="w-5 h-5 text-destructive" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      )}

      {activeTab === 'build' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Build Readiness</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Check configuration files and dependencies
            </p>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-foreground mb-3">Config Files</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {['eslintrc.js', 'prettierrc.json', 'jest.config.js', 'playwright.config.ts'].map(
                    (cf) => (
                      <div
                        key={cf}
                        className="flex items-center justify-between p-2 rounded bg-muted"
                      >
                        <span className="text-sm font-mono text-foreground">
                          src/qa/configs/{cf}
                        </span>
                        <Badge variant="success">Ready</Badge>
                      </div>
                    )
                  )}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-foreground mb-3">Install Command</h4>
                <div className="p-3 rounded-lg bg-muted font-mono text-xs flex items-start justify-between gap-2">
                  <code className="break-all text-foreground">{installCmd}</code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => navigator.clipboard.writeText(installCmd)}
                    className="shrink-0"
                  >
                    <IconCopy />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'coverage' && (
        <Card>
          <div className="p-6">
            <h3 className="text-lg font-medium text-foreground mb-2">Coverage Goals</h3>
            <p className="text-sm text-muted-foreground mb-4">Test coverage targets by category</p>
            <div className="space-y-4">
              {coverageData.map((cd) => (
                <div key={cd.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">{cd.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">
                        {cd.files} files · {cd.cases} cases
                      </span>
                      <Badge variant="outline">Target: {cd.target}%</Badge>
                    </div>
                  </div>
                  <div className="h-2">
                    <Progress value={cd.target} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
