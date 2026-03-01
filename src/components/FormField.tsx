/**
 * @file 表单字段组件
 * @description 表单字段包装器，提供标签、错误提示等
 * @component FormField
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, ReactNode, LabelHTMLAttributes } from 'react';
import React from 'react';
import { Controller, FieldValues, FieldPath, FieldPathValue, Control } from 'react-hook-form';
import { useTheme } from '../context/ThemeContext';
import { useFormField } from './Form';

export interface FormFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<LabelHTMLAttributes<HTMLDivElement>, 'children'> {
  name: TName;
  control?: Control<TFieldValues>;
  label?: string;
  labelProps?: LabelHTMLAttributes<HTMLLabelElement>;
  error?: string;
  required?: boolean;
  description?: string;
  children: (field: {
    name: TName;
    value: FieldPathValue<TFieldValues, TName>;
    onChange: (value: FieldPathValue<TFieldValues, TName>) => void;
    onBlur: () => void;
    ref: React.Ref<unknown>;
    disabled?: boolean;
    [key: string]: unknown;
  }) => ReactNode;
  className?: string;
  'data-testid'?: string;
}

const FormFieldComponent = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  name,
  control,
  label,
  labelProps,
  error,
  required,
  description,
  children,
  className = '',
  'data-testid': dataTestId,
  ...props
}: FormFieldProps<TFieldValues, TName>) => {
  const { tokens } = useTheme();
  const formContext = useFormField();

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '8px',
    width: '100%',
  };

  const labelStyles = {
    fontSize: '14px',
    fontWeight: 500,
    color: (tokens['color.text.primary'] as string) || '#333',
    marginBottom: '4px',
  };

  const errorStyles = {
    fontSize: '12px',
    color: (tokens['color.error'] as string) || '#ff4d4f',
    marginTop: '4px',
  };

  const descriptionStyles = {
    fontSize: '12px',
    color: (tokens['color.text.secondary'] as string) || '#666',
    marginTop: '2px',
  };

  const currentControl = control || (formContext.control as Control<TFieldValues>);

  return (
    <div className={className} style={containerStyles} data-testid={dataTestId} {...props}>
      {label && (
        <label style={labelStyles} {...labelProps}>
          {label}
          {required && (
            <span
              style={{ color: (tokens['color.error'] as string) || '#ff4d4f', marginLeft: '4px' }}
            >
              *
            </span>
          )}
        </label>
      )}
      <Controller
        name={name}
        control={currentControl}
        render={({ field }) =>
          children({
            ...field,
            name,
            disabled: field.disabled,
          }) as React.ReactElement
        }
      />
      {description && <div style={descriptionStyles}>{description}</div>}
      {error && <div style={errorStyles}>{error}</div>}
    </div>
  );
};

export const FormField = memo(FormFieldComponent) as typeof FormFieldComponent;
