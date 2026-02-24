/**
 * @file Switch 组件测试
 * @description 测试 Switch 组件的各项功能
 * @module __tests__/components/Switch.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React from 'react';
;

import { render, fireEvent, waitFor } from '@testing-library/react'


import { Switch } from './Switch';
import { ThemeProvider } from '../theme/ThemeProvider';

describe('Switch 组件', () => {
  const renderWithTheme = (component: React.ReactElement) => {
    return render(<ThemeProvider>{component}</ThemeProvider>);
  };

  it('应该正确渲染未选中的 Switch', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
  });

  it('应该正确渲染选中的 Switch', () => {
    renderWithTheme(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('应该在点击时切换状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在选中状态下点击时切换为 false', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch checked onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it('应该在禁用状态下不响应点击', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch disabled onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).not.toHaveBeenCalled();
  });

  it('应该应用自定义 className', () => {
    const { container } = renderWithTheme(<Switch className="custom-class" />);
    
    const switchElement = container.querySelector('.custom-class');
    expect(switchElement).toBeInTheDocument();
  });

  it('应该在禁用时设置正确的属性', () => {
    renderWithTheme(<Switch disabled />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('tabIndex', '-1');
  });

  it('应该在未禁用时设置正确的属性', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('tabIndex', '0');
  });

  it('应该在选中时应用正确的背景色', () => {
    renderWithTheme(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
    });
  });

  it('应该在未选中时应用正确的背景色', () => {
    renderWithTheme(<Switch checked={false} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      backgroundColor: 'rgb(160, 160, 160)',
    });
  });

  it('应该在选中时正确设置滑块位置', () => {
    renderWithTheme(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('div');
    expect(thumb).toHaveStyle({
      left: '1.625rem',
    });
  });

  it('应该在未选中时正确设置滑块位置', () => {
    renderWithTheme(<Switch checked={false} />);
    
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('div');
    expect(thumb).toHaveStyle({
      left: '0.125rem',
    });
  });

  it('应该在禁用时应用正确的样式', () => {
    renderWithTheme(<Switch disabled />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      cursor: 'not-allowed',
      opacity: 0.5,
    });
  });

  it('应该在未禁用时应用正确的样式', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      cursor: 'pointer',
      opacity: 1,
    });
  });

  it('应该支持受控模式', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch checked={true} onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('应该在非受控模式下维护内部状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'false');
    
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在受控模式下正确处理状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch checked={true} onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('应该正确设置 aria-checked 属性', () => {
    renderWithTheme(<Switch checked={true} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveAttribute('aria-checked', 'true');
  });

  it('应该正确设置 role 属性', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toBeInTheDocument();
  });

  it('应该在点击时正确处理 onChange 回调', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch checked={false} onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    fireEvent.click(switchElement);
    
    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith(true);
  });

  it('应该在多次点击时正确切换状态', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(1);
    
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(2);
    
    fireEvent.click(switchElement);
    expect(handleChange).toHaveBeenCalledTimes(3);
  });

  it('应该在禁用时正确处理样式', () => {
    renderWithTheme(<Switch disabled checked />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      cursor: 'not-allowed',
      opacity: 0.5,
    });
  });

  it('应该在未禁用时正确处理样式', () => {
    renderWithTheme(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
      cursor: 'pointer',
      opacity: 1,
    });
  });

  it('应该正确渲染滑块', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('div');
    expect(thumb).toBeInTheDocument();
    expect(thumb).toHaveStyle({
      width: '1.25rem',
      height: '1.25rem',
      borderRadius: '50%',
      backgroundColor: 'rgb(240, 240, 240)',
    });
  });

  it('应该在选中状态下正确渲染滑块', () => {
    renderWithTheme(<Switch checked />);
    
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('div');
    expect(thumb).toHaveStyle({
      left: '1.625rem',
    });
  });

  it('应该在未选中状态下正确渲染滑块', () => {
    renderWithTheme(<Switch checked={false} />);
    
    const switchElement = screen.getByRole('switch');
    const thumb = switchElement.querySelector('div');
    expect(thumb).toHaveStyle({
      left: '0.125rem',
    });
  });

  it('应该正确处理过渡效果', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({
      transition: 'all 0.2s ease',
    });
    
    const thumb = switchElement.querySelector('div');
    expect(thumb).toHaveStyle({
      transition: 'all 0.2s ease',
    });
  });

  it('应该在禁用时禁用点击事件', () => {
    const handleChange = jest.fn();
    renderWithTheme(<Switch disabled onChange={handleChange} />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({ cursor: 'not-allowed' });
  });

  it('应该在未禁用时启用点击事件', () => {
    renderWithTheme(<Switch />);
    
    const switchElement = screen.getByRole('switch');
    expect(switchElement).toHaveStyle({ cursor: 'pointer' });
  });
});
