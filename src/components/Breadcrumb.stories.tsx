/**
 * @file 面包屑导航组件Story
 * @description Breadcrumb组件的Storybook故事
 * @module components/Breadcrumb.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Breadcrumb } from './Breadcrumb';

const meta: Meta<typeof Breadcrumb> = {
  title: 'Components/Breadcrumb',
  component: Breadcrumb,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    separator: {
      control: 'text',
      description: '分隔符',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Breadcrumb>;

const mockItems = [
  { key: 'home', title: '首页', href: '/' },
  { key: 'products', title: '产品', href: '/products' },
  { key: 'detail', title: '详情' },
];

export const Default: Story = {
  args: {
    items: mockItems,
  },
};

export const WithCustomSeparator: Story = {
  args: {
    items: mockItems,
    separator: '>',
  },
};

export const WithArrowSeparator: Story = {
  args: {
    items: mockItems,
    separator: '→',
  },
};

export const WithChevronSeparator: Story = {
  args: {
    items: mockItems,
    separator: '›',
  },
};

export const LongBreadcrumb: Story = {
  args: {
    items: [
      { key: 'home', title: '首页', href: '/' },
      { key: 'category', title: '分类', href: '/category' },
      { key: 'subcategory', title: '子分类', href: '/category/sub' },
      { key: 'products', title: '产品', href: '/category/sub/products' },
      { key: 'detail', title: '详情' },
    ],
  },
};

export const WithDisabledItem: Story = {
  args: {
    items: [
      { key: 'home', title: '首页', href: '/' },
      { key: 'products', title: '产品', href: '/products', disabled: true },
      { key: 'detail', title: '详情' },
    ],
  },
};

export const WithClickHandler: Story = {
  args: {
    items: [
      { key: 'home', title: '首页', onClick: () => alert('点击首页') },
      { key: 'products', title: '产品', onClick: () => alert('点击产品') },
      { key: 'detail', title: '详情' },
    ],
  },
};

export const SingleItem: Story = {
  args: {
    items: [{ key: 'home', title: '首页' }],
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { key: 'home', title: '🏠 首页', href: '/' },
      { key: 'products', title: '📦 产品', href: '/products' },
      { key: 'detail', title: '📄 详情' },
    ],
  },
};

export const WithCustomComponentSeparator: Story = {
  args: {
    items: mockItems,
    separator: <span style={{ color: '#d45a5f', margin: '0 8px' }}>→</span>,
  },
};
