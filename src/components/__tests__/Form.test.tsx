/**
 * @file 表单组件测试
 * @description 测试表单组件的功能
 * @module __tests__/components/Form.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import '@testing-library/jest-dom';
import { describe, it, expect } from '@jest/globals';
import { z } from 'zod';
import { Form } from '../Form';
import { FormField } from '../FormField';
import { FormError } from '../FormError';
import { Input } from '../Input';

describe('Form', () => {
  const testSchema = z.object({
    username: z.string().min(3, '用户名至少3个字符'),
    email: z.string().email('请输入有效的邮箱地址'),
    password: z.string().min(6, '密码至少6个字符'),
  });

  it('应该渲染表单', () => {
    const handleSubmit = jest.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <div>表单内容</div>
      </Form>
    );
    expect(screen.getByText('表单内容')).toBeInTheDocument();
  });

  it('应该正确提交表单', async () => {
    const handleSubmit = jest.fn().mockResolvedValue(undefined);
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
      </Form>
    );

    const input = screen.getByPlaceholderText('请输入用户名');
    fireEvent.change(input, { target: { value: 'testuser' } });
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        username: 'testuser',
      });
    });
  });

  it('应该显示验证错误', async () => {
    const handleSubmit = jest.fn();
    render(
      <Form schema={testSchema} onSubmit={handleSubmit}>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
      </Form>
    );

    const input = screen.getByPlaceholderText('请输入用户名');
    fireEvent.change(input, { target: { value: 'ab' } });
    fireEvent.blur(input);

    await waitFor(() => {
      expect(screen.getByText('用户名至少3个字符')).toBeInTheDocument();
    });
  });

  it('应该支持默认值', () => {
    const handleSubmit = jest.fn();
    const defaultValues = {
      username: 'defaultuser',
      email: 'default@example.com',
    };
    render(
      <Form schema={testSchema} defaultValues={defaultValues} onSubmit={handleSubmit}>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
      </Form>
    );

    const input = screen.getByPlaceholderText('请输入用户名');
    expect(input).toHaveValue('defaultuser');
  });
});

describe('FormField', () => {
  it('应该渲染标签', () => {
    render(
      <FormField name="test" control={{}} label="测试标签">
        {({ value, onChange }) => <Input value={value} onChange={onChange} />}
      </FormField>
    );
    expect(screen.getByText('测试标签')).toBeInTheDocument();
  });

  it('应该渲染错误信息', () => {
    render(
      <FormField
        name="test"
        control={{}}
        label="测试标签"
        error="测试错误"
      >
        {({ value, onChange }) => <Input value={value} onChange={onChange} />}
      </FormField>
    );
    expect(screen.getByText('测试错误')).toBeInTheDocument();
  });

  it('应该支持自定义标签属性', () => {
    render(
      <FormField
        name="test"
        control={{}}
        label="测试标签"
        labelProps={{ className: 'custom-label' }}
      >
        {({ value, onChange }) => <Input value={value} onChange={onChange} />}
      </FormField>
    );
    const label = screen.getByText('测试标签');
    expect(label).toHaveClass('custom-label');
  });
});

describe('FormError', () => {
  it('应该不渲染当没有错误时', () => {
    const { container } = render(<FormError errors={{}} name="test" />);
    expect(container).toBeEmptyDOMElement();
  });

  it('应该渲染错误信息', () => {
    render(<FormError errors={{ test: '测试错误' }} name="test" />);
    expect(screen.getByText('测试错误')).toBeInTheDocument();
  });

  it('应该渲染多个错误', () => {
    render(
      <FormError
        errors={{ test: ['错误1', '错误2'] }}
        name="test"
      />
    );
    expect(screen.getByText('错误1')).toBeInTheDocument();
    expect(screen.getByText('错误2')).toBeInTheDocument();
  });

  it('应该显示警告图标', () => {
    render(<FormError errors={{ test: '测试错误' }} name="test" />);
    expect(screen.getByText('⚠️')).toBeInTheDocument();
  });
});
