import React, { useState } from 'react';
import { useTheme } from '../theme/useTheme';

interface CheckboxProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  children?: React.ReactNode;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  disabled = false,
  onChange,
  children,
  className = '',
}) => {
  const { tokens } = useTheme();
  const [internalChecked, setInternalChecked] = useState(checked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newChecked = e.target.checked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked);
    }
  };

  const checkboxStyle: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: (tokens['radius.sm'] as string) || '0.125rem',
    border: `2px solid ${(tokens['color.muted-foreground'] as string) || '#ccc'}`,
    backgroundColor: isChecked ? (tokens['color.primary'] as string) || '#d45a5f' : 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
  };

  const checkmarkStyle: React.CSSProperties = {
    color: (tokens['color.primary-foreground'] as string) || '#fff',
    fontSize: '0.875rem',
    fontWeight: 'bold',
    display: isChecked ? 'block' : 'none',
  };

  const labelStyle: React.CSSProperties = {
    marginLeft: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: (tokens['font-size.body'] as string) || '1rem',
    fontFamily: (tokens['typography.font-sans'] as string) || 'system-ui',
    color: (tokens['color.foreground'] as string) || '#000',
  };

  return (
    <label
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      className={className}
    >
      <div style={checkboxStyle}>
        <span style={checkmarkStyle}>✓</span>
      </div>
      <input
        type="checkbox"
        checked={isChecked}
        disabled={disabled}
        onChange={handleChange}
        style={{ position: 'absolute', opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
      {children && <span style={labelStyle}>{children}</span>}
    </label>
  );
};

export default Checkbox;
