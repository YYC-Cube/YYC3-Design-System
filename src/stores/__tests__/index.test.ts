/**
 * @file Zustand Store测试
 * @description 测试所有store的功能
 * @module __tests__/stores/index.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-23
 */

import { renderHook, act, render } from '@testing-library/react';
import { screen, fireEvent, waitFor } from '@testing-library/dom';
import { useAppStore } from '@/stores/useAppStore';
import { useThemeStore } from '@/stores/useThemeStore';
import { useComponentStore } from '@/stores/useComponentStore';

describe('useAppStore', () => {
  beforeEach(() => {
    useAppStore.setState({
      isSidebarOpen: true,
      currentLanguage: 'zh-CN',
      notifications: [],
      isLoading: false,
      error: null,
    });
  });

  it('应该正确初始化状态', () => {
    const { result } = renderHook(() => useAppStore());
    expect(result.current.isSidebarOpen).toBe(true);
    expect(result.current.currentLanguage).toBe('zh-CN');
    expect(result.current.notifications).toEqual([]);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
  });

  it('应该正确切换侧边栏', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(false);

    act(() => {
      result.current.toggleSidebar();
    });
    expect(result.current.isSidebarOpen).toBe(true);
  });

  it('应该正确设置侧边栏状态', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setSidebarOpen(false);
    });
    expect(result.current.isSidebarOpen).toBe(false);

    act(() => {
      result.current.setSidebarOpen(true);
    });
    expect(result.current.isSidebarOpen).toBe(true);
  });

  it('应该正确设置语言', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setLanguage('en-US');
    });
    expect(result.current.currentLanguage).toBe('en-US');
  });

  it('应该正确添加通知', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.addNotification({
        type: 'success',
        title: '成功',
        message: '操作成功',
        duration: 0,
      });
    });
    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0]).toMatchObject({
      type: 'success',
      title: '成功',
      message: '操作成功',
    });
  });

  it('应该正确移除通知', () => {
    const { result } = renderHook(() => useAppStore());
    const notificationId = 'test-notification-id';
    act(() => {
      result.current.addNotification({
        type: 'info',
        title: '测试',
        message: '测试消息',
        duration: 0,
      });
    });
    const id = result.current.notifications[0].id;
    act(() => {
      result.current.removeNotification(id);
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('应该正确清除所有通知', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.addNotification({
        type: 'info',
        title: '测试1',
        message: '测试消息1',
        duration: 0,
      });
      result.current.addNotification({
        type: 'info',
        title: '测试2',
        message: '测试消息2',
        duration: 0,
      });
    });
    expect(result.current.notifications).toHaveLength(2);

    act(() => {
      result.current.clearNotifications();
    });
    expect(result.current.notifications).toHaveLength(0);
  });

  it('应该正确设置加载状态', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setLoading(true);
    });
    expect(result.current.isLoading).toBe(true);

    act(() => {
      result.current.setLoading(false);
    });
    expect(result.current.isLoading).toBe(false);
  });

  it('应该正确设置错误', () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.setError('测试错误');
    });
    expect(result.current.error).toBe('测试错误');

    act(() => {
      result.current.setError(null);
    });
    expect(result.current.error).toBeNull();
  });

  it('应该自动移除过期的通知', async () => {
    const { result } = renderHook(() => useAppStore());
    act(() => {
      result.current.addNotification({
        type: 'info',
        title: '测试',
        message: '测试消息',
        duration: 100,
      });
    });
    expect(result.current.notifications).toHaveLength(1);

    await waitFor(
      () => {
        expect(result.current.notifications).toHaveLength(0);
      },
      { timeout: 200 }
    );
  });
});

