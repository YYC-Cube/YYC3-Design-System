/**
 * @file YYC³ 主题系统Context
 * @description 三主题系统：future | cyber | business，支持 light + dark + system 模式
 * @module theme
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

export type ThemeStyle = 'future' | 'cyber' | 'business';
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  style: ThemeStyle;
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setStyle: (style: ThemeStyle) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  cycleStyle: () => void;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

const defaultThemeContext: ThemeContextType = {
  style: 'future',
  mode: 'dark',
  resolvedMode: 'dark',
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
      value={{ style, mode, resolvedMode, setStyle, setMode, toggleMode, cycleStyle }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
