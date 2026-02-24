/**
 * @file 表单组件Story
 * @description Form组件的Storybook故事
 * @module components/Form.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { z } from 'zod';
import { Form } from './Form';
import { FormField } from './FormField';
import { FormError } from './FormError';
import { Input } from './Input';
import { Button } from './Button';

const meta: Meta<typeof Form> = {
  title: 'Components/Form',
  component: Form,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: {
      action: 'submitted',
      description: '表单提交回调',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Form>;

const loginSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
});

const registerSchema = z.object({
  username: z.string().min(3, '用户名至少3个字符'),
  email: z.string().email('请输入有效的邮箱地址'),
  password: z.string().min(6, '密码至少6个字符'),
  confirmPassword: z.string().min(6, '确认密码至少6个字符'),
}).refine((data) => data.password === data.confirmPassword, {
  message: '两次输入的密码不一致',
  path: ['confirmPassword'],
});

export const Default: Story = {
  args: {
    schema: loginSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
    children: (
      <>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
        <FormField name="email" control={{}} label="邮箱">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入邮箱" />
          )}
        </FormField>
        <FormField name="password" control={{}} label="密码">
          {({ value, onChange }) => (
            <Input
              value={value}
              onChange={onChange}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </FormField>
        <Button type="submit">登录</Button>
      </>
    ),
  },
};

export const WithDefaultValues: Story = {
  args: {
    schema: loginSchema,
    defaultValues: {
      username: 'defaultuser',
      email: 'default@example.com',
    },
    onSubmit: (data) => console.log('Form submitted:', data),
    children: (
      <>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
        <FormField name="email" control={{}} label="邮箱">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入邮箱" />
          )}
        </FormField>
        <Button type="submit">登录</Button>
      </>
    ),
  },
};

export const WithValidation: Story = {
  args: {
    schema: registerSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
    children: (
      <>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
        <FormField name="email" control={{}} label="邮箱">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入邮箱" />
          )}
        </FormField>
        <FormField name="password" control={{}} label="密码">
          {({ value, onChange }) => (
            <Input
              value={value}
              onChange={onChange}
              type="password"
              placeholder="请输入密码"
            />
          )}
        </FormField>
        <FormField name="confirmPassword" control={{}} label="确认密码">
          {({ value, onChange }) => (
            <Input
              value={value}
              onChange={onChange}
              type="password"
              placeholder="请再次输入密码"
            />
          )}
        </FormField>
        <Button type="submit">注册</Button>
      </>
    ),
  },
};

export const WithCustomStyle: Story = {
  args: {
    schema: loginSchema,
    onSubmit: (data) => console.log('Form submitted:', data),
    className: 'custom-form',
    children: (
      <>
        <FormField name="username" control={{}} label="用户名">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入用户名" />
          )}
        </FormField>
        <FormField name="email" control={{}} label="邮箱">
          {({ value, onChange }) => (
            <Input value={value} onChange={onChange} placeholder="请输入邮箱" />
          )}
        </FormField>
        <Button type="submit">登录</Button>
      </>
    ),
  },
};
