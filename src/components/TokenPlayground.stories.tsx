import type { Meta, StoryObj } from '@storybook/react';
import { TokenPlayground } from './TokenPlayground';

const meta: Meta<typeof TokenPlayground> = {
  title: 'Tools/TokenPlayground',
  component: TokenPlayground,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof TokenPlayground>;

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
