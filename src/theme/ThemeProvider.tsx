import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import { ThemeContextValue, DesignTokens } from '../../types/tokens';
import { getStoredTheme, setStoredTheme, initThemePersistence } from '../utils/theme-persistence';

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
  initial?: 'light' | 'dark';
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

export function ThemeProvider({ children, initial }: ThemeProviderProps) {
  const [mode, setModeState] = useState<'light' | 'dark'>(() => {
    if (initial) return initial;
    const stored = getStoredTheme();
    return stored === 'dark' ? 'dark' : 'light';
  });

  const [themeTokens, setThemeTokens] = useState<DesignTokens>(defaultTokens);

  const setMode = useCallback((newMode: 'light' | 'dark') => {
    setModeState(newMode);
    setStoredTheme(newMode);

    document.documentElement.classList.toggle('dark', newMode === 'dark');
  }, []);

  const setTokens = useCallback((patch: Partial<DesignTokens>) => {
    setThemeTokens((prev) => ({ ...prev, ...patch }) as DesignTokens);
  }, []);

  useEffect(() => {
    const cleanup = initThemePersistence();

    document.documentElement.classList.toggle('dark', mode === 'dark');

    return cleanup;
  }, [mode]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      tokens: themeTokens,
      setTokens,
      mode,
      setMode,
    }),
    [themeTokens, mode, setTokens, setMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
