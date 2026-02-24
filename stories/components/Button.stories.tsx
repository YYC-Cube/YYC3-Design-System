/**
 * @file Button 组件 Story
 * @description Button 组件的 Storybook 故事
 * @module stories/components/Button.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Button } from '../../src/components/Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'destructive', 'outline', 'secondary', 'ghost', 'link'],
      description: '按钮变体',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: '按钮尺寸',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    type: {
      control: 'select',
      options: ['button', 'submit', 'reset'],
      description: '按钮类型',
    },
    onClick: {
      action: 'clicked',
      description: '点击事件',
    },
    children: {
      control: 'text',
      description: '按钮内容',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Button>;

export const Default: Story = {
  args: {
    children: '默认按钮',
    variant: 'default',
    size: 'default',
  },
};

export const Destructive: Story = {
  args: {
    children: '危险按钮',
    variant: 'destructive',
    size: 'default',
  },
};

export const Outline: Story = {
  args: {
    children: '轮廓按钮',
    variant: 'outline',
    size: 'default',
  },
};

export const Secondary: Story = {
  args: {
    children: '次要按钮',
    variant: 'secondary',
    size: 'default',
  },
};

export const Ghost: Story = {
  args: {
    children: '幽灵按钮',
    variant: 'ghost',
    size: 'default',
  },
};

export const Link: Story = {
  args: {
    children: '链接按钮',
    variant: 'link',
    size: 'default',
  },
};

export const Small: Story = {
  args: {
    children: '小按钮',
    variant: 'default',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    children: '大按钮',
    variant: 'default',
    size: 'lg',
  },
};

export const Icon: Story = {
  args: {
    children: '🔍',
    variant: 'default',
    size: 'icon',
  },
};

export const Disabled: Story = {
  args: {
    children: '禁用按钮',
    variant: 'default',
    size: 'default',
    disabled: true,
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button variant="default">默认</Button>
      <Button variant="destructive">危险</Button>
      <Button variant="outline">轮廓</Button>
      <Button variant="secondary">次要</Button>
      <Button variant="ghost">幽灵</Button>
      <Button variant="link">链接</Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
      <Button size="sm">小按钮</Button>
      <Button size="default">默认按钮</Button>
      <Button size="lg">大按钮</Button>
      <Button size="icon">🔍</Button>
    </div>
  ),
};

export const WithOnClick: Story = {
  args: {
    children: '点击我',
    variant: 'default',
    size: 'default',
    onClick: () => alert('按钮被点击了！'),
  },
};
