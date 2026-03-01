/**
 * YYC³ Design System — System Settings Page
 *
 * Token Reference:
 *   background:    var(--background)
 *   foreground:    var(--foreground)
 *   card:          var(--card)
 *   card-fg:       var(--card-foreground)
 *   primary:       var(--primary)
 *   primary-fg:    var(--primary-foreground)
 *   muted:         var(--muted)
 *   muted-fg:      var(--muted-foreground)
 *   border:        var(--border)
 *   ring:          var(--ring)
 *   success:       var(--success)
 *   destructive:   var(--destructive)
 *   warning:       var(--warning)
 *   shadow:        var(--shadow-sm) / var(--shadow-md) / var(--shadow-lg)
 *   radius:        var(--radius) via Tailwind radius-*
 *   spacing:       var(--spacing-*) via Tailwind
 *   animation:     var(--duration-fast) var(--easing-out)
 *   a11y:          outline: 2px solid var(--color-ring) on focus
 */
import { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import {
  Upload,
  Image as ImageIcon,
  Type,
  ChevronDown,
  RotateCcw,
  Sparkles,
  Zap,
  Briefcase,
  Sun,
  Moon,
  Code2,
  Check,
  Download,
  FileCode2,
  Shield,
  Gauge,
  Github,
  BookOpen,
  Scale,
  FileJson,
  FileType,
  Copy,
  AlertCircle,
  CheckCircle2,
  Palette,
  Settings2,
  ExternalLink,
  Trash2,
  Link,
} from 'lucide-react';
import { useTheme, type ThemeStyle } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { toast } from 'sonner';
import { logo32 } from '../components/PWAProvider';
import Editor from '@monaco-editor/react';

/* ──────────────────────────────────────────────
   Mock token data — full OKLCH + HEX
   ────────────────────────────────────────────── */
const MOCK_TOKENS = {
  color: {
    primary: {
      base: { oklch: 'oklch(0.62 0.14 210)', hex: '#3A9FFB' },
      hover: { oklch: 'oklch(0.58 0.16 210)', hex: '#2B8DE8' },
      active: { oklch: 'oklch(0.52 0.18 210)', hex: '#1D7AD5' },
      disabled: { oklch: 'oklch(0.72 0.06 210)', hex: '#A0C4E8' },
      foreground: { oklch: 'oklch(0.99 0.01 0)', hex: '#FFFFFF' },
    },
    secondary: {
      base: { oklch: 'oklch(0.95 0.03 220)', hex: '#E0F2FE' },
      foreground: { oklch: 'oklch(0.35 0.08 230)', hex: '#0C4A6E' },
    },
    accent: {
      base: { oklch: 'oklch(0.72 0.14 240)', hex: '#60A5FA' },
      foreground: { oklch: 'oklch(0.15 0.03 260)', hex: '#0F172A' },
    },
    background: {
      light: { oklch: 'oklch(0.98 0.02 30)', hex: '#FAFAFA' },
      dark: { oklch: 'oklch(0.12 0.02 260)', hex: '#1F1F1F' },
    },
    surface: {
      light: { oklch: 'oklch(1 0 0)', hex: '#FFFFFF' },
      dark: { oklch: 'oklch(0.14 0.02 260)', hex: '#111827' },
    },
    modal: {
      light: { oklch: 'oklch(1 0 0)', hex: '#FFFFFF' },
      dark: { oklch: 'oklch(0.16 0.02 260)', hex: '#1E293B' },
    },
    muted: {
      light: { oklch: 'oklch(0.96 0.01 240)', hex: '#F1F5F9' },
      dark: { oklch: 'oklch(0.22 0.02 260)', hex: '#1E293B' },
    },
    destructive: {
      base: { oklch: 'oklch(0.52 0.21 25)', hex: '#DC2626' },
      foreground: { oklch: 'oklch(0.99 0.01 0)', hex: '#FFFFFF' },
    },
    success: {
      base: { oklch: 'oklch(0.60 0.18 145)', hex: '#16A34A' },
      foreground: { oklch: 'oklch(0.99 0.01 0)', hex: '#FFFFFF' },
    },
    warning: {
      base: { oklch: 'oklch(0.62 0.16 70)', hex: '#D97706' },
      foreground: { oklch: 'oklch(0.99 0.01 0)', hex: '#FFFFFF' },
    },
    border: {
      light: { oklch: 'oklch(0.92 0.01 240)', hex: '#E2E8F0' },
      dark: { oklch: 'oklch(0.22 0.02 260)', hex: '#1E293B' },
    },
    input: {
      background: { oklch: 'oklch(0.96 0.01 240)', hex: '#F1F5F9' },
      focus: { oklch: 'oklch(0.55 0.12 210)', hex: '#5B9CE1' },
    },
    ring: { oklch: 'oklch(0.55 0.12 210)', hex: '#5B9CE1' },
  },
  radius: {
    default: { value: '0.5rem', type: 'dimension' },
    sm: { value: '0.125rem' },
    md: { value: '0.25rem' },
    lg: { value: '0.5rem' },
  },
  shadow: {
    sm: { x: '0', y: '2px', blur: '4px', color: 'oklch(0 0 0 / 0.05)' },
    md: { x: '0', y: '4px', blur: '12px', color: 'oklch(0 0 0 / 0.08)' },
    lg: { x: '0', y: '6px', blur: '20px', color: 'oklch(0 0 0 / 0.12)' },
    neon: {
      x: '0',
      y: '4px',
      blur: '16px',
      color: 'oklch(0.30 0.20 320 / 0.15)',
    },
  },
  animation: {
    duration: { fast: '120ms', normal: '300ms', slow: '500ms' },
    easing: {
      'ease-out': 'cubic-bezier(0.25,0.8,0.25,1)',
      'ease-in': 'cubic-bezier(0.4,0,1,1)',
    },
  },
  typography: {
    'font-sans': {
      value: "Geist, system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', Arial",
      type: 'fontFamily',
    },
    'font-mono': { value: 'Roboto Mono, monospace', type: 'fontFamily' },
  },
};

/* ──────────────────────────────────────────────
   Page route configs
   ────────────────────────────────────────────── */
const PAGE_ROUTES = [
  { key: 'home', route: '/' },
  { key: 'components', route: '/components' },
  { key: 'playground', route: '/playground' },
  { key: 'tokenManager', route: '/token-manager' },
  { key: 'buildSettings', route: '/build-settings' },
  { key: 'qa', route: '/qa' },
  { key: 'dashboard', route: '/dashboard' },
  { key: 'auth', route: '/auth' },
] as const;

/* ──────────────────────────────────────────────
   Color palette for each theme
   ────────────────────────────────────────────── */
const THEME_PALETTES: Record<
  ThemeStyle,
  { name: string; colors: { label: string; var: string; light: string; dark: string }[] }
> = {
  future: {
    name: 'Future-Tech',
    colors: [
      { label: 'Primary', var: '--primary', light: '#2563eb', dark: '#3b82f6' },
      { label: 'Secondary', var: '--secondary', light: '#e0f2fe', dark: '#1e293b' },
      { label: 'Background', var: '--background', light: '#ffffff', dark: '#0b1121' },
      { label: 'Surface', var: '--card', light: '#ffffff', dark: '#111827' },
      { label: 'Destructive', var: '--destructive', light: '#dc2626', dark: '#ef4444' },
      { label: 'Success', var: '--success', light: '#16a34a', dark: '#22c55e' },
      { label: 'Warning', var: '--warning', light: '#d97706', dark: '#f59e0b' },
    ],
  },
  cyber: {
    name: 'Cyber-Punk',
    colors: [
      { label: 'Primary', var: '--primary', light: '#c026d3', dark: '#d946ef' },
      { label: 'Secondary', var: '--secondary', light: '#fae8ff', dark: '#1e0a3a' },
      { label: 'Background', var: '--background', light: '#faf5ff', dark: '#0a0015' },
      { label: 'Surface', var: '--card', light: '#ffffff', dark: '#140025' },
      { label: 'Destructive', var: '--destructive', light: '#f43f5e', dark: '#fb7185' },
      { label: 'Success', var: '--success', light: '#10b981', dark: '#34d399' },
      { label: 'Warning', var: '--warning', light: '#f59e0b', dark: '#fbbf24' },
    ],
  },
  business: {
    name: 'Modern Business',
    colors: [
      { label: 'Primary', var: '--primary', light: '#1d4ed8', dark: '#3b82f6' },
      { label: 'Secondary', var: '--secondary', light: '#f3f4f6', dark: '#374151' },
      { label: 'Background', var: '--background', light: '#ffffff', dark: '#111827' },
      { label: 'Surface', var: '--card', light: '#ffffff', dark: '#1f2937' },
      { label: 'Destructive', var: '--destructive', light: '#b91c1c', dark: '#ef4444' },
      { label: 'Success', var: '--success', light: '#15803d', dark: '#22c55e' },
      { label: 'Warning', var: '--warning', light: '#b45309', dark: '#f59e0b' },
    ],
  },
};

/* ──────────────────────────────────────────────
   Token comparison table data (Light vs Dark)
   ────────────────────────────────────────────── */
const TOKEN_COMPARISON = [
  { name: '--background', light: '#ffffff', dark: '#0b1121' },
  { name: '--foreground', light: '#0f172a', dark: '#e2e8f0' },
  { name: '--primary', light: '#2563eb', dark: '#3b82f6' },
  { name: '--card', light: '#ffffff', dark: '#111827' },
  { name: '--muted', light: '#f1f5f9', dark: '#1e293b' },
  { name: '--border', light: '#e2e8f0', dark: '#1e293b' },
  { name: '--ring', light: '#2563eb', dark: '#3b82f6' },
  { name: '--destructive', light: '#dc2626', dark: '#ef4444' },
  { name: '--success', light: '#16a34a', dark: '#22c55e' },
];

/* ──────────────────────────────────────────────
   Utility: Compute relative luminance (sRGB)
   ────────────────────────────────────────────── */
function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace('#', '');
  return [
    parseInt(h.substring(0, 2), 16) / 255,
    parseInt(h.substring(2, 4), 16) / 255,
    parseInt(h.substring(4, 6), 16) / 255,
  ];
}
function luminance(hex: string): number {
  const [r, g, b] = hexToRgb(hex).map((c) =>
    c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
function contrastRatio(hex1: string, hex2: string): number {
  const l1 = luminance(hex1);
  const l2 = luminance(hex2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

/* ──────────────────────────────────────────────
   Helper: generate export file content
   ────────────────────────────────────────────── */
function generateCSS(tokens: typeof MOCK_TOKENS): string {
  let css =
    '/* YYC\u00b3 Design System — tokens.css */\n/* Generated by Theme Customizer */\n/* OKLCH primary, HEX fallback */\n\n:root {\n';
  const flat = flattenTokens(tokens, '');
  for (const [k, v] of Object.entries(flat)) {
    css += `  --${k}: ${v};\n`;
  }
  css += '}\n';
  return css;
}
function generateJS(tokens: typeof MOCK_TOKENS): string {
  return `// YYC\u00b3 Design System \u2014 tokens.js\n// Generated by Theme Customizer\nexport const tokens = ${JSON.stringify(tokens, null, 2)};\n`;
}
function generateTS(tokens: typeof MOCK_TOKENS): string {
  const flat = flattenTokens(tokens, '');
  const keys = Object.keys(flat)
    .map((k) => `  '--${k}': string;`)
    .join('\n');
  return `// YYC\u00b3 Design System \u2014 tokens.d.ts\n// Generated by Theme Customizer\nexport interface DesignTokens {\n${keys}\n}\n\ndeclare const tokens: DesignTokens;\nexport default tokens;\n`;
}
function flattenTokens(obj: Record<string, unknown>, prefix: string): Record<string, string> {
  const result: Record<string, string> = {};
  for (const [key, value] of Object.entries(obj)) {
    const path = prefix ? `${prefix}-${key}` : key;
    if (typeof value === 'string') {
      result[path] = value;
    } else if (typeof value === 'object' && value !== null) {
      Object.assign(result, flattenTokens(value as Record<string, unknown>, path));
    }
  }
  return result;
}
function downloadFile(filename: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

/* ══════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════ */

interface CustomFont {
  id: string;
  name: string;
  fileName: string;
  url: string;
  isDefault: boolean;
}

export function ThemeCustomizerPage() {
  const { style, setStyle, resolvedMode, toggleMode } = useTheme();
  const { t } = useLanguage();

  // ── Copy token helper ──
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  const copyToken = useCallback(
    (varName: string, value: string) => {
      const text = `var(${varName}); /* ${value} */`;
      navigator.clipboard.writeText(text).then(() => {
        setCopiedVar(varName);
        toast.success(t('common.copied'));
        setTimeout(() => setCopiedVar(null), 1500);
      });
    },
    [t]
  );

  // ── Section collapse state ──
  const [logoSectionOpen, setLogoSectionOpen] = useState(true);
  const [titleSectionOpen, setTitleSectionOpen] = useState(true);
  const [presetSectionOpen, setPresetSectionOpen] = useState(true);
  const [modeSectionOpen, setModeSectionOpen] = useState(true);
  const [editorSectionOpen, setEditorSectionOpen] = useState(false);
  const [a11ySectionOpen, setA11ySectionOpen] = useState(true);
  const [githubSectionOpen, setGithubSectionOpen] = useState(true);
  const [fontSectionOpen, setFontSectionOpen] = useState(true);

  // ── Theme drawer ──
  const [themeDrawerOpen, setThemeDrawerOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!themeDrawerOpen) return;
    const handler = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setThemeDrawerOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [themeDrawerOpen]);

  // ── Logo upload ──
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [logoDragOver, setLogoDragOver] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Slogan ──
  const [slogan, setSlogan] = useState('YYC\u00b3 Design System');

  // ── Page titles ──
  const defaultTitles = useMemo(
    () => Object.fromEntries(PAGE_ROUTES.map((p) => [p.key, t(`themeCustomizer.pages.${p.key}`)])),
    [t]
  );
  const [pageTitles, setPageTitles] = useState<Record<string, string>>(defaultTitles);
  useEffect(() => {
    setPageTitles(defaultTitles);
  }, [defaultTitles]);

  // ── Token editor ──
  const [tokenJson, setTokenJson] = useState(() => JSON.stringify(MOCK_TOKENS, null, 2));
  const [jsonValid, setJsonValid] = useState<boolean | null>(null);

  // ── Lighthouse mock ──
  const [lighthouseRunning, setLighthouseRunning] = useState(false);
  const [lighthouseResult, setLighthouseResult] = useState<null | {
    fcp: string;
    lcp: string;
    cls: string;
    score: number;
  }>(null);

  // ── GitHub URL (editable, persisted) ──
  const [githubUrl, setGithubUrl] = useState(
    () => localStorage.getItem('yyc3-github-url') || 'https://github.com'
  );
  const [githubDraft, setGithubDraft] = useState(githubUrl);
  const saveGithubUrl = useCallback(() => {
    const url = githubDraft.trim() || 'https://github.com';
    setGithubUrl(url);
    localStorage.setItem('yyc3-github-url', url);
    toast.success(t('themeCustomizer.githubUrlSaved'));
  }, [githubDraft, t]);
  const resetGithubUrl = useCallback(() => {
    const def = 'https://github.com';
    setGithubUrl(def);
    setGithubDraft(def);
    localStorage.removeItem('yyc3-github-url');
    toast.success(t('themeCustomizer.githubUrlReset'));
  }, [t]);

  // ── Font management ──
  const [customFonts, setCustomFonts] = useState<CustomFont[]>(() => {
    try {
      const saved = localStorage.getItem('yyc3-custom-fonts-meta');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [fontDragOver, setFontDragOver] = useState(false);
  const fontInputRef = useRef<HTMLInputElement>(null);

  const handleFontFile = useCallback(
    (file: File) => {
      const validExts = ['.woff2', '.woff', '.ttf', '.otf'];
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!validExts.includes(ext)) {
        toast.error(t('themeCustomizer.fontInvalid'));
        return;
      }
      const url = URL.createObjectURL(file);
      const fontName = file.name.replace(/\.[^.]+$/, '').replace(/[-_]/g, ' ');
      const id = `font-${Date.now()}`;
      const fontFace = new FontFace(fontName, `url(${url})`);
      fontFace.load().then((loaded) => {
        document.fonts.add(loaded);
        const newFont: CustomFont = {
          id,
          name: fontName,
          fileName: file.name,
          url,
          isDefault: false,
        };
        setCustomFonts((prev) => {
          const next = [...prev, newFont];
          localStorage.setItem(
            'yyc3-custom-fonts-meta',
            JSON.stringify(next.map((f) => ({ ...f, url: '' })))
          );
          return next;
        });
        toast.success(t('themeCustomizer.fontAdded'));
      });
    },
    [t]
  );

  const removeFont = useCallback(
    (id: string) => {
      setCustomFonts((prev) => {
        const next = prev.filter((f) => f.id !== id);
        localStorage.setItem(
          'yyc3-custom-fonts-meta',
          JSON.stringify(next.map((f) => ({ ...f, url: '' })))
        );
        return next;
      });
      toast.success(t('themeCustomizer.fontRemoved'));
    },
    [t]
  );

  const setDefaultFont = useCallback((id: string) => {
    setCustomFonts((prev) => {
      const next = prev.map((f) => ({ ...f, isDefault: f.id === id }));
      const font = next.find((f) => f.id === id);
      if (font) {
        document.documentElement.style.setProperty(
          '--font-family-custom',
          `"${font.name}", var(--font-family-sans)`
        );
      }
      localStorage.setItem(
        'yyc3-custom-fonts-meta',
        JSON.stringify(next.map((f) => ({ ...f, url: '' })))
      );
      return next;
    });
  }, []);

  // ── Logo handler ──
  const handleLogoFile = useCallback(
    (file: File) => {
      setLogoError(null);
      const validTypes = ['image/svg+xml', 'image/png'];
      if (!validTypes.includes(file.type)) {
        setLogoError(t('themeCustomizer.logoValidation'));
        return;
      }
      if (file.size > 500 * 1024) {
        setLogoError(t('themeCustomizer.logoValidation'));
        return;
      }
      const url = URL.createObjectURL(file);
      setLogoUrl(url);
      toast.success(t('themeCustomizer.tokenGenerated'));
    },
    [t]
  );

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setLogoDragOver(false);
      const file = e.dataTransfer.files[0];
      if (file) handleLogoFile(file);
    },
    [handleLogoFile]
  );

  // ── Validate JSON ──
  const validateJson = useCallback(() => {
    try {
      JSON.parse(tokenJson);
      setJsonValid(true);
      toast.success(t('themeCustomizer.validationSuccess'));
    } catch {
      setJsonValid(false);
      toast.error(t('themeCustomizer.validationError'));
    }
  }, [tokenJson, t]);

  // ── Export handlers ──
  const handleExportCSS = useCallback(() => {
    try {
      const tokens = JSON.parse(tokenJson);
      downloadFile('tokens.css', generateCSS(tokens), 'text/css');
      toast.success(t('themeCustomizer.downloadStarted'));
    } catch {
      toast.error(t('themeCustomizer.validationError'));
    }
  }, [tokenJson, t]);

  const handleExportJS = useCallback(() => {
    try {
      const tokens = JSON.parse(tokenJson);
      downloadFile('tokens.js', generateJS(tokens), 'text/javascript');
      toast.success(t('themeCustomizer.downloadStarted'));
    } catch {
      toast.error(t('themeCustomizer.validationError'));
    }
  }, [tokenJson, t]);

  const handleExportTS = useCallback(() => {
    try {
      const tokens = JSON.parse(tokenJson);
      downloadFile('tokens.d.ts', generateTS(tokens), 'text/typescript');
      toast.success(t('themeCustomizer.downloadStarted'));
    } catch {
      toast.error(t('themeCustomizer.validationError'));
    }
  }, [tokenJson, t]);

  // ── Lighthouse mock run ──
  const runLighthouse = useCallback(() => {
    setLighthouseRunning(true);
    setLighthouseResult(null);
    setTimeout(() => {
      setLighthouseRunning(false);
      setLighthouseResult({
        fcp: '1.2s',
        lcp: '2.1s',
        cls: '0.03',
        score: 94,
      });
      toast.success(t('themeCustomizer.lighthouseComplete'));
    }, 2500);
  }, [t]);

  // ── Contrast calculations ──
  const palette = THEME_PALETTES[style];
  const primaryHex = resolvedMode === 'dark' ? palette.colors[0].dark : palette.colors[0].light;
  const fgHex = resolvedMode === 'dark' ? '#e2e8f0' : '#0f172a';
  const bgHex = resolvedMode === 'dark' ? palette.colors[2].dark : palette.colors[2].light;

  const primaryContrast = contrastRatio(primaryHex, '#ffffff');
  const bgContrast = contrastRatio(bgHex, fgHex);

  // ── Section toggle component ──
  const SectionHeader = ({
    open,
    onToggle,
    icon: Icon,
    title,
    desc,
    id,
  }: {
    open: boolean;
    onToggle: () => void;
    icon: React.ElementType;
    title: string;
    desc: string;
    id: string;
  }) => (
    <button
      onClick={onToggle}
      className="w-full flex items-center gap-3 text-left group"
      style={{
        padding: 'var(--spacing-4)',
        transition: `all var(--duration-fast) var(--easing-out)`,
      }}
      aria-expanded={open}
      aria-controls={id}
    >
      <div
        className="flex items-center justify-center rounded-lg"
        style={{
          width: '2.5rem',
          height: '2.5rem',
          background: 'var(--primary)',
          color: 'var(--primary-foreground)',
          flexShrink: 0,
        }}
      >
        <Icon className="size-5" aria-hidden="true" />
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="text-foreground" style={{ fontSize: 'var(--text-base)', lineHeight: 1.4 }}>
          {title}
        </h3>
        <p
          className="text-muted-foreground truncate"
          style={{ fontSize: 'var(--text-sm)', lineHeight: 1.4 }}
        >
          {desc}
        </p>
      </div>
      <div
        className="text-muted-foreground"
        style={{
          transition: `transform var(--duration-fast) var(--easing-out)`,
          transform: open ? 'rotate(0)' : 'rotate(-90deg)',
        }}
      >
        <ChevronDown className="size-5" />
      </div>
    </button>
  );

  return (
    <div
      className="max-w-[1400px] mx-auto"
      style={{ padding: 'var(--spacing-4) var(--spacing-4) var(--spacing-8)' }}
    >
      {/* ═══ PAGE HEADER ═══ */}
      <div
        className="text-center"
        style={{
          paddingTop: 'var(--spacing-6)',
          paddingBottom: 'var(--spacing-6)',
        }}
      >
        <div
          className="flex items-center justify-center gap-2"
          style={{ marginBottom: 'var(--spacing-2)' }}
        >
          <Settings2 className="size-6 text-primary" aria-hidden="true" />
          <h1 style={{ fontSize: 'var(--text-2xl)', lineHeight: 1.3 }}>
            {t('themeCustomizer.title')}
          </h1>
        </div>
        <p
          className="text-muted-foreground max-w-2xl mx-auto"
          style={{ fontSize: 'var(--text-sm)', lineHeight: 1.5 }}
        >
          {t('themeCustomizer.subtitle')}
        </p>
      </div>

      <div className="space-y-4">
        {/* ═══ 2. LOGO & SLOGAN ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={logoSectionOpen}
            onToggle={() => setLogoSectionOpen(!logoSectionOpen)}
            icon={ImageIcon}
            title={t('themeCustomizer.logoSection')}
            desc={t('themeCustomizer.logoUploadDesc')}
            id="logo-section"
          />
          {logoSectionOpen && (
            <div
              id="logo-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Upload zone */}
                <div>
                  <label
                    className="text-sm text-foreground"
                    style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}
                  >
                    {t('themeCustomizer.logoUpload')}
                  </label>
                  <div
                    onDrop={onDrop}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setLogoDragOver(true);
                    }}
                    onDragLeave={() => setLogoDragOver(false)}
                    onClick={() => fileInputRef.current?.click()}
                    className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed cursor-pointer"
                    style={{
                      borderColor: logoDragOver ? 'var(--primary)' : 'var(--border)',
                      background: logoDragOver ? 'var(--primary)' : 'var(--muted)',
                      opacity: logoDragOver ? 0.85 : 1,
                      minHeight: '10rem',
                      padding: 'var(--spacing-4)',
                      transition: `all var(--duration-fast) var(--easing-out)`,
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={t('themeCustomizer.logoUpload')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        fileInputRef.current?.click();
                      }
                    }}
                  >
                    {logoUrl ? (
                      <img
                        src={logoUrl}
                        alt={t('themeCustomizer.logoPreview')}
                        className="max-h-24 object-contain"
                      />
                    ) : (
                      <Upload className="size-8 text-muted-foreground" aria-hidden="true" />
                    )}
                    <span
                      className="text-muted-foreground text-center"
                      style={{
                        marginTop: 'var(--spacing-2)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {t('themeCustomizer.logoUploadDesc')}
                    </span>
                    <span
                      className="inline-flex items-center gap-1 rounded-md text-primary-foreground"
                      style={{
                        marginTop: 'var(--spacing-2)',
                        padding: 'var(--spacing-1) var(--spacing-3)',
                        background: 'var(--primary)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      {t('themeCustomizer.chooseFile')}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".svg,.png,image/svg+xml,image/png"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoFile(file);
                      }}
                      aria-label={t('themeCustomizer.chooseFile')}
                    />
                  </div>
                  {logoError && (
                    <div
                      className="flex items-center gap-1 text-destructive"
                      style={{
                        marginTop: 'var(--spacing-1)',
                        fontSize: 'var(--text-sm)',
                      }}
                    >
                      <AlertCircle className="size-4" aria-hidden="true" />
                      {logoError}
                    </div>
                  )}
                  {logoUrl && (
                    <div
                      className="text-muted-foreground"
                      style={{
                        marginTop: 'var(--spacing-2)',
                        fontFamily: 'var(--font-family-mono)',
                        fontSize: 'var(--text-sm)',
                        padding: 'var(--spacing-2)',
                        background: 'var(--muted)',
                        borderRadius: 'var(--radius)',
                      }}
                    >
                      {`--logo-url: url("${logoUrl.substring(0, 40)}...");`}
                    </div>
                  )}
                </div>

                {/* Slogan editor */}
                <div>
                  <label
                    htmlFor="slogan-input"
                    className="text-sm text-foreground"
                    style={{ marginBottom: 'var(--spacing-1)', display: 'block' }}
                  >
                    {t('themeCustomizer.sloganLabel')}
                  </label>
                  <input
                    id="slogan-input"
                    type="text"
                    value={slogan}
                    onChange={(e) => setSlogan(e.target.value)}
                    placeholder={t('themeCustomizer.sloganPlaceholder')}
                    className="w-full rounded-lg border border-border text-foreground"
                    style={{
                      padding: 'var(--spacing-2) var(--spacing-3)',
                      background: 'var(--input-background)',
                      fontSize: 'var(--text-base)',
                      outline: '2px solid transparent',
                      transition: `all var(--duration-fast) var(--easing-out)`,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--ring)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = '2px solid transparent';
                    }}
                    aria-label={t('themeCustomizer.sloganLabel')}
                  />
                  <div
                    className="text-muted-foreground"
                    style={{
                      marginTop: 'var(--spacing-2)',
                      fontFamily: 'var(--font-family-mono)',
                      fontSize: 'var(--text-sm)',
                      padding: 'var(--spacing-2)',
                      background: 'var(--muted)',
                      borderRadius: 'var(--radius)',
                    }}
                  >
                    {`--slogan-text: "${slogan}";`}
                  </div>

                  {/* Live preview mini-header */}
                  <div style={{ marginTop: 'var(--spacing-3)' }}>
                    <span
                      className="text-muted-foreground"
                      style={{
                        fontSize: 'var(--text-xs)',
                        display: 'block',
                        marginBottom: 'var(--spacing-1)',
                      }}
                    >
                      {t('themeCustomizer.livePreview')}
                    </span>
                    <div
                      className="flex items-center gap-2 rounded-lg border border-border"
                      style={{
                        padding: 'var(--spacing-2) var(--spacing-3)',
                        background: 'var(--card)',
                      }}
                    >
                      <img src={logoUrl || logo32} alt="Logo" className="size-6 rounded" />
                      <div>
                        <div style={{ fontSize: 'var(--text-sm)', lineHeight: 1.2 }}>{slogan}</div>
                        <div
                          className="text-muted-foreground capitalize"
                          style={{ fontSize: 'var(--text-xs)', lineHeight: 1 }}
                        >
                          {style}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 3. PAGE TITLE MANAGER ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={titleSectionOpen}
            onToggle={() => setTitleSectionOpen(!titleSectionOpen)}
            icon={Type}
            title={t('themeCustomizer.pageTitles')}
            desc={t('themeCustomizer.pageTitlesDesc')}
            id="title-section"
          />
          {titleSectionOpen && (
            <div
              id="title-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              <div className="space-y-2">
                {PAGE_ROUTES.map(({ key, route }) => (
                  <div
                    key={key}
                    className="flex flex-col sm:flex-row sm:items-center gap-2 rounded-lg border border-border"
                    style={{ padding: 'var(--spacing-2) var(--spacing-3)' }}
                  >
                    <div
                      className="flex items-center gap-2 flex-shrink-0"
                      style={{ minWidth: '8rem' }}
                    >
                      <code
                        className="text-muted-foreground"
                        style={{
                          fontFamily: 'var(--font-family-mono)',
                          fontSize: 'var(--text-xs)',
                        }}
                      >
                        {route}
                      </code>
                    </div>
                    <input
                      type="text"
                      value={pageTitles[key] || ''}
                      onChange={(e) =>
                        setPageTitles((prev) => ({
                          ...prev,
                          [key]: e.target.value,
                        }))
                      }
                      className="flex-1 rounded-md border border-border text-foreground"
                      style={{
                        padding: 'var(--spacing-1) var(--spacing-2)',
                        background: 'var(--input-background)',
                        fontSize: 'var(--text-sm)',
                        outline: '2px solid transparent',
                        transition: `all var(--duration-fast) var(--easing-out)`,
                      }}
                      onFocus={(e) => {
                        e.currentTarget.style.outline = '2px solid var(--ring)';
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.outline = '2px solid transparent';
                      }}
                      aria-label={`${t('themeCustomizer.pageTitles')}: ${route}`}
                    />
                    <button
                      onClick={() =>
                        setPageTitles((prev) => ({
                          ...prev,
                          [key]: t(`themeCustomizer.pages.${key}`),
                        }))
                      }
                      className="flex items-center gap-1 rounded-md text-muted-foreground hover:text-foreground"
                      style={{
                        padding: 'var(--spacing-1) var(--spacing-2)',
                        fontSize: 'var(--text-xs)',
                        transition: `all var(--duration-fast) var(--easing-out)`,
                      }}
                      aria-label={`${t('themeCustomizer.resetDefault')} — ${route}`}
                    >
                      <RotateCcw className="size-3" aria-hidden="true" />
                      {t('themeCustomizer.resetDefault')}
                    </button>
                  </div>
                ))}
              </div>

              {/* Mini preview */}
              <div style={{ marginTop: 'var(--spacing-3)' }}>
                <span
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    display: 'block',
                    marginBottom: 'var(--spacing-1)',
                  }}
                >
                  {t('themeCustomizer.livePreview')}
                </span>
                <div
                  className="flex items-center gap-3 rounded-lg border border-border overflow-x-auto"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    background: 'var(--card)',
                  }}
                >
                  <img
                    src={logoUrl || logo32}
                    alt="Logo"
                    className="size-5 rounded flex-shrink-0"
                  />
                  {PAGE_ROUTES.slice(0, 5).map(({ key }) => (
                    <span
                      key={key}
                      className="text-muted-foreground whitespace-nowrap"
                      style={{ fontSize: 'var(--text-xs)' }}
                    >
                      {pageTitles[key]}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 4. THEME PRESET SELECTOR ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={presetSectionOpen}
            onToggle={() => setPresetSectionOpen(!presetSectionOpen)}
            icon={Palette}
            title={t('themeCustomizer.themePresets')}
            desc={t('themeCustomizer.themePresetsDesc')}
            id="preset-section"
          />
          {presetSectionOpen && (
            <div
              id="preset-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              {/* ── Dropdown drawer theme selector ── */}
              <div ref={drawerRef} className="relative" style={{ zIndex: 10 }}>
                {/* Trigger button */}
                <button
                  onClick={() => setThemeDrawerOpen((v) => !v)}
                  className="w-full flex items-center gap-3 rounded-xl border-2 text-left cursor-pointer"
                  style={{
                    padding: 'var(--spacing-3) var(--spacing-4)',
                    borderColor: themeDrawerOpen ? 'var(--ring)' : 'var(--primary)',
                    background: 'var(--card)',
                    color: 'var(--foreground)',
                    boxShadow: themeDrawerOpen ? 'var(--shadow-lg)' : 'var(--shadow-sm)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: 'none',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = 'none';
                  }}
                  aria-expanded={themeDrawerOpen}
                  aria-haspopup="listbox"
                  aria-label={t('themeCustomizer.selectThemeStyle')}
                >
                  {/* Active theme icon */}
                  <div
                    className="flex items-center justify-center rounded-lg flex-shrink-0"
                    style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      background: 'var(--primary)',
                      color: 'var(--primary-foreground)',
                    }}
                  >
                    {style === 'future' && <Sparkles className="size-5" aria-hidden="true" />}
                    {style === 'cyber' && <Zap className="size-5" aria-hidden="true" />}
                    {style === 'business' && <Briefcase className="size-5" aria-hidden="true" />}
                  </div>
                  {/* Active theme label */}
                  <div className="flex-1 min-w-0">
                    <div style={{ fontSize: 'var(--text-sm)' }}>
                      {style === 'future' && t('themeCustomizer.presetFuture')}
                      {style === 'cyber' && t('themeCustomizer.presetCyber')}
                      {style === 'business' && t('themeCustomizer.presetBusiness')}
                    </div>
                    <div className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                      {style === 'future' && t('themeCustomizer.presetFutureDesc')}
                      {style === 'cyber' && t('themeCustomizer.presetCyberDesc')}
                      {style === 'business' && t('themeCustomizer.presetBusinessDesc')}
                    </div>
                  </div>
                  {/* Color dots preview */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {THEME_PALETTES[style].colors.slice(0, 4).map((c) => (
                      <div
                        key={c.var}
                        className="rounded-full border border-border"
                        style={{
                          width: '0.75rem',
                          height: '0.75rem',
                          background: resolvedMode === 'dark' ? c.dark : c.light,
                        }}
                      />
                    ))}
                  </div>
                  {/* Chevron */}
                  <ChevronDown
                    className="size-5 flex-shrink-0 text-muted-foreground"
                    style={{
                      transition: `transform var(--duration-fast) var(--easing-out)`,
                      transform: themeDrawerOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    }}
                    aria-hidden="true"
                  />
                </button>

                {/* Drawer panel */}
                <div
                  role="listbox"
                  aria-label={t('themeCustomizer.selectThemeStyle')}
                  style={{
                    maxHeight: themeDrawerOpen ? '600px' : '0px',
                    opacity: themeDrawerOpen ? 1 : 0,
                    overflow: 'hidden',
                    transition: `max-height 300ms var(--easing-out), opacity 200ms var(--easing-out)`,
                    marginTop: themeDrawerOpen ? 'var(--spacing-2)' : '0',
                  }}
                >
                  <div
                    className="rounded-xl border border-border overflow-hidden"
                    style={{
                      background: 'var(--card)',
                      boxShadow: 'var(--shadow-lg)',
                    }}
                  >
                    {(
                      [
                        {
                          key: 'future' as ThemeStyle,
                          icon: Sparkles,
                          label: t('themeCustomizer.presetFuture'),
                          desc: t('themeCustomizer.presetFutureDesc'),
                          accent: { light: '#2563eb', dark: '#3b82f6' },
                          gradient: {
                            light: 'linear-gradient(135deg, #dbeafe 0%, #ede9fe 100%)',
                            dark: 'linear-gradient(135deg, #1e1b4b 0%, #0c1a3d 100%)',
                          },
                        },
                        {
                          key: 'cyber' as ThemeStyle,
                          icon: Zap,
                          label: t('themeCustomizer.presetCyber'),
                          desc: t('themeCustomizer.presetCyberDesc'),
                          accent: { light: '#c026d3', dark: '#d946ef' },
                          gradient: {
                            light: 'linear-gradient(135deg, #fae8ff 0%, #fce7f3 100%)',
                            dark: 'linear-gradient(135deg, #2d0a3e 0%, #1a0025 100%)',
                          },
                        },
                        {
                          key: 'business' as ThemeStyle,
                          icon: Briefcase,
                          label: t('themeCustomizer.presetBusiness'),
                          desc: t('themeCustomizer.presetBusinessDesc'),
                          accent: { light: '#1d4ed8', dark: '#3b82f6' },
                          gradient: {
                            light: 'linear-gradient(135deg, #f0f4ff 0%, #f3f4f6 100%)',
                            dark: 'linear-gradient(135deg, #111827 0%, #1a2332 100%)',
                          },
                        },
                      ] as const
                    ).map((preset, idx) => {
                      const isActive = style === preset.key;
                      const accentColor =
                        resolvedMode === 'dark' ? preset.accent.dark : preset.accent.light;
                      const gradBg =
                        resolvedMode === 'dark' ? preset.gradient.dark : preset.gradient.light;
                      const pal = THEME_PALETTES[preset.key];
                      return (
                        <button
                          key={preset.key}
                          role="option"
                          aria-selected={isActive}
                          onClick={() => {
                            setStyle(preset.key);
                            setThemeDrawerOpen(false);
                          }}
                          className="w-full text-left relative"
                          style={{
                            padding: '0',
                            background: 'transparent',
                            border: 'none',
                            borderTop: idx > 0 ? '1px solid var(--border)' : 'none',
                            cursor: 'pointer',
                            outline: 'none',
                          }}
                          onFocus={(e) => {
                            e.currentTarget.style.outline = '2px solid var(--ring)';
                            e.currentTarget.style.outlineOffset = '-2px';
                          }}
                          onBlur={(e) => {
                            e.currentTarget.style.outline = 'none';
                          }}
                        >
                          {/* Active indicator bar */}
                          {isActive && (
                            <div
                              style={{
                                position: 'absolute',
                                left: 0,
                                top: 0,
                                bottom: 0,
                                width: '4px',
                                background: accentColor,
                                borderRadius:
                                  idx === 0
                                    ? 'var(--radius) 0 0 0'
                                    : idx === 2
                                      ? '0 0 0 var(--radius)'
                                      : '0',
                              }}
                            />
                          )}
                          <div
                            style={{
                              padding: 'var(--spacing-4)',
                              paddingLeft: 'var(--spacing-5)',
                              background: isActive ? gradBg : 'transparent',
                              transition: `background var(--duration-fast) var(--easing-out)`,
                            }}
                            onMouseEnter={(e) => {
                              if (!isActive) e.currentTarget.style.background = 'var(--muted)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isActive) e.currentTarget.style.background = 'transparent';
                            }}
                          >
                            <div className="flex items-center gap-3">
                              {/* Icon circle */}
                              <div
                                className="flex items-center justify-center rounded-lg flex-shrink-0"
                                style={{
                                  width: '2.5rem',
                                  height: '2.5rem',
                                  background: isActive ? accentColor : 'var(--muted)',
                                  color: isActive ? '#ffffff' : 'var(--muted-foreground)',
                                  transition: `all var(--duration-fast) var(--easing-out)`,
                                }}
                              >
                                <preset.icon className="size-5" aria-hidden="true" />
                              </div>
                              {/* Text */}
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span
                                    style={{
                                      fontSize: 'var(--text-sm)',
                                      color: isActive ? accentColor : 'var(--foreground)',
                                    }}
                                  >
                                    {preset.label}
                                  </span>
                                  {isActive && (
                                    <span
                                      className="rounded-full"
                                      style={{
                                        padding: '1px 8px',
                                        background: accentColor,
                                        color: '#ffffff',
                                        fontSize: '10px',
                                      }}
                                    >
                                      {t('themeCustomizer.currentDefault')}
                                    </span>
                                  )}
                                </div>
                                <div
                                  className="text-muted-foreground"
                                  style={{ fontSize: 'var(--text-xs)', marginTop: '2px' }}
                                >
                                  {preset.desc}
                                </div>
                              </div>
                              {/* Color swatches */}
                              <div className="flex flex-col gap-1 flex-shrink-0">
                                <div className="flex gap-1">
                                  {pal.colors.slice(0, 4).map((c) => (
                                    <div
                                      key={c.var}
                                      className="rounded-sm"
                                      style={{
                                        width: '1rem',
                                        height: '1rem',
                                        background: resolvedMode === 'dark' ? c.dark : c.light,
                                        border: '1px solid var(--border)',
                                      }}
                                    />
                                  ))}
                                </div>
                                <div className="flex gap-1">
                                  {pal.colors.slice(4, 7).map((c) => (
                                    <div
                                      key={c.var}
                                      className="rounded-sm"
                                      style={{
                                        width: '1rem',
                                        height: '1rem',
                                        background: resolvedMode === 'dark' ? c.dark : c.light,
                                        border: '1px solid var(--border)',
                                      }}
                                    />
                                  ))}
                                </div>
                              </div>
                              {/* Check */}
                              {isActive && (
                                <Check
                                  className="size-5 flex-shrink-0"
                                  style={{ color: accentColor }}
                                  aria-hidden="true"
                                />
                              )}
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Color palette */}
              <div style={{ marginTop: 'var(--spacing-4)' }}>
                <h4
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  {t('themeCustomizer.colorPalette')} — {palette.name}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {palette.colors.map((c) => {
                    const colorValue = resolvedMode === 'dark' ? c.dark : c.light;
                    const isCopied = copiedVar === c.var;
                    return (
                      <button
                        key={c.var}
                        onClick={() => copyToken(c.var, colorValue)}
                        className="flex items-center gap-2 rounded-md border border-border text-left group"
                        style={{
                          padding: 'var(--spacing-1) var(--spacing-2)',
                          background: 'transparent',
                          cursor: 'pointer',
                          transition: `all var(--duration-fast) var(--easing-out)`,
                          outline: '2px solid transparent',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'var(--muted)';
                          e.currentTarget.style.boxShadow = 'var(--shadow-md)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.outline = '2px solid var(--ring)';
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.outline = '2px solid transparent';
                        }}
                        aria-label={`${t('common.copy')} var(${c.var}): ${colorValue}`}
                        title={`${t('common.copy')} var(${c.var})`}
                      >
                        <div
                          className="rounded-sm border border-border"
                          style={{
                            width: '1.5rem',
                            height: '1.5rem',
                            background: colorValue,
                            flexShrink: 0,
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <div style={{ fontSize: 'var(--text-xs)' }}>{c.label}</div>
                          <div
                            className="text-muted-foreground"
                            style={{
                              fontSize: '10px',
                              fontFamily: 'var(--font-family-mono)',
                            }}
                          >
                            {colorValue}
                          </div>
                        </div>
                        <div
                          className="flex-shrink-0 opacity-0 group-hover:opacity-100"
                          style={{
                            opacity: isCopied ? 1 : undefined,
                            transition: `opacity var(--duration-fast) var(--easing-out)`,
                          }}
                        >
                          {isCopied ? (
                            <Check className="size-3 text-success" aria-hidden="true" />
                          ) : (
                            <Copy className="size-3 text-muted-foreground" aria-hidden="true" />
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 5. LIGHT/DARK MODE SWITCH ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={modeSectionOpen}
            onToggle={() => setModeSectionOpen(!modeSectionOpen)}
            icon={resolvedMode === 'dark' ? Moon : Sun}
            title={t('themeCustomizer.modeSwitcher')}
            desc={t('themeCustomizer.modeSwitcherDesc')}
            id="mode-section"
          />
          {modeSectionOpen && (
            <div
              id="mode-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              {/* Switch row */}
              <div className="flex items-center gap-3">
                <Sun className="size-5 text-warning" aria-hidden="true" />
                <button
                  onClick={toggleMode}
                  className="relative rounded-full"
                  style={{
                    width: '3rem',
                    height: '1.5rem',
                    background:
                      resolvedMode === 'dark' ? 'var(--primary)' : 'var(--switch-background)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  role="switch"
                  aria-checked={resolvedMode === 'dark'}
                  aria-label={t('themeCustomizer.modeSwitcher')}
                >
                  <div
                    className="absolute top-0.5 rounded-full bg-white"
                    style={{
                      width: '1.25rem',
                      height: '1.25rem',
                      left: resolvedMode === 'dark' ? '1.625rem' : '0.125rem',
                      transition: `left var(--duration-fast) var(--easing-out)`,
                      boxShadow: 'var(--shadow-sm)',
                    }}
                  />
                </button>
                <Moon className="size-5 text-primary" aria-hidden="true" />
                <span className="text-sm text-foreground">
                  {resolvedMode === 'dark'
                    ? t('themeCustomizer.darkMode')
                    : t('themeCustomizer.lightMode')}
                </span>
              </div>

              {/* Comparison table */}
              <div style={{ marginTop: 'var(--spacing-3)' }}>
                <h4
                  className="text-muted-foreground"
                  style={{
                    fontSize: 'var(--text-xs)',
                    marginBottom: 'var(--spacing-2)',
                  }}
                >
                  {t('themeCustomizer.tokenComparison')}
                </h4>
                <div className="overflow-x-auto rounded-lg border border-border">
                  <table className="w-full" style={{ fontSize: 'var(--text-sm)' }}>
                    <thead>
                      <tr style={{ background: 'var(--muted)' }}>
                        <th
                          className="text-left text-muted-foreground"
                          style={{
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {t('themeCustomizer.tokenName')}
                        </th>
                        <th
                          className="text-left text-muted-foreground"
                          style={{
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {t('themeCustomizer.lightValue')}
                        </th>
                        <th
                          className="text-left text-muted-foreground"
                          style={{
                            padding: 'var(--spacing-2) var(--spacing-3)',
                            fontSize: 'var(--text-xs)',
                          }}
                        >
                          {t('themeCustomizer.darkValue')}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {TOKEN_COMPARISON.map((row) => (
                        <tr key={row.name} className="border-t border-border">
                          <td
                            style={{
                              padding: 'var(--spacing-1) var(--spacing-3)',
                              fontFamily: 'var(--font-family-mono)',
                              fontSize: 'var(--text-xs)',
                            }}
                          >
                            {row.name}
                          </td>
                          <td
                            style={{
                              padding: 'var(--spacing-1) var(--spacing-3)',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="rounded border border-border"
                                style={{
                                  width: '1rem',
                                  height: '1rem',
                                  background: row.light,
                                  flexShrink: 0,
                                }}
                              />
                              <code
                                className="text-muted-foreground"
                                style={{ fontSize: 'var(--text-xs)' }}
                              >
                                {row.light}
                              </code>
                            </div>
                          </td>
                          <td
                            style={{
                              padding: 'var(--spacing-1) var(--spacing-3)',
                            }}
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="rounded border border-border"
                                style={{
                                  width: '1rem',
                                  height: '1rem',
                                  background: row.dark,
                                  flexShrink: 0,
                                }}
                              />
                              <code
                                className="text-muted-foreground"
                                style={{ fontSize: 'var(--text-xs)' }}
                              >
                                {row.dark}
                              </code>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 6. ADVANCED TOKEN EDITOR ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={editorSectionOpen}
            onToggle={() => setEditorSectionOpen(!editorSectionOpen)}
            icon={Code2}
            title={t('themeCustomizer.advancedEditor')}
            desc={t('themeCustomizer.advancedEditorDesc')}
            id="editor-section"
          />
          {editorSectionOpen && (
            <div
              id="editor-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              {/* Monaco Editor */}
              <div
                className="rounded-lg border border-border overflow-hidden"
                style={{ background: 'var(--muted)' }}
              >
                <div
                  className="flex items-center justify-between border-b border-border"
                  style={{
                    padding: 'var(--spacing-1) var(--spacing-3)',
                    background: 'var(--muted)',
                  }}
                >
                  <span
                    className="text-muted-foreground flex items-center gap-1"
                    style={{ fontSize: 'var(--text-xs)' }}
                  >
                    <FileJson className="size-3" aria-hidden="true" />
                    design/tokens.json
                  </span>
                  <div className="flex items-center gap-1">
                    {jsonValid === true && (
                      <CheckCircle2
                        className="size-4 text-success"
                        aria-label={t('themeCustomizer.validationSuccess')}
                      />
                    )}
                    {jsonValid === false && (
                      <AlertCircle
                        className="size-4 text-destructive"
                        aria-label={t('themeCustomizer.validationError')}
                      />
                    )}
                  </div>
                </div>
                <div
                  style={{ height: '24rem' }}
                  role="textbox"
                  aria-label={t('themeCustomizer.advancedEditor')}
                >
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    value={tokenJson}
                    onChange={(value) => {
                      setTokenJson(value ?? '');
                      setJsonValid(null);
                    }}
                    theme={resolvedMode === 'dark' ? 'vs-dark' : 'light'}
                    options={{
                      minimap: { enabled: false },
                      fontSize: 13,
                      lineNumbers: 'on',
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      tabSize: 2,
                      automaticLayout: true,
                      formatOnPaste: true,
                      folding: true,
                      bracketPairColorization: { enabled: true },
                      padding: { top: 8, bottom: 8 },
                      renderLineHighlight: 'line',
                      scrollbar: {
                        verticalScrollbarSize: 8,
                        horizontalScrollbarSize: 8,
                      },
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2" style={{ marginTop: 'var(--spacing-3)' }}>
                <button
                  onClick={validateJson}
                  className="flex items-center gap-1.5 rounded-lg text-primary-foreground"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    background: 'var(--primary)',
                    fontSize: 'var(--text-sm)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                    boxShadow: 'var(--shadow-sm)',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('themeCustomizer.validate')}
                >
                  <Check className="size-4" aria-hidden="true" />
                  {t('themeCustomizer.validate')}
                </button>
                <button
                  onClick={handleExportCSS}
                  className="flex items-center gap-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    fontSize: 'var(--text-sm)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('themeCustomizer.exportCSS')}
                >
                  <FileCode2 className="size-4" aria-hidden="true" />
                  {t('themeCustomizer.exportCSS')}
                </button>
                <button
                  onClick={handleExportJS}
                  className="flex items-center gap-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    fontSize: 'var(--text-sm)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('themeCustomizer.exportJS')}
                >
                  <Download className="size-4" aria-hidden="true" />
                  {t('themeCustomizer.exportJS')}
                </button>
                <button
                  onClick={handleExportTS}
                  className="flex items-center gap-1.5 rounded-lg border border-border text-foreground hover:bg-muted"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-4)',
                    fontSize: 'var(--text-sm)',
                    transition: `all var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('themeCustomizer.exportTS')}
                >
                  <FileType className="size-4" aria-hidden="true" />
                  {t('themeCustomizer.exportTS')}
                </button>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 7. A11Y & PERFORMANCE ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={a11ySectionOpen}
            onToggle={() => setA11ySectionOpen(!a11ySectionOpen)}
            icon={Shield}
            title={t('themeCustomizer.a11yPerf')}
            desc={t('themeCustomizer.a11yPerfDesc')}
            id="a11y-section"
          />
          {a11ySectionOpen && (
            <div
              id="a11y-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Contrast card: Primary/Foreground */}
                <div
                  className="rounded-lg border border-border"
                  style={{
                    padding: 'var(--spacing-3)',
                    background: 'var(--muted)',
                  }}
                >
                  <div
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--text-xs)',
                      marginBottom: 'var(--spacing-2)',
                    }}
                  >
                    {t('themeCustomizer.primaryFg')}
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="rounded border border-border"
                      style={{
                        width: '2rem',
                        height: '2rem',
                        background: primaryHex,
                      }}
                    />
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          lineHeight: 1.2,
                        }}
                      >
                        {primaryContrast.toFixed(2)}:1
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ fontSize: 'var(--text-xs)' }}
                      >
                        {primaryContrast >= 4.5 ? (
                          <>
                            <CheckCircle2 className="size-3 text-success" aria-hidden="true" />
                            <span className="text-success">
                              {t('themeCustomizer.contrastPass')}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-3 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">
                              {t('themeCustomizer.contrastFail')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contrast card: Background/Foreground */}
                <div
                  className="rounded-lg border border-border"
                  style={{
                    padding: 'var(--spacing-3)',
                    background: 'var(--muted)',
                  }}
                >
                  <div
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--text-xs)',
                      marginBottom: 'var(--spacing-2)',
                    }}
                  >
                    {t('themeCustomizer.bgFg')}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-0.5">
                      <div
                        className="rounded border border-border"
                        style={{
                          width: '2rem',
                          height: '0.875rem',
                          background: bgHex,
                        }}
                      />
                      <div
                        className="rounded border border-border"
                        style={{
                          width: '2rem',
                          height: '0.875rem',
                          background: fgHex,
                        }}
                      />
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--text-lg)',
                          lineHeight: 1.2,
                        }}
                      >
                        {bgContrast.toFixed(2)}:1
                      </div>
                      <div
                        className="flex items-center gap-1"
                        style={{ fontSize: 'var(--text-xs)' }}
                      >
                        {bgContrast >= 4.5 ? (
                          <>
                            <CheckCircle2 className="size-3 text-success" aria-hidden="true" />
                            <span className="text-success">
                              {t('themeCustomizer.contrastPass')}
                            </span>
                          </>
                        ) : (
                          <>
                            <AlertCircle className="size-3 text-destructive" aria-hidden="true" />
                            <span className="text-destructive">
                              {t('themeCustomizer.contrastFail')}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bundle size + Lighthouse */}
                <div
                  className="rounded-lg border border-border"
                  style={{
                    padding: 'var(--spacing-3)',
                    background: 'var(--muted)',
                  }}
                >
                  <div
                    className="text-muted-foreground"
                    style={{
                      fontSize: 'var(--text-xs)',
                      marginBottom: 'var(--spacing-2)',
                    }}
                  >
                    {t('themeCustomizer.bundleSize')}
                  </div>
                  <div
                    style={{
                      fontSize: 'var(--text-lg)',
                      lineHeight: 1.2,
                    }}
                  >
                    ~142 KB
                  </div>
                  <div
                    className="text-success flex items-center gap-1"
                    style={{
                      fontSize: 'var(--text-xs)',
                      marginBottom: 'var(--spacing-2)',
                    }}
                  >
                    <CheckCircle2 className="size-3" aria-hidden="true" />
                    {'< 200 KB'}
                  </div>

                  <button
                    onClick={runLighthouse}
                    disabled={lighthouseRunning}
                    className="flex items-center gap-1.5 rounded-md text-primary-foreground w-full justify-center"
                    style={{
                      padding: 'var(--spacing-1) var(--spacing-2)',
                      background: lighthouseRunning ? 'var(--muted-foreground)' : 'var(--primary)',
                      fontSize: 'var(--text-xs)',
                      transition: `all var(--duration-fast) var(--easing-out)`,
                      cursor: lighthouseRunning ? 'not-allowed' : 'pointer',
                      opacity: lighthouseRunning ? 0.5 : 1,
                      outline: '2px solid transparent',
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--ring)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = '2px solid transparent';
                    }}
                    aria-label={t('themeCustomizer.runLighthouse')}
                  >
                    <Gauge className="size-3" aria-hidden="true" />
                    {lighthouseRunning
                      ? t('themeCustomizer.lighthouseRunning')
                      : t('themeCustomizer.runLighthouse')}
                  </button>

                  {lighthouseResult && (
                    <div
                      className="grid grid-cols-2 gap-1"
                      style={{
                        marginTop: 'var(--spacing-2)',
                        fontSize: 'var(--text-xs)',
                      }}
                    >
                      <span className="text-muted-foreground">FCP</span>
                      <span>{lighthouseResult.fcp}</span>
                      <span className="text-muted-foreground">LCP</span>
                      <span>{lighthouseResult.lcp}</span>
                      <span className="text-muted-foreground">CLS</span>
                      <span>{lighthouseResult.cls}</span>
                      <span className="text-muted-foreground">Score</span>
                      <span className="text-success">{lighthouseResult.score}/100</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>

        {/* ═══ 8. GITHUB SETTINGS ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={githubSectionOpen}
            onToggle={() => setGithubSectionOpen(!githubSectionOpen)}
            icon={Github}
            title={t('themeCustomizer.githubSection')}
            desc={t('themeCustomizer.githubSectionDesc')}
            id="github-section"
          />
          {githubSectionOpen && (
            <div
              id="github-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              <label
                htmlFor="github-url-input"
                className="text-muted-foreground block"
                style={{ fontSize: 'var(--text-xs)', marginBottom: 'var(--spacing-2)' }}
              >
                {t('themeCustomizer.githubUrl')}
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Link
                    className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                    aria-hidden="true"
                  />
                  <input
                    id="github-url-input"
                    type="url"
                    value={githubDraft}
                    onChange={(e) => setGithubDraft(e.target.value)}
                    placeholder={t('themeCustomizer.githubUrlPlaceholder')}
                    className="w-full rounded-lg border border-border"
                    style={{
                      padding:
                        'var(--spacing-2) var(--spacing-3) var(--spacing-2) var(--spacing-8)',
                      background: 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: 'var(--text-sm)',
                      outline: 'none',
                      transition: `border-color var(--duration-fast) var(--easing-out)`,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = 'var(--ring)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border)';
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveGithubUrl();
                    }}
                  />
                </div>
                <button
                  onClick={saveGithubUrl}
                  className="rounded-lg flex items-center gap-1"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    background: 'var(--primary)',
                    color: 'var(--primary-foreground)',
                    fontSize: 'var(--text-sm)',
                    transition: `opacity var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '0.9';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('common.save')}
                >
                  <Check className="size-4" aria-hidden="true" />
                  {t('common.save')}
                </button>
                <button
                  onClick={resetGithubUrl}
                  className="rounded-lg flex items-center gap-1"
                  style={{
                    padding: 'var(--spacing-2) var(--spacing-3)',
                    background: 'var(--muted)',
                    color: 'var(--foreground)',
                    fontSize: 'var(--text-sm)',
                    transition: `opacity var(--duration-fast) var(--easing-out)`,
                    outline: '2px solid transparent',
                  }}
                  onFocus={(e) => {
                    e.currentTarget.style.outline = '2px solid var(--ring)';
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.outline = '2px solid transparent';
                  }}
                  aria-label={t('common.reset')}
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  {t('common.reset')}
                </button>
              </div>
              {githubUrl !== 'https://github.com' && (
                <div className="flex items-center gap-2" style={{ marginTop: 'var(--spacing-2)' }}>
                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                    style={{ fontSize: 'var(--text-sm)', outline: '2px solid transparent' }}
                    onFocus={(e) => {
                      e.currentTarget.style.outline = '2px solid var(--ring)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.outline = '2px solid transparent';
                    }}
                  >
                    <ExternalLink className="size-3" aria-hidden="true" />
                    {t('themeCustomizer.openGithub')}
                  </a>
                  <span className="text-muted-foreground" style={{ fontSize: 'var(--text-xs)' }}>
                    {githubUrl}
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* ═══ 9. FONT MANAGEMENT ═══ */}
        <section
          className="rounded-xl border border-border overflow-hidden"
          style={{ background: 'var(--card)', boxShadow: 'var(--shadow-sm)' }}
        >
          <SectionHeader
            open={fontSectionOpen}
            onToggle={() => setFontSectionOpen(!fontSectionOpen)}
            icon={Type}
            title={t('themeCustomizer.fontSection')}
            desc={t('themeCustomizer.fontSectionDesc')}
            id="font-section"
          />
          {fontSectionOpen && (
            <div
              id="font-section"
              className="border-t border-border"
              style={{ padding: 'var(--spacing-4)' }}
            >
              {/* Font upload area */}
              <div
                className="rounded-lg border-2 border-dashed flex flex-col items-center justify-center text-center cursor-pointer"
                style={{
                  padding: 'var(--spacing-4)',
                  borderColor: fontDragOver ? 'var(--primary)' : 'var(--border)',
                  background: fontDragOver ? 'var(--muted)' : 'transparent',
                  transition: `all var(--duration-fast) var(--easing-out)`,
                }}
                onDragOver={(e) => {
                  e.preventDefault();
                  setFontDragOver(true);
                }}
                onDragLeave={() => setFontDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setFontDragOver(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFontFile(file);
                }}
                onClick={() => fontInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') fontInputRef.current?.click();
                }}
                aria-label={t('themeCustomizer.uploadFont')}
              >
                <Upload
                  className="size-6 text-muted-foreground"
                  aria-hidden="true"
                  style={{ marginBottom: 'var(--spacing-2)' }}
                />
                <span style={{ fontSize: 'var(--text-sm)' }}>
                  {t('themeCustomizer.uploadFontDesc')}
                </span>
                <input
                  ref={fontInputRef}
                  type="file"
                  accept=".woff2,.woff,.ttf,.otf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFontFile(file);
                    e.target.value = '';
                  }}
                />
              </div>

              {/* Font list */}
              <div style={{ marginTop: 'var(--spacing-3)' }}>
                {customFonts.length === 0 ? (
                  <p
                    className="text-muted-foreground text-center"
                    style={{ fontSize: 'var(--text-sm)', padding: 'var(--spacing-3)' }}
                  >
                    {t('themeCustomizer.noFonts')}
                  </p>
                ) : (
                  <div className="space-y-2">
                    {customFonts.map((font) => (
                      <div
                        key={font.id}
                        className="flex items-center gap-3 rounded-lg border border-border"
                        style={{ padding: 'var(--spacing-2) var(--spacing-3)' }}
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 'var(--text-sm)' }}>{font.name}</span>
                            {font.isDefault && (
                              <span
                                className="rounded text-primary-foreground"
                                style={{
                                  padding: '0 var(--spacing-1)',
                                  background: 'var(--primary)',
                                  fontSize: '10px',
                                }}
                              >
                                {t('themeCustomizer.currentDefault')}
                              </span>
                            )}
                          </div>
                          <span
                            className="text-muted-foreground"
                            style={{ fontSize: 'var(--text-xs)' }}
                          >
                            {font.fileName}
                          </span>
                          {font.url && (
                            <p
                              style={{
                                fontFamily: `"${font.name}", sans-serif`,
                                fontSize: 'var(--text-sm)',
                                marginTop: 'var(--spacing-1)',
                                color: 'var(--foreground)',
                              }}
                            >
                              {t('themeCustomizer.fontPreviewText')}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0">
                          {!font.isDefault && (
                            <button
                              onClick={() => setDefaultFont(font.id)}
                              className="rounded-md"
                              style={{
                                padding: 'var(--spacing-1) var(--spacing-2)',
                                background: 'var(--muted)',
                                color: 'var(--foreground)',
                                fontSize: 'var(--text-xs)',
                                outline: '2px solid transparent',
                                transition: `all var(--duration-fast) var(--easing-out)`,
                              }}
                              onFocus={(e) => {
                                e.currentTarget.style.outline = '2px solid var(--ring)';
                              }}
                              onBlur={(e) => {
                                e.currentTarget.style.outline = '2px solid transparent';
                              }}
                              aria-label={t('themeCustomizer.applyAsDefault')}
                            >
                              {t('themeCustomizer.applyAsDefault')}
                            </button>
                          )}
                          <button
                            onClick={() => removeFont(font.id)}
                            className="rounded-md text-destructive"
                            style={{
                              padding: 'var(--spacing-1)',
                              background: 'transparent',
                              outline: '2px solid transparent',
                              transition: `all var(--duration-fast) var(--easing-out)`,
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = 'var(--destructive)';
                              e.currentTarget.style.color = 'var(--destructive-foreground)';
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = 'transparent';
                              e.currentTarget.style.color = '';
                            }}
                            onFocus={(e) => {
                              e.currentTarget.style.outline = '2px solid var(--ring)';
                            }}
                            onBlur={(e) => {
                              e.currentTarget.style.outline = '2px solid transparent';
                            }}
                            aria-label={t('themeCustomizer.removeFont')}
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </section>

        {/* ═══ 10. FOOTER ═══ */}
        <footer
          className="rounded-xl border border-border"
          style={{
            padding: 'var(--spacing-4)',
            background: 'var(--card)',
            boxShadow: 'var(--shadow-sm)',
          }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                style={{
                  fontSize: 'var(--text-sm)',
                  transition: `color var(--duration-fast) var(--easing-out)`,
                  outline: '2px solid transparent',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--ring)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = '2px solid transparent';
                }}
                aria-label="GitHub"
              >
                <Github className="size-4" aria-hidden="true" />
                GitHub
              </a>
              <a
                href="#"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                style={{
                  fontSize: 'var(--text-sm)',
                  transition: `color var(--duration-fast) var(--easing-out)`,
                  outline: '2px solid transparent',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--ring)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = '2px solid transparent';
                }}
                aria-label={t('themeCustomizer.documentation')}
              >
                <BookOpen className="size-4" aria-hidden="true" />
                {t('themeCustomizer.documentation')}
              </a>
              <a
                href="#"
                className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
                style={{
                  fontSize: 'var(--text-sm)',
                  transition: `color var(--duration-fast) var(--easing-out)`,
                  outline: '2px solid transparent',
                }}
                onFocus={(e) => {
                  e.currentTarget.style.outline = '2px solid var(--ring)';
                }}
                onBlur={(e) => {
                  e.currentTarget.style.outline = '2px solid transparent';
                }}
                aria-label={t('themeCustomizer.license')}
              >
                <Scale className="size-4" aria-hidden="true" />
                {t('themeCustomizer.license')}
              </a>
            </div>
            <div
              className="flex items-center gap-2 rounded-md"
              style={{
                padding: 'var(--spacing-1) var(--spacing-2)',
                background: 'var(--muted)',
                fontSize: 'var(--text-xs)',
              }}
            >
              <span className="text-muted-foreground">
                YYC<sup>3</sup>
              </span>
              <span
                className="rounded text-primary-foreground"
                style={{
                  padding: '0 var(--spacing-1)',
                  background: 'var(--primary)',
                  fontSize: '10px',
                }}
              >
                {t('themeCustomizer.version')}
              </span>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
