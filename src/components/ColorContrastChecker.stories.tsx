import type { Meta, StoryObj } from '@storybook/react';
import { ColorContrastChecker } from './ColorContrastChecker';

const meta: Meta<typeof ColorContrastChecker> = {
  title: 'Tools/ColorContrastChecker',
  component: ColorContrastChecker,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof ColorContrastChecker>;

export const Default: Story = {
  args: {},
};

export const DarkMode: Story = {
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  args: {},
};