describe('useThemeStore', () => {
  beforeEach(() => {
    useThemeStore.setState({
      mode: 'light',
      primaryColor: '#d45a5f',
      borderRadius: 4,
      fontSize: 14,
    });
  });

  it('应该正确初始化状态', () => {
    const { result } = renderHook(() => useThemeStore());
    expect(result.current.mode).toBe('light');
    expect(result.current.primaryColor).toBe('#d45a5f');
    expect(result.current.borderRadius).toBe(4);
    expect(result.current.fontSize).toBe(14);
  });

  it('应该正确设置主题模式', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setMode('dark');
    });
    expect(result.current.mode).toBe('dark');

    act(() => {
      result.current.setMode('auto');
    });
    expect(result.current.mode).toBe('auto');
  });

  it('应该正确设置主色调', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setPrimaryColor('#ff0000');
    });
    expect(result.current.primaryColor).toBe('#ff0000');
  });

  it('应该正确设置圆角', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setBorderRadius(8);
    });
    expect(result.current.borderRadius).toBe(8);
  });

  it('应该正确设置字体大小', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setFontSize(16);
    });
    expect(result.current.fontSize).toBe(16);
  });

  it('应该正确重置主题', () => {
    const { result } = renderHook(() => useThemeStore());
    act(() => {
      result.current.setMode('dark');
      result.current.setPrimaryColor('#ff0000');
      result.current.setBorderRadius(8);
      result.current.setFontSize(16);
    });

    act(() => {
      result.current.resetTheme();
    });

    expect(result.current.mode).toBe('light');
    expect(result.current.primaryColor).toBe('#d45a5f');
    expect(result.current.borderRadius).toBe(4);
    expect(result.current.fontSize).toBe(14);
  });
});

describe('useComponentStore', () => {
  beforeEach(() => {
    useComponentStore.setState({
      globalConfig: {
        size: 'middle',
        bordered: false,
        disabled: false,
        loading: false,
      },
      componentConfigs: {},
    });
  });

  it('应该正确初始化状态', () => {
    const { result } = renderHook(() => useComponentStore());
    expect(result.current.globalConfig).toEqual({
      size: 'middle',
      bordered: false,
      disabled: false,
      loading: false,
    });
    expect(result.current.componentConfigs).toEqual({});
  });

  it('应该正确设置全局配置', () => {
    const { result } = renderHook(() => useComponentStore());
    const newConfig = {
      size: 'large' as const,
      bordered: true,
      disabled: false,
      loading: false,
    };
    act(() => {
      result.current.setGlobalConfig(newConfig);
    });
    expect(result.current.globalConfig).toEqual(newConfig);
  });

  it('应该正确更新全局配置', () => {
    const { result } = renderHook(() => useComponentStore());
    act(() => {
      result.current.updateGlobalConfig({ size: 'large' });
    });
    expect(result.current.globalConfig.size).toBe('large');
    expect(result.current.globalConfig.bordered).toBe(false);
  });

  it('应该正确设置组件配置', () => {
    const { result } = renderHook(() => useComponentStore());
    const componentConfig = {
      size: 'small' as const,
      bordered: true,
      disabled: false,
      loading: false,
    };
    act(() => {
      result.current.setComponentConfig('button', componentConfig);
    });
    expect(result.current.componentConfigs['button']).toEqual(componentConfig);
  });

  it('应该正确更新组件配置', () => {
    const { result } = renderHook(() => useComponentStore());
    act(() => {
      result.current.setComponentConfig('button', {
        size: 'small' as const,
        bordered: false,
        disabled: false,
        loading: false,
      });
    });
    act(() => {
      result.current.updateComponentConfig('button', { bordered: true });
    });
    expect(result.current.componentConfigs['button']).toMatchObject({
      size: 'small',
      bordered: true,
    });
  });

  it('应该正确移除组件配置', () => {
    const { result } = renderHook(() => useComponentStore());
    act(() => {
      result.current.setComponentConfig('button', {
        size: 'small' as const,
        bordered: false,
        disabled: false,
        loading: false,
      });
    });
    expect(result.current.componentConfigs['button']).toBeDefined();

    act(() => {
      result.current.removeComponentConfig('button');
    });
    expect(result.current.componentConfigs['button']).toBeUndefined();
  });

  it('应该正确重置所有配置', () => {
    const { result } = renderHook(() => useComponentStore());
    act(() => {
      result.current.setGlobalConfig({
        size: 'large' as const,
        bordered: true,
        disabled: true,
        loading: true,
      });
      result.current.setComponentConfig('button', {
        size: 'small' as const,
        bordered: false,
        disabled: false,
        loading: false,
      });
    });

    act(() => {
      result.current.resetConfigs();
    });

    expect(result.current.globalConfig).toEqual({
      size: 'middle',
      bordered: false,
      disabled: false,
      loading: false,
    });
    expect(result.current.componentConfigs).toEqual({});
  });
});
