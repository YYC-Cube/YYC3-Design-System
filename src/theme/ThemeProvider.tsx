import { createContext, useContext, useMemo, useState, useEffect, ReactNode, useCallback } from 'react';
import tokens from '../../dist/js/theme.js';
import darkTokens from '../../dist/js/theme.dark.js';
import { ThemeContextValue, DesignTokens } from '../../types/tokens';
import {
  getStoredTheme,
  setStoredTheme,
  initThemePersistence,
} from '../utils/theme-persistence';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initial?: 'light' | 'dark';
}

export function ThemeProvider({ children, initial }: ThemeProviderProps) {
  const [mode, setModeState] = useState<'light' | 'dark'>(() => {
    if (initial) return initial;
    const stored = getStoredTheme();
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [themeTokens, setThemeTokens] = useState<DesignTokens>(() => {
    const initialMode = initial || getStoredTheme();
    return initialMode === 'dark' ? darkTokens : tokens;
  });

  const setMode = useCallback((newMode: 'light' | 'dark') => {
    setModeState(newMode);
    setThemeTokens(newMode === 'dark' ? darkTokens : tokens);
    setStoredTheme(newMode);
  }, []);

  const setTokens = useCallback((patch: Partial<DesignTokens>) => {
    setThemeTokens(prev => ({ ...prev, ...patch } as DesignTokens));
  }, []);

  useEffect(() => {
    const cleanup = initThemePersistence();
    
    return cleanup;
  }, []);

  const value = useMemo<ThemeContextValue>(() => ({
    tokens: themeTokens,
    setTokens,
    mode,
    setMode,
  }), [themeTokens, mode, setTokens, setMode]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
