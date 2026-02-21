/**
 * @file 增强的 Token 工具函数
 * @description 提供类型安全的 Token 访问和操作函数
 * @module utils/token-utils
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import type { DesignTokens } from '../../types/tokens';
import React from 'react';
import type {
  ResponsiveValue
} from '../types/advanced-types';

export type TokenPath = string | string[];

export type TokenValue = 
  string | 
  number | 
  boolean | 
  Record<string, unknown> | 
  Array<unknown> | 
  null | 
  undefined;

export type TokenAccessor<T extends object = DesignTokens> = {
  get<K extends keyof T>(key: K): T[K];
  get2<K1 extends keyof T, K2 extends keyof T[K1]>(key1: K1, key2: K2): T[K1][K2];
  get3<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(key1: K1, key2: K2, key3: K3): T[K1][K2][K3];
  get4<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): T[K1][K2][K3][K4];
};

export type TokenValidator = {
  validate(value: unknown, path: TokenPath): value is TokenValue;
  exists(path: TokenPath): boolean;
  isColor(path: TokenPath): boolean;
  isSize(path: TokenPath): boolean;
  isSpacing(path: TokenPath): boolean;
};

export type TokenTransformer = {
  transform(
    value: unknown,
    transformer: (value: unknown) => string
  ): string;
  transformColor(path: TokenPath, format: 'hex' | 'rgb' | 'hsl' | 'oklch'): string;
  transformSize(path: TokenPath, unit: 'px' | 'rem' | 'em'): string;
  transformSpacing(path: TokenPath, unit: 'px' | 'rem' | 'em'): string;
};

export type TokenResponsive = {
  getResponsive(
    path: TokenPath,
    breakpoints: ResponsiveValue<TokenValue>
  ): string;
  createResponsiveStyle(
    property: string,
    path: TokenPath,
    breakpoints: ResponsiveValue<TokenValue>
  ): React.CSSProperties;
};

export type TokenTheme<T extends object = DesignTokens> = {
  getThemeValue(
    path: TokenPath,
    theme: T
  ): TokenValue;
  createTheme(
    base: T,
    overrides: Partial<T>
  ): T;
  mergeThemes(...themes: Partial<T>[]): T;
};

export type TokenCSS = {
  toCSS(path: TokenPath): string;
  createCSSVar(path: TokenPath, prefix?: string): string;
  createCSSProperties(
    paths: TokenPath[],
    prefix?: string
  ): React.CSSProperties;
};

export const getTokenPath = (
  path: TokenPath
): string[] => {
  return Array.isArray(path) ? path : path.split('.');
};

export const getNestedValue = <T extends object = DesignTokens>(
  obj: T,
  path: TokenPath
): TokenValue | undefined => {
  const keys = getTokenPath(path);
  let value: Record<string, unknown> = obj as Record<string, unknown>;
  
  for (const key of keys) {
    if (value && typeof value === 'object' && key in value) {
      value = value[key] as Record<string, unknown>;
    } else {
      return undefined;
    }
  }
  
  return value as TokenValue;
};

export const hasToken = <T extends object = DesignTokens>(
  obj: T,
  path: TokenPath
): boolean => {
  return getNestedValue(obj, path) !== undefined;
};

export const isTokenColor = <T extends object = DesignTokens>(
  obj: T,
  path: TokenPath
): boolean => {
  const value = getNestedValue(obj, path);
  if (typeof value !== 'string') return false;
  
  const colorPatterns = [
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    /^oklch\([^)]+\)$/,
    /^rgb\([^)]+\)$/,
    /^rgba\([^)]+\)$/,
    /^hsl\([^)]+\)$/,
    /^hsla\([^)]+\)$/
  ];
  
  return colorPatterns.some(pattern => pattern.test(value));
};

export const isTokenSize = <T extends object = DesignTokens>(
  obj: T,
  path: TokenPath
): boolean => {
  const value = getNestedValue(obj, path);
  if (typeof value !== 'string') return false;
  
  const sizePatterns = [
    /^\d+px$/,
    /^\d+rem$/,
    /^\d+em$/,
    /^\d+$/,
    /^\d+\.\d+px$/,
    /^\d+\.\d+rem$/,
    /^\d+\.\d+em$/,
    /^\d+\.\d+$/
  ];
  
  return sizePatterns.some(pattern => pattern.test(value));
};

export const isTokenSpacing = <T extends object = DesignTokens>(
  obj: T,
  path: TokenPath
): boolean => {
  const value = getNestedValue(obj, path);
  if (typeof value !== 'string') return false;
  
  const spacingPatterns = [
    /^\d+px$/,
    /^\d+rem$/,
    /^\d+em$/,
    /^\d+\s+\d+$/,
    /^\d+px\s+\d+px$/,
    /^\d+rem\s+\d+rem$/,
    /^\d+em\s+\d+em$/
  ];
  
  return spacingPatterns.some(pattern => pattern.test(value));
};

export const createTokenAccessor = <T extends object = DesignTokens>(
  tokens: T
): TokenAccessor<T> => {
  return {
    get<K extends keyof T>(key: K): T[K] {
      return tokens[key];
    },
    get2<K1 extends keyof T, K2 extends keyof T[K1]>(key1: K1, key2: K2): T[K1][K2] {
      return tokens[key1][key2];
    },
    get3<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(key1: K1, key2: K2, key3: K3): T[K1][K2][K3] {
      return tokens[key1][key2][key3];
    },
    get4<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): T[K1][K2][K3][K4] {
      return tokens[key1][key2][key3][key4];
    }
  };
};

export const createTokenValidator = <T extends object = DesignTokens>(
  tokens: T
): TokenValidator => {
  return {
    validate(value: unknown, path: TokenPath): value is TokenValue {
      const tokenValue = getNestedValue(tokens, path);
      return tokenValue === value;
    },
    exists(path: TokenPath): boolean {
      return hasToken(tokens, path);
    },
    isColor(path: TokenPath): boolean {
      return isTokenColor(tokens, path);
    },
    isSize(path: TokenPath): boolean {
      return isTokenSize(tokens, path);
    },
    isSpacing(path: TokenPath): boolean {
      return isTokenSpacing(tokens, path);
    }
  };
};

export const transformColor = (
  value: string,
  format: 'hex' | 'rgb' | 'hsl' | 'oklch'
): string => {
  if (value.startsWith('#')) {
    if (format === 'hex') return value;
    const hex = value.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    
    if (format === 'rgb') return `rgb(${r}, ${g}, ${b})`;
    if (format === 'hsl') {
      const rNorm = r / 255;
      const gNorm = g / 255;
      const bNorm = b / 255;
      const max = Math.max(rNorm, gNorm, bNorm);
      const min = Math.min(rNorm, gNorm, bNorm);
      let h = 0;
      let s = 0;
      const l = (max + min) / 2;
      
      if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
          case rNorm: h = ((gNorm - bNorm) / d + (gNorm < bNorm ? 6 : 0)) / 6; break;
          case gNorm: h = ((bNorm - rNorm) / d + 2) / 6; break;
          case bNorm: h = ((rNorm - gNorm) / d + 4) / 6; break;
        }
      }
      
      return `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`;
    }
  }
  
  if (value.startsWith('oklch(')) {
    if (format === 'oklch') return value;
    const match = value.match(/oklch\(([\d.]+)%?\s+([\d.]+)\s+([\d.]+)\)/);
    if (match) {
      const l = parseFloat(match[1]);
      const c = parseFloat(match[2]);
      const h = parseFloat(match[3]);
      
      if (format === 'hex' || format === 'rgb' || format === 'hsl') {
        return `oklch(${l}%, ${c}, ${h})`;
      }
    }
  }
  
  return value;
};

export const transformSize = (
  value: string | number,
  unit: 'px' | 'rem' | 'em'
): string => {
  if (typeof value === 'number') {
    return `${value}${unit}`;
  }
  
  if (value.match(/^\d+$/) || value.match(/^\d+\.\d+$/)) {
    return `${value}${unit}`;
  }
  
  const valueMatch = value.match(/^([\d.]+)(px|rem|em)$/);
  if (valueMatch) {
    const numValue = parseFloat(valueMatch[1]);
    const currentUnit = valueMatch[2];
    
    if (currentUnit === unit) return value;
    
    return `${numValue}${unit}`;
  }
  
  return value;
};

export const transformSpacing = (
  value: string,
  unit: 'px' | 'rem' | 'em'
): string => {
  if (value.match(/^\d+$/) || value.match(/^\d+\.\d+$/)) {
    return `${value}${unit}`;
  }
  
  const parts = value.split(/\s+/);
  const transformed = parts.map(part => transformSize(part, unit));
  
  return transformed.join(' ');
};

export const createTokenTransformer = <T extends object = DesignTokens>(
  tokens: T
): TokenTransformer => {
  return {
    transform(value: unknown, transformer: (value: unknown) => string): string {
      return transformer(value);
    },
    transformColor(path: TokenPath, format: 'hex' | 'rgb' | 'hsl' | 'oklch'): string {
      const value = getNestedValue(tokens, path) as string;
      return transformColor(value, format);
    },
    transformSize(path: TokenPath, unit: 'px' | 'rem' | 'em'): string {
      const value = getNestedValue(tokens, path) as string | number;
      return transformSize(value, unit);
    },
    transformSpacing(path: TokenPath, unit: 'px' | 'rem' | 'em'): string {
      const value = getNestedValue(tokens, path) as string;
      return transformSpacing(value, unit);
    }
  };
};

export const createTokenCSS = <T extends object = DesignTokens>(
  tokens: T,
  prefix: string = 'yyc3'
): TokenCSS => {
  const toCSSVar = (path: TokenPath): string => {
    const keys = getTokenPath(path);
    return `--${prefix}-${keys.join('-')}`;
  };
  
  const toCSSValue = (path: TokenPath): string => {
    const value = getNestedValue(tokens, path);
    if (value === undefined) return '';
    return `var(${toCSSVar(path)})`;
  };
  
  return {
    toCSS(path: TokenPath): string {
      return toCSSValue(path);
    },
    createCSSVar(path: TokenPath, customPrefix?: string): string {
      const actualPrefix = customPrefix || prefix;
      const keys = getTokenPath(path);
      return `--${actualPrefix}-${keys.join('-')}`;
    },
    createCSSProperties(
      paths: TokenPath[],
      customPrefix?: string
    ): React.CSSProperties {
      const actualPrefix = customPrefix || prefix;
      const properties: React.CSSProperties = {};
      
      paths.forEach(path => {
        const keys = getTokenPath(path);
        const varName = `--${actualPrefix}-${keys.join('-')}`;
        const value = getNestedValue(tokens, path);
        
        if (value !== undefined) {
          (properties as Record<string, TokenValue>)[varName] = value;
        }
      });
      
      return properties;
    }
  };
};

export const createResponsiveToken = <T extends object = DesignTokens>(
  tokens: T,
  _transformer: TokenTransformer
): TokenResponsive => {
  const getResponsiveValue = (
    path: TokenPath,
    breakpoints: ResponsiveValue<TokenValue>
  ): string => {
    if (typeof breakpoints === 'string' || typeof breakpoints === 'number') {
      return String(breakpoints);
    }
    
    const value = getNestedValue(tokens, path);
    if (value === undefined) return '';
    
    return String(value);
  };
  
  return {
    getResponsive(
      path: TokenPath,
      breakpoints: ResponsiveValue<TokenValue>
    ): string {
      return getResponsiveValue(path, breakpoints);
    },
    createResponsiveStyle(
      property: string,
      path: TokenPath,
      breakpoints: ResponsiveValue<TokenValue>
    ): React.CSSProperties {
      const style: React.CSSProperties = {};
      
      if (typeof breakpoints === 'string' || typeof breakpoints === 'number') {
        (style as Record<string, string>)[property] = getResponsiveValue(path, breakpoints);
      } else if (Array.isArray(breakpoints)) {
        breakpoints.forEach((bp) => {
          if (typeof bp === 'object' && bp !== null) {
            const bpKeys = Object.keys(bp);
            bpKeys.forEach((key) => {
              const k = key as keyof typeof bp;
              if (k in bp) {
                (style as Record<string, string>)[`${property}-${k}`] = getResponsiveValue(path, bp[k] as ResponsiveValue<TokenValue>);
              }
            });
          }
        });
      }
      
      return style;
    }
  };
};

export const createTokenTheme = <T extends object = DesignTokens>(
  tokens: T
): TokenTheme<T> => {
  const getThemeValue = (
    path: TokenPath,
    theme: T
  ): TokenValue => {
    return getNestedValue(theme, path) as TokenValue;
  };
  
  const createTheme = (
    base: T,
    overrides: Partial<T>
  ): T => {
    const mergeDeep = <O extends object>(target: O, source: Partial<O>): O => {
      const result = { ...target } as O;
      
      for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          const targetValue = (result as Record<string, unknown>)[key];
          const sourceValue = (source as Record<string, unknown>)[key];
          
          if (targetValue && typeof targetValue === 'object' && !Array.isArray(targetValue)) {
            (result as Record<string, unknown>)[key] = mergeDeep(targetValue as O, sourceValue as Partial<O>);
          } else {
            (result as Record<string, unknown>)[key] = sourceValue;
          }
        } else {
          (result as Record<string, unknown>)[key] = (source as Record<string, unknown>)[key];
        }
      }
      
      return result;
    };
    
    return mergeDeep(base, overrides);
  };
  
  const mergeThemes = (...themes: Partial<T>[]): T => {
    return themes.reduce((acc, theme) => createTheme(acc as T, theme), tokens) as T;
  };
  
  return {
    getThemeValue,
    createTheme,
    mergeThemes
  };
};

export const useToken = <T extends object = DesignTokens>(
  tokens: T
) => {
  const accessor = createTokenAccessor(tokens);
  const validator = createTokenValidator(tokens);
  const transformer = createTokenTransformer(tokens);
  const css = createTokenCSS(tokens);
  const responsive = createResponsiveToken(tokens, transformer);
  const theme = createTokenTheme(tokens);
  
  return {
    accessor,
    validator,
    transformer,
    css,
    responsive,
    theme,
    get: <V extends TokenValue>(path: TokenPath): V => {
      return getNestedValue(tokens, path) as V;
    },
    has: (path: TokenPath): boolean => {
      return hasToken(tokens, path);
    },
    isColor: (path: TokenPath): boolean => {
      return isTokenColor(tokens, path);
    },
    isSize: (path: TokenPath): boolean => {
      return isTokenSize(tokens, path);
    },
    isSpacing: (path: TokenPath): boolean => {
      return isTokenSpacing(tokens, path);
    }
  };
};

export const createTokenCache = <T extends object = DesignTokens>(
  tokens: T,
  maxSize: number = 100
) => {
  const cache = new Map<string, TokenValue>();
  const keys: string[] = [];
  
  const get = (path: TokenPath): TokenValue | undefined => {
    const key = Array.isArray(path) ? path.join('.') : path;
    if (cache.has(key)) {
      return cache.get(key);
    }
    
    const value = getNestedValue(tokens, path);
    if (value !== undefined) {
      cache.set(key, value);
      keys.push(key);
      
      if (keys.length > maxSize) {
        const oldestKey = keys.shift();
        if (oldestKey) {
          cache.delete(oldestKey);
        }
      }
    }
    
    return value;
  };
  
  const clear = () => {
    cache.clear();
    keys.length = 0;
  };
  
  const size = () => cache.size;
  
  return { get, clear, size };
};

export const createTokenObserver = <T extends object = DesignTokens>(
  tokens: T,
  onChange: (path: TokenPath, oldValue: TokenValue, newValue: TokenValue) => void
): T => {
  const proxy: T = new Proxy(tokens, {
    get(target, property: string) {
      const value = target[property as keyof T];
      
      if (value && typeof value === 'object' && !Array.isArray(value)) {
        return createTokenObserver(value as T, onChange);
      }
      
      return value;
    },
    
    set(target, property: string, newValue: unknown) {
      const oldValue = target[property as keyof T];
      
      if (oldValue !== newValue) {
        target[property as keyof T] = newValue as T[keyof T];
        onChange([property], oldValue as TokenValue, newValue as TokenValue);
      }
      
      return true;
    }
  }) as T;
  
  return proxy;
};

export default {
  getTokenPath,
  getNestedValue,
  hasToken,
  isTokenColor,
  isTokenSize,
  isTokenSpacing,
  createTokenAccessor,
  createTokenValidator,
  createTokenTransformer,
  createTokenCSS,
  createResponsiveToken,
  createTokenTheme,
  useToken,
  createTokenCache,
  createTokenObserver,
  transformColor,
  transformSize,
  transformSpacing
};
