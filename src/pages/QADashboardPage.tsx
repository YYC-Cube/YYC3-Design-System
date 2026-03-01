import { useState, useMemo, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Progress } from '../components/ui/progress';
import { Separator } from '../components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  CheckCircle2,
  XCircle,
  Clock,
  Languages,
  Palette,
  Wrench,
  BarChart3,
  Copy,
  RefreshCw,
  Shield,
  Zap,
  Eye,
  Globe,
  Layers,
  Terminal,
  FileCheck,
} from 'lucide-react';
import { toast } from 'sonner';
import zhLocale from '../locales/zh.json';
import enLocale from '../locales/en.json';
import tokensJson from '../../design/tokens.json';

/* ──── Locale Validation (in-browser) ──── */
interface LocaleReport {
  namespacesChecked: number;
  totalKeys: number;
  missingInEn: string[];
  missingInZh: string[];
  identicalValues: string[];
  emptyValues: { key: string; locale: 'zh' | 'en' }[];
  isValid: boolean;
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
  const zh = zhLocale as Record<string, unknown>;
  const en = enLocale as Record<string, unknown>;
  const zhKeys = extractKeys(zh);
  const enKeys = extractKeys(en);
  const zhSet = new Set(zhKeys);
  const enSet = new Set(enKeys);

  const missingInEn = zhKeys.filter((k) => !enSet.has(k));
  const missingInZh = enKeys.filter((k) => !zhSet.has(k));
  const allKeys = [...new Set([...zhKeys, ...enKeys])];
  const identicalValues: string[] = [];
  const emptyValues: { key: string; locale: 'zh' | 'en' }[] = [];

  for (const key of allKeys) {
    const zhVal = getVal(zh, key);
    const enVal = getVal(en, key);
    if (typeof zhVal === 'string' && typeof enVal === 'string') {
      const skip = [/^[\d.]+$/, /^[A-Z_]+$/, /oklch|hex|css|json|yaml|scss|typescript|react/i];
      const isSkippable = skip.some((p) => p.test(zhVal) && p.test(enVal));
      if (zhVal === enVal && zhVal.length > 2 && !isSkippable) identicalValues.push(key);
      if (zhVal === '') emptyValues.push({ key, locale: 'zh' });
      if (enVal === '') emptyValues.push({ key, locale: 'en' });
    }
  }

  return {
    namespacesChecked: Math.max(Object.keys(zh).length, Object.keys(en).length),
    totalKeys: allKeys.length,
    missingInEn,
    missingInZh,
    identicalValues,
    emptyValues,
    isValid: missingInEn.length === 0 && missingInZh.length === 0,
  };
}

/* ──── Token Validation (in-browser) ──── */
interface TokenReport {
  hasThemes: boolean;
  themeCount: number;
  hasSpacing: boolean;
  hasAnimation: boolean;
  hasTypography: boolean;
  hasIcons: boolean;
  colorCount: number;
  isValid: boolean;
  errors: string[];
}

function runTokenValidation(): TokenReport {
  const data = tokensJson as Record<string, unknown>;
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
  const hasTypography = !!shared.typography;
  const hasIcons = !!shared.icon;
  if (!hasSpacing) errors.push('Missing shared.spacing');
  if (!hasAnimation) errors.push('Missing shared.animation');

  return {
    hasThemes,
    themeCount: themeNames.length,
    hasSpacing,
    hasAnimation,
    hasTypography,
    hasIcons,
    colorCount,
    isValid: errors.length === 0,
    errors,
  };
}

/* ──── Status Badge Component ──── */
function StatusBadge({ status }: { status: 'passed' | 'failed' | 'pending' }) {
  const { t } = useLanguage();
  if (status === 'passed')
    return (
      <Badge
        className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 gap-1"
        variant="outline"
      >
        <CheckCircle2 className="w-3 h-3" /> {t('qa.passed')}
      </Badge>
    );
  if (status === 'failed')
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="w-3 h-3" /> {t('qa.failed')}
      </Badge>
    );
  return (
    <Badge variant="secondary" className="gap-1">
      <Clock className="w-3 h-3" /> {t('qa.pending')}
    </Badge>
  );
}

