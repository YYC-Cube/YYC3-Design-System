/**
 * @file 分页组件Story
 * @description Pagination组件的Storybook故事
 * @module components/Pagination.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    current: {
      control: 'number',
      description: '当前页码',
    },
    pageSize: {
      control: 'number',
      description: '每页条数',
    },
    total: {
      control: 'number',
      description: '总条数',
    },
    showSizeChanger: {
      control: 'boolean',
      description: '是否显示每页数量选择器',
    },
    showQuickJumper: {
      control: 'boolean',
      description: '是否显示快速跳转',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
    simple: {
      control: 'boolean',
      description: '是否使用简单模式',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {
  args: {
    total: 100,
    current: 1,
    pageSize: 10,
  },
};

export const WithShowTotal: Story = {
  args: {
    ...Default.args,
    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} 条`,
  },
};

export const WithSizeChanger: Story = {
  args: {
    ...Default.args,
    showSizeChanger: true,
    pageSizeOptions: [10, 20, 50, 100],
  },
};

export const WithQuickJumper: Story = {
  args: {
    ...Default.args,
    showQuickJumper: true,
  },
};

export const Simple: Story = {
  args: {
    ...Default.args,
    simple: true,
  },
};

export const Disabled: Story = {
  args: {
    ...Default.args,
    disabled: true,
  },
};

export const LargeTotal: Story = {
  args: {
    total: 1000,
    current: 5,
    pageSize: 10,
  },
};

export const SmallTotal: Story = {
  args: {
    total: 20,
    current: 1,
    pageSize: 10,
  },
};

export const MiddlePage: Story = {
  args: {
    total: 100,
    current: 5,
    pageSize: 10,
  },
};

export const LastPage: Story = {
  args: {
    total: 100,
    current: 10,
    pageSize: 10,
  },
};

export const CustomPageSize: Story = {
  args: {
    total: 100,
    current: 1,
    pageSize: 20,
  },
};

export const WithAllFeatures: Story = {
  args: {
    total: 100,
    current: 3,
    pageSize: 10,
    showSizeChanger: true,
    showQuickJumper: true,
    showTotal: (total, range) => `${range[0]}-${range[1]} / ${total} 条`,
    pageSizeOptions: [10, 20, 50, 100],
  },
};

export const WithOnChange: Story = {
  args: {
    total: 100,
    current: 1,
    pageSize: 10,
    onChange: (page, pageSize) => alert(`跳转到第${page}页，每页${pageSize}条`),
  },
};
