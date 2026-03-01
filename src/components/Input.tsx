import * as React from 'react';
import { memo, useCallback } from 'react';
import { InputProps } from '../../types/tokens';
import { useTheme } from '../theme/useTheme';

export const Input = memo<InputProps>(
  ({
    type = 'text',
    defaultValue,
    label,
    placeholder = '',
    disabled = false,
    value,
    onChange,
    required = false,
    name,
    readOnly = false,
    'data-testid': dataTestId,
    className = '',
  }) => {
    const { tokens } = useTheme();
    const radius = (tokens['radius.md'] as string) || '0.25rem';
    const focusShadowValue = tokens['shadow.focus'] as string;
    const focusShadow = focusShadowValue
      ? focusShadowValue.split(' ')
      : ['0px', '0px', '0px', '2px', '#e06a70'];
    const shadowString = `${focusShadow[0]} ${focusShadow[1]} ${focusShadow[2]} ${focusShadow[3]} ${focusShadow[4] || '#e06a70'}`;

    const inputStyle: React.CSSProperties = {
      padding: '0.5rem 0.75rem',
      borderRadius: radius,
      border: `1px solid ${(tokens['color.muted-foreground'] as string) || '#ccc'}`,
      fontSize: (tokens['font-size.body'] as string) || '1rem',
      fontFamily: (tokens['typography.font-sans'] as string) || 'system-ui',
      lineHeight: (tokens['line-height.body'] as string) || '1.5',
      color: (tokens['color.foreground'] as string) || '#000',
      backgroundColor: (tokens['color.background'] as string) || '#fff',
      opacity: disabled ? 0.5 : 1,
      cursor: disabled ? 'not-allowed' : readOnly ? 'default' : 'text',
      transition: 'all 0.2s ease',
      outline: 'none',
      width: '100%',
      boxSizing: 'border-box',
    };

    const handleFocus = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = (tokens['color.primary'] as string) || '#d45a5f';
        e.target.style.boxShadow = shadowString;
      },
      [tokens, shadowString]
    );

    const handleBlur = useCallback(
      (e: React.FocusEvent<HTMLInputElement>) => {
        e.target.style.borderColor = (tokens['color.muted-foreground'] as string) || '#ccc';
        e.target.style.boxShadow = 'none';
      },
      [tokens]
    );

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        if (onChange) {
          onChange(e.target.value);
        }
      },
      [onChange]
    );

    return (
      <div>
        {label && (
          <label
            style={{
              display: 'block',
              marginBottom: '0.25rem',
              fontSize: '0.875rem',
              fontWeight: 500,
            }}
          >
            {label}
          </label>
        )}
        <input
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          value={value}
          onChange={handleChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          required={required}
          name={name}
          readOnly={readOnly}
          data-testid={dataTestId}
          style={inputStyle}
          className={className}
        />
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
