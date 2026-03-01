/**
 * YYC³ Design System — Multi-Platform Build Settings Page
 *
 * Token Reference:
 *   background:   var(--background), var(--card), var(--muted)
 *   foreground:   var(--foreground), var(--muted-foreground), var(--primary)
 *   border:       var(--border)
 *   primary:      var(--primary), var(--primary-foreground)  — progress bar, platform icon
 *   success:      var(--success), var(--success-foreground)  — build success toast
 *   destructive:  var(--destructive), var(--destructive-foreground) — build error
 *   warning:      var(--warning), var(--warning-foreground)  — iOS platform icon
 *   shadow:       var(--shadow-sm), var(--shadow-md)
 *   animation:    var(--duration-fast), var(--duration-normal), var(--easing-default), var(--easing-out)
 *   a11y:         outline: 2px solid var(--ring) on focus
 */
import { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import { Label } from '../components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { ScrollArea } from '../components/ui/scroll-area';
import { Link } from 'react-router';
import {
  Home,
  ChevronRight,
  Play,
  Loader2,
  CheckCircle2,
  AlertCircle,
  FileCode2,
  Smartphone,
  Tablet,
  X,
} from 'lucide-react';

interface PlatformConfig {
  id: string;
  name: string;
  icon: 'scss' | 'swift' | 'kotlin';
  enabled: boolean;
  outputDir: string;
  outputDirOptions: string[];
  outputs: { variables: boolean; tokens: boolean; types: boolean; docs: boolean };
  buildProgress: number;
  buildStatus: 'idle' | 'building' | 'success' | 'error';
}

function PlatformIcon({ type, className = '' }: { type: string; className?: string }) {
  if (type === 'scss') {
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className}`}
        style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
      >
        <FileCode2 className="size-5" />
      </div>
    );
  }
  if (type === 'swift') {
    return (
      <div
        className={`flex items-center justify-center rounded-lg ${className}`}
        style={{ background: 'var(--warning)', color: 'var(--warning-foreground)' }}
      >
        <Smartphone className="size-5" />
      </div>
    );
  }
  return (
    <div
      className={`flex items-center justify-center rounded-lg ${className}`}
      style={{ background: 'var(--success)', color: 'var(--success-foreground)' }}
    >
      <Tablet className="size-5" />
    </div>
  );
}

const DEFAULT_PLATFORMS: PlatformConfig[] = [
  {
    id: 'scss',
    name: 'SCSS',
    icon: 'scss',
    enabled: true,
    outputDir: 'dist/css',
    outputDirOptions: ['dist/css', 'dist/scss', 'styles/scss'],
    outputs: { variables: true, tokens: true, types: false, docs: true },
    buildProgress: 0,
    buildStatus: 'idle',
  },
  {
    id: 'ios',
    name: 'Swift (iOS)',
    icon: 'swift',
    enabled: false,
    outputDir: 'ios/YYC3',
    outputDirOptions: ['ios/YYC3', 'ios/Resources', 'ios/Tokens'],
    outputs: { variables: true, tokens: true, types: true, docs: false },
    buildProgress: 0,
    buildStatus: 'idle',
  },
  {
    id: 'android',
    name: 'Kotlin (Android)',
    icon: 'kotlin',
    enabled: false,
    outputDir: 'android/YYC3',
    outputDirOptions: ['android/YYC3', 'android/res/values', 'android/tokens'],
    outputs: { variables: true, tokens: true, types: true, docs: false },
    buildProgress: 0,
    buildStatus: 'idle',
  },
];

export function BuildSettingsPage() {
  const { t } = useLanguage();
  const { style } = useTheme();
  const [platforms, setPlatforms] = useState<PlatformConfig[]>(DEFAULT_PLATFORMS);
  const [errorModal, setErrorModal] = useState<{ open: boolean; platform: string; log: string }>({
    open: false,
    platform: '',
    log: '',
  });
  const [toastMsg, setToastMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        document.querySelector<HTMLElement>('[data-build-focus]')?.focus();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  useEffect(() => {
    if (toastMsg) {
      const timer = setTimeout(() => setToastMsg(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMsg]);

  const updatePlatform = useCallback((id: string, updates: Partial<PlatformConfig>) => {
    setPlatforms((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));
  }, []);

  const toggleOutput = useCallback((id: string, key: keyof PlatformConfig['outputs']) => {
    setPlatforms((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, outputs: { ...p.outputs, [key]: !p.outputs[key] } } : p
      )
    );
  }, []);

  const handleGenerate = useCallback(
    (platformId: string) => {
      const platform = platforms.find((p) => p.id === platformId);
      if (!platform || !platform.enabled) return;
      updatePlatform(platformId, { buildStatus: 'building', buildProgress: 0 });
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 15 + 5;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          const success = Math.random() > 0.2;
          if (success) {
            updatePlatform(platformId, { buildStatus: 'success', buildProgress: 100 });
            setToastMsg({
              type: 'success',
              text: `${platform.name} ${t('build.buildSuccessful')}! → ${platform.outputDir}`,
            });
          } else {
            updatePlatform(platformId, { buildStatus: 'error', buildProgress: 100 });
            setErrorModal({
              open: true,
              platform: platform.name,
              log: `[ERROR] Build failed for ${platform.name}\n[${new Date().toISOString()}] Token validation error:\n  - color-primary-highlight: invalid OKLCH value at line 42\n  - shadow-neon: missing fallback for dark theme\n\n[WARN] 2 tokens skipped due to format mismatch\n[INFO] Build aborted after 3 retries\n\nStack trace:\n  at TokenCompiler.validate (src/compiler/validate.ts:128)\n  at StyleDictionary.build (node_modules/style-dictionary/lib/build.js:45)\n  at async BuildRunner.execute (src/runner.ts:89)`,
            });
          }
        } else {
          updatePlatform(platformId, { buildProgress: Math.round(progress) });
        }
      }, 200);
    },
    [platforms, updatePlatform, t]
  );

  const handleGenerateAll = useCallback(() => {
    platforms.forEach((p) => {
      if (p.enabled) handleGenerate(p.id);
    });
  }, [platforms, handleGenerate]);

  const enabledCount = platforms.filter((p) => p.enabled).length;

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-6 space-y-6">
      {/* Toast */}
      {toastMsg && (
        <div
          className="fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-lg text-sm shadow-lg"
          style={{
            background: toastMsg.type === 'success' ? 'var(--success)' : 'var(--destructive)',
            color:
              toastMsg.type === 'success'
                ? 'var(--success-foreground)'
                : 'var(--destructive-foreground)',
          }}
          role="alert"
        >
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <AlertCircle className="size-4" />
          )}
          {toastMsg.text}
          <button
            onClick={() => setToastMsg(null)}
            className="ml-2 p-0.5 rounded hover:opacity-80"
            aria-label={t('common.close')}
          >
            <X className="size-3.5" />
          </button>
        </div>
      )}

      {/* Breadcrumb */}
      <nav aria-label={t('components.breadcrumb')}>
        <ol className="flex items-center gap-1.5 text-sm">
          <li>
            <Link
              to="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="size-3.5" />
              {t('nav.home')}
            </Link>
          </li>
          <li>
            <ChevronRight className="size-3.5 text-muted-foreground" />
          </li>
          <li className="text-foreground" aria-current="page">
            {t('nav.build')}
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl" data-build-focus tabIndex={-1}>
            {t('build.title')}
          </h1>
          <p className="text-sm text-muted-foreground">{t('build.subtitle')}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
            <kbd className="px-1.5 py-0.5 rounded border border-border bg-muted font-mono">
              Ctrl+Alt+B
            </kbd>
          </div>
          <Button onClick={handleGenerateAll} disabled={enabledCount === 0}>
            <Play className="size-4" />
            {t('build.generateAll')}
            {enabledCount > 0 && (
              <Badge variant="secondary" className="ml-1 text-[10px]">
                {enabledCount}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
        {platforms.map((platform) => (
          <div
            key={platform.id}
            className={`rounded-xl border p-5 space-y-4 transition-all ${
              platform.enabled ? 'border-primary/30 bg-card' : 'border-border bg-card opacity-70'
            }`}
            style={{ boxShadow: platform.enabled ? 'var(--shadow-md)' : 'var(--shadow-sm)' }}
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <PlatformIcon type={platform.icon} className="size-10" />
                <div>
                  <h3 className="text-sm">{platform.name}</h3>
                  <p className="text-xs text-muted-foreground font-mono">{platform.outputDir}</p>
                </div>
              </div>
              <Switch
                checked={platform.enabled}
                onCheckedChange={(checked) => updatePlatform(platform.id, { enabled: checked })}
                aria-label={`${t('common.enabled')} ${platform.name}`}
              />
            </div>

            {/* Output Directory */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t('build.outputDirectory')}</Label>
              <Select
                value={platform.outputDir}
                onValueChange={(val) => updatePlatform(platform.id, { outputDir: val })}
                disabled={!platform.enabled}
              >
                <SelectTrigger className="h-8 text-xs" aria-label={t('build.selectOutputDir')}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {platform.outputDirOptions.map((dir) => (
                    <SelectItem key={dir} value={dir} className="text-xs font-mono">
                      {dir}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Checkbox Group */}
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{t('build.outputFiles')}</Label>
              <div className="grid grid-cols-2 gap-2">
                {(['variables', 'tokens', 'types', 'docs'] as const).map((opt) => (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                      platform.enabled ? 'hover:bg-muted' : 'opacity-50'
                    }`}
                  >
                    <Checkbox
                      checked={platform.outputs[opt]}
                      onCheckedChange={() => toggleOutput(platform.id, opt)}
                      disabled={!platform.enabled}
                      aria-label={`${opt} for ${platform.name}`}
                    />
                    <span className="font-mono">{opt}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Progress Bar — Token: color-primary / color-destructive */}
            {platform.buildStatus !== 'idle' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    {platform.buildStatus === 'building'
                      ? t('build.building')
                      : platform.buildStatus === 'success'
                        ? t('build.buildSuccessful')
                        : t('build.buildFailed')}
                  </span>
                  <span className="font-mono">{platform.buildProgress}%</span>
                </div>
                <div
                  className="w-full h-2 rounded-full overflow-hidden"
                  style={{ background: 'var(--muted)' }}
                >
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${platform.buildProgress}%`,
                      background:
                        platform.buildStatus === 'error' ? 'var(--destructive)' : 'var(--primary)',
                      transition: `width var(--duration-normal) var(--easing-default)`,
                    }}
                  />
                </div>
              </div>
            )}

            {/* Generate Button */}
            <Button
              onClick={() => handleGenerate(platform.id)}
              disabled={!platform.enabled || platform.buildStatus === 'building'}
              className="w-full"
              variant={platform.buildStatus === 'success' ? 'outline' : 'default'}
            >
              {platform.buildStatus === 'building' ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {t('build.generating')}
                </>
              ) : platform.buildStatus === 'success' ? (
                <>
                  <CheckCircle2 className="size-4 text-success" />
                  {t('build.regenerate')}
                </>
              ) : platform.buildStatus === 'error' ? (
                <>
                  <AlertCircle className="size-4" />
                  {t('common.retry')}
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  {t('common.generate')}
                </>
              )}
            </Button>
          </div>
        ))}
      </div>

      {/* Build Info — Token: card bg, shadow-sm */}
      <div
        className="rounded-xl border border-border p-5"
        style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
      >
        <h3 className="text-sm mb-3">{t('build.buildInfo')}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">{t('build.buildTool')}</span>
            <p className="font-mono mt-0.5">Style-Dictionary</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t('build.tokenSource')}</span>
            <p className="font-mono mt-0.5">design/tokens.json</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t('build.themeCount')}</span>
            <p className="mt-0.5">3 × 2 (Light/Dark)</p>
          </div>
          <div>
            <span className="text-muted-foreground">{t('build.sizeBudget')}</span>
            <p className="mt-0.5">&le; 200 KB</p>
          </div>
        </div>
      </div>

      {/* Error Modal */}
      <Dialog
        open={errorModal.open}
        onOpenChange={(open) => setErrorModal((prev) => ({ ...prev, open }))}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              {t('build.buildFailed')} - {errorModal.platform}
            </DialogTitle>
            <DialogDescription>{t('build.errorLog')}</DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[300px]">
            <pre
              className="text-xs font-mono p-4 rounded-lg whitespace-pre-wrap"
              style={{
                background: 'var(--muted)',
                color: 'var(--muted-foreground)',
                lineHeight: 1.6,
              }}
            >
              {errorModal.log}
            </pre>
          </ScrollArea>
          <DialogFooter>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(errorModal.log)}>
              {t('build.copyLog')}
            </Button>
            <Button onClick={() => setErrorModal((prev) => ({ ...prev, open: false }))}>
              {t('common.close')}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
