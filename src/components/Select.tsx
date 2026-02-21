import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { useTheme } from '../theme/useTheme';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'data-testid'?: string;
}

const getTokenValue = (tokens: unknown, key: string): string => {
  if (!tokens || typeof tokens !== 'object') {
    return '#000000';
  }
  const value = (tokens as Record<string, unknown>)[key];
  if (typeof value === 'string') {
    return value;
  }
  return '#000000';
};

export const Select: React.FC<SelectProps> = ({
  options,
  value,
  onChange,
  placeholder = 'Select...',
  disabled = false,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [internalValue, setInternalValue] = useState(value || '');
  const selectRef = useRef<HTMLDivElement>(null);
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const selectedOption = useMemo(() => options.find(opt => opt.value === currentValue), [options, currentValue]);

  const handleToggle = useCallback(() => {
    if (!disabled) {
      setIsOpen(prev => !prev);
    }
  }, [disabled]);

  const handleSelect = useCallback((optionValue: string) => {
    if (!isControlled) {
      setInternalValue(optionValue);
    }
    if (onChange) {
      onChange(optionValue);
    }
    setIsOpen(false);
  }, [isControlled, onChange]);

  const handleClickOutside = useCallback((e: MouseEvent) => {
    if (selectRef.current && !selectRef.current.contains(e.target as Node)) {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [handleClickOutside]);

  const selectStyle = useMemo<React.CSSProperties>(() => ({
    position: 'relative',
    display: 'inline-block',
    minWidth: '200px',
  }), []);

  const triggerStyle = useMemo<React.CSSProperties>(() => ({
    width: '100%',
    padding: '0.5rem 0.75rem',
    borderRadius: getTokenValue(tokens.radius, 'md'),
    border: `1px solid ${getTokenValue(tokens.color, 'muted-foreground')}`,
    backgroundColor: tokens['color.background'] as string || '#fbfbfc',
    color: tokens['color.foreground'] as string || '#000',
    fontSize: tokens['font-size.body'] as string || '1rem',
    fontFamily: tokens['typography.font-sans'] as string || 'system-ui',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    transition: 'all 0.2s ease',
  }), [tokens, disabled]);

  const dropdownStyle = useMemo<React.CSSProperties>(() => ({
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    marginTop: '0.25rem',
    backgroundColor: tokens['color.card'] as string || '#f8f9ef',
    borderRadius: getTokenValue(tokens.radius, 'md'),
    boxShadow: `0 4px 12px rgba(0, 0, 0, 0.15)`,
    zIndex: 1000,
    display: isOpen ? 'block' : 'none',
    maxHeight: '200px',
    overflowY: 'auto',
  }), [tokens, isOpen]);

  const optionStyle = useMemo<React.CSSProperties>(() => ({
    padding: '0.5rem 0.75rem',
    cursor: 'pointer',
    transition: 'background 0.2s ease',
    fontSize: tokens['font-size.body'] as string || '1rem',
    fontFamily: tokens['typography.font-sans'] as string || 'system-ui',
    color: tokens['color.foreground'] as string || '#000',
  }), [tokens]);

  const handleOptionMouseEnter = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = tokens['color.primary'] as string || '#d45a5f';
    e.currentTarget.style.color = tokens['color.foreground'] as string || '#fff';
  }, [tokens]);

  const handleOptionMouseLeave = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    e.currentTarget.style.backgroundColor = 'transparent';
    e.currentTarget.style.color = tokens['color.foreground'] as string || '#000';
  }, [tokens]);

  return (
    <div ref={selectRef} style={selectStyle} className={className} data-testid={dataTestId}>
      <div
        style={triggerStyle}
        onClick={handleToggle}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        tabIndex={disabled ? -1 : 0}
      >
        <span>{selectedOption ? selectedOption.label : placeholder}</span>
        <span style={{ marginLeft: '0.5rem' }}>{isOpen ? '▲' : '▼'}</span>
      </div>
      <div style={dropdownStyle} role="listbox">
        {options.map((option) => (
          <div
            key={option.value}
            style={optionStyle}
            onClick={() => handleSelect(option.value)}
            onMouseEnter={handleOptionMouseEnter}
            onMouseLeave={handleOptionMouseLeave}
            role="option"
            aria-selected={currentValue === option.value}
          >
            {option.label}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Select;
