/**
 * @file AI Token 生成器 Storybook 文档
 * @description AI Token 生成器的 Storybook 故事
 * @module stories/AITokenGenerator.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { logger } from '../utils/logger';

import type { Meta, StoryObj } from '@storybook/react';
import { AITokenGenerator } from './AITokenGenerator';

const meta: Meta<typeof AITokenGenerator> = {
  title: 'AI/AITokenGenerator',
  component: AITokenGenerator,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof AITokenGenerator>;

export const Default: Story = {
  args: {},
};

export const WithCustomColor: Story = {
  args: {
    onGenerate: (tokens) => {
      logger.warn('Generated tokens:', tokens);
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

export const WithComplementaryHarmony: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const harmonyButtons = canvasElement.querySelectorAll('.badge');
    harmonyButtons.forEach((button) => {
      if (button.textContent === '互补色') {
        button.dispatchEvent(new Event('click', { bubbles: true }));
      }
    });
  },
};

export const WithLargeScale: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const scaleInput = canvasElement.querySelector('input[type="range"]') as HTMLInputElement;
    if (scaleInput) {
      scaleInput.value = '14';
      scaleInput.dispatchEvent(new Event('input', { bubbles: true }));
    }
  },
};

export const WithoutShadesAndTints: Story = {
  args: {},
  play: async ({ canvasElement }) => {
    const checkboxes = canvasElement.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
      (checkbox as HTMLInputElement).checked = false;
      checkbox.dispatchEvent(new Event('change', { bubbles: true }));
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
