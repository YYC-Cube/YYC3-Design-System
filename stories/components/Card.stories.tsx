/**
 * @file Card 组件 Story
 * @description Card 组件的 Storybook 故事
 * @module stories/components/Card.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardHeader, CardTitle, CardContent } from '../../src/components/Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  subcomponents: { CardHeader, CardTitle, CardContent },
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: '自定义类名',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Card>;

export const Default: Story = {
  args: {
    children: <CardContent>这是一个默认的卡片组件</CardContent>,
  },
};

export const WithHeader: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>卡片标题</CardTitle>
      </CardHeader>
      <CardContent>
        这是卡片的内容区域。可以放置文本、图片、按钮等各种内容。
      </CardContent>
    </Card>
  ),
};

export const WithLongContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>长内容卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这是第一段内容。卡片组件可以容纳较长的文本内容。</p>
        <p>这是第二段内容。Card组件提供了良好的视觉层次结构。</p>
        <p>这是第三段内容。通过使用CardHeader和CardTitle，可以清晰地组织卡片内容。</p>
        <p>这是第四段内容。CardContent区域可以包含任意React元素。</p>
      </CardContent>
    </Card>
  ),
};

export const WithMultipleElements: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>多元素卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ marginBottom: '1rem' }}>
          <strong>用户信息</strong>
        </div>
        <p>姓名：张三</p>
        <p>邮箱：zhangsan@yyc3.com</p>
        <p>职位：前端工程师</p>
        <div style={{ marginTop: '1rem' }}>
          <button style={{ padding: '0.5rem 1rem', background: '#d45a5f', color: '#fff', border: 'none', borderRadius: '0.5rem' }}>
            编辑
          </button>
        </div>
      </CardContent>
    </Card>
  ),
};

export const Minimal: Story = {
  render: () => (
    <Card>
      <CardContent>
        这是一个简洁的卡片，没有标题和头部。
      </CardContent>
    </Card>
  ),
};

export const WithCustomContent: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>自定义内容</CardTitle>
      </CardHeader>
      <CardContent>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ 
            width: '60px', 
            height: '60px', 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
            borderRadius: '50%' 
          }} />
          <div>
            <div style={{ fontWeight: '600', marginBottom: '0.25rem' }}>用户头像</div>
            <div style={{ fontSize: '0.875rem', color: '#666' }}>这是一个圆形头像占位符</div>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
};

export const MultipleCards: Story = {
  render: () => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', maxWidth: '800px' }}>
      <Card>
        <CardHeader>
          <CardTitle>卡片 1</CardTitle>
        </CardHeader>
        <CardContent>
          这是第一个卡片的内容。
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 2</CardTitle>
        </CardHeader>
        <CardContent>
          这是第二个卡片的内容。
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>卡片 3</CardTitle>
        </CardHeader>
        <CardContent>
          这是第三个卡片的内容。
        </CardContent>
      </Card>
    </div>
  ),
};

export const InteractiveCard: Story = {
  render: () => (
    <Card style={{ cursor: 'pointer', transition: 'transform 0.2s ease' }}>
      <CardHeader>
        <CardTitle>可交互卡片</CardTitle>
      </CardHeader>
      <CardContent>
        <p>这个卡片可以点击</p>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '0.5rem' }}>
          鼠标悬停时可以添加交互效果
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithList: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>任务列表</CardTitle>
      </CardHeader>
      <CardContent>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            ✓ 完成项目规划
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            ✓ 设计系统架构
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            ✓ 开发核心组件
          </li>
          <li style={{ padding: '0.5rem 0', borderBottom: '1px solid #eee' }}>
            ⏳ 编写文档
          </li>
          <li style={{ padding: '0.5rem 0' }}>
            ⏳ 性能优化
          </li>
        </ul>
      </CardContent>
    </Card>
  ),
};

export const StatsCard: Story = {
  render: () => (
    <Card>
      <CardContent>
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.5rem' }}>
          总访问量
        </div>
        <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '0.5rem' }}>
          12,345
        </div>
        <div style={{ fontSize: '0.875rem', color: '#10b981' }}>
          ↑ 12.5% 较上周
        </div>
      </CardContent>
    </Card>
  ),
};
