/**
 * @file 菜单组件Story
 * @description Menu组件的Storybook故事
 * @module components/Menu.stories
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import type { Meta, StoryObj } from '@storybook/react';
import { Menu } from './Menu';

const meta: Meta<typeof Menu> = {
  title: 'Components/Menu',
  component: Menu,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    mode: {
      control: 'select',
      options: ['vertical', 'horizontal'],
      description: '菜单模式',
    },
    theme: {
      control: 'select',
      options: ['light', 'dark'],
      description: '主题',
    },
    inlineCollapsed: {
      control: 'boolean',
      description: '是否折叠',
    },
  },
};

export default meta;
type Story = StoryObj<typeof Menu>;

const mockItems = [
  { key: 'home', label: '首页', icon: '🏠' },
  { key: 'products', label: '产品', icon: '📦' },
  { key: 'services', label: '服务', icon: '⚙️' },
  { key: 'about', label: '关于', icon: 'ℹ️' },
];

export const Default: Story = {
  args: {
    items: mockItems,
    mode: 'vertical',
  },
};

export const Horizontal: Story = {
  args: {
    items: mockItems,
    mode: 'horizontal',
  },
};

export const WithIcons: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: '🏠' },
      { key: 'dashboard', label: '仪表盘', icon: '📊' },
      { key: 'settings', label: '设置', icon: '⚙️' },
      { key: 'logout', label: '退出', icon: '🚪' },
    ],
    mode: 'vertical',
  },
};

export const WithShortcuts: Story = {
  args: {
    items: [
      { key: 'new', label: '新建', shortcut: 'Ctrl+N' },
      { key: 'open', label: '打开', shortcut: 'Ctrl+O' },
      { key: 'save', label: '保存', shortcut: 'Ctrl+S' },
      { key: 'divider', label: '', divider: true },
      { key: 'exit', label: '退出', shortcut: 'Ctrl+Q' },
    ],
    mode: 'vertical',
  },
};

export const WithNestedMenu: Story = {
  args: {
    items: [
      {
        key: 'file',
        label: '文件',
        icon: '📄',
        children: [
          { key: 'new', label: '新建' },
          { key: 'open', label: '打开' },
          { key: 'save', label: '保存' },
          { key: 'divider', label: '', divider: true },
          { key: 'exit', label: '退出' },
        ],
      },
      {
        key: 'edit',
        label: '编辑',
        icon: '✏️',
        children: [
          { key: 'undo', label: '撤销', shortcut: 'Ctrl+Z' },
          { key: 'redo', label: '重做', shortcut: 'Ctrl+Y' },
          { key: 'divider', label: '', divider: true },
          { key: 'cut', label: '剪切', shortcut: 'Ctrl+X' },
          { key: 'copy', label: '复制', shortcut: 'Ctrl+C' },
          { key: 'paste', label: '粘贴', shortcut: 'Ctrl+V' },
        ],
      },
      {
        key: 'view',
        label: '视图',
        icon: '👁️',
        children: [
          { key: 'zoom-in', label: '放大', shortcut: 'Ctrl++' },
          { key: 'zoom-out', label: '缩小', shortcut: 'Ctrl+-' },
          { key: 'divider', label: '', divider: true },
          { key: 'fullscreen', label: '全屏', shortcut: 'F11' },
        ],
      },
    ],
    mode: 'vertical',
  },
};

export const WithDivider: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: '🏠' },
      { key: 'products', label: '产品', icon: '📦' },
      { key: 'divider', label: '', divider: true },
      { key: 'settings', label: '设置', icon: '⚙️' },
      { key: 'divider', label: '', divider: true },
      { key: 'logout', label: '退出', icon: '🚪' },
    ],
    mode: 'vertical',
  },
};

export const WithDisabledItems: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: '🏠' },
      { key: 'products', label: '产品', icon: '📦', disabled: true },
      { key: 'services', label: '服务', icon: '⚙️' },
      { key: 'about', label: '关于', icon: 'ℹ️', disabled: true },
    ],
    mode: 'vertical',
  },
};

export const DarkTheme: Story = {
  args: {
    items: mockItems,
    mode: 'vertical',
    theme: 'dark',
  },
};

export const Collapsed: Story = {
  args: {
    items: mockItems,
    mode: 'vertical',
    inlineCollapsed: true,
  },
};

export const WithSelectedKey: Story = {
  args: {
    items: mockItems,
    mode: 'vertical',
    selectedKey: 'products',
  },
};

export const WithOnSelect: Story = {
  args: {
    items: mockItems,
    mode: 'vertical',
    onSelect: (key) => alert(`选中: ${key}`),
  },
};

export const WithOnClick: Story = {
  args: {
    items: [
      { key: 'home', label: '首页', icon: '🏠', onClick: () => alert('首页') },
      { key: 'products', label: '产品', icon: '📦', onClick: () => alert('产品') },
      { key: 'services', label: '服务', icon: '⚙️', onClick: () => alert('服务') },
    ],
    mode: 'vertical',
  },
};

export const LongMenu: Story = {
  args: {
    items: Array.from({ length: 15 }, (_, i) => ({
      key: `item-${i}`,
      label: `菜单项 ${i + 1}`,
      icon: '📄',
    })),
    mode: 'vertical',
  },
};

export const HorizontalWithNested: Story = {
  args: {
    items: [
      {
        key: 'file',
        label: '文件',
        children: [
          { key: 'new', label: '新建' },
          { key: 'open', label: '打开' },
        ],
      },
      {
        key: 'edit',
        label: '编辑',
        children: [
          { key: 'undo', label: '撤销' },
          { key: 'redo', label: '重做' },
        ],
      },
    ],
    mode: 'horizontal',
  },
};
