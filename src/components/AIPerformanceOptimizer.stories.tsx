/**
 * @file AI 性能优化建议器 Storybook 故事
 * @description Storybook 配置和故事
 * @module stories/AIPerformanceOptimizer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import * as React from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ThemeProvider } from '../context/ThemeContext';
import { AIPerformanceOptimizer } from './AIPerformanceOptimizer';

const meta: Meta<typeof AIPerformanceOptimizer> = {
  title: 'AI/AI 性能优化建议器',
  component: AIPerformanceOptimizer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: '基于性能指标提供智能优化建议',
      },
    },
  },
  argTypes: {
    onApplyOptimization: {
      description: '应用优化时的回调函数',
      action: 'applied',
    },
    onExportPlan: {
      description: '导出优化计划时的回调函数',
      action: 'exported',
    },
    initialMetrics: {
      description: '初始性能指标',
      control: 'object',
    },
    showDetails: {
      description: '是否显示详细信息',
      control: 'boolean',
    },
    className: {
      description: '自定义类名',
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof AIPerformanceOptimizer>;

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
    onApplyOptimization: (recommendation) => console.log('Applied optimization:', recommendation),
    onExportPlan: (plan) => console.log('Exported plan:', plan),
    showDetails: true,
  },
};

export const WithGoodMetrics: Story = {
  decorators: [
    (Story) => (
      <WithTheme>
        <Story />
      </WithTheme>
    ),
  ],
  args: {
    initialMetrics: {
      FCP: 1.5,
      LCP: 2.0,
      FID: 80,
      CLS: 0.08,
      TTFB: 600,
      bundleSize: 80,
      renderTime: 10,
      memoryUsage: 40,
      apiLatency: 80,
    },
    onApplyOptimization: (recommendation) => console.log('Applied optimization:', recommendation),
    onExportPlan: (plan) => console.log('Exported plan:', plan),
    showDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: '展示优秀性能指标的优化建议',
      },
    },
  },
};

export const WithPoorMetrics: Story = {
  decorators: [
    (Story) => (
      <WithTheme>
        <Story />
      </WithTheme>
    ),
  ],
  args: {
    initialMetrics: {
      FCP: 4.5,
      LCP: 6.0,
      FID: 450,
      CLS: 0.3,
      TTFB: 2500,
      bundleSize: 450,
      renderTime: 55,
      memoryUsage: 180,
      apiLatency: 550,
    },
    onApplyOptimization: (recommendation) => console.log('Applied optimization:', recommendation),
    onExportPlan: (plan) => console.log('Exported plan:', plan),
    showDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: '展示性能较差指标的优化建议',
      },
    },
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
    onApplyOptimization: (recommendation) => console.log('Applied optimization:', recommendation),
    onExportPlan: (plan) => console.log('Exported plan:', plan),
    showDetails: true,
  },
  parameters: {
    docs: {
      description: {
        story: '完整的交互式示例，用户可以输入指标并获得优化建议',
      },
    },
  },
};
