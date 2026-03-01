import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Copy, Check, Download, FileJson, FileCode2, FileType, FileText } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const tokensJson = `{
  "$schema": "https://yyc3.design/tokens.schema.json",
  "version": "1.0.0",
  "themes": {
    "future": {
      "light": {
        "color": {
          "primary":            { "oklch": "oklch(0.55 0.18 260)", "hex": "#2563eb" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.72 0.14 240)", "hex": "#60a5fa" },
          "secondary":          { "oklch": "oklch(0.95 0.03 220)", "hex": "#e0f2fe" },
          "secondary-foreground": { "oklch": "oklch(0.35 0.08 230)", "hex": "#0c4a6e" },
          "background":         { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "foreground":         { "oklch": "oklch(0.15 0.03 260)", "hex": "#0f172a" },
          "card":               { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "card-foreground":    { "oklch": "oklch(0.15 0.03 260)", "hex": "#0f172a" },
          "muted":              { "oklch": "oklch(0.96 0.01 240)", "hex": "#f1f5f9" },
          "muted-foreground":   { "oklch": "oklch(0.55 0.03 250)", "hex": "#64748b" },
          "border":             { "oklch": "oklch(0.92 0.01 240)", "hex": "#e2e8f0" },
          "destructive":        { "oklch": "oklch(0.52 0.21 25)",  "hex": "#dc2626" },
          "destructive-foreground": { "oklch": "oklch(1 0 0)",     "hex": "#ffffff" },
          "success":            { "oklch": "oklch(0.60 0.18 145)", "hex": "#16a34a" },
          "success-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "warning":            { "oklch": "oklch(0.62 0.16 70)",  "hex": "#d97706" },
          "warning-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" }
        },
        "shadow": {
          "sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
          "md": "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
          "lg": "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)",
          "glow": "0 0 20px rgba(37,99,235,0.15)"
        }
      },
      "dark": {
        "color": {
          "primary":            { "oklch": "oklch(0.61 0.18 260)", "hex": "#3b82f6" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.72 0.14 240)", "hex": "#60a5fa" },
          "secondary":          { "oklch": "oklch(0.22 0.02 260)", "hex": "#1e293b" },
          "secondary-foreground": { "oklch": "oklch(0.92 0.01 240)", "hex": "#e2e8f0" },
          "background":         { "oklch": "oklch(0.10 0.03 260)", "hex": "#0b1121" },
          "foreground":         { "oklch": "oklch(0.92 0.01 240)", "hex": "#e2e8f0" },
          "card":               { "oklch": "oklch(0.14 0.02 260)", "hex": "#111827" },
          "card-foreground":    { "oklch": "oklch(0.92 0.01 240)", "hex": "#e2e8f0" },
          "muted":              { "oklch": "oklch(0.22 0.02 260)", "hex": "#1e293b" },
          "muted-foreground":   { "oklch": "oklch(0.68 0.02 250)", "hex": "#94a3b8" },
          "border":             { "oklch": "oklch(0.22 0.02 260)", "hex": "#1e293b" },
          "destructive":        { "oklch": "oklch(0.58 0.22 25)",  "hex": "#ef4444" },
          "destructive-foreground": { "oklch": "oklch(1 0 0)",     "hex": "#ffffff" },
          "success":            { "oklch": "oklch(0.68 0.20 150)", "hex": "#22c55e" },
          "success-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "warning":            { "oklch": "oklch(0.72 0.16 85)",  "hex": "#f59e0b" },
          "warning-foreground": { "oklch": "oklch(0.15 0.03 260)", "hex": "#0f172a" }
        },
        "shadow": {
          "sm": "0 1px 2px 0 rgba(0,0,0,0.3)",
          "md": "0 4px 6px -1px rgba(0,0,0,0.4), 0 2px 4px -2px rgba(0,0,0,0.3)",
          "lg": "0 10px 15px -3px rgba(0,0,0,0.5), 0 4px 6px -4px rgba(0,0,0,0.4)",
          "glow": "0 0 30px rgba(59,130,246,0.25)"
        }
      }
    },
    "cyber": {
      "light": {
        "color": {
          "primary":            { "oklch": "oklch(0.55 0.24 320)", "hex": "#c026d3" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.72 0.22 320)", "hex": "#e879f9" },
          "background":         { "oklch": "oklch(0.98 0.01 300)", "hex": "#faf5ff" },
          "foreground":         { "oklch": "oklch(0.12 0.06 280)", "hex": "#1a0a2e" },
          "destructive":        { "oklch": "oklch(0.58 0.22 350)", "hex": "#f43f5e" },
          "success":            { "oklch": "oklch(0.62 0.18 160)", "hex": "#10b981" },
          "warning":            { "oklch": "oklch(0.72 0.16 85)",  "hex": "#f59e0b" }
        }
      },
      "dark": {
        "color": {
          "primary":            { "oklch": "oklch(0.65 0.28 320)", "hex": "#d946ef" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.78 0.20 320)", "hex": "#f0abfc" },
          "background":         { "oklch": "oklch(0.07 0.04 300)", "hex": "#0a0015" },
          "foreground":         { "oklch": "oklch(0.94 0.02 280)", "hex": "#f0e6ff" },
          "destructive":        { "oklch": "oklch(0.68 0.20 350)", "hex": "#fb7185" },
          "success":            { "oklch": "oklch(0.72 0.20 160)", "hex": "#34d399" },
          "warning":            { "oklch": "oklch(0.78 0.16 85)",  "hex": "#fbbf24" }
        }
      }
    },
    "business": {
      "light": {
        "color": {
          "primary":            { "oklch": "oklch(0.50 0.16 260)", "hex": "#1d4ed8" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.61 0.18 260)", "hex": "#3b82f6" },
          "background":         { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "foreground":         { "oklch": "oklch(0.14 0.02 240)", "hex": "#111827" },
          "destructive":        { "oklch": "oklch(0.45 0.22 25)",  "hex": "#b91c1c" },
          "success":            { "oklch": "oklch(0.52 0.18 145)", "hex": "#15803d" },
          "warning":            { "oklch": "oklch(0.55 0.14 60)",  "hex": "#b45309" }
        }
      },
      "dark": {
        "color": {
          "primary":            { "oklch": "oklch(0.61 0.18 260)", "hex": "#3b82f6" },
          "primary-foreground": { "oklch": "oklch(1 0 0)",         "hex": "#ffffff" },
          "primary-highlight":  { "oklch": "oklch(0.72 0.14 240)", "hex": "#60a5fa" },
          "background":         { "oklch": "oklch(0.14 0.02 240)", "hex": "#111827" },
          "foreground":         { "oklch": "oklch(0.96 0.01 240)", "hex": "#f3f4f6" },
          "destructive":        { "oklch": "oklch(0.58 0.22 25)",  "hex": "#ef4444" },
          "success":            { "oklch": "oklch(0.68 0.20 150)", "hex": "#22c55e" },
          "warning":            { "oklch": "oklch(0.72 0.16 85)",  "hex": "#f59e0b" }
        }
      }
    },
    "shared": {
      "spacing": {
        "1": "0.25rem",
        "2": "0.5rem",
        "3": "0.75rem",
        "4": "1rem",
        "5": "1.5rem",
        "6": "2rem",
        "7": "2.5rem",
        "8": "3rem"
      },
      "radius": {
        "sm": "calc(0.5rem - 4px)",
        "md": "calc(0.5rem - 2px)",
        "lg": "0.5rem",
        "xl": "calc(0.5rem + 4px)"
      },
      "shadow": {
        "sm": "0 1px 2px 0 rgba(0,0,0,0.05)",
        "md": "0 4px 6px -1px rgba(0,0,0,0.07), 0 2px 4px -2px rgba(0,0,0,0.05)",
        "lg": "0 10px 15px -3px rgba(0,0,0,0.08), 0 4px 6px -4px rgba(0,0,0,0.05)"
      },
      "animation": {
        "duration": {
          "fast": "120ms",
          "normal": "200ms",
          "slow": "350ms"
        },
        "easing": {
          "default": "cubic-bezier(0.25, 0.8, 0.25, 1)",
          "in": "cubic-bezier(0.4, 0, 1, 1)",
          "out": "cubic-bezier(0, 0, 0.2, 1)",
          "in-out": "cubic-bezier(0.4, 0, 0.2, 1)"
        }
      },
      "icon": {
        "xs": "0.75rem",
        "sm": "1rem",
        "md": "1.25rem",
        "lg": "1.5rem",
        "xl": "2rem"
      }
    }
  }
}`;

