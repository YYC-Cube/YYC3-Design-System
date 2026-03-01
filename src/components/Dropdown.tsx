/**
 * @file 下拉菜单组件
 * @description 下拉菜单组件，支持键盘导航和多级菜单
 * @component Dropdown
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, useState, useRef, useEffect, useCallback, ReactNode, ReactElement } from 'react';
import { useTheme } from '../context/ThemeContext';

export interface DropdownOption {
  key: string;
  label: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
  divider?: boolean;
  children?: DropdownOption[];
  onClick?: () => void;
}

export interface DropdownProps {
  trigger?: 'click' | 'hover';
  placement?: 'bottomLeft' | 'bottomCenter' | 'bottomRight' | 'topLeft' | 'topCenter' | 'topRight';
  options: DropdownOption[];
  children: ReactElement;
  disabled?: boolean;
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  className?: string;
  'data-testid'?: string;
}

export const Dropdown = memo<DropdownProps>(
  ({
    trigger = 'click',
    placement = 'bottomLeft',
    options,
    children,
    disabled = false,
    visible: controlledVisible,
    onVisibleChange,
    className = '',
    'data-testid': dataTestId,
  }) => {
    const { tokens } = useTheme();
    const [internalVisible, setInternalVisible] = useState(false);
    const [activeKey, setActiveKey] = useState<string | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const visible = controlledVisible !== undefined ? controlledVisible : internalVisible;

    const handleVisibleChange = useCallback(
      (newVisible: boolean) => {
        if (disabled) return;
        setInternalVisible(newVisible);
        onVisibleChange?.(newVisible);
      },
      [disabled, onVisibleChange]
    );

    const handleClick = useCallback(() => {
      if (trigger === 'click') {
        handleVisibleChange(!visible);
      }
    }, [trigger, visible, handleVisibleChange]);

    const handleMouseEnter = useCallback(() => {
      if (trigger === 'hover') {
        handleVisibleChange(true);
      }
    }, [trigger, handleVisibleChange]);

    const handleMouseLeave = useCallback(() => {
      if (trigger === 'hover') {
        handleVisibleChange(false);
      }
    }, [trigger, handleVisibleChange]);

    const handleOptionClick = useCallback(
      (option: DropdownOption) => {
        if (option.disabled) return;
        option.onClick?.();
        handleVisibleChange(false);
      },
      [handleVisibleChange]
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent) => {
        if (!visible || disabled) return;

        const enabledOptions = options.filter((opt) => !opt.disabled);
        const currentIndex = enabledOptions.findIndex((opt) => opt.key === activeKey);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            const nextIndex = currentIndex < enabledOptions.length - 1 ? currentIndex + 1 : 0;
            setActiveKey(enabledOptions[nextIndex].key);
            break;
          case 'ArrowUp':
            e.preventDefault();
            const prevIndex = currentIndex > 0 ? currentIndex - 1 : enabledOptions.length - 1;
            setActiveKey(enabledOptions[prevIndex].key);
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            if (activeKey) {
              const option = options.find((opt) => opt.key === activeKey);
              if (option) {
                handleOptionClick(option);
              }
            }
            break;
          case 'Escape':
            e.preventDefault();
            handleVisibleChange(false);
            break;
        }
      },
      [visible, disabled, options, activeKey, handleOptionClick, handleVisibleChange]
    );

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          handleVisibleChange(false);
        }
      };

      if (visible) {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
          document.removeEventListener('mousedown', handleClickOutside);
        };
      }
    }, [visible, handleVisibleChange]);

    useEffect(() => {
      if (visible) {
        const firstEnabledOption = options.find((opt) => !opt.disabled);
        if (firstEnabledOption) {
          setActiveKey(firstEnabledOption.key);
        }
      } else {
        setActiveKey(null);
      }
    }, [visible, options]);

    const getPlacementStyles = (): React.CSSProperties => {
      const baseStyles: React.CSSProperties = {
        position: 'absolute',
        zIndex: 1000,
        minWidth: '160px',
        maxHeight: '300px',
        overflowY: 'auto',
      };

      switch (placement) {
        case 'bottomLeft':
          return { ...baseStyles, top: '100%', left: 0, marginTop: '4px' };
        case 'bottomCenter':
          return {
            ...baseStyles,
            top: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginTop: '4px',
          };
        case 'bottomRight':
          return { ...baseStyles, top: '100%', right: 0, marginTop: '4px' };
        case 'topLeft':
          return { ...baseStyles, bottom: '100%', left: 0, marginBottom: '4px' };
        case 'topCenter':
          return {
            ...baseStyles,
            bottom: '100%',
            left: '50%',
            transform: 'translateX(-50%)',
            marginBottom: '4px',
          };
        case 'topRight':
          return { ...baseStyles, bottom: '100%', right: 0, marginBottom: '4px' };
        default:
          return baseStyles;
      }
    };

    const containerStyles: React.CSSProperties = {
      position: 'relative',
      display: 'inline-block',
    };

    const dropdownStyles: React.CSSProperties = {
      ...getPlacementStyles(),
      backgroundColor: (tokens['color.background'] as string) || '#fff',
      border: `1px solid ${(tokens['color.border'] as string) || '#e0e0e0'}`,
      borderRadius: '4px',
      boxShadow: `0 2px 8px rgba(0, 0, 0, 0.1)`,
      padding: '4px 0',
      opacity: visible ? 1 : 0,
      visibility: visible ? 'visible' : 'hidden',
      transition: 'opacity 0.2s, visibility 0.2s',
    };

    const optionStyles: React.CSSProperties = {
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.2s',
      fontSize: '14px',
      color: (tokens['color.text.primary'] as string) || '#333',
    };

    const optionHoverStyles: React.CSSProperties = {
      ...optionStyles,
      backgroundColor: (tokens['color.hover'] as string) || '#f5f5f5',
    };

    const activeOptionStyles: React.CSSProperties = {
      ...optionStyles,
      backgroundColor: (tokens['color.primary.light'] as string) || '#f0f0f0',
    };

    const disabledOptionStyles: React.CSSProperties = {
      ...optionStyles,
      opacity: 0.5,
      cursor: 'not-allowed',
    };

    const dividerStyles: React.CSSProperties = {
      height: '1px',
      backgroundColor: (tokens['color.border'] as string) || '#e0e0e0',
      margin: '4px 0',
    };

    const iconStyles: React.CSSProperties = {
      fontSize: '16px',
      color: (tokens['color.text.secondary'] as string) || '#666',
    };

    const arrowStyles: React.CSSProperties = {
      marginLeft: 'auto',
      fontSize: '12px',
      color: (tokens['color.text.disabled'] as string) || '#999',
    };

    const renderOption = (option: DropdownOption, level = 0): ReactNode => {
      const isActive = option.key === activeKey;
      const hasChildren = option.children && option.children.length > 0;

      return (
        <div key={option.key}>
          {option.divider ? (
            <div style={dividerStyles} />
          ) : (
            <div
              style={{
                ...(option.disabled
                  ? disabledOptionStyles
                  : isActive
                    ? activeOptionStyles
                    : optionStyles),
                paddingLeft: `${12 + level * 16}px`,
              }}
              onClick={() => handleOptionClick(option)}
              onMouseEnter={() => !option.disabled && setActiveKey(option.key)}
              onMouseLeave={() => !option.disabled && setActiveKey(null)}
              role="menuitem"
              tabIndex={-1}
              aria-disabled={option.disabled}
            >
              {option.icon && <span style={iconStyles}>{option.icon}</span>}
              <span>{option.label}</span>
              {hasChildren && <span style={arrowStyles}>›</span>}
            </div>
          )}
          {hasChildren && (
            <div>{option.children?.map((child) => renderOption(child, level + 1))}</div>
          )}
        </div>
      );
    };

    return (
      <div
        ref={containerRef}
        className={className}
        style={containerStyles}
        data-testid={dataTestId}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        role="button"
        aria-haspopup="true"
        aria-expanded={visible}
      >
        {children}
        {visible && (
          <div ref={dropdownRef} style={dropdownStyles} role="menu" aria-label="Dropdown menu">
            {options.map((option) => renderOption(option))}
          </div>
        )}
      </div>
    );
  }
);

Dropdown.displayName = 'Dropdown';
