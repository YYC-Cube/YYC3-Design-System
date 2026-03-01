import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import type { DesignTokens } from '../../types/tokens';

export type ThemeStyle = 'future' | 'cyber' | 'business';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  style: ThemeStyle;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  tokens: DesignTokens;
  setStyle: (style: ThemeStyle) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  cycleStyle: () => void;
  setTokens?: (tokens: DesignTokens) => void;
}

const defaultTokens: DesignTokens = {
  color: {
    primary: '#2563eb',
    secondary: '#e0f2fe',
    accent: '#e0f2fe',
    destructive: '#dc2626',
    success: '#16a34a',
    warning: '#d97706',
  },
  background: '#ffffff',
  foreground: '#0f172a',
  radius: '0.5rem',
  shadow: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.07)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
  },
};

const ThemeContext = createContext<ThemeContextType | null>(null);

const defaultThemeContext: ThemeContextType = {
  style: 'future',
  mode: 'dark',
  resolvedMode: 'dark',
  tokens: defaultTokens,
  setStyle: () => {},
  setMode: () => {},
  toggleMode: () => {},
  cycleStyle: () => {},
};

export function useTheme() {
  const ctx = useContext(ThemeContext);
  return ctx ?? defaultThemeContext;
}

function getSystemPreference(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [style, setStyleState] = useState<ThemeStyle>(() => {
    const saved = localStorage.getItem('yyc3-theme-style');
    return (saved as ThemeStyle) || 'future';
  });

  const [mode, setModeState] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('yyc3-theme-mode');
    return (saved as ThemeMode) || 'dark';
  });

  const [systemPref, setSystemPref] = useState<'light' | 'dark'>(getSystemPreference);

  const resolvedMode = mode === 'system' ? systemPref : mode;

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = (e: MediaQueryListEvent) => setSystemPref(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', style);
    root.classList.toggle('dark', resolvedMode === 'dark');
    localStorage.setItem('yyc3-theme-style', style);
    localStorage.setItem('yyc3-theme-mode', mode);
  }, [style, mode, resolvedMode]);

  const setStyle = useCallback((s: ThemeStyle) => setStyleState(s), []);
  const setMode = useCallback((m: ThemeMode) => setModeState(m), []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => {
      if (prev === 'light') return 'dark';
      if (prev === 'dark') return 'light';
      return getSystemPreference() === 'dark' ? 'light' : 'dark';
    });
  }, []);

  const cycleStyle = useCallback(() => {
    setStyleState((prev) => {
      const styles: ThemeStyle[] = ['future', 'cyber', 'business'];
      return styles[(styles.indexOf(prev) + 1) % 3];
    });
  }, []);

  // Keyboard shortcut: Ctrl+Alt+T
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        cycleStyle();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [cycleStyle]);

  return (
    <ThemeContext.Provider
      value={{
        style,
        mode,
        resolvedMode,
        tokens: defaultTokens,
        setStyle,
        setMode,
        toggleMode,
        cycleStyle,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
