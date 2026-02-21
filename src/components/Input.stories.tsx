import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';
import { ThemeProvider } from '../theme/ThemeProvider';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['text', 'email', 'password', 'number', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
    placeholder: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: {
    type: 'text',
    placeholder: '请输入内容...',
  },
};

export const Email: Story = {
  args: {
    type: 'email',
    placeholder: '请输入邮箱地址...',
  },
};

export const Password: Story = {
  args: {
    type: 'password',
    placeholder: '请输入密码...',
  },
};

export const Number: Story = {
  args: {
    type: 'number',
    placeholder: '请输入数字...',
  },
};

export const Disabled: Story = {
  args: {
    type: 'text',
    placeholder: '禁用输入框',
    disabled: true,
  },
};

const ControlledComponent = () => {
  const [value, setValue] = React.useState('');
  return (
    <div>
      <Input
        type="text"
        placeholder="受控输入框"
        value={value}
        onChange={setValue}
      />
      <p style={{ marginTop: '0.5rem' }}>当前值: {value}</p>
    </div>
  );
};

export const Controlled: Story = {
  render: ControlledComponent,
};
