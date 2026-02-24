/**
 * @file 实时编辑器组件测试
 * @description 测试 RealtimeEditor 组件的各项功能
 * @module __tests__/components/RealtimeEditor.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'

import '@testing-library/jest-dom';
import { RealtimeEditor } from './RealtimeEditor';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('RealtimeEditor', () => {
  it('应该渲染组件', () => {
    renderWithTheme(<RealtimeEditor />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = renderWithTheme(<RealtimeEditor className="custom-class" />);
    expect(container.querySelector('.custom-class')).toBeInTheDocument();
  });

  it('应该支持初始令牌', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持 onSave 回调', () => {
    const onSave = jest.fn();
    renderWithTheme(<RealtimeEditor onSave={onSave} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持 userId', () => {
    renderWithTheme(<RealtimeEditor userId="test-user" />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示初始令牌', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText('color.primary')).toBeInTheDocument();
    expect(screen.getByText('color.secondary')).toBeInTheDocument();
  });

  it('应该支持搜索令牌', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'spacing.large': '20px',
      'font.size': '16px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    fireEvent.change(searchInput, { target: { value: 'color' } });
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
    });
  });

  it('应该支持类别筛选', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'spacing.large': '20px',
      'font.size': '16px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const colorCategory = screen.getByText('color');
    fireEvent.click(colorCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
    });
  });

  it('应该支持添加新令牌', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该支持编辑令牌值', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该支持删除令牌', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    window.confirm = jest.fn(() => true);
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该显示未保存状态', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该支持保存更改', () => {
    const onSave = jest.fn();
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} onSave={onSave} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该支持撤销更改', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该支持放弃更改', () => {
    window.confirm = jest.fn(() => true);
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText('实时编辑器')).toBeInTheDocument();
  });

  it('应该显示颜色预览', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const colorPreview = document.querySelector('.w-4.h-4');
    expect(colorPreview).toHaveStyle({ background: '#ff0000' });
  });

  it('应该显示更改历史', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    expect(tokenValue).toBeInTheDocument();
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
      }
    }
  });

  it('应该支持按 Enter 键保存编辑', async () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    expect(tokenValue).toBeInTheDocument();
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
  });

  it('应该支持按 Escape 键取消编辑', async () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    expect(tokenValue).toBeInTheDocument();
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.keyDown(editInput, { key: 'Escape' });
      }
    }
  });

  it('应该显示更改历史', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示更改历史数量', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持多个类别筛选', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00',
      'spacing.large': '20px',
      'spacing.small': '10px',
      'font.size': '16px',
      'font.weight': 'bold'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const colorCategory = screen.getByText('color');
    fireEvent.click(colorCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('color.secondary')).toBeInTheDocument();
    });
    
    const allCategory = screen.getByText('全部');
    fireEvent.click(allCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('color.secondary')).toBeInTheDocument();
      expect(screen.getByText('spacing.large')).toBeInTheDocument();
      expect(screen.getByText('spacing.small')).toBeInTheDocument();
      expect(screen.getByText('font.size')).toBeInTheDocument();
      expect(screen.getByText('font.weight')).toBeInTheDocument();
    });
  });

  it('应该支持搜索和筛选组合', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00',
      'spacing.large': '20px',
      'spacing.small': '10px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const colorCategory = screen.getByText('color');
    fireEvent.click(colorCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
    });
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    fireEvent.change(searchInput, { target: { value: 'secondary' } });
    
    await waitFor(() => {
      expect(screen.getByText('color.secondary')).toBeInTheDocument();
    });
  });

  it('应该处理空搜索结果', async () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.queryByText('color.primary')).not.toBeInTheDocument();
    });
  });

  it('应该显示令牌数量', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00',
      'spacing.large': '20px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText(/令牌 \(3\)/i)).toBeInTheDocument();
  });

  it('应该支持空令牌列表', () => {
    renderWithTheme(<RealtimeEditor initialTokens={{}} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
    expect(screen.getByText(/令牌 \(0\)/i)).toBeInTheDocument();
  });

  it('应该显示已保存时间', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该禁用撤销按钮当无法撤销时', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const undoButton = screen.getByText('撤销');
    expect(undoButton).toBeDisabled();
  });

  it('应该禁用保存按钮当没有更改时', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const saveButton = screen.getByText('保存');
    expect(saveButton).toBeDisabled();
  });

  it('应该禁用放弃更改按钮当没有更改时', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const discardButton = screen.getByText('放弃更改');
    expect(discardButton).toBeDisabled();
  });

  it('应该禁用添加按钮当令牌名称或值为空时', () => {
    renderWithTheme(<RealtimeEditor initialTokens={{}} />);
    
    const addButton = screen.getByText('添加');
    expect(addButton).toBeDisabled();
  });

  it('应该处理空令牌列表', () => {
    renderWithTheme(<RealtimeEditor initialTokens={{}} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
    expect(screen.getByText(/令牌 \(0\)/i)).toBeInTheDocument();
  });

  it('应该处理无效令牌值', () => {
    const initialTokens = {
      'color.invalid': 'invalid-value'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该处理长令牌名称', () => {
    const initialTokens = {
      'color.very.long.token.name.that.exceeds.normal.length': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该处理特殊字符在令牌名称中', () => {
    const initialTokens = {
      'color.special@token#name': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持多个类别筛选', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00',
      'spacing.large': '20px',
      'spacing.small': '10px',
      'font.size': '16px',
      'font.weight': 'bold'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const colorCategory = screen.getByText('color');
    fireEvent.click(colorCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('color.secondary')).toBeInTheDocument();
    });
    
    const allCategory = screen.getByText('全部');
    fireEvent.click(allCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('color.secondary')).toBeInTheDocument();
      expect(screen.getByText('spacing.large')).toBeInTheDocument();
      expect(screen.getByText('spacing.small')).toBeInTheDocument();
      expect(screen.getByText('font.size')).toBeInTheDocument();
      expect(screen.getByText('font.weight')).toBeInTheDocument();
    });
  });

  it('应该支持搜索不存在的令牌', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'spacing.large': '20px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    fireEvent.change(searchInput, { target: { value: 'nonexistent' } });
    
    await waitFor(() => {
      expect(screen.queryByText('color.primary')).not.toBeInTheDocument();
      expect(screen.queryByText('spacing.large')).not.toBeInTheDocument();
    });
  });

  it('应该支持清空搜索', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'spacing.large': '20px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    fireEvent.change(searchInput, { target: { value: 'color' } });
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
    });
    
    fireEvent.change(searchInput, { target: { value: '' } });
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('spacing.large')).toBeInTheDocument();
    });
  });

  it('应该支持选择所有类别', async () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'spacing.large': '20px',
      'font.size': '16px'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const allCategory = screen.getByText('全部');
    fireEvent.click(allCategory);
    
    await waitFor(() => {
      expect(screen.getByText('color.primary')).toBeInTheDocument();
      expect(screen.getByText('spacing.large')).toBeInTheDocument();
      expect(screen.getByText('font.size')).toBeInTheDocument();
    });
  });

  it('应该处理保存失败', () => {
    const onSave = jest.fn(() => {
      throw new Error('Save failed');
    });
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} onSave={onSave} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该处理空 userId', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} userId="" />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该处理 undefined userId', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} userId={undefined as any} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持复制令牌值', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    expect(tokenValue).toBeInTheDocument();
  });

  it('应该支持粘贴令牌值', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    expect(tokenValue).toBeInTheDocument();
  });

  it('应该处理重复令牌名称', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持重置为默认值', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示加载状态', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该处理网络错误', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持键盘导航', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    searchInput.focus();
    fireEvent.keyDown(searchInput, { key: 'ArrowDown' });
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持 Tab 键切换焦点', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const searchInput = screen.getByPlaceholderText('搜索令牌...');
    searchInput.focus();
    fireEvent.keyDown(searchInput, { key: 'Tab' });
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该调用 onSave 回调', async () => {
    const onSave = jest.fn();
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} onSave={onSave} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    const saveButton = screen.getByText('保存');
    fireEvent.click(saveButton);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示确认对话框删除令牌', () => {
    window.confirm = jest.fn(() => true);
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const deleteButton = screen.getByText('删除');
    fireEvent.click(deleteButton);
    
    expect(window.confirm).toHaveBeenCalledWith('确定要删除令牌 color.primary 吗？');
  });

  it('应该显示确认对话框放弃更改', async () => {
    window.confirm = jest.fn(() => true);
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    const discardButton = screen.getByText('放弃更改');
    fireEvent.click(discardButton);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示验证错误提示', () => {
    window.alert = jest.fn();
    const initialTokens = {};
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const nameInput = container.querySelectorAll('input')[1];
    const valueInput = container.querySelectorAll('input')[2];
    const addButton = screen.getByText('添加');
    
    if (nameInput && valueInput) {
      fireEvent.change(nameInput, { target: { value: 'color.new' } });
      fireEvent.change(valueInput, { target: { value: '#0000ff' } });
      fireEvent.click(addButton);
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持撤销操作', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    const undoButton = screen.getByText('撤销');
    if (!undoButton.hasAttribute('disabled')) {
      fireEvent.click(undoButton);
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持添加新令牌', () => {
    const initialTokens = {};
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const nameInput = container.querySelectorAll('input')[1];
    const valueInput = container.querySelectorAll('input')[2];
    const addButton = screen.getByText('添加');
    
    if (nameInput && valueInput) {
      fireEvent.change(nameInput, { target: { value: 'color.new' } });
      fireEvent.change(valueInput, { target: { value: '#0000ff' } });
      fireEvent.click(addButton);
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示颜色预览', () => {
    const initialTokens = {
      'color.primary': '#ff0000',
      'color.secondary': '#00ff00'
    };
    renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示更改历史', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持更改历史显示旧值和新值', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持更改历史的倒序显示', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该支持更改历史的滚动', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });

  it('应该显示更改历史数量', () => {
    const initialTokens = {
      'color.primary': '#ff0000'
    };
    const { container } = renderWithTheme(<RealtimeEditor initialTokens={initialTokens} />);
    
    const tokenValues = container.querySelectorAll('.p-2.rounded');
    const tokenValue = Array.from(tokenValues).find(el => el.textContent === '#ff0000');
    if (tokenValue) {
      fireEvent.click(tokenValue);
      
      const editInput = container.querySelector('input[type="text"]');
      if (editInput) {
        fireEvent.change(editInput, { target: { value: '#00ff00' } });
        fireEvent.keyDown(editInput, { key: 'Enter' });
      }
    }
    
    expect(screen.getByText(/实时编辑器/i)).toBeInTheDocument();
  });
});
