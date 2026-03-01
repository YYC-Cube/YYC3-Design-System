/**
 * @file 统一设计令牌类型定义
 * @description 提供严格类型安全的设计令牌定义和深度路径访问支持
 * @module types/tokens-unified
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import type { DesignToken } from 'style-dictionary/types/DesignToken';
import type { ReactNode, ComponentProps, FocusEvent, KeyboardEvent, CSSProperties, ReactElement } from 'react';

export type ColorToken = {
  oklch: string;
  hex: string;
  foreground?: string;
};

export type ShadowToken = {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color_hex: string;
};

export type TypographyTokens = {
  'font-sans': string;
  'font-serif': string;
  'font-mono': string;
};

export type SpacingToken = string | number;

export type BorderToken = string | number;

export type RadiusToken = string | number;

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce';

export type ColorPath =
  | 'primary'
  | 'primary-foreground'
  | 'secondary'
  | 'secondary-foreground'
  | 'destructive'
  | 'destructive-foreground'
  | 'muted'
  | 'muted-foreground'
  | 'accent'
  | 'accent-foreground'
  | 'background'
  | 'foreground'
  | 'card'
  | 'card-foreground'
  | 'popover'
  | 'popover-foreground'
  | 'border'
  | 'input'
  | 'ring';

export type SpacingPath =
  | 'xs'
  | 'sm'
  | 'md'
  | 'lg'
  | 'xl'
  | '2xl'
  | '3xl'
  | '4xl';

export type RadiusPath =
  | 'none'
  | 'sm'
  | 'default'
  | 'md'
  | 'lg'
  | 'full';

export type FontSizePath =
  | 'caption'
  | 'body'
  | 'heading-1'
  | 'heading-2'
  | 'heading-3'
  | 'heading-4';

export type LineHeightPath =
  | 'caption'
  | 'body'
  | 'heading';

export type ShadowPath =
  | 'xs'
  | 'sm'
  | 'default'
  | 'md'
  | 'lg'
  | 'xl';

export type BreakpointPath = 'sm' | 'md' | 'lg' | 'xl';

export type TokenType = 'color' | 'spacing' | 'radius' | 'shadow' | 'typography' | 'border' | 'animation';

export type TokenCategory = TokenType | 'all';

export interface DesignTokens {
  color: Record<ColorPath, string> & {
    [key: string]: string | ColorToken;
  };
  spacing: Record<SpacingPath, SpacingToken> & {
    [key: string]: SpacingToken;
  };
  radius: Record<RadiusPath, RadiusToken> & {
    [key: string]: RadiusToken;
  };
  shadow: Record<ShadowPath, string> & {
    [key: string]: string | ShadowToken;
  };
  typography: {
    'font-sans': string;
    'font-serif': string;
    'font-mono': string;
    'font-size': Record<FontSizePath, string> & {
      [key: string]: string;
    };
    'line-height': Record<LineHeightPath, string> & {
      [key: string]: string;
    };
    'letter-spacing'?: Record<string, string>;
    'font-weight'?: Record<string, string>;
  };
  border: {
    [key: string]: BorderToken;
  };
  breakpoints: Record<BreakpointPath, string> & {
    [key: string]: string;
  };
  [key: string]: string | number | Record<string, unknown> | DesignToken;
}

export type TokenPath<K extends TokenType = TokenType> =
  K extends 'color' ? `color.${ColorPath}`
  : K extends 'spacing' ? `spacing.${SpacingPath}`
  : K extends 'radius' ? `radius.${RadiusPath}`
  : K extends 'shadow' ? `shadow.${ShadowPath}`
  : K extends 'typography' ? `typography.${string}`
  : K extends 'border' ? `border.${string}`
  : K extends 'animation' ? `animation.${string}`
  : `${string}`;

export type TokenValue<T extends TokenPath> =
  T extends `color.${infer _C}` ? string
  : T extends `spacing.${infer _S}` ? SpacingToken
  : T extends `radius.${infer _R}` ? RadiusToken
  : T extends `shadow.${infer _Sh}` ? string
  : T extends `typography.${infer _T}` ? string
  : T extends `border.${infer _B}` ? BorderToken
  : T extends `animation.${infer _A}` ? string
  : unknown;

export type GeneratedColorToken = {
  value: {
    hex: string;
    oklch: string;
    foreground?: string;
  };
  name: string;
};

export interface GeneratedTokens {
  colors: Record<string, GeneratedColorToken>;
  spacing?: Record<string, string | number>;
  typography?: Record<string, string | number>;
  [key: string]: unknown;
}

export type Theme = {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
};

export interface ThemeContextValue {
  tokens: DesignTokens;
  setTokens: (patch: Partial<DesignTokens>) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends Omit<ComponentProps<'button'>, 'size'> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface InputProps extends Omit<ComponentProps<'input'>, 'size' | 'onChange'> {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'search';
  size?: 'default' | 'sm' | 'lg';
  label?: string;
  placeholder?: string;
  value?: string | number;
  defaultValue?: string | number;
  onChange?: (value: string) => void;
  onBlur?: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  required?: boolean;
  disabled?: boolean;
  error?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export interface CardProps {
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  'data-testid'?: string;
}

export interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  fallback?: string;
  className?: string;
  'data-testid'?: string;
}

export interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  children?: ReactNode;
  className?: string;
}

export interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  children?: ReactNode;
  className?: string;
}

export interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}

export interface ProgressProps {
  value?: number;
  max?: number;
  className?: string;
}

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  children: ReactNode;
  className?: string;
}

export interface TabsProps {
  defaultValue?: string;
  children: ReactNode;
  className?: string;
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: ReactNode;
  className?: string;
}

export interface TooltipProps {
  content: ReactNode;
  children: ReactElement;
  placement?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}

export interface DividerProps {
  orientation?: 'horizontal' | 'vertical';
  variant?: 'solid' | 'dashed';
  className?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export interface TokenAccessor<T extends DesignTokens = DesignTokens> {
  get<K extends keyof T>(key: K): T[K];
  get2<K1 extends keyof T, K2 extends keyof T[K1]>(key1: K1, key2: K2): T[K1][K2];
  get3<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]>(key1: K1, key2: K2, key3: K3): T[K1][K2][K3];
  get4<K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2], K4 extends keyof T[K1][K2][K3]>(key1: K1, key2: K2, key3: K3, key4: K4): T[K1][K2][K3][K4];
  getPath<P extends TokenPath>(path: P): TokenValue<P>;
}

export type ResponsiveValue<T> = T | {
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
};

export type ThemeValue<T> = T | ((theme: DesignTokens) => T);

export interface ColorProps {
  color?: string;
  backgroundColor?: string;
  borderColor?: string;
}

export interface SpacingProps {
  margin?: SpacingToken | ResponsiveValue<SpacingToken>;
  padding?: SpacingToken | ResponsiveValue<SpacingToken>;
  gap?: SpacingToken | ResponsiveValue<SpacingToken>;
}

export interface LayoutProps {
  width?: string | number | ResponsiveValue<string | number>;
  height?: string | number | ResponsiveValue<string | number>;
  display?: string;
  flex?: string;
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
}

export interface TypographyProps {
  fontSize?: string | number | ResponsiveValue<string | number>;
  fontWeight?: string | number;
  lineHeight?: string | number;
  letterSpacing?: string | number;
  textAlign?: string;
}