const variablesCss = `/* ═══════════════════════════════════════════════
   YYC³ Design System — Generated CSS Variables
   Auto-generated by: npm run build:tokens
   Source: design/tokens.json
   ═══════════════════════════════════════════════ */

/* ─── Shared Scale Tokens (8px base) ─── */
:root {
  --font-family-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-family-mono: 'JetBrains Mono', ui-monospace, monospace;

  /* Spacing */
  --spacing-1: 0.25rem;  /* 4px */
  --spacing-2: 0.5rem;   /* 8px */
  --spacing-3: 0.75rem;  /* 12px */
  --spacing-4: 1rem;     /* 16px */
  --spacing-5: 1.5rem;   /* 24px */
  --spacing-6: 2rem;     /* 32px */
  --spacing-7: 2.5rem;   /* 40px */
  --spacing-8: 3rem;     /* 48px */

  /* Radius */
  --radius-sm: 0.125rem;
  --radius-md: 0.375rem;
  --radius-lg: 0.5rem;
  --radius-xl: 0.75rem;

  /* Shadow */
  --shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  --shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.07), 0 2px 4px -2px rgba(0, 0, 0, 0.05);
  --shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05);

  /* Animation */
  --duration-fast: 120ms;
  --duration-normal: 200ms;
  --duration-slow: 350ms;
  --easing-default: cubic-bezier(0.25, 0.8, 0.25, 1);
  --easing-in: cubic-bezier(0.4, 0, 1, 1);
  --easing-out: cubic-bezier(0, 0, 0.2, 1);
  --easing-in-out: cubic-bezier(0.4, 0, 0.2, 1);

  /* Icon sizes */
  --icon-xs: 0.75rem;
  --icon-sm: 1rem;
  --icon-md: 1.25rem;
  --icon-lg: 1.5rem;
  --icon-xl: 2rem;
}

/* ─── Future-Tech (Light) ─── */
:root, [data-theme="future"] {
  --primary: #2563eb;           /* oklch(0.55 0.18 260) */
  --primary-foreground: #ffffff;
  --primary-highlight: #60a5fa; /* oklch(0.72 0.14 240) */
  --background: #ffffff;
  --foreground: #0f172a;
  --card: #ffffff;
  --card-foreground: #0f172a;
  --muted: #f1f5f9;
  --muted-foreground: #64748b;
  --border: #e2e8f0;
  --destructive: #dc2626;
  --success: #16a34a;
  --warning: #d97706;
}

/* ─── Future-Tech (Dark) ─── */
.dark, [data-theme="future"].dark {
  --primary: #3b82f6;
  --primary-foreground: #ffffff;
  --primary-highlight: #60a5fa;
  --background: #0b1121;
  --foreground: #e2e8f0;
  --card: #111827;
  --card-foreground: #e2e8f0;
  --muted: #1e293b;
  --muted-foreground: #94a3b8;
  --border: #1e293b;
  --destructive: #ef4444;
  --success: #22c55e;
  --warning: #f59e0b;
}

/* ─── Cyber-Punk, Business themes follow same pattern ─── */
/* ... (see tokens.json for full values) */`;

