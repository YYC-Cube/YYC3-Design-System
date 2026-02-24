/**
 * @file 表格组件Story
 * @description Table组件的Storybook故事
 * @module components/Table.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Table } from './Table';

const meta: Meta<typeof Table> = {
  title: 'Components/Table',
  component: Table,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    bordered: {
      control: 'boolean',
      description: '是否显示边框',
    },
    size: {
      control: 'select',
      options: ['small', 'middle', 'large'],
      description: '表格尺寸',
    },
    showHeader: {
      control: 'boolean',
      description: '是否显示表头',
    },
    loading: {
      control: 'boolean',
      description: '是否加载中',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Table>;

const mockData = [
  { id: 1, name: 'John Doe', age: 30, email: 'john@example.com', status: 'Active' },
  { id: 2, name: 'Jane Smith', age: 25, email: 'jane@example.com', status: 'Inactive' },
  { id: 3, name: 'Bob Johnson', age: 35, email: 'bob@example.com', status: 'Active' },
  { id: 4, name: 'Alice Brown', age: 28, email: 'alice@example.com', status: 'Active' },
  { id: 5, name: 'Charlie Wilson', age: 42, email: 'charlie@example.com', status: 'Inactive' },
];

const mockColumns = [
  { key: 'name', title: '姓名', dataIndex: 'name', sortable: true },
  { key: 'age', title: '年龄', dataIndex: 'age', sortable: true },
  { key: 'email', title: '邮箱', dataIndex: 'email' },
  {
    key: 'status',
    title: '状态',
    dataIndex: 'status',
    render: (value: unknown) => (
      <span style={{ color: value === 'Active' ? 'green' : 'red' }}>
        {value as string}
      </span>
    ),
  },
];

export const Default: Story = {
  args: {
    columns: mockColumns,
    dataSource: mockData,
    rowKey: 'id',
  },
};

export const Bordered: Story = {
  args: {
    ...Default.args,
    bordered: true,
  },
};

export const Small: Story = {
  args: {
    ...Default.args,
    size: 'small',
  },
};

export const Large: Story = {
  args: {
    ...Default.args,
    size: 'large',
  },
};

export const WithPagination: Story = {
  args: {
    ...Default.args,
    pagination: {
      current: 1,
      pageSize: 10,
      total: 100,
      showSizeChanger: true,
      showQuickJumper: true,
    },
  },
};

export const WithRowSelection: Story = {
  args: {
    ...Default.args,
    rowSelection: {
      type: 'checkbox',
    },
  },
};

export const WithRadioSelection: Story = {
  args: {
    ...Default.args,
    rowSelection: {
      type: 'radio',
    },
  },
};

export const Loading: Story = {
  args: {
    ...Default.args,
    loading: true,
  },
};

export const WithoutHeader: Story = {
  args: {
    ...Default.args,
    showHeader: false,
  },
};

export const CustomRender: Story = {
  args: {
    columns: [
      { key: 'name', title: '姓名', dataIndex: 'name' },
      { key: 'age', title: '年龄', dataIndex: 'age' },
      {
        key: 'email',
        title: '邮箱',
        dataIndex: 'email',
        render: (value: unknown) => <a href={`mailto:${value}`}>{value as string}</a>,
      },
    ],
    dataSource: mockData,
    rowKey: 'id',
  },
};

export const WithScroll: Story = {
  args: {
    ...Default.args,
    scroll: {
      x: 800,
      y: 300,
    },
  },
};

export const WithRowClick: Story = {
  args: {
    ...Default.args,
    onRow: (record) => ({
      onClick: () => alert(`Clicked row: ${record.name}`),
      onDoubleClick: () => alert(`Double clicked row: ${record.name}`),
    }),
  },
};
