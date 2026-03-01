// path: src/types/tokens.d.ts
/**
 * YYC\u00b3 Design System \u2014 Design Token Type Definitions
 * Covers all token categories: color, spacing, radius, shadow, animation, icon
 */

export interface OklchColor {
  oklch: string; // e.g. "oklch(0.55 0.18 260)"
  hex: string; // fallback, e.g. "#2563eb"
}

export interface ColorToken {
  oklch: string;
  hex: string;
  foreground?: string;
}

export interface ColorTokens {
  primary: string;
  'primary-foreground': string;
  'primary-highlight': string;
  secondary: string;
  'secondary-foreground': string;
  background: string;
  foreground: string;
  card: string;
  'card-foreground': string;
  popover: string;
  'popover-foreground': string;
  muted: string;
  'muted-foreground': string;
  accent: string;
  'accent-foreground': string;
  border: string;
  input: string;
  ring: string;
  destructive: string;
  'destructive-foreground': string;
  success: string;
  'success-foreground': string;
  warning: string;
  'warning-foreground': string;
}

export interface SpacingTokens {
  1: string; // 0.25rem = 4px
  2: string; // 0.5rem  = 8px
  3: string; // 0.75rem = 12px
  4: string; // 1rem    = 16px
  5: string; // 1.5rem  = 24px
  6: string; // 2rem    = 32px
  7: string; // 2.5rem  = 40px
  8: string; // 3rem    = 48px
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

export interface ShadowValue {
  offsetX: number;
  offsetY: number;
  blur: number;
  spread: number;
  color: string;
}

export interface TypographyTokens {
  'font-sans': string;
  'font-mono': string;
}

export interface DurationTokens {
  fast: string; // 120ms
  normal: string; // 200ms
  slow: string; // 350ms
}

export interface EasingTokens {
  default: string; // cubic-bezier(0.25, 0.8, 0.25, 1)
  in: string; // cubic-bezier(0.4, 0, 1, 1)
  out: string; // cubic-bezier(0, 0, 0.2, 1)
  'in-out': string; // cubic-bezier(0.4, 0, 0.2, 1)
}

export interface AnimationTokens {
  duration: DurationTokens;
  easing: EasingTokens;
}

export interface IconTokens {
  xs: string; // 0.75rem
  sm: string; // 1rem
  md: string; // 1.25rem
  lg: string; // 1.5rem
  xl: string; // 2rem
}

export interface DesignTokens {
  color: ColorTokens;
  spacing: SpacingTokens;
  radius: RadiusTokens;
  shadow: ShadowTokens;
  animation: AnimationTokens;
  icon: IconTokens;
  typography: TypographyTokens;
}

export interface ThemeColorSet {
  primary: OklchColor;
  'primary-foreground': OklchColor;
  'primary-highlight': OklchColor;
  secondary?: OklchColor;
  'secondary-foreground'?: OklchColor;
  background: OklchColor;
  foreground: OklchColor;
  card?: OklchColor;
  'card-foreground'?: OklchColor;
  muted?: OklchColor;
  'muted-foreground'?: OklchColor;
  border?: OklchColor;
  destructive: OklchColor;
  'destructive-foreground'?: OklchColor;
  success: OklchColor;
  'success-foreground'?: OklchColor;
  warning: OklchColor;
  'warning-foreground'?: OklchColor;
}

export interface ThemeDefinition {
  light: { color: ThemeColorSet; shadow?: ShadowTokens };
  dark: { color: ThemeColorSet; shadow?: ShadowTokens };
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
export declare const themeValues: Record<
  'future' | 'cyber' | 'business',
  Record<'light' | 'dark', Record<string, string>>
>;
