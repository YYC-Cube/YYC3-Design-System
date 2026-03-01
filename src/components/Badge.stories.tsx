import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import { ThemeProvider } from '../context/ThemeContext';

const meta: Meta<typeof Badge> = {
  title: 'Components/Badge',
  component: Badge,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = {
  args: {
    variant: 'default',
    children: '默认徽章',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: '次要徽章',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: '危险徽章',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: '轮廓徽章',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
      <Badge variant="default">默认</Badge>
      <Badge variant="secondary">次要</Badge>
      <Badge variant="destructive">危险</Badge>
      <Badge variant="outline">轮廓</Badge>
    </div>
  ),
};

export const WithText: Story = {
  render: () => (
    <div>
      <p>
        这是一段包含徽章的文本 <Badge variant="default">新功能</Badge>， 可以用来突出显示重要信息。
      </p>
      <p style={{ marginTop: '1rem' }}>
        另一个示例 <Badge variant="secondary">提示</Badge>， 徽章可以灵活地嵌入到文本中。
      </p>
    </div>
  ),
};

export const StatusBadges: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div>
        <Badge variant="default">进行中</Badge> - 任务正在处理
      </div>
      <div>
        <Badge variant="secondary">已完成</Badge> - 任务已完成
      </div>
      <div>
        <Badge variant="destructive">已取消</Badge> - 任务已取消
      </div>
      <div>
        <Badge variant="outline">待处理</Badge> - 任务待处理
      </div>
    </div>
  ),
};
