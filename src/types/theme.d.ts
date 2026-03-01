// path: src/types/theme.d.ts
/**
 * YYC\u00b3 Design System \u2014 Theme Type Definitions
 */

export type ThemeMode = 'light' | 'dark' | 'system';
export type VisualTheme = 'future' | 'cyber' | 'business';
export type ThemeStyle = VisualTheme;
export type ResolvedMode = 'light' | 'dark';

export interface ThemeContextValue {
  /** Current visual theme style */
  style: VisualTheme;
  /** Current mode preference (light/dark/system) */
  mode: ThemeMode;
  /** Resolved mode after system preference evaluation */
  resolvedMode: ResolvedMode;
  /** Set the visual theme style */
  setStyle: (style: VisualTheme) => void;
  /** Set the mode preference */
  setMode: (mode: ThemeMode) => void;
  /** Toggle between light and dark */
  toggleMode: () => void;
  /** Cycle through visual themes: future \u2192 cyber \u2192 business */
  cycleStyle: () => void;
}

/**
 * Theme CSS Custom Properties mapping.
 * All components reference these via `var(--property-name)`.
 *
 * Driven by `data-theme` attribute + `.dark` class on `<html>`.
 * Keyboard shortcut: Ctrl+Alt+T cycles themes.
 * System preference: `prefers-color-scheme` auto-detected.
 */
export interface ThemeCSSProperties {
  '--primary': string;
  '--primary-foreground': string;
  '--primary-highlight': string;
  '--secondary': string;
  '--secondary-foreground': string;
  '--background': string;
  '--foreground': string;
  '--card': string;
  '--card-foreground': string;
  '--muted': string;
  '--muted-foreground': string;
  '--border': string;
  '--ring': string;
  '--destructive': string;
  '--destructive-foreground': string;
  '--success': string;
  '--success-foreground': string;
  '--warning': string;
  '--warning-foreground': string;
}
