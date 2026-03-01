/**
 * @file 菜单组件
 * @description 导航菜单组件，支持嵌套菜单、图标和快捷键
 * @component Menu
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, useState, useCallback, ReactNode } from 'react';
import { useTheme } from '../context/ThemeContext';

export interface MenuItem {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  children?: MenuItem[];
  shortcut?: string;
  onClick?: () => void;
}

export interface MenuProps {
  items: MenuItem[];
  mode?: 'vertical' | 'horizontal';
  theme?: 'light' | 'dark';
  defaultSelectedKey?: string;
  selectedKey?: string;
  onSelect?: (key: string) => void;
  inlineCollapsed?: boolean;
  className?: string;
  'data-testid'?: string;
}

export const Menu = memo<MenuProps>(
  ({
    items,
    mode = 'vertical',
    theme: menuTheme = 'light',
    defaultSelectedKey,
    selectedKey: controlledSelectedKey,
    onSelect,
    inlineCollapsed = false,
    className = '',
    'data-testid': dataTestId,
  }) => {
    const { tokens, mode: themeMode } = useTheme();
    const [internalSelectedKey, setInternalSelectedKey] = useState<string | null>(
      defaultSelectedKey || null
    );
    const [expandedKeys, setExpandedKeys] = useState<Set<string>>(new Set());

    const selectedKey =
      controlledSelectedKey !== undefined ? controlledSelectedKey : internalSelectedKey;

    const handleSelect = useCallback(
      (key: string) => {
        if (selectedKey === key) return;
        setInternalSelectedKey(key);
        onSelect?.(key);
      },
      [selectedKey, onSelect]
    );

    const handleExpand = useCallback((key: string) => {
      setExpandedKeys((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(key)) {
          newSet.delete(key);
        } else {
          newSet.add(key);
        }
        return newSet;
      });
    }, []);

    const handleItemClick = useCallback(
      (item: MenuItem) => {
        if (item.disabled) return;
        if (item.children && item.children.length > 0) {
          handleExpand(item.key);
        } else {
          handleSelect(item.key);
          item.onClick?.();
        }
      },
      [handleSelect, handleExpand]
    );

    const isDark = menuTheme === 'dark' || themeMode === 'dark';

    const containerStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: mode === 'vertical' ? 'column' : 'row',
      backgroundColor: isDark
        ? (tokens['color.background.dark'] as string) || '#1a1a1a'
        : (tokens['color.background'] as string) || '#fff',
      border:
        mode === 'vertical'
          ? `1px solid ${(tokens['color.border'] as string) || '#e0e0e0'}`
          : undefined,
      borderRadius: '4px',
      overflow: 'hidden',
    };

    const itemStyles: React.CSSProperties = {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: mode === 'vertical' ? '12px 16px' : '12px 20px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      fontSize: '14px',
      color: isDark
        ? (tokens['color.text.dark'] as string) || '#fff'
        : (tokens['color.text.primary'] as string) || '#333',
      borderLeft: mode === 'vertical' ? '3px solid transparent' : undefined,
      borderBottom: mode === 'horizontal' ? '2px solid transparent' : undefined,
      whiteSpace: 'nowrap',
    };

    const itemHoverStyles: React.CSSProperties = {
      ...itemStyles,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.1)'
        : (tokens['color.hover'] as string) || '#f5f5f5',
    };

    const selectedItemStyles: React.CSSProperties = {
      ...itemStyles,
      backgroundColor: isDark
        ? 'rgba(255, 255, 255, 0.15)'
        : (tokens['color.primary.light'] as string) || '#f0f0f0',
      borderLeftColor:
        mode === 'vertical' ? (tokens['color.primary'] as string) || '#d45a5f' : undefined,
      borderBottomColor:
        mode === 'horizontal' ? (tokens['color.primary'] as string) || '#d45a5f' : undefined,
      color: (tokens['color.primary'] as string) || '#d45a5f',
    };

    const disabledItemStyles: React.CSSProperties = {
      ...itemStyles,
      opacity: 0.5,
      cursor: 'not-allowed',
    };

    const dividerStyles: React.CSSProperties = {
      height: '1px',
      backgroundColor: (tokens['color.border'] as string) || '#e0e0e0',
      margin: mode === 'vertical' ? '4px 0' : '0 8px',
    };

    const iconStyles: React.CSSProperties = {
      fontSize: '16px',
      color: isDark
        ? (tokens['color.text.dark'] as string) || '#fff'
        : (tokens['color.text.secondary'] as string) || '#666',
      minWidth: '16px',
    };

    const shortcutStyles: React.CSSProperties = {
      marginLeft: 'auto',
      fontSize: '12px',
      color: isDark
        ? (tokens['color.text.disabled.dark'] as string) || '#666'
        : (tokens['color.text.disabled'] as string) || '#999',
    };

    const submenuStyles: React.CSSProperties = {
      display: 'flex',
      flexDirection: 'column',
      paddingLeft: mode === 'vertical' ? '16px' : '0',
      backgroundColor: isDark ? 'rgba(0, 0, 0, 0.2)' : 'rgba(0, 0, 0, 0.03)',
    };

    const collapsedStyles: React.CSSProperties = {
      padding: '12px',
      justifyContent: 'center',
    };

    const renderMenuItem = (item: MenuItem, level = 0): ReactNode => {
      const isSelected = item.key === selectedKey;
      const isExpanded = expandedKeys.has(item.key);
      const hasChildren = item.children && item.children.length > 0;
      const isCollapsed = inlineCollapsed && level === 0;

      if (item.divider) {
        return <div key={item.key} style={dividerStyles} />;
      }

      const itemContent = (
        <>
          {item.icon && <span style={iconStyles}>{item.icon}</span>}
          {!isCollapsed && <span>{item.label}</span>}
          {!isCollapsed && item.shortcut && <span style={shortcutStyles}>{item.shortcut}</span>}
          {!isCollapsed && hasChildren && (
            <span style={{ marginLeft: 'auto', fontSize: '12px' }}>{isExpanded ? '▼' : '▶'}</span>
          )}
        </>
      );

      const baseItemStyles = isCollapsed ? collapsedStyles : itemStyles;

      return (
        <div key={item.key}>
          <div
            style={{
              ...(item.disabled
                ? disabledItemStyles
                : isSelected
                  ? selectedItemStyles
                  : baseItemStyles),
              ...(isCollapsed ? collapsedStyles : {}),
            }}
            onClick={() => handleItemClick(item)}
            role="menuitem"
            aria-disabled={item.disabled}
            aria-expanded={hasChildren ? isExpanded : undefined}
            aria-selected={isSelected}
            tabIndex={item.disabled ? -1 : 0}
          >
            {itemContent}
          </div>
          {hasChildren && !isCollapsed && isExpanded && (
            <div style={submenuStyles}>
              {item.children?.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    };

    return (
      <nav
        className={className}
        style={containerStyles}
        data-testid={dataTestId}
        role="menu"
        aria-label="Navigation menu"
      >
        {items.map((item) => renderMenuItem(item))}
      </nav>
    );
  }
);

Menu.displayName = 'Menu';
