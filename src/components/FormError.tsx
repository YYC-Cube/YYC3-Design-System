/**
 * @file 表单错误组件
 * @description 显示表单验证错误信息
 * @component FormError
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, ReactNode } from 'react';
import { useTheme } from '../theme/ThemeProvider';

export interface FormErrorProps {
  errors?: Record<string, any>;
  name?: string;
  className?: string;
  'data-testid'?: string;
}

export const FormError = memo(({ errors, name, className = '', 'data-testid': dataTestId }: FormErrorProps) => {
  const { tokens } = useTheme();

  const error = name && errors ? errors[name] : null;

  if (!error) {
    return null;
  }

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '4px',
    marginTop: '8px',
  };

  const errorItemStyles = {
    display: 'flex',
    alignItems: 'center' as const,
    gap: '4px',
    fontSize: '12px',
    color: tokens['color.error'] as string || '#ff4d4f',
  };

  const iconStyles = {
    fontSize: '14px',
  };

  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message) {
      return error.message;
    }
    return '验证失败';
  };

  const errorMessages = Array.isArray(error) ? error : [error];

  return (
    <div className={className} style={containerStyles} data-testid={dataTestId}>
      {errorMessages.map((err, index) => (
        <div key={index} style={errorItemStyles}>
          <span style={iconStyles}>⚠️</span>
          <span>{getErrorMessage(err)}</span>
        </div>
      ))}
    </div>
  );
});

FormError.displayName = 'FormError';
