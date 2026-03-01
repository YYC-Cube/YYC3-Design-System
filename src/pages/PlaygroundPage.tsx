/**
 * YYC³ Design System — Token Playground Page
 *
 * Token Reference:
 *   background:   var(--background), var(--card), var(--muted)
 *   foreground:   var(--foreground), var(--muted-foreground), var(--primary)
 *   primary:      var(--primary), var(--primary-foreground), var(--primary-highlight)
 *   border:       var(--border)
 *   destructive:  var(--destructive)
 *   success:      var(--success), var(--success-foreground)
 *   warning:      var(--warning), var(--warning-foreground)
 *   shadow:       var(--shadow-sm), var(--shadow-md), var(--shadow-lg)
 *   radius:       var(--radius)
 *   animation:    var(--duration-fast), var(--easing-default)
 *   a11y:         outline: 2px solid var(--ring) on focus
 */
import { useState, useEffect, useCallback, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Slider } from '../components/ui/slider';
import { Progress } from '../components/ui/progress';
import { Alert, AlertTitle, AlertDescription } from '../components/ui/alert';
import { Separator } from '../components/ui/separator';
import { Avatar, AvatarFallback } from '../components/ui/avatar';
import { Switch } from '../components/ui/switch';
import { Checkbox } from '../components/ui/checkbox';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import {
  RotateCcw,
  Copy,
  Check,
  Palette,
  Sparkles,
  Info,
  AlertCircle,
  CheckCircle2,
  Download,
  Wand2,
} from 'lucide-react';

interface TokenOverride {
  name: string;
  value: string;
  cssVar: string;
  category: 'color' | 'spacing' | 'radius' | 'shadow' | 'animation';
  nameKey: string; // locale key for display name
}

const defaultColorTokens: TokenOverride[] = [
  {
    name: 'Primary',
    nameKey: 'overview.primary',
    value: '#2563eb',
    cssVar: '--primary',
    category: 'color',
  },
  {
    name: 'Primary Foreground',
    nameKey: 'overview.primary',
    value: '#ffffff',
    cssVar: '--primary-foreground',
    category: 'color',
  },
  {
    name: 'Primary Highlight',
    nameKey: 'overview.highlight',
    value: '#60a5fa',
    cssVar: '--primary-highlight',
    category: 'color',
  },
  {
    name: 'Background',
    nameKey: 'overview.background',
    value: '#ffffff',
    cssVar: '--background',
    category: 'color',
  },
  {
    name: 'Foreground',
    nameKey: 'overview.background',
    value: '#0f172a',
    cssVar: '--foreground',
    category: 'color',
  },
  {
    name: 'Card',
    nameKey: 'components.card',
    value: '#ffffff',
    cssVar: '--card',
    category: 'color',
  },
  {
    name: 'Muted',
    nameKey: 'overview.muted',
    value: '#f1f5f9',
    cssVar: '--muted',
    category: 'color',
  },
  {
    name: 'Muted Foreground',
    nameKey: 'overview.muted',
    value: '#64748b',
    cssVar: '--muted-foreground',
    category: 'color',
  },
  {
    name: 'Border',
    nameKey: 'overview.muted',
    value: '#e2e8f0',
    cssVar: '--border',
    category: 'color',
  },
  {
    name: 'Destructive',
    nameKey: 'overview.destructive',
    value: '#dc2626',
    cssVar: '--destructive',
    category: 'color',
  },
  {
    name: 'Success',
    nameKey: 'overview.successColor',
    value: '#16a34a',
    cssVar: '--success',
    category: 'color',
  },
  {
    name: 'Warning',
    nameKey: 'overview.warningColor',
    value: '#d97706',
    cssVar: '--warning',
    category: 'color',
  },
];

