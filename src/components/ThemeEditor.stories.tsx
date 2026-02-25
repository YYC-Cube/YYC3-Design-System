import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ThemeEditor } from './ThemeEditor';
import { ThemeProvider } from '../theme/ThemeProvider';

const meta: Meta<typeof ThemeEditor> = {
  title: 'Components/ThemeEditor',
  component: ThemeEditor,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <div style={{ minHeight: '800px' }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    initialPresetId: {
      control: { type: 'select' },
      options: ['light', 'dark', 'forest', 'ocean', 'sunset', 'midnight', 'lavender', 'rose', 'amber', 'cyan', 'slate'],
    },
    showPreview: {
      control: 'boolean',
    },
    onSave: {
      action: 'onSave',
    },
    onExport: {
      action: 'onExport',
    },
    onImport: {
      action: 'onImport',
    },
  },
};

export default meta;
type Story = StoryObj<typeof ThemeEditor>;

export const Default: Story = {
  args: {
    initialPresetId: 'light',
    showPreview: true,
  },
};

export const DarkPreset: Story = {
  args: {
    initialPresetId: 'dark',
    showPreview: true,
  },
};

export const ForestTheme: Story = {
  args: {
    initialPresetId: 'forest',
    showPreview: true,
  },
};

export const OceanTheme: Story = {
  args: {
    initialPresetId: 'ocean',
    showPreview: true,
  },
};

export const LavenderTheme: Story = {
  args: {
    initialPresetId: 'lavender',
    showPreview: true,
  },
};

export const RoseTheme: Story = {
  args: {
    initialPresetId: 'rose',
    showPreview: true,
  },
};

export const NoPreview: Story = {
  args: {
    initialPresetId: 'light',
    showPreview: false,
  },
  parameters: {
    layout: 'centered',
  },
};
