import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { ThemeProvider } from '../context/ThemeContext';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  decorators: [
    (Story) => (
      <ThemeProvider>
        <Story />
      </ThemeProvider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardContent>这是一个简单的卡片组件，用于展示内容。</CardContent>
    </Card>
  ),
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
      </CardHeader>
      <CardContent>这是一个带有标题的卡片组件。卡片可以包含标题、内容和其他元素。</CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Card>
        <CardHeader>
          <CardTitle>卡片 1</CardTitle>
        </CardHeader>
        <CardContent>这是第一个卡片的内容。</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 2</CardTitle>
        </CardHeader>
        <CardContent>这是第二个卡片的内容。</CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 3</CardTitle>
        </CardHeader>
        <CardContent>这是第三个卡片的内容。</CardContent>
      </Card>
    </div>
  ),
};

export const ComplexContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>复杂内容示例</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这是一个包含复杂内容的卡片。</p>
        <ul>
          <li>列表项 1</li>
          <li>列表项 2</li>
          <li>列表项 3</li>
        </ul>
        <p>卡片可以包含各种类型的内容，包括文本、列表、图片等。</p>
      </CardContent>
    </Card>
  ),
};
