/**
 * @file AI 最佳实践建议 Storybook 文档
 * @description AI 最佳实践建议的 Storybook 故事
 * @module stories/AIBestPractices.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import type { Meta, StoryObj } from '@storybook/react';
import { AIBestPractices } from './AIBestPractices';

const meta: Meta<typeof AIBestPractices> = {
  title: 'AI/AIBestPractices',
  component: AIBestPractices,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AIBestPractices>;

export const Default: Story = {
  args: {},
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

export const WithSearch: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const generateButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (generateButton) {
      generateButton.dispatchEvent(new Event('click', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const searchInput = canvasElement.querySelector('input[type="text"]') as HTMLInputElement;
    if (searchInput) {
      searchInput.value = 'color';
      searchInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const QuickWins: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const generateButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (generateButton) {
      generateButton.dispatchEvent(new Event('click', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const quickWinsButton = Array.from(canvasElement.querySelectorAll('.badge'))
      .find(badge => badge.textContent === '快速见效');
    
    if (quickWinsButton) {
      quickWinsButton.dispatchEvent(new Event('click', { bubbles: true }));
    }
  },
};

export const ColorCategory: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const generateButton = canvasElement.querySelector('button') as HTMLButtonElement;
    if (generateButton) {
      generateButton.dispatchEvent(new Event('click', { bubbles: true }));
    }

    await new Promise(resolve => setTimeout(resolve, 100));

    const colorButton = Array.from(canvasElement.querySelectorAll('.badge'))
      .find(badge => badge.textContent === '颜色');
    
    if (colorButton) {
      colorButton.dispatchEvent(new Event('click', { bubbles: true }));
    }
  },
};
