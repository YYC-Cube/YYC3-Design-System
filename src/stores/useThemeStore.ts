/**
 * @file 主题状态Store
 * @description 主题状态管理，包括主题模式、主色调等
 * @module stores/useThemeStore
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ThemeMode = 'light' | 'dark' | 'auto';

export interface ThemeState {
  mode: ThemeMode;
  primaryColor: string;
  borderRadius: number;
  fontSize: number;

  setMode: (mode: ThemeMode) => void;
  setPrimaryColor: (color: string) => void;
  setBorderRadius: (radius: number) => void;
  setFontSize: (size: number) => void;
  resetTheme: () => void;
}

const defaultTheme: Omit<
  ThemeState,
  'setMode' | 'setPrimaryColor' | 'setBorderRadius' | 'setFontSize' | 'resetTheme'
> = {
  mode: 'light',
  primaryColor: '#d45a5f',
  borderRadius: 4,
  fontSize: 14,
};

export const useThemeStore = create<ThemeState>()(
  devtools(
    persist(
      (set) => ({
        ...defaultTheme,

        setMode: (mode) => set({ mode }),
        setPrimaryColor: (color) => set({ primaryColor: color }),
        setBorderRadius: (radius) => set({ borderRadius: radius }),
        setFontSize: (size) => set({ fontSize: size }),
        resetTheme: () => set(defaultTheme),
      }),
      {
        name: 'theme-store',
      }
    ),
    { name: 'ThemeStore' }
  )
);
