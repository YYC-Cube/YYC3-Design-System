/**
 * @file AI 配色方案推荐 Storybook 文档
 * @description AI 配色方案推荐的 Storybook 故事
 * @module stories/AIColorRecommender.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { logger } from '../utils/logger';
import type { Meta, StoryObj } from '@storybook/react';
import { AIColorRecommender } from './AIColorRecommender';

const meta: Meta<typeof AIColorRecommender> = {
  title: 'AI/AIColorRecommender',
  component: AIColorRecommender,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AIColorRecommender>;

export const Default: Story = {
  args: {},
};

export const WithCustomColor: Story = {
  args: {
    onSelectScheme: (scheme) => {
      logger.warn('Selected scheme:', scheme);
    },
  },
  play: async ({ canvasElement }) => {
    const colorInput = canvasElement.querySelector('input[type="text"]') as HTMLInputElement;
    if (colorInput) {
      colorInput.value = '#3b82f6';
      colorInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const BrandPurpose: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const purposeButtons = canvasElement.querySelectorAll('.badge');
    purposeButtons.forEach((button) => {
      if (button.textContent === '品牌') {
        button.dispatchEvent(new Event('click', { bubbles: true }));
      }
    });
  },
};

export const PlayfulMood: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const moodButtons = canvasElement.querySelectorAll('.badge');
    moodButtons.forEach((button) => {
      if (button.textContent === '活泼') {
        button.dispatchEvent(new Event('click', { bubbles: true }));
      }
    });
  },
};

export const AAAAccessibility: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const accessibilityButtons = canvasElement.querySelectorAll('.badge');
    accessibilityButtons.forEach((button) => {
      if (button.textContent?.includes('AAA')) {
        button.dispatchEvent(new Event('click', { bubbles: true }));
      }
    });
  },
};

export const Generated: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const generateButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (generateButton) {
      generateButton.dispatchEvent(new Event('click', { bubbles: true }));
    }
  },
};

export const SelectedScheme: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const generateButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (generateButton) {
      generateButton.dispatchEvent(new Event('click', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const schemes = canvasElement.querySelectorAll('[class*="cursor-pointer"]');
    if (schemes.length > 1) {
      schemes[1].dispatchEvent(new Event('click', { bubbles: true }));
    }
  },
};
