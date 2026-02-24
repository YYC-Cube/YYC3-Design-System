/**
 * @file 下拉菜单组件测试
 * @description 测试Dropdown组件的各项功能
 * @module __tests__/components/Dropdown.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

;

import { render, fireEvent, waitFor } from '@testing-library/react'
import { screen } from '@testing-library/dom';

import { Dropdown } from '../Dropdown';
import { Button } from '../Button'
import { ThemeProvider } from '../../theme/ThemeProvider';;

describe('Dropdown', () => {
  const mockOptions = [
    { key: '1', label: '选项1' },
    { key: '2', label: '选项2' },
    { key: '3', label: '选项3' },
  ];

  it('应该渲染下拉菜单', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    expect(screen.getByText('点击')).toBeInTheDocument();
  });

  it('点击时应该显示下拉菜单', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('应该调用选项的onClick回调', () => {
    const mockOnClick = jest.fn();
    const optionsWithClick = [
      { key: '1', label: '选项1', onClick: mockOnClick },
    ];
    render(<ThemeProvider>
      <Dropdown options={optionsWithClick}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    const option = screen.getByText('选项1');
    fireEvent.click(option);
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('应该支持禁用选项', () => {
    const disabledOptions = [
      { key: '1', label: '选项1' },
      { key: '2', label: '选项2', disabled: true },
    ];
    render(<ThemeProvider>
      <Dropdown options={disabledOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    const disabledOption = screen.getByText('选项2').closest('div');
    expect(disabledOption).toHaveAttribute('aria-disabled', 'true');
  });

  it('应该支持分隔线', () => {
    const optionsWithDivider = [
      { key: '1', label: '选项1' },
      { key: 'divider', label: '', divider: true },
      { key: '2', label: '选项2' },
    ];
    render(<ThemeProvider>
      <Dropdown options={optionsWithDivider}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    const divider = screen.getByRole('menu').querySelector('div[style*="height: 1px"]');
    expect(divider).toBeInTheDocument();
  });

  it('应该支持图标', () => {
    const optionsWithIcon = [
      { key: '1', label: '选项1', icon: '📄' },
    ];
    render(<ThemeProvider>
      <Dropdown options={optionsWithIcon}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.getByText('📄')).toBeInTheDocument();
  });

  it('应该支持多级菜单', () => {
    const nestedOptions = [
      {
        key: '1',
        label: '父选项',
        children: [
          { key: '1-1', label: '子选项1' },
          { key: '1-2', label: '子选项2' },
        ],
      },
    ];
    render(<ThemeProvider>
      <Dropdown options={nestedOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.getByText('子选项1')).toBeInTheDocument();
    expect(screen.getByText('子选项2')).toBeInTheDocument();
  });

  it('应该支持hover触发', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions} trigger="hover">
        <Button>悬停</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('悬停');
    fireEvent.mouseEnter(trigger);
    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('应该支持受控visible', () => {
    const { rerender } = render(<ThemeProvider>
      <Dropdown options={mockOptions} visible={false}>
        <Button>点击</Button>
      </Dropdown>
    );
    expect(screen.queryByText('选项1')).not.toBeInTheDocument();

    rerender(<ThemeProvider>
      <Dropdown options={mockOptions} visible={true}>
        <Button>点击</Button>
      </Dropdown>
    );
    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('应该支持禁用状态', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions} disabled>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.queryByText('选项1')).not.toBeInTheDocument();
  });

  it('应该支持不同placement', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions} placement="topLeft">
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('应该支持键盘导航', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    fireEvent.keyDown(trigger, { key: 'ArrowDown' });
    expect(screen.getByText('选项1')).toBeInTheDocument();
  });

  it('应该支持ESC键关闭', () => {
    render(<ThemeProvider>
      <Dropdown options={mockOptions}>
        <Button>点击</Button>
      </Dropdown>
    );
    const trigger = screen.getByText('点击');
    fireEvent.click(trigger);
    expect(screen.getByText('选项1')).toBeInTheDocument();
    fireEvent.keyDown(trigger, { key: 'Escape' });
    expect(screen.queryByText('选项1')).not.toBeInTheDocument();
  });

  it('应该支持自定义类名', () => {
    const { container } = render(<ThemeProvider>
      <Dropdown options={mockOptions} className="custom-dropdown">
        <Button>点击</Button>
      </Dropdown>
    );
    expect(container.querySelector('.custom-dropdown')).toBeInTheDocument();
  });
});