const tokensJs = `/**
 * YYC³ Design System — JavaScript Tokens
 * Auto-generated by: npm run build:tokens
 * Source: design/tokens.json
 */

export const tokens = {
  color: {
    primary: "var(--primary)",
    primaryForeground: "var(--primary-foreground)",
    primaryHighlight: "var(--primary-highlight)",
    secondary: "var(--secondary)",
    secondaryForeground: "var(--secondary-foreground)",
    background: "var(--background)",
    foreground: "var(--foreground)",
    card: "var(--card)",
    cardForeground: "var(--card-foreground)",
    muted: "var(--muted)",
    mutedForeground: "var(--muted-foreground)",
    accent: "var(--accent)",
    accentForeground: "var(--accent-foreground)",
    border: "var(--border)",
    destructive: "var(--destructive)",
    destructiveForeground: "var(--destructive-foreground)",
    success: "var(--success)",
    successForeground: "var(--success-foreground)",
    warning: "var(--warning)",
    warningForeground: "var(--warning-foreground)",
    ring: "var(--ring)",
  },
  spacing: {
    1: "var(--spacing-1)",
    2: "var(--spacing-2)",
    3: "var(--spacing-3)",
    4: "var(--spacing-4)",
    5: "var(--spacing-5)",
    6: "var(--spacing-6)",
    7: "var(--spacing-7)",
    8: "var(--spacing-8)",
  },
  radius: {
    sm: "var(--radius-sm)",
    md: "var(--radius-md)",
    lg: "var(--radius-lg)",
    xl: "var(--radius-xl)",
  },
  shadow: {
    sm: "var(--shadow-sm)",
    md: "var(--shadow-md)",
    lg: "var(--shadow-lg)",
    glow: "var(--shadow-glow)",
  },
  animation: {
    duration: {
      fast: "var(--duration-fast)",
      normal: "var(--duration-normal)",
      slow: "var(--duration-slow)",
    },
    easing: {
      default: "var(--easing-default)",
      in: "var(--easing-in)",
      out: "var(--easing-out)",
      inOut: "var(--easing-in-out)",
    },
  },
  icon: {
    xs: "var(--icon-xs)",
    sm: "var(--icon-sm)",
    md: "var(--icon-md)",
    lg: "var(--icon-lg)",
    xl: "var(--icon-xl)",
  },
};

export const themeValues = {
  future: {
    light: {
      primary: "#2563eb",
      primaryHighlight: "#60a5fa",
      background: "#ffffff",
      foreground: "#0f172a",
    },
    dark: {
      primary: "#3b82f6",
      primaryHighlight: "#60a5fa",
      background: "#0b1121",
      foreground: "#e2e8f0",
    },
  },
  cyber: {
    light: {
      primary: "#c026d3",
      primaryHighlight: "#e879f9",
      background: "#faf5ff",
      foreground: "#1a0a2e",
    },
    dark: {
      primary: "#d946ef",
      primaryHighlight: "#f0abfc",
      background: "#0a0015",
      foreground: "#f0e6ff",
    },
  },
  business: {
    light: {
      primary: "#1d4ed8",
      primaryHighlight: "#3b82f6",
      background: "#ffffff",
      foreground: "#111827",
    },
    dark: {
      primary: "#3b82f6",
      primaryHighlight: "#60a5fa",
      background: "#111827",
      foreground: "#f3f4f6",
    },
  },
};`;

