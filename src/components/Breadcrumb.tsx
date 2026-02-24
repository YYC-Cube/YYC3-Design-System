/**
 * @file 面包屑导航组件
 * @description 显示当前页面在层级结构中的位置
 * @component Breadcrumb
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export interface BreadcrumbItem {
  key: string;
  title: ReactNode;
  href?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const getColorValue = (value: unknown, fallback: string): string => {
  return typeof value === 'string' ? value : fallback;
};

export const Breadcrumb = memo<BreadcrumbProps>(({
  items,
  separator = '/',
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();

  const breadcrumbStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    fontSize: '14px',
    color: getColorValue(tokens['color.text.secondary'], '#666'),
  };

  const itemStyles: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: getColorValue(tokens['color.text.secondary'], '#666'),
    textDecoration: 'none',
    transition: 'color 0.2s',
  };

  const itemHoverStyles: React.CSSProperties = {
    color: getColorValue(tokens['color.primary'], '#d45a5f'),
  };

  const lastItemStyles: React.CSSProperties = {
    color: getColorValue(tokens['color.text.primary'], '#333'),
    fontWeight: 'bold',
  };

  const separatorStyles: React.CSSProperties = {
    color: getColorValue(tokens['color.text.disabled'], '#999'),
  };

  const disabledStyles: React.CSSProperties = {
    opacity: 0.5,
    cursor: 'not-allowed',
  };

  return (
    <nav className={className} style={breadcrumbStyles} data-testid={dataTestId} aria-label="Breadcrumb">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        const isDisabled = item.disabled;

        return (
          <div key={item.key} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {item.href || item.onClick ? (
              <a
                href={item.href}
                onClick={item.onClick}
                style={{
                  ...itemStyles,
                  ...(isLast ? lastItemStyles : {}),
                  ...(isDisabled ? disabledStyles : {}),
                }}
                onMouseEnter={(e) => {
                  if (!isLast && !isDisabled) {
                    const target = e.currentTarget as HTMLElement;
                    target.style.color = itemHoverStyles.color || '#d45a5f';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLast && !isDisabled) {
                    const target = e.currentTarget as HTMLElement;
                    target.style.color = itemStyles.color || '#666';
                  }
                }}
                aria-disabled={isDisabled}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.title}
              </a>
            ) : (
              <span
                style={{
                  ...itemStyles,
                  ...(isLast ? lastItemStyles : {}),
                  ...(isDisabled ? disabledStyles : {}),
                }}
                aria-current={isLast ? 'page' : undefined}
              >
                {item.title}
              </span>
            )}
            {!isLast && (
              <span style={separatorStyles} aria-hidden="true">
                {separator}
              </span>
            )}
          </div>
        );
      })}
    </nav>
  );
});

Breadcrumb.displayName = 'Breadcrumb';
