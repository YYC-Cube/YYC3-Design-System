import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';
import { ThemeProvider } from '../context/ThemeContext';
import { useTheme } from '../context/ThemeContext';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
    },
    size: {
      control: { type: 'select' },
      options: ['default', 'sm', 'lg', 'icon'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: '默认按钮',
    variant: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: '危险按钮',
    variant: 'destructive',
  },
};

export const Outline: Story = {
  args: {
    children: '轮廓按钮',
    variant: 'outline',
  },
};

export const Secondary: Story = {
  args: {
    children: '次要按钮',
    variant: 'secondary',
  },
};

export const Ghost: Story = {
  args: {
    children: '幽灵按钮',
    variant: 'ghost',
  },
};

export const Link: Story = {
  args: {
    children: '链接按钮',
    variant: 'link',
  },
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">小按钮</Button>
      <Button size="default">默认按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="icon">🔍</Button>
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    children: '禁用按钮',
    disabled: true,
  },
};

export const LiveTokens = () => {
  const { setTokens, tokens } = useTheme();

  const handleColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const patch = {
      color: {
        ...tokens.color,
        primary: { ...tokens.color.primary, hex: event.target.value },
      },
    };
    setTokens(patch);
  };

  return (
    <div>
      <div style={{ marginBottom: '1rem' }}>
        <label htmlFor="primaryColor">主色选择：</label>
        <input
          id="primaryColor"
          type="color"
          defaultValue={tokens.color.primary.hex}
          onChange={handleColorChange}
        />
      </div>
      <Button variant="default">实时主色按钮</Button>
    </div>
  );
};