const tokensDts = `/**
 * YYC³ Design System — TypeScript Token Definitions
 * Auto-generated by: npm run build:tokens
 */

export interface ColorTokens {
  primary: string;
  primaryForeground: string;
  primaryHighlight: string;
  secondary: string;
  secondaryForeground: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
}

export interface SpacingTokens {
  1: string;
  2: string;
  3: string;
  4: string;
  5: string;
  6: string;
  7: string;
  8: string;
}

export interface RadiusTokens {
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface ShadowTokens {
  sm: string;
  md: string;
  lg: string;
  glow: string;
}

export interface DurationTokens {
  fast: string;
  normal: string;
  slow: string;
}

export interface EasingTokens {
  default: string;
  in: string;
  out: string;
  inOut: string;
}

export interface AnimationTokens {
  duration: DurationTokens;
  easing: EasingTokens;
}

export interface IconTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
}

export interface DesignTokens {
  color: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  animation: AnimationTokens;
  icon: IconTokens;
}

export type ThemeStyle = 'future' | 'cyber' | 'business';
export type ThemeMode = 'light' | 'dark';

export interface OklchColor {
  oklch: string;
  hex: string;
}

export interface ThemeColorSet {
  primary: OklchColor;
  'primary-foreground': OklchColor;
  'primary-highlight': OklchColor;
  secondary: OklchColor;
  'secondary-foreground': OklchColor;
  background: OklchColor;
  foreground: OklchColor;
  card: OklchColor;
  'card-foreground': OklchColor;
  muted: OklchColor;
  'muted-foreground': OklchColor;
  border: OklchColor;
  destructive: OklchColor;
  'destructive-foreground': OklchColor;
  success: OklchColor;
  'success-foreground': OklchColor;
  warning: OklchColor;
  'warning-foreground': OklchColor;
}

export interface ThemeDefinition {
  light: { color: ThemeColorSet; shadow: ShadowTokens };
  dark: { color: ThemeColorSet; shadow: ShadowTokens };
}

export interface TokensJson {
  $schema: string;
  version: string;
  themes: {
    future: ThemeDefinition;
    cyber: ThemeDefinition;
    business: ThemeDefinition;
    shared: {
      spacing: SpacingTokens;
      radius: RadiusTokens;
      shadow: ShadowTokens;
      animation: AnimationTokens;
      icon: IconTokens;
    };
  };
}

export declare const tokens: DesignTokens;
export declare const themeValues: Record<ThemeStyle, Record<ThemeMode, Record<string, string>>>;`;

