// path: src/types/components.d.ts
/**
 * YYC\u00b3 Design System \u2014 Component Props Type Definitions
 * Unified Props interfaces for all 26+ components.
 */
import React from 'react';

// ─── Polymorphic Base ───
export type PolymorphicRef<C extends React.ElementType> = React.ComponentPropsWithRef<C>['ref'];

export type PolymorphicProps<C extends React.ElementType, Props = {}> = Props &
  Omit<React.ComponentPropsWithoutRef<C>, keyof Props> & {
    as?: C;
  };

// ─── Button ───
export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
}

// ─── Input ───
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

// ─── Textarea ───
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

// ─── Card ───
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {}
export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}
export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}
export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

// ─── Badge ───
export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';
export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: BadgeVariant;
}

// ─── Avatar ───
export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {}
export interface AvatarImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {}
export interface AvatarFallbackProps extends React.HTMLAttributes<HTMLSpanElement> {}

// ─── Alert ───
export type AlertVariant = 'default' | 'destructive';
export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
}

// ─── Progress ───
export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
}

// ─── Switch ───
export interface SwitchProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

// ─── Slider ───
export interface SliderProps {
  value?: number[];
  onValueChange?: (value: number[]) => void;
  min?: number;
  max?: number;
  step?: number;
  disabled?: boolean;
  'aria-label'?: string;
}

// ─── Select ───
export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  disabled?: boolean;
  children?: React.ReactNode;
}

// ─── Checkbox ───
export interface CheckboxProps {
  checked?: boolean;
  onCheckedChange?: (checked: boolean | 'indeterminate') => void;
  disabled?: boolean;
  id?: string;
  'aria-label'?: string;
}

// ─── Tabs ───
export interface TabsProps {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}

// ─── Dialog / Modal ───
export interface DialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children?: React.ReactNode;
}

// ─── Tooltip ───
export interface TooltipProps {
  children?: React.ReactNode;
  delayDuration?: number;
}

// ─── ThemeToggle ───
export interface ThemeToggleProps {
  className?: string;
}

// ─── LanguageToggle ───
export interface LanguageToggleProps {
  className?: string;
}

// ─── Animated (Motion wrapper) ───
export interface AnimatedProps extends React.HTMLAttributes<HTMLDivElement> {
  animation?: 'fadeIn' | 'fadeInUp' | 'pulse' | 'neonPulse' | 'glitch';
  duration?: string; // e.g. "var(--duration-fast)"
  easing?: string; // e.g. "var(--easing-default)"
  delay?: number;
  repeat?: boolean;
}

// ─── Custom Token Manager ───
export interface CustomTokenManagerProps {
  className?: string;
}

export interface TokenEntry {
  id: string;
  key: string;
  type: 'color' | 'spacing' | 'radius' | 'shadow' | 'animation' | 'other';
  value: string;
  fallbackHex?: string;
}

export interface HistoryEntry {
  id: string;
  timestamp: string;
  author: string;
  summary: string;
  added: number;
  modified: number;
  deleted: number;
}

// ─── Storybook Isolation Mode ───
export interface StorybookIsolationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type SnapshotLayout = 'grid' | 'list' | 'carousel';

export interface StorybookSettingsState {
  isolationMode: boolean;
  snapshotLayout: SnapshotLayout;
  renderQuality: number;
  lastRunStatus: 'passed' | 'failed' | null;
}

// ─── Build Settings ───
export interface BuildSettingsProps {
  className?: string;
}

export type BuildStatus = 'idle' | 'building' | 'success' | 'error';

export interface PlatformConfig {
  id: string;
  name: string;
  icon: 'scss' | 'swift' | 'kotlin';
  enabled: boolean;
  outputDir: string;
  outputDirOptions: string[];
  outputs: {
    variables: boolean;
    tokens: boolean;
    types: boolean;
    docs: boolean;
  };
  buildProgress: number;
  buildStatus: BuildStatus;
}
