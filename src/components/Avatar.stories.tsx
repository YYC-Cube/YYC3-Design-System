import type { Meta, StoryObj } from '@storybook/react';
import { Avatar } from './Avatar';
import { ThemeProvider } from '../theme/ThemeProvider';

const meta: Meta<typeof Avatar> = {
  title: 'Components/Avatar',
  component: Avatar,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg', 'xl'],
    },
    src: {
      control: 'text',
    },
    alt: {
      control: 'text',
    },
    fallback: {
      control: 'text',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Avatar>;

export const Default: Story = {
  args: {
    alt: 'John Doe',
    size: 'md',
  },
};

export const WithImage: Story = {
  args: {
    src: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix',
    alt: 'Felix',
    size: 'md',
  },
};

export const Small: Story = {
  args: {
    alt: 'Small Avatar',
    size: 'sm',
  },
};

export const Large: Story = {
  args: {
    alt: 'Large Avatar',
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    alt: 'Extra Large Avatar',
    size: 'xl',
  },
};

export const CustomFallback: Story = {
  args: {
    alt: 'Custom Avatar',
    fallback: 'AB',
    size: 'md',
  },
};

export const AllSizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar alt="Small" size="sm" />
      <Avatar alt="Medium" size="md" />
      <Avatar alt="Large" size="lg" />
      <Avatar alt="Extra Large" size="xl" />
    </div>
  ),
};

export const WithImages: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Felix" size="sm" />
      <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" alt="Aneka" size="md" />
      <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zack" alt="Zack" size="lg" />
      <Avatar src="https://api.dicebear.com/7.x/avataaars/svg?seed=Molly" alt="Molly" size="xl" />
    </div>
  ),
};

export const AvatarGroup: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <div style={{ display: 'flex', marginLeft: '-0.5rem' }}>
        <Avatar 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" 
          alt="Felix" 
          size="md" 
          style={{ border: '2px solid white', marginLeft: '-0.5rem' }}
        />
        <Avatar 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Aneka" 
          alt="Aneka" 
          size="md" 
          style={{ border: '2px solid white', marginLeft: '-0.5rem' }}
        />
        <Avatar 
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=Zack" 
          alt="Zack" 
          size="md" 
          style={{ border: '2px solid white', marginLeft: '-0.5rem' }}
        />
        <Avatar 
          alt="+5" 
          fallback="+5" 
          size="md" 
          style={{ border: '2px solid white', marginLeft: '-0.5rem' }}
        />
      </div>
    </div>
  ),
};

export const ErrorHandling: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
      <Avatar src="invalid-url.jpg" alt="Invalid Image" size="md" />
      <Avatar src="https://example.com/nonexistent.jpg" alt="Nonexistent" size="md" />
      <Avatar alt="Fallback Only" size="md" />
    </div>
  ),
};
