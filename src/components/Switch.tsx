import React, { useState } from 'react';
import { useTheme } from '../theme/useTheme';

interface SwitchProps {
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
  'data-testid'?: string;
}

export const Switch: React.FC<SwitchProps> = ({
  checked = false,
  disabled = false,
  onChange,
  className = '',
  'data-testid': dataTestId,
}) => {
  const { tokens } = useTheme();
  const [internalChecked, setInternalChecked] = useState(checked);
  const isControlled = checked !== undefined;
  const isChecked = isControlled ? checked : internalChecked;

  const handleChange = () => {
    const newChecked = !isChecked;
    if (!isControlled) {
      setInternalChecked(newChecked);
    }
    if (onChange) {
      onChange(newChecked);
    }
  };

  const switchStyle: React.CSSProperties = {
    width: '3rem',
    height: '1.5rem',
    borderRadius: '1rem',
    backgroundColor: isChecked 
      ? (tokens['color.primary'] as string || '#d45a5f')
      : (tokens['color.muted-foreground'] as string || '#ccc'),
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    position: 'relative',
    transition: 'all 0.2s ease',
  };

  const thumbStyle: React.CSSProperties = {
    width: '1.25rem',
    height: '1.25rem',
    borderRadius: '50%',
    backgroundColor: tokens['color.foreground'] as string || '#fff',
    position: 'absolute',
    top: '0.125rem',
    left: isChecked ? '1.625rem' : '0.125rem',
    transition: 'all 0.2s ease',
  };

  return (
    <div 
      style={switchStyle} 
      onClick={disabled ? undefined : handleChange}
      className={className}
      role="switch"
      aria-checked={isChecked}
      tabIndex={disabled ? -1 : 0}
      data-testid={dataTestId}
    >
      <div style={thumbStyle} />
    </div>
  );
};

export default Switch;
