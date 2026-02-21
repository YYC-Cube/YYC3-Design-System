/**
 * @file AI 使用模式分析 Storybook 文档
 * @description AI 使用模式分析的 Storybook 故事
 * @module stories/AIUsageAnalyzer.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AIUsageAnalyzer } from './AIUsageAnalyzer';

const meta: Meta<typeof AIUsageAnalyzer> = {
  title: 'AI/AIUsageAnalyzer',
  component: AIUsageAnalyzer,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AIUsageAnalyzer>;

export const Default: Story = {
  args: {},
};

export const Analyzed: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const analyzeButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (analyzeButton) {
      analyzeButton.dispatchEvent(new Event('click', { bubbles: true }));
    }
  },
};
