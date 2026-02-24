/**
 * @file 表单组件
 * @description 基于react-hook-form的表单组件
 * @component Form
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 * @updated 2026-02-23
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import { memo, ReactNode, FormHTMLAttributes, useCallback } from 'react';
import { useForm, FormProvider, useFormContext } from 'react-hook-form';
import type { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useTheme } from '../theme/ThemeProvider';

export interface FormProps extends Omit<FormHTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  schema: z.ZodType;
  defaultValues?: Record<string, unknown>;
  onSubmit: (data: Record<string, unknown>) => void | Promise<void>;
  children: ReactNode;
  className?: string;
  'data-testid'?: string;
}

const FormComponent = ({
  schema,
  defaultValues,
  onSubmit,
  children,
  className = '',
  'data-testid': dataTestId,
  ...props
}: FormProps) => {
  const { tokens } = useTheme();
  
  const methods = useForm<any>({
    resolver: zodResolver(schema as any) as any,
    defaultValues: defaultValues,
  });

  const handleSubmit = useCallback(async (data: any) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  }, [onSubmit]);

  const containerStyles = {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
    width: '100%',
  };

  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(handleSubmit)}
        className={className}
        style={containerStyles}
        data-testid={dataTestId}
        {...props}
      >
        {children}
      </form>
    </FormProvider>
  );
};

export const Form = memo(FormComponent) as typeof FormComponent;

export const useFormField = () => {
  const context = useFormContext();
  if (!context) {
    throw new Error('useFormField must be used within a Form component');
  }
  return context;
};