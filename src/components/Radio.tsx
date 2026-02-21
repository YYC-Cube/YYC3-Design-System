import React from 'react';
import { useTheme } from '../theme/useTheme';

interface RadioProps {
  name?: string;
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
  'data-testid'?: string;
}

export const Radio: React.FC<RadioProps> = ({
  name,
  value,
  checked = false,
  disabled = false,
  onChange,
  children,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();

  const handleChange = () => {
    if (onChange && value) {
      onChange(value);
    }
  };

  const radioStyle: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    border: `2px solid ${tokens['color.muted-foreground'] as string || '#ccc'}`,
    backgroundColor: checked ? tokens['color.primary'] as string || '#d45a5f' : 'transparent',
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.2s ease',
    position: 'relative',
  };

  const dotStyle: React.CSSProperties = {
    width: '0.5rem',
    height: '0.5rem',
    borderRadius: '50%',
    backgroundColor: tokens['color.primary-foreground'] as string || '#fff',
    display: checked ? 'block' : 'none',
  };

  const labelStyle: React.CSSProperties = {
    marginLeft: '0.5rem',
    cursor: disabled ? 'not-allowed' : 'pointer',
    fontSize: tokens['font-size.body'] as string || '1rem',
    fontFamily: tokens['typography.font-sans'] as string || 'system-ui',
    color: tokens['color.foreground'] as string || '#000',
  };

  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', cursor: disabled ? 'not-allowed' : 'pointer' }} className={className} data-testid={dataTestId}>
      <div style={radioStyle}>
        <span style={dotStyle} />
      </div>
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        disabled={disabled}
        onChange={handleChange}
        style={{ position: 'absolute', opacity: 0, cursor: disabled ? 'not-allowed' : 'pointer' }}
      />
      {children && <span style={labelStyle}>{children}</span>}
    </label>
  );
};

export default Radio;
