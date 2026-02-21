/**
 * @file Avatar 组件测试
 * @description 测试 Avatar 组件的各项功能
 * @module __tests__/components/Avatar.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */


import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';
import { Avatar } from './Avatar';
import { ThemeProvider } from '../theme/ThemeProvider';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider>{component}</ThemeProvider>);
};

describe('Avatar 组件', () => {
  it('应该正确渲染 fallback 文本', () => {
    renderWithTheme(<Avatar alt="John Doe" />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该支持自定义 fallback 文本', () => {
    renderWithTheme(<Avatar alt="John Doe" fallback="Custom" />);

    expect(screen.getByText('Custom')).toBeInTheDocument();
  });

  it('应该渲染图片', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', 'https://example.com/avatar.jpg');
  });

  it('应该在图片加载失败时显示 fallback', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/invalid.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    fireEvent(img, new ErrorEvent('error'));

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该支持不同的尺寸', () => {
    const sizes = ['sm', 'md', 'lg', 'xl'] as const;

    sizes.forEach(size => {
      const { unmount } = renderWithTheme(<Avatar alt="Test" size={size} />);
      const avatar = screen.getByRole('img');
      expect(avatar).toBeInTheDocument();
      unmount();
    });
  });

  it('应该应用自定义 className', () => {
    renderWithTheme(<Avatar alt="Test" className="custom-class" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveClass('custom-class');
  });

  it('应该在没有 alt 时显示默认 fallback', () => {
    renderWithTheme(<Avatar />);

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    const span = avatar.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('应该正确处理单个词的 alt', () => {
    renderWithTheme(<Avatar alt="John" />);

    expect(screen.getByText('JO')).toBeInTheDocument();
  });

  it('应该正确处理多个词的 alt', () => {
    renderWithTheme(<Avatar alt="John Doe" />);

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该应用正确的样式', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
    });
  });

  it('应该在图片加载时正确显示', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    img.onload?.(new Event('load'));

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
  });

  it('应该正确处理空字符串 alt', () => {
    renderWithTheme(<Avatar alt="" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    const span = avatar.querySelector('span');
    expect(span).toBeTruthy();
  });

  it('应该正确处理无效的 size 属性', () => {
    renderWithTheme(<Avatar alt="Test" size={'invalid' as any} />);

    const avatar = screen.getByRole('img');
    expect(avatar).toBeInTheDocument();
    expect(avatar).toHaveStyle({
      width: '2.5rem',
      height: '2.5rem',
    });
  });

  it('应该在图片加载成功后隐藏 fallback', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('应该正确处理空字符串的 fallback', () => {
    renderWithTheme(<Avatar alt="Test" fallback="" />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('TE');
  });

  it('应该在图片加载前显示 fallback', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
  });

  it('应该正确处理图片加载状态', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();
  });

  it('应该正确处理图片加载错误状态', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/invalid.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    fireEvent(img, new ErrorEvent('error'));

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该正确设置 aria-label 属性', () => {
    renderWithTheme(<Avatar alt="John Doe" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('aria-label', 'John Doe');
  });

  it('应该正确设置默认 aria-label', () => {
    renderWithTheme(<Avatar />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveAttribute('aria-label', 'Avatar');
  });

  it('应该在 alt 为 undefined 且没有 fallback 时显示默认 fallback', () => {
    renderWithTheme(<Avatar />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('AV');
  });

  it('应该在图片加载失败时显示 fallback 并设置错误状态', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/invalid.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    fireEvent(img, new ErrorEvent('error'));

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该在图片加载成功时设置加载状态', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    fireEvent(img, new Event('load'));

    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });

  it('应该在 alt 为空字符串时显示默认 fallback', () => {
    renderWithTheme(<Avatar alt="" />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('??');
  });

  it('应该在 alt 为 null 时显示默认 fallback', () => {
    renderWithTheme(<Avatar alt={null as any} />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('??');
  });

  it('应该在 alt 为单个字符时显示 fallback', () => {
    renderWithTheme(<Avatar alt="J" />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('J');
  });

  it('应该在 alt 为两个字符时显示 fallback', () => {
    renderWithTheme(<Avatar alt="Jo" />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('JO');
  });

  it('应该在 alt 为三个单词时显示 fallback', () => {
    renderWithTheme(<Avatar alt="John Doe Smith" />);

    const avatar = screen.getByRole('img');
    const span = avatar.querySelector('span');
    expect(span).toBeInTheDocument();
    expect(span).toHaveTextContent('JD');
  });

  it('应该在图片加载失败时隐藏图片并显示 fallback', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/invalid.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();

    fireEvent(img, new ErrorEvent('error'));

    expect(screen.getByText('JD')).toBeInTheDocument();
  });

  it('应该在图片加载成功时隐藏 fallback', () => {
    renderWithTheme(
      <Avatar
        src="https://example.com/avatar.jpg"
        alt="John Doe"
      />
    );

    const img = screen.getByAltText('John Doe');
    expect(img).toBeInTheDocument();

    fireEvent(img, new Event('load'));

    expect(screen.getByAltText('John Doe')).toBeInTheDocument();
  });

  it('应该应用正确的 borderRadius', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      borderRadius: '0.5rem',
    });
  });

  it('应该应用正确的 backgroundColor', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      backgroundColor: 'rgb(224, 106, 112)',
    });
  });

  it('应该应用正确的 color', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      color: 'rgb(255, 255, 255)',
    });
  });

  it('应该应用正确的 overflow', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      overflow: 'hidden',
    });
  });

  it('应该应用正确的 transition', () => {
    renderWithTheme(<Avatar alt="Test" />);

    const avatar = screen.getByRole('img');
    expect(avatar).toHaveStyle({
      transition: 'all 0.2s ease',
    });
  });
});