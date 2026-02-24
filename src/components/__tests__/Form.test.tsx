/**
 * @file 表单组件测试
 * @description 测试表单组件的功能
 * @module __tests__/components/Form.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';;
import '@testing-library/jest-dom';
import { z } from 'zod';
import { Form } from '../Form';
import { FormField } from '../FormField';
import { FormError } from '../FormError';
import { Input } from '../Input';
import { ThemeProvider } from '../../theme/ThemeProvider';

describe('Form', () => {
  const loginSchema = z.object({
    username: z.string().min(3, '用户名至少3个字符'),
    password: z.string().min(6, '密码至少6个字符'),
  });

  it('应该渲染表单', () => {
    render(
      <ThemeProvider>
        <Form schema={loginSchema} onSubmit={jest.fn()}>
          <FormField name="username" label="用户名">
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="password" label="密码">
            {(field) => <Input {...field} type="password" />}
          </FormField>
        </Form>
      </ThemeProvider>
    );

    expect(screen.getByLabelText('用户名')).toBeInTheDocument();
    expect(screen.getByLabelText('密码')).toBeInTheDocument();
  });

  it('应该验证表单', async () => {
    const handleSubmit = jest.fn();
    render(
      <ThemeProvider>
        <Form schema={loginSchema} onSubmit={handleSubmit}>
          <FormField name="username" label="用户名">
            {(field) => <Input {...field} />}
          </FormField>
          <FormField name="password" label="密码">
            {(field) => <Input {...field} type="password" />}
          </FormField>
        </Form>
      </ThemeProvider>
    );

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('用户名至少3个字符')).toBeInTheDocument();
      expect(screen.getByText('密码至少6个字符')).toBeInTheDocument();
    });
  });

  it('应该显示验证错误', () => {
    render(
      <ThemeProvider>
        <FormError message="这是一个错误信息" />
      </ThemeProvider>
    );

    expect(screen.getByText('这是一个错误信息')).toBeInTheDocument();
  });

  it('应该支持默认值', () => {
    render(
      <ThemeProvider>
        <Form 
          schema={loginSchema} 
          defaultValues={{ username: 'testuser' }} 
          onSubmit={jest.fn()}
        >
          <FormField name="username" label="用户名">
            {(field) => <Input {...field} />}
          </FormField>
        </Form>
      </ThemeProvider>
    );

    const input = screen.getByLabelText('用户名') as HTMLInputElement;
    expect(input.value).toBe('testuser');
  });

  it('应该在提交时调用回调', async () => {
    const handleSubmit = jest.fn();
    render(
      <ThemeProvider>
        <Form schema={loginSchema} onSubmit={handleSubmit}>
          <FormField name="username" label="用户名">
            {(field) => <Input {...field} defaultValue="validuser" />}
          </FormField>
          <FormField name="password" label="密码">
            {(field) => <Input {...field} type="password" defaultValue="validpassword" />}
          </FormField>
        </Form>
      </ThemeProvider>
    );

    const submitButton = screen.getByRole('button');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: 'validuser',
        password: 'validpassword',
      });
    });
  });
});
