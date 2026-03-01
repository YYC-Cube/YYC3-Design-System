/**
 * @file AI 组件推荐器 Storybook 故事
 * @description Storybook 配置和故事
 * @module stories/AIComponentRecommender
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../context/ThemeContext';
import { AIComponentRecommender } from './AIComponentRecommender';

const meta: Meta<typeof AIComponentRecommender> = {
  title: 'AI/AI 组件推荐器',
  component: AIComponentRecommender,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '基于用户需求智能推荐合适的UI组件',
      },
    },
  },
  argTypes: {
    onSelectComponent: {
      description: '选中组件时的回调函数',
      action: 'selected',
    },
    className: {
      description: '自定义类名',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIComponentRecommender>;

const WithTheme = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider initial="light">{children}</ThemeProvider>;
};

export const Default: Story = {
  decorators: [
    (Story) => (
      <WithTheme>
        <Story />
      </WithTheme>
    ),
  ],
  args: {
    onSelectComponent: (component: string) => console.log('Selected component:', component),
  },
};

export const Interactive: Story = {
  decorators: [
    (Story) => (
      <WithTheme>
        <Story />
      </WithTheme>
    ),
  ],
  args: {
    onSelectComponent: (component: string) => console.log('Selected component:', component),
  },
  parameters: {
    docs: {
      description: {
        story: '完整的交互式示例，用户可以输入需求并获得组件推荐',
      },
    },
  },
};

export const Simple: Story = {
  decorators: [
    (Story) => (
      <WithTheme>
        <Story />
      </WithTheme>
    ),
  ],
  args: {
    onSelectComponent: (component: string) => console.log('Selected component:', component),
  },
  parameters: {
    docs: {
      description: {
        story: '基础版本，展示推荐器的主要功能',
      },
    },
  },
};