/* ──── Pipeline Stage Component ──── */
function PipelineStage({
  label,
  icon: Icon,
  index,
  total,
}: {
  label: string;
  icon: React.ElementType;
  index: number;
  total: number;
}) {
  return (
    <div className="flex flex-col items-center gap-1 relative">
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center"
        style={{
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
        }}
      >
        <Icon className="w-5 h-5" />
      </div>
      <span className="text-xs text-center" style={{ color: 'var(--muted-foreground)' }}>
        {label}
      </span>
      {index < total - 1 && (
        <div
          className="absolute top-5 left-full w-8 h-0.5"
          style={{ background: 'var(--border)' }}
        />
      )}
    </div>
  );
}

/* ──── Main Component ──── */
export function QADashboardPage() {
  const { t } = useLanguage();
  const [localeReport, setLocaleReport] = useState<LocaleReport | null>(null);
  const [tokenReport, setTokenReport] = useState<TokenReport | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  const handleRunLocaleValidation = useCallback(() => {
    setIsValidating(true);
    setTimeout(() => {
      const report = runLocaleValidation();
      setLocaleReport(report);
      setIsValidating(false);
      if (report.isValid) {
        toast.success(t('qa.allInSync'));
      } else {
        toast.error(
          `${t('qa.missingInEn')}: ${report.missingInEn.length}, ${t('qa.missingInZh')}: ${report.missingInZh.length}`
        );
      }
    }, 400);
  }, [t]);

  const handleRunTokenValidation = useCallback(() => {
    const report = runTokenValidation();
    setTokenReport(report);
    if (report.isValid) {
      toast.success(`${t('qa.tokenValidation')}: ${t('qa.valid')}`);
    } else {
      toast.error(`${t('qa.tokenValidation')}: ${report.errors.length} errors`);
    }
  }, [t]);

  const coverageData = useMemo(
    () => [
      { label: t('qa.unitTests'), files: 5, cases: 50, target: 80 },
      { label: t('qa.integrationTests'), files: 4, cases: 35, target: 80 },
      { label: t('qa.e2eTests'), files: 6, cases: 30, target: 70 },
      { label: t('qa.a11yTests'), files: 1, cases: 15, target: 90 },
      { label: t('qa.visualTests'), files: 1, cases: 8, target: 100 },
      { label: t('qa.perfTests'), files: 2, cases: 10, target: 85 },
    ],
    [t]
  );

  const pipelineStages = useMemo(
    () => [
      { label: t('qa.quality'), icon: Shield },
      { label: t('qa.testing'), icon: FileCheck },
      { label: t('qa.building'), icon: Wrench },
      { label: t('qa.e2e'), icon: Globe },
      { label: t('qa.performance'), icon: Zap },
      { label: t('qa.visual'), icon: Eye },
      { label: t('qa.deploy'), icon: Layers },
    ],
    [t]
  );

  const configFiles = useMemo(
    () => [
      { name: 'eslintrc.js', status: 'ready' as const },
      { name: 'prettierrc.json', status: 'ready' as const },
      { name: 'jest.config.js', status: 'ready' as const },
      { name: 'playwright.config.ts', status: 'ready' as const },
      { name: 'lintstagedrc.json', status: 'ready' as const },
      { name: 'lighthouserc.json', status: 'ready' as const },
      { name: 'chromatic.config.json', status: 'ready' as const },
    ],
    []
  );

  const devDeps = useMemo(
    () => [
      'jest',
      'ts-jest',
      '@testing-library/react',
      '@testing-library/jest-dom',
      '@testing-library/user-event',
      'jest-axe',
      '@playwright/test',
      'eslint',
      'prettier',
      'husky',
      'lint-staged',
      '@lhci/cli',
      'chromatic',
    ],
    []
  );

  const installCmd =
    'pnpm add -D jest ts-jest @jest/types jest-environment-jsdom identity-obj-proxy @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-axe @types/jest-axe jest-junit @playwright/test eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks eslint-plugin-jsx-a11y eslint-config-prettier eslint-plugin-prettier prettier prettier-plugin-tailwindcss husky lint-staged @lhci/cli chromatic';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 style={{ color: 'var(--foreground)' }}>{t('qa.title')}</h1>
        <p style={{ color: 'var(--muted-foreground)' }} className="mt-1">
          {t('qa.subtitle')}
        </p>
      </div>

      {/* Pipeline Overview */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" style={{ color: 'var(--primary)' }} />
            {t('qa.pipelineStages')}
          </CardTitle>
          <CardDescription>7-stage GitHub Actions CI/CD</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start justify-between gap-2 overflow-x-auto pb-2">
            {pipelineStages.map((stage, i) => (
              <PipelineStage
                key={stage.label}
                label={stage.label}
                icon={stage.icon}
                index={i}
                total={pipelineStages.length}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="locale" className="w-full">
        <TabsList className="w-full justify-start flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="locale" className="gap-1">
            <Languages className="w-4 h-4" />
            {t('qa.localeValidation')}
          </TabsTrigger>
          <TabsTrigger value="tokens" className="gap-1">
            <Palette className="w-4 h-4" />
            {t('qa.tokenValidation')}
          </TabsTrigger>
          <TabsTrigger value="build" className="gap-1">
            <Wrench className="w-4 h-4" />
            {t('qa.buildReadiness')}
          </TabsTrigger>
          <TabsTrigger value="coverage" className="gap-1">
            <BarChart3 className="w-4 h-4" />
            {t('qa.coverageGoals')}
          </TabsTrigger>
        </TabsList>

        {/* ──── Locale Validation Tab ──── */}
        <TabsContent value="locale" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('qa.localeValidation')}</CardTitle>
                  <CardDescription>{t('qa.localeDesc')}</CardDescription>
                </div>
                <Button
                  onClick={handleRunLocaleValidation}
                  disabled={isValidating}
                  className="gap-2"
                >
                  <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
                  {t('qa.runValidation')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!localeReport ? (
                <p style={{ color: 'var(--muted-foreground)' }}>{t('qa.pending')}...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={localeReport.isValid ? 'passed' : 'failed'} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="rounded-lg p-3" style={{ background: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {t('qa.namespacesChecked')}
                      </p>
                      <p className="text-2xl" style={{ color: 'var(--foreground)' }}>
                        {localeReport.namespacesChecked}
                      </p>
                    </div>
                    <div className="rounded-lg p-3" style={{ background: 'var(--muted)' }}>
                      <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {t('qa.totalKeys')}
                      </p>
                      <p className="text-2xl" style={{ color: 'var(--foreground)' }}>
                        {localeReport.totalKeys}
                      </p>
                    </div>
                    <div
                      className="rounded-lg p-3"
                      style={{
                        background:
                          localeReport.missingInEn.length > 0
                            ? 'var(--destructive)'
                            : 'var(--muted)',
                        color:
                          localeReport.missingInEn.length > 0
                            ? 'var(--destructive-foreground)'
                            : undefined,
                      }}
                    >
                      <p
                        className="text-xs"
                        style={{
                          color:
                            localeReport.missingInEn.length > 0
                              ? 'inherit'
                              : 'var(--muted-foreground)',
                        }}
                      >
                        {t('qa.missingInEn')}
                      </p>
                      <p className="text-2xl">{localeReport.missingInEn.length}</p>
                    </div>
                    <div
                      className="rounded-lg p-3"
                      style={{
                        background:
                          localeReport.missingInZh.length > 0
                            ? 'var(--destructive)'
                            : 'var(--muted)',
                        color:
                          localeReport.missingInZh.length > 0
                            ? 'var(--destructive-foreground)'
                            : undefined,
                      }}
                    >
                      <p
                        className="text-xs"
                        style={{
                          color:
                            localeReport.missingInZh.length > 0
                              ? 'inherit'
                              : 'var(--muted-foreground)',
                        }}
                      >
                        {t('qa.missingInZh')}
                      </p>
                      <p className="text-2xl">{localeReport.missingInZh.length}</p>
                    </div>
                  </div>

                  {localeReport.identicalValues.length > 0 && (
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--muted-foreground)' }}>
                        {t('qa.identicalValues')} ({localeReport.identicalValues.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {localeReport.identicalValues.slice(0, 20).map((k) => (
                          <Badge key={k} variant="outline" className="text-xs">
                            {k}
                          </Badge>
                        ))}
                        {localeReport.identicalValues.length > 20 && (
                          <Badge variant="secondary">
                            +{localeReport.identicalValues.length - 20}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {localeReport.missingInEn.length > 0 && (
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--destructive)' }}>
                        {t('qa.missingInEn')} ({localeReport.missingInEn.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {localeReport.missingInEn.map((k) => (
                          <Badge key={k} variant="destructive" className="text-xs">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {localeReport.missingInZh.length > 0 && (
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--destructive)' }}>
                        {t('qa.missingInZh')} ({localeReport.missingInZh.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {localeReport.missingInZh.map((k) => (
                          <Badge key={k} variant="destructive" className="text-xs">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {localeReport.isValid && localeReport.identicalValues.length === 0 && (
                    <p className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                      {t('qa.allInSync')}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──── Token Validation Tab ──── */}
        <TabsContent value="tokens" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('qa.tokenValidation')}</CardTitle>
                  <CardDescription>{t('qa.tokenDesc')}</CardDescription>
                </div>
                <Button onClick={handleRunTokenValidation} className="gap-2">
                  <RefreshCw className="w-4 h-4" />
                  {t('qa.runValidation')}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {!tokenReport ? (
                <p style={{ color: 'var(--muted-foreground)' }}>{t('qa.pending')}...</p>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <StatusBadge status={tokenReport.isValid ? 'passed' : 'failed'} />
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {[
                      {
                        label: t('qa.themes'),
                        value: tokenReport.themeCount,
                        ok: tokenReport.hasThemes,
                      },
                      {
                        label: t('qa.colors'),
                        value: tokenReport.colorCount,
                        ok: tokenReport.colorCount > 0,
                      },
                      {
                        label: t('qa.spacing'),
                        value: tokenReport.hasSpacing ? t('qa.valid') : t('qa.invalid'),
                        ok: tokenReport.hasSpacing,
                      },
                      {
                        label: t('qa.animation'),
                        value: tokenReport.hasAnimation ? t('qa.valid') : t('qa.invalid'),
                        ok: tokenReport.hasAnimation,
                      },
                      {
                        label: t('qa.typography'),
                        value: tokenReport.hasTypography ? t('qa.valid') : t('qa.invalid'),
                        ok: tokenReport.hasTypography,
                      },
                      {
                        label: t('qa.icons'),
                        value: tokenReport.hasIcons ? t('qa.valid') : t('qa.invalid'),
                        ok: tokenReport.hasIcons,
                      },
                    ].map((item) => (
                      <div
                        key={item.label}
                        className="rounded-lg p-3 flex items-center justify-between"
                        style={{ background: 'var(--muted)' }}
                      >
                        <div>
                          <p className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                            {item.label}
                          </p>
                          <p style={{ color: 'var(--foreground)' }}>{item.value}</p>
                        </div>
                        {item.ok ? (
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        ) : (
                          <XCircle className="w-5 h-5" style={{ color: 'var(--destructive)' }} />
                        )}
                      </div>
                    ))}
                  </div>

                  {tokenReport.errors.length > 0 && (
                    <div>
                      <p className="text-sm mb-2" style={{ color: 'var(--destructive)' }}>
                        Errors ({tokenReport.errors.length})
                      </p>
                      <div className="space-y-1">
                        {tokenReport.errors.map((err, i) => (
                          <p
                            key={i}
                            className="text-xs font-mono p-2 rounded"
                            style={{
                              background: 'var(--muted)',
                              color: 'var(--destructive)',
                            }}
                          >
                            {err}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──── Build Readiness Tab ──── */}
        <TabsContent value="build" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('qa.buildReadiness')}</CardTitle>
              <CardDescription>{t('qa.buildDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Config Files */}
              <div>
                <h3
                  className="text-sm mb-3 flex items-center gap-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  <FileCheck className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  {t('qa.configFiles')} ({configFiles.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {configFiles.map((cf) => (
                    <div
                      key={cf.name}
                      className="flex items-center justify-between p-2 rounded"
                      style={{ background: 'var(--muted)' }}
                    >
                      <span className="text-sm font-mono" style={{ color: 'var(--foreground)' }}>
                        src/qa/configs/{cf.name}
                      </span>
                      <Badge
                        className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                        variant="outline"
                      >
                        {t('qa.ready')}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Dev Dependencies */}
              <div>
                <h3
                  className="text-sm mb-3 flex items-center gap-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Terminal className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  {t('qa.devDeps')} ({devDeps.length})
                </h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {devDeps.map((dep) => (
                    <Badge key={dep} variant="outline" className="text-xs font-mono">
                      {dep}
                    </Badge>
                  ))}
                </div>
                <div
                  className="p-3 rounded-lg font-mono text-xs"
                  style={{
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <code className="break-all">{installCmd}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="shrink-0"
                      onClick={() => {
                        navigator.clipboard.writeText(installCmd);
                        toast.success(t('common.copied'));
                      }}
                      aria-label={t('qa.copyCommand')}
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Scripts */}
              <div>
                <h3
                  className="text-sm mb-3 flex items-center gap-2"
                  style={{ color: 'var(--foreground)' }}
                >
                  <Terminal className="w-4 h-4" style={{ color: 'var(--primary)' }} />
                  {t('qa.scripts')}
                </h3>
                <div className="space-y-1">
                  {[
                    { cmd: 'pnpm typecheck', desc: 'TypeScript check' },
                    { cmd: 'pnpm lint', desc: 'ESLint' },
                    { cmd: 'pnpm format:check', desc: 'Prettier' },
                    { cmd: 'pnpm validate:locales', desc: 'Locale sync' },
                    { cmd: 'pnpm test', desc: 'Jest (unit + integration)' },
                    { cmd: 'pnpm test:a11y', desc: 'Accessibility' },
                    { cmd: 'pnpm test:e2e', desc: 'Playwright E2E' },
                    { cmd: 'pnpm test:visual', desc: 'Visual regression' },
                    { cmd: 'pnpm test:perf', desc: 'Lighthouse CI' },
                    { cmd: 'pnpm chromatic', desc: 'Chromatic' },
                    { cmd: 'pnpm qa', desc: 'Full QA suite' },
                  ].map((s) => (
                    <div
                      key={s.cmd}
                      className="flex items-center justify-between p-2 rounded"
                      style={{ background: 'var(--muted)' }}
                    >
                      <div className="flex items-center gap-3">
                        <code className="text-xs font-mono" style={{ color: 'var(--primary)' }}>
                          {s.cmd}
                        </code>
                        <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                          {s.desc}
                        </span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(s.cmd);
                          toast.success(t('common.copied'));
                        }}
                        aria-label={`${t('qa.copyCommand')}: ${s.cmd}`}
                      >
                        <Copy className="w-3 h-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ──── Coverage Goals Tab ──── */}
        <TabsContent value="coverage" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('qa.coverageGoals')}</CardTitle>
              <CardDescription>{t('qa.coverageDesc')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {coverageData.map((cd) => (
                <div key={cd.label} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span style={{ color: 'var(--foreground)' }}>{cd.label}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>
                        {cd.files} files \u00b7 {cd.cases} cases
                      </span>
                      <Badge variant="outline" className="text-xs">
                        {t('qa.target')}: {cd.target}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={cd.target} className="h-2" />
                </div>
              ))}

              <Separator />

              {/* Five-High Alignment */}
              <div>
                <h3 className="text-sm mb-3" style={{ color: 'var(--foreground)' }}>
                  {t('qa.fiveHighAlignment')}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {[
                    {
                      goal: t('overview.highAccessibility'),
                      mapping: 'jest-axe, WCAG AA, contrast >= 4.5:1',
                    },
                    {
                      goal: t('overview.highCustomizability'),
                      mapping: 'Token Playground, runtime overrides',
                    },
                    {
                      goal: t('overview.highPerformance'),
                      mapping: 'Lighthouse CI, FCP <= 1.5s, JS <= 200KB',
                    },
                    {
                      goal: t('overview.highConsistency'),
                      mapping: 'ESLint, Prettier, unified tokens',
                    },
                    {
                      goal: t('overview.highExtensibility'),
                      mapping: 'Polymorphic components, cross-framework',
                    },
                  ].map((fh) => (
                    <div
                      key={fh.goal}
                      className="p-3 rounded-lg"
                      style={{ background: 'var(--muted)' }}
                    >
                      <p className="text-sm" style={{ color: 'var(--foreground)' }}>
                        {fh.goal}
                      </p>
                      <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>
                        {fh.mapping}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
