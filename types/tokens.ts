export interface ColorToken {
  oklch: string;
  hex: string;
  foreground?: string;
}

export interface ShadowToken {
  x: string;
  y: string;
  blur: string;
  spread: string;
  color_hex: string;
}

export interface TypographyTokens {
  'font-sans': string;
  'font-serif': string;
  'font-mono': string;
}

export interface DesignTokens {
  [key: string]: string | number | ColorToken | ShadowToken | TypographyTokens | Record<string, string | number>;
}

export interface GeneratedColorToken {
  value: {
    hex: string;
    oklch: string;
    foreground?: string;
  };
  name: string;
}

export interface GeneratedTokens {
  colors: Record<string, GeneratedColorToken>;
  spacing?: Record<string, string | number>;
  typography?: Record<string, string | number>;
  [key: string]: unknown;
}

export interface Theme {
  tokens: DesignTokens;
  mode: 'light' | 'dark';
}

export interface ThemeContextValue {
  tokens: DesignTokens;
  setTokens: (patch: Partial<DesignTokens>) => void;
  mode: 'light' | 'dark';
  setMode: (mode: 'light' | 'dark') => void;
}

export type ButtonVariant = 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

export interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  'data-testid'?: string;
  'aria-label'?: string;
}

export interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'color';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string | React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  autoFocus?: boolean;
  required?: boolean;
  name?: string;
  'data-testid'?: string;
  className?: string;
}

export interface CardProps {
  children: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export interface BadgeProps {
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
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
  children?: React.ReactNode;
  className?: string;
}

export interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
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
  children: React.ReactNode;
  className?: string;
}

export interface TabsProps {
  defaultValue?: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabListProps {
  children: React.ReactNode;
  className?: string;
}

export interface TabProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface TabPanelProps {
  value: string;
  children: React.ReactNode;
  className?: string;
}

export interface ModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  className?: string;
}

export interface TooltipProps {
  content: React.ReactNode;
  children: React.ReactElement;
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
