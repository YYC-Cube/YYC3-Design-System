/**
 * @file 下拉菜单组件Story
 * @description Dropdown组件的Storybook故事
 * @module components/Dropdown.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import { Button } from './Button';

const meta: Meta<typeof Dropdown> = {
  title: 'Components/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    trigger: {
      control: 'select',
      options: ['click', 'hover'],
      description: '触发方式',
    },
    placement: {
      control: 'select',
      options: ['bottomLeft', 'bottomCenter', 'bottomRight', 'topLeft', 'topCenter', 'topRight'],
      description: '弹出位置',
    },
    disabled: {
      control: 'boolean',
      description: '是否禁用',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

const mockOptions = [
  { key: '1', label: '新建项目' },
  { key: '2', label: '打开项目' },
  { key: 'divider', label: '', divider: true },
  { key: '3', label: '保存' },
  { key: '4', label: '另存为' },
  { key: 'divider', label: '', divider: true },
  { key: '5', label: '退出', disabled: true },
];

export const Default: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>点击打开</Button>,
  },
};

export const WithIcons: Story = {
  args: {
    options: [
      { key: '1', label: '新建项目', icon: '📄' },
      { key: '2', label: '打开项目', icon: '📂' },
      { key: 'divider', label: '', divider: true },
      { key: '3', label: '保存', icon: '💾' },
      { key: '4', label: '另存为', icon: '💿' },
    ],
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>带图标</Button>,
  },
};

export const WithNestedMenu: Story = {
  args: {
    options: [
      {
        key: '1',
        label: '文件',
        children: [
          { key: '1-1', label: '新建' },
          { key: '1-2', label: '打开' },
          { key: '1-3', label: '保存' },
        ],
      },
      {
        key: '2',
        label: '编辑',
        children: [
          { key: '2-1', label: '撤销' },
          { key: '2-2', label: '重做' },
          { key: '2-3', label: '复制' },
          { key: '2-4', label: '粘贴' },
        ],
      },
    ],
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>多级菜单</Button>,
  },
};

export const HoverTrigger: Story = {
  args: {
    options: mockOptions,
    trigger: 'hover',
    placement: 'bottomLeft',
    children: <Button>悬停打开</Button>,
  },
};

export const TopPlacement: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'topLeft',
    children: <Button>上方弹出</Button>,
  },
};

export const CenterPlacement: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'bottomCenter',
    children: <Button>居中弹出</Button>,
  },
};

export const RightPlacement: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'bottomRight',
    children: <Button>右侧弹出</Button>,
  },
};

export const Disabled: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'bottomLeft',
    disabled: true,
    children: <Button>禁用</Button>,
  },
};

export const WithOnClick: Story = {
  args: {
    options: [
      { key: '1', label: '新建项目', onClick: () => alert('新建项目') },
      { key: '2', label: '打开项目', onClick: () => alert('打开项目') },
      { key: 'divider', label: '', divider: true },
      { key: '3', label: '保存', onClick: () => alert('保存') },
    ],
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>带点击事件</Button>,
  },
};

export const CustomTrigger: Story = {
  args: {
    options: mockOptions,
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button variant="secondary">自定义触发器</Button>,
  },
};

export const LongOptions: Story = {
  args: {
    options: Array.from({ length: 20 }, (_, i) => ({
      key: `${i + 1}`,
      label: `选项 ${i + 1}`,
    })),
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>长列表</Button>,
  },
};

export const WithDisabledOptions: Story = {
  args: {
    options: [
      { key: '1', label: '可用选项' },
      { key: '2', label: '禁用选项', disabled: true },
      { key: '3', label: '另一个可用选项' },
    ],
    trigger: 'click',
    placement: 'bottomLeft',
    children: <Button>包含禁用项</Button>,
  },
};
