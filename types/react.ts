import { ReactNode } from 'react';

export interface BaseComponentProps {
  children?: ReactNode;
  className?: string;
  id?: string;
  'data-testid'?: string;
}

export interface WithThemeProps {
  theme?: 'light' | 'dark';
}

export interface AccessibilityProps {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  role?: string;
  tabIndex?: number;
}
