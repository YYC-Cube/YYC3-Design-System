/**
 * @file AI 一致性检查 Storybook 文档
 * @description AI 一致性检查的 Storybook 故事
 * @module stories/AIConsistencyChecker.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { logger } from '../utils/logger';
import type { Meta, StoryObj } from '@storybook/react';
import { AIConsistencyChecker } from './AIConsistencyChecker';

const meta: Meta<typeof AIConsistencyChecker> = {
  title: 'AI/AIConsistencyChecker',
  component: AIConsistencyChecker,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AIConsistencyChecker>;

export const Default: Story = {
  args: {},
};

export const WithCustomTokens: Story = {
  args: {
    tokens: {
      'color.primary': '#d45a5f',
      'color.secondary': '#6b7280',
      'color.foreground': '#1f2937',
      'color.background': '#ffffff',
      'color.muted-foreground': '#6b7280',
      'spacing.1': '4px',
      'spacing.2': '8px',
      'spacing.3': '12px',
      'spacing.4': '16px',
      'font-size.base': '16px',
      'font-size.lg': '18px',
      'line-height.base': '1.5',
    },
  },
};

export const WithIssues: Story = {
  args: {
    tokens: {
      'color.primary': '#d45a5f',
      'color.foreground': '#1f2937',
      'spacing.1': '5px',
      'spacing.2': '11px',
      'spacing.3': '17px',
      fontSize: '16px',
      lineHeight: '1.5',
    },
  },
};

export const WithFixHandler: Story = {
  args: {
    onFixIssue: (issueId) => {
      logger.warn('Fixing issue:', issueId);
    },
  },
};