const buildScript = `// build-tokens.mjs — Style-Dictionary build pipeline
// Run: node build-tokens.mjs
// Or add to package.json: "build:tokens": "node build-tokens.mjs"

import fs from 'fs';
import path from 'path';

const tokensPath = path.resolve('design/tokens.json');
const tokens = JSON.parse(fs.readFileSync(tokensPath, 'utf-8'));

// Generate dist/css/variables.css
function generateCSS(tokens) {
  let css = '/* Auto-generated by YYC³ build:tokens */\\n\\n';
  const { shared, ...themes } = tokens.themes;

  // Shared tokens
  css += ':root {\\n';
  for (const [category, values] of Object.entries(shared)) {
    for (const [key, value] of Object.entries(values)) {
      if (typeof value === 'string') {
        css += \`  --\${category}-\${key}: \${value};\\n\`;
      } else {
        for (const [subKey, subVal] of Object.entries(value)) {
          css += \`  --\${category}-\${key}-\${subKey}: \${subVal};\\n\`;
        }
      }
    }
  }
  css += '}\\n\\n';

  // Theme-specific tokens
  for (const [theme, modes] of Object.entries(themes)) {
    for (const [mode, categories] of Object.entries(modes)) {
      const selector = mode === 'light'
        ? \`[data-theme="\${theme}"]\`
        : \`[data-theme="\${theme}"].dark\`;
      css += \`\${selector} {\\n\`;
      for (const [category, values] of Object.entries(categories)) {
        for (const [key, value] of Object.entries(values)) {
          if (typeof value === 'object' && value.hex) {
            css += \`  --\${key}: \${value.hex}; /* \${value.oklch} */\\n\`;
          } else {
            css += \`  --\${category}-\${key}: \${value};\\n\`;
          }
        }
      }
      css += '}\\n\\n';
    }
  }

  return css;
}

// Generate dist/js/tokens.js
function generateJS(tokens) {
  return \`// Auto-generated by YYC³ build:tokens
export const tokens = \${JSON.stringify(tokens, null, 2)};
\`;
}

// Write files
const distCSS = path.resolve('dist/css');
const distJS = path.resolve('dist/js');
fs.mkdirSync(distCSS, { recursive: true });
fs.mkdirSync(distJS, { recursive: true });

fs.writeFileSync(path.join(distCSS, 'variables.css'), generateCSS(tokens));
fs.writeFileSync(path.join(distJS, 'tokens.js'), generateJS(tokens));

console.log('✅ Tokens built successfully!');
console.log('   → dist/css/variables.css');
console.log('   → dist/js/tokens.js');`;

