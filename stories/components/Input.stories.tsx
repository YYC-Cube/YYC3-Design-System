/**
 * @file Input 组件 Story
 * @description Input 组件的 Storybook 故事
 * @module stories/components/Input.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { Input } from '../../src/components/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
      description: '输入框类型',
    },
    label: {
      control: 'text',
      description: '标签文本',
    },
    placeholder: {
      control: 'text',
      description: '占位符文本',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    required: {
      control: 'boolean',
      description: '是否必填',
    },
    value: {
      control: 'text',
      description: '输入框值',
    },
    onChange: {
      action: 'changed',
      description: '值变化事件',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '请输入内容',
  },
};

export const WithLabel: Story = {
  args: {
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    label: '邮箱',
    placeholder: 'example@yyc3.com',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    label: '密码',
    placeholder: '请输入密码',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    label: '年龄',
    placeholder: '请输入年龄',
  },
};

export const Required: Story = {
  args: {
    type: 'text',
    label: '手机号',
    placeholder: '请输入手机号',
    required: true,
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    disabled: true,
    value: '已禁用的输入框',
  },
};

export const WithValue: Story = {
  args: {
    type: 'text',
    label: '用户名',
    placeholder: '请输入用户名',
    value: '默认值',
  },
};

export const Interactive: Story = {
  render: () => {
    const [value, setValue] = useState('');
    
    return (
      <div style={{ width: '300px' }}>
        <Input
          type="text"
          label="用户名"
          placeholder="请输入用户名"
          value={value}
          onChange={setValue}
        />
        <p style={{ marginTop: '1rem', fontSize: '0.875rem' }}>
          当前值: {value || '(空)'}
        </p>
      </div>
    );
  },
};

export const AllTypes: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '300px' }}>
      <Input type="text" label="文本" placeholder="请输入文本" />
      <Input type="email" label="邮箱" placeholder="example@yyc3.com" />
      <Input type="password" label="密码" placeholder="请输入密码" />
      <Input type="number" label="数字" placeholder="请输入数字" />
      <Input type="tel" label="电话" placeholder="请输入电话号码" />
      <Input type="url" label="网址" placeholder="https://example.com" />
    </div>
  ),
};

export const FormExample: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      username: '',
      email: '',
      password: '',
    });
    
    const handleChange = (field: string) => (value: string) => {
      setFormData(prev => ({ ...prev, [field]: value }));
    };
    
    return (
      <div style={{ width: '400px' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            type="text"
            label="用户名"
            placeholder="请输入用户名"
            value={formData.username}
            onChange={handleChange('username')}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            type="email"
            label="邮箱"
            placeholder="example@yyc3.com"
            value={formData.email}
            onChange={handleChange('email')}
            required
          />
        </div>
        <div style={{ marginBottom: '1.5rem' }}>
          <Input
            type="password"
            label="密码"
            placeholder="请输入密码"
            value={formData.password}
            onChange={handleChange('password')}
            required
          />
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          <p>用户名: {formData.username || '(未填写)'}</p>
          <p>邮箱: {formData.email || '(未填写)'}</p>
          <p>密码: {formData.password ? '******' : '(未填写)'}</p>
        </div>
      </div>
    );
  },
};