export function PlaygroundPage() {
  const { style, resolvedMode } = useTheme();
  const { t } = useLanguage();
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);
  const [radiusVal, setRadiusVal] = useState(0.5);
  const previewRef = useRef<HTMLDivElement>(null);

  const aiColorSchemes = [
    {
      name: t('playground.oceanBreeze'),
      desc: t('playground.oceanBreezeDesc'),
      colors: {
        '--primary': '#0891b2',
        '--primary-highlight': '#22d3ee',
        '--primary-foreground': '#ffffff',
        '--destructive': '#be123c',
        '--success': '#059669',
        '--warning': '#d97706',
      },
    },
    {
      name: t('playground.forestCanopy'),
      desc: t('playground.forestCanopyDesc'),
      colors: {
        '--primary': '#15803d',
        '--primary-highlight': '#4ade80',
        '--primary-foreground': '#ffffff',
        '--destructive': '#dc2626',
        '--success': '#16a34a',
        '--warning': '#ca8a04',
      },
    },
    {
      name: t('playground.sunsetGlow'),
      desc: t('playground.sunsetGlowDesc'),
      colors: {
        '--primary': '#9333ea',
        '--primary-highlight': '#c084fc',
        '--primary-foreground': '#ffffff',
        '--destructive': '#e11d48',
        '--success': '#059669',
        '--warning': '#ea580c',
      },
    },
    {
      name: t('playground.midnightNeon'),
      desc: t('playground.midnightNeonDesc'),
      colors: {
        '--primary': '#ec4899',
        '--primary-highlight': '#f472b6',
        '--primary-foreground': '#ffffff',
        '--destructive': '#ef4444',
        '--success': '#10b981',
        '--warning': '#f59e0b',
      },
    },
  ];

  useEffect(() => {
    const computed = getComputedStyle(document.documentElement);
    const newOverrides: Record<string, string> = {};
    defaultColorTokens.forEach((tok) => {
      const val = computed.getPropertyValue(tok.cssVar).trim();
      if (val) newOverrides[tok.cssVar] = val;
    });
    const r = computed.getPropertyValue('--radius').trim();
    if (r) setRadiusVal(parseFloat(r));
    setOverrides(newOverrides);
  }, [style, resolvedMode]);

  const applyOverride = useCallback((cssVar: string, value: string) => {
    setOverrides((prev) => ({ ...prev, [cssVar]: value }));
    document.documentElement.style.setProperty(cssVar, value);
  }, []);

  const resetAll = useCallback(() => {
    Object.keys(overrides).forEach((v) => document.documentElement.style.removeProperty(v));
    document.documentElement.style.removeProperty('--radius');
    setOverrides({});
    setRadiusVal(0.5);
    const computed = getComputedStyle(document.documentElement);
    const newOverrides: Record<string, string> = {};
    defaultColorTokens.forEach((tok) => {
      const val = computed.getPropertyValue(tok.cssVar).trim();
      if (val) newOverrides[tok.cssVar] = val;
    });
    setOverrides(newOverrides);
  }, [overrides]);

  const applyAiScheme = (scheme: (typeof aiColorSchemes)[0]) => {
    Object.entries(scheme.colors).forEach(([cssVar, value]) => applyOverride(cssVar, value));
  };

  const exportCSS = () => {
    let css = `:root {\n`;
    Object.entries(overrides).forEach(([k, v]) => {
      css += `  ${k}: ${v};\n`;
    });
    css += `  --radius: ${radiusVal}rem;\n}\n`;
    navigator.clipboard.writeText(css);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl flex items-center gap-2">
            <Palette className="size-6 text-primary" />
            {t('playground.title')}
          </h2>
          <p className="text-sm text-muted-foreground mt-1">{t('playground.subtitle')}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={resetAll}>
            <RotateCcw className="size-4" /> {t('common.reset')}
          </Button>
          <Button size="sm" onClick={exportCSS}>
            {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {copied ? t('common.copied') : t('playground.exportCSS')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Controls */}
        <div className="lg:col-span-2 space-y-4">
          <Tabs defaultValue="colors">
            <TabsList className="w-full">
              <TabsTrigger value="colors" className="flex-1">
                {t('playground.colors')}
              </TabsTrigger>
              <TabsTrigger value="scale" className="flex-1">
                {t('playground.scale')}
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex-1">
                {t('playground.aiSuggest')}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="colors" className="mt-4 space-y-3">
              {defaultColorTokens.map((token) => (
                <div key={token.cssVar} className="flex items-center gap-3">
                  <input
                    type="color"
                    value={overrides[token.cssVar] || token.value}
                    onChange={(e) => applyOverride(token.cssVar, e.target.value)}
                    className="size-8 rounded-md border border-border cursor-pointer bg-transparent"
                    aria-label={`${t('playground.changeColor').replace('{name}', token.name)}`}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs truncate">{token.name}</p>
                    <code className="text-[10px] text-muted-foreground font-mono">
                      {token.cssVar}
                    </code>
                  </div>
                  <input
                    type="text"
                    value={overrides[token.cssVar] || token.value}
                    onChange={(e) => applyOverride(token.cssVar, e.target.value)}
                    className="w-20 h-7 px-2 text-[10px] font-mono rounded border border-border bg-muted text-center"
                    aria-label={`${t('playground.hexValue').replace('{name}', token.name)}`}
                  />
                </div>
              ))}
            </TabsContent>

            <TabsContent value="scale" className="mt-4 space-y-6">
              <div className="space-y-3">
                <Label>
                  {t('playground.borderRadius')}: {radiusVal}rem
                </Label>
                <Slider
                  value={[radiusVal * 100]}
                  onValueChange={([v]) => {
                    const r = v / 100;
                    setRadiusVal(r);
                    document.documentElement.style.setProperty('--radius', `${r}rem`);
                  }}
                  max={200}
                  step={5}
                  aria-label={t('playground.borderRadius')}
                />
                <div className="flex gap-2">
                  {[0, 0.25, 0.5, 0.75, 1, 1.5].map((v) => (
                    <button
                      key={v}
                      onClick={() => {
                        setRadiusVal(v);
                        document.documentElement.style.setProperty('--radius', `${v}rem`);
                      }}
                      className={`px-2 py-1 text-[10px] rounded border ${
                        radiusVal === v
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/50'
                      }`}
                    >
                      {v}rem
                    </button>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>{t('playground.spacingSystem')}</Label>
                <div className="space-y-2">
                  {Array.from({ length: 8 }, (_, i) => i + 1).map((n) => (
                    <div key={n} className="flex items-center gap-2">
                      <code className="text-[10px] text-muted-foreground font-mono w-20">
                        spacing-{n}
                      </code>
                      <div
                        className="h-3 rounded bg-primary/30"
                        style={{ width: `calc(var(--spacing-${n}) * 3)` }}
                      />
                      <span className="text-[10px] text-muted-foreground">{n * 4}px</span>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <Label>{t('playground.shadowTokens')}</Label>
                <div className="grid grid-cols-3 gap-3">
                  {['sm', 'md', 'lg'].map((s) => (
                    <div
                      key={s}
                      className="aspect-square rounded-lg border border-border bg-card flex items-center justify-center"
                      style={{ boxShadow: `var(--shadow-${s})` }}
                    >
                      <span className="text-[10px] text-muted-foreground font-mono">
                        shadow-{s}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="mt-4 space-y-4">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Wand2 className="size-4 text-primary" />
                <span>{t('playground.aiColorRecommender')}</span>
              </div>
              {aiColorSchemes.map((scheme) => (
                <div
                  key={scheme.name}
                  className="rounded-lg border border-border p-3 hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => applyAiScheme(scheme)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => e.key === 'Enter' && applyAiScheme(scheme)}
                  aria-label={t('playground.applyScheme').replace('{name}', scheme.name)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-sm">{scheme.name}</h4>
                    <Sparkles className="size-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="text-[10px] text-muted-foreground mb-2">{scheme.desc}</p>
                  <div className="flex gap-1">
                    {Object.entries(scheme.colors).map(([k, v]) => (
                      <div
                        key={k}
                        className="size-5 rounded-sm border border-border"
                        style={{ background: v }}
                        title={`${k}: ${v}`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-3" ref={previewRef}>
          <div className="sticky top-20 space-y-4">
            <h3 className="text-sm text-muted-foreground flex items-center gap-2">
              <span className="size-2 rounded-full bg-success animate-pulse" />
              {t('playground.livePreview')}
            </h3>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  {t('playground.componentPreview')}
                  <Badge>{t('common.live')}</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{t('playground.buttons')}</p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm">{t('components.primary')}</Button>
                    <Button size="sm" variant="secondary">
                      {t('components.secondary')}
                    </Button>
                    <Button size="sm" variant="outline">
                      {t('components.outline')}
                    </Button>
                    <Button size="sm" variant="ghost">
                      {t('components.ghost')}
                    </Button>
                    <Button size="sm" variant="destructive">
                      {t('common.delete')}
                    </Button>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">{t('playground.badges')}</p>
                  <div className="flex flex-wrap gap-2">
                    <Badge>{t('components.default')}</Badge>
                    <Badge variant="secondary">{t('components.secondary')}</Badge>
                    <Badge variant="outline">{t('components.outline')}</Badge>
                    <Badge variant="destructive">{t('common.error')}</Badge>
                    <Badge className="bg-success text-success-foreground">{t('tokens.pass')}</Badge>
                    <Badge className="bg-warning text-warning-foreground">
                      {t('common.warning')}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div>
                  <p className="text-xs text-muted-foreground mb-2">
                    {t('playground.formElements')}
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <Input placeholder={t('playground.textInput')} />
                    <div className="flex items-center gap-2">
                      <Checkbox defaultChecked id="preview-check" />
                      <Label htmlFor="preview-check" className="text-xs">
                        {t('playground.checked')}
                      </Label>
                    </div>
                    <div className="flex items-center gap-2 col-span-2">
                      <Switch defaultChecked id="preview-switch" />
                      <Label htmlFor="preview-switch" className="text-xs">
                        {t('playground.toggle')}
                      </Label>
                    </div>
                  </div>
                </div>
                <Separator />
                <div className="space-y-2">
                  <Alert>
                    <Info className="size-4" />
                    <AlertTitle>{t('playground.infoAlert')}</AlertTitle>
                    <AlertDescription className="text-xs">
                      {t('playground.infoMessage')}
                    </AlertDescription>
                  </Alert>
                  <Alert variant="destructive">
                    <AlertCircle className="size-4" />
                    <AlertTitle>{t('playground.errorAlert')}</AlertTitle>
                    <AlertDescription className="text-xs">
                      {t('playground.errorMessage')}
                    </AlertDescription>
                  </Alert>
                </div>
                <Separator />
                <div className="space-y-1">
                  <p className="text-xs text-muted-foreground">Progress: 72%</p>
                  <Progress value={72} />
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      YC
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-destructive text-destructive-foreground text-xs">
                      AB
                    </AvatarFallback>
                  </Avatar>
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-success text-success-foreground text-xs">
                      OK
                    </AvatarFallback>
                  </Avatar>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  {t('playground.generatedCSS')}
                  <Button size="sm" variant="ghost" onClick={exportCSS}>
                    {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-[10px] p-3 rounded-lg bg-muted font-mono overflow-x-auto max-h-40 overflow-y-auto">
                  {`:root {\n${Object.entries(overrides)
                    .map(([k, v]) => `  ${k}: ${v};`)
                    .join('\n')}\n  --radius: ${radiusVal}rem;\n}`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