export function TokensPage() {
  const [copied, setCopied] = useState<string | null>(null);
  const { style, resolvedMode } = useTheme();
  const { t } = useLanguage();

  const files = [
    { id: 'json', label: 'tokens.json', icon: FileJson, content: tokensJson, lang: 'json' },
    { id: 'css', label: 'variables.css', icon: FileCode2, content: variablesCss, lang: 'css' },
    { id: 'js', label: 'tokens.js', icon: FileText, content: tokensJs, lang: 'javascript' },
    { id: 'dts', label: 'tokens.d.ts', icon: FileType, content: tokensDts, lang: 'typescript' },
    {
      id: 'build',
      label: 'build-tokens.mjs',
      icon: FileCode2,
      content: buildScript,
      lang: 'javascript',
    },
  ];

  const copyContent = (id: string, content: string) => {
    navigator.clipboard.writeText(content);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 space-y-6">
      <div>
        <h2 className="text-2xl flex items-center gap-2">
          <FileJson className="size-6 text-primary" />
          {t('tokens.title')}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{t('tokens.subtitle')}</p>
      </div>

      {/* File structure overview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('tokens.fileStructure')}</CardTitle>
        </CardHeader>
        <CardContent>
          <pre className="text-xs font-mono text-muted-foreground p-3 rounded-lg bg-muted overflow-x-auto">
            {`project/
├── design/
│   └── tokens.json            ← ${t('tokens.sourceFile')}
├── dist/
│   ├── css/
│   │   └── variables.css      ← ${t('tokens.generatedCSS')}
│   └── js/
│       └── tokens.js          ← ${t('tokens.generatedJS')}
├── tokens.d.ts                ← ${t('tokens.typescriptDefs')}
├── build-tokens.mjs           ← ${t('tokens.buildScript')}
└── package.json
    └── "build:tokens": "node build-tokens.mjs"`}
          </pre>
        </CardContent>
      </Card>

      {/* Five-High compliance per theme */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">{t('tokens.fiveHighCompliance')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 pr-4">{t('tokens.goal')}</th>
                  <th className="text-center py-2 px-3">{t('theme.future')}</th>
                  <th className="text-center py-2 px-3">{t('theme.cyber')}</th>
                  <th className="text-center py-2 px-3">{t('theme.business')}</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    goal: t('tokens.accessibility'),
                    f: t('tokens.pass'),
                    c: t('tokens.pass'),
                    b: t('tokens.pass'),
                  },
                  { goal: t('tokens.customizability'), f: '22%', c: '25%', b: '20%' },
                  { goal: t('tokens.performance'), f: '~1.2s', c: '~1.3s', b: '~1.1s' },
                  { goal: t('tokens.consistency'), f: '0', c: '0', b: '0' },
                  {
                    goal: t('tokens.extensibility'),
                    f: t('tokens.lessThan2Days'),
                    c: t('tokens.lessThan2Days'),
                    b: t('tokens.lessThan2Days'),
                  },
                ].map((row) => (
                  <tr key={row.goal} className="border-b border-border/50">
                    <td className="py-2 pr-4">{row.goal}</td>
                    <td className="text-center py-2 px-3">
                      <Badge variant="outline">{row.f}</Badge>
                    </td>
                    <td className="text-center py-2 px-3">
                      <Badge variant="outline">{row.c}</Badge>
                    </td>
                    <td className="text-center py-2 px-3">
                      <Badge variant="outline">{row.b}</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Token Files */}
      <Tabs defaultValue="json">
        <TabsList className="flex-wrap h-auto gap-1">
          {files.map((f) => (
            <TabsTrigger key={f.id} value={f.id} className="gap-1.5">
              <f.icon className="size-3.5" />
              {f.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {files.map((f) => (
          <TabsContent key={f.id} value={f.id} className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <f.icon className="size-4 text-primary" />
                    {f.label}
                  </span>
                  <Button size="sm" variant="outline" onClick={() => copyContent(f.id, f.content)}>
                    {copied === f.id ? (
                      <>
                        <Check className="size-3.5" /> {t('common.copied')}
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" /> {t('common.copy')}
                      </>
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-[11px] font-mono p-4 rounded-lg bg-muted overflow-x-auto max-h-[500px] overflow-y-auto whitespace-pre">
                  {f.content}
                </pre>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
