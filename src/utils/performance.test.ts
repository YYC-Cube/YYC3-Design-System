/**
 * @file 性能工具测试
 * @description 测试性能相关的工具函数
 * @module __tests__/utils/performance.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */


import { renderHook, act } from '@testing-library/react';
import { useDebounce, useThrottle, usePrevious, useIsMounted, useLazyRef, useUpdateEffect } from './performance';

describe('性能工具函数', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('useDebounce', () => {
    it('应该在延迟后执行', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      act(() => {
        result.current();
      });
      expect(mockFn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(100);
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该在延迟内重置定时器', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      act(() => {
        result.current();
        jest.advanceTimersByTime(50);
        result.current();
        jest.advanceTimersByTime(50);
      });

      expect(mockFn).not.toHaveBeenCalled();

      act(() => {
        jest.advanceTimersByTime(50);
      });
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it('应该正确传递参数', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      act(() => {
        result.current('arg1', 'arg2');
        jest.advanceTimersByTime(100);
      });

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('应该处理多次快速调用', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 100));

      act(() => {
        result.current('call1');
        result.current('call2');
        result.current('call3');
        jest.advanceTimersByTime(100);
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('call3');
    });

    it('应该支持零延迟', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useDebounce(mockFn, 0));

      act(() => {
        result.current();
        jest.advanceTimersByTime(0);
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe('useThrottle', () => {
    it('应该在指定延迟内只执行一次', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      act(() => {
        result.current();
        result.current();
        result.current();
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      act(() => {
        result.current();
      });

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('应该正确传递参数', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      act(() => {
        result.current('arg1', 'arg2');
      });

      expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2');
    });

    it('应该在延迟后允许再次执行', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      act(() => {
        result.current();
      });

      expect(mockFn).toHaveBeenCalledTimes(1);

      act(() => {
        jest.advanceTimersByTime(100);
        result.current();
      });

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('应该支持零延迟', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 0));

      act(() => {
        result.current();
        result.current();
      });

      expect(mockFn).toHaveBeenCalledTimes(2);
    });

    it('应该在延迟期间忽略调用', () => {
      const mockFn = jest.fn();
      const { result } = renderHook(() => useThrottle(mockFn, 100));

      act(() => {
        result.current('first');
        result.current('second');
        result.current('third');
      });

      expect(mockFn).toHaveBeenCalledTimes(1);
      expect(mockFn).toHaveBeenCalledWith('first');
    });
  });

  describe('usePrevious', () => {
    it('应该返回上一次的值', () => {
      const { result, rerender } = renderHook(({ count }) => usePrevious(count), {
        initialProps: { count: 1 },
      });

      expect(result.current).toBeUndefined();

      rerender({ count: 2 });
      expect(result.current).toBe(1);

      rerender({ count: 3 });
      expect(result.current).toBe(2);
    });

    it('应该处理相同值', () => {
      const { result, rerender } = renderHook(({ count }) => usePrevious(count), {
        initialProps: { count: 1 },
      });

      rerender({ count: 1 });
      expect(result.current).toBe(1);

      rerender({ count: 1 });
      expect(result.current).toBe(1);
    });

    it('应该处理对象类型', () => {
      const { result, rerender } = renderHook(({ data }) => usePrevious(data), {
        initialProps: { data: { id: 1 } },
      });

      expect(result.current).toBeUndefined();

      rerender({ data: { id: 2 } });
      expect(result.current).toEqual({ id: 1 });
    });

    it('应该处理数组类型', () => {
      const { result, rerender } = renderHook(({ items }) => usePrevious(items), {
        initialProps: { items: [1, 2, 3] },
      });

      expect(result.current).toBeUndefined();

      rerender({ items: [4, 5, 6] });
      expect(result.current).toEqual([1, 2, 3]);
    });
  });

  describe('useIsMounted', () => {
    it('应该返回组件挂载状态', () => {
      const { result } = renderHook(() => useIsMounted());

      expect(result.current()).toBe(true);
    });

    it('应该在组件卸载时返回 false', () => {
      const { result, unmount } = renderHook(() => useIsMounted());

      expect(result.current()).toBe(true);

      unmount();
      expect(result.current()).toBe(false);
    });

    it('应该在多次调用时保持一致性', () => {
      const { result } = renderHook(() => useIsMounted());

      expect(result.current()).toBe(true);
      expect(result.current()).toBe(true);
      expect(result.current()).toBe(true);
    });
  });

  describe('useLazyRef', () => {
    it('应该延迟初始化 ref', () => {
      const initFn = jest.fn(() => ({ data: 'test' }));
      const { result } = renderHook(() => useLazyRef(initFn));

      const [ref, cleanup] = result.current;
      expect(initFn).toHaveBeenCalledTimes(1);

      expect(ref.current).toEqual({ data: 'test' });

      cleanup();
      expect(ref.current).toBeNull();
    });

    it('应该只初始化一次', () => {
      const initFn = jest.fn(() => ({ data: 'test' }));
      const { result, rerender } = renderHook(() => useLazyRef(initFn));

      rerender();

      const [ref] = result.current;
      expect(initFn).toHaveBeenCalledTimes(1);
      expect(ref.current).toEqual({ data: 'test' });
    });

    it('应该支持复杂对象初始化', () => {
      const initFn = () => ({
        users: [{ id: 1, name: 'User1' }],
        settings: { theme: 'dark', language: 'zh-CN' },
      });
      const { result } = renderHook(() => useLazyRef(initFn));

      const [ref] = result.current;
      expect(ref.current).toEqual({
        users: [{ id: 1, name: 'User1' }],
        settings: { theme: 'dark', language: 'zh-CN' },
      });
    });

    it('应该支持函数返回值', () => {
      const initFn = () => () => 'test function';
      const { result } = renderHook(() => useLazyRef(initFn));

      const [ref] = result.current;
      expect(typeof ref.current).toBe('function');
      if (ref.current) {
        expect(ref.current()).toBe('test function');
      }
    });

    it('应该支持数组初始化', () => {
      const initFn = () => [1, 2, 3, 4, 5];
      const { result } = renderHook(() => useLazyRef(initFn));

      const [ref] = result.current;
      expect(ref.current).toEqual([1, 2, 3, 4, 5]);
    });

    it('应该在清理后允许重新初始化', () => {
      const initFn = jest.fn(() => ({ data: 'test' }));
      const { result, rerender } = renderHook(() => useLazyRef(initFn));

      const [ref, cleanup] = result.current;
      expect(initFn).toHaveBeenCalledTimes(1);

      cleanup();
      expect(ref.current).toBeNull();

      rerender();
      expect(ref.current).toEqual({ data: 'test' });
      expect(initFn).toHaveBeenCalledTimes(2);
    });
  });

  describe('useUpdateEffect', () => {
    it('应该在组件挂载后执行 effect', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
        initialProps: { value: 1 },
      });

      expect(effect).not.toHaveBeenCalled();
      rerender({ value: 2 });
      expect(effect).toHaveBeenCalled();
    });

    it('应该支持清理函数', () => {
      const cleanup = jest.fn();
      const effect = jest.fn(() => cleanup);
      const { rerender, unmount } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
        initialProps: { value: 1 },
      });

      rerender({ value: 2 });
      expect(effect).toHaveBeenCalled();

      unmount();
      expect(cleanup).toHaveBeenCalled();
    });

    it('应该在依赖变化时执行 effect', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
        initialProps: { value: 1 },
      });

      expect(effect).not.toHaveBeenCalled();

      rerender({ value: 2 });
      expect(effect).toHaveBeenCalledTimes(1);

      rerender({ value: 3 });
      expect(effect).toHaveBeenCalledTimes(2);
    });

    it('应该在依赖不变时不执行 effect', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
        initialProps: { value: 1 },
      });

      rerender({ value: 1 });
      expect(effect).not.toHaveBeenCalled();

      rerender({ value: 1 });
      expect(effect).not.toHaveBeenCalled();
    });

    it('应该支持空依赖数组', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(() => useUpdateEffect(effect, []));

      expect(effect).not.toHaveBeenCalled();

      rerender();
      expect(effect).not.toHaveBeenCalled();
    });

    it('应该支持多个依赖项', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ a, b }) => useUpdateEffect(effect, [a, b]), {
        initialProps: { a: 1, b: 2 },
      });

      expect(effect).not.toHaveBeenCalled();

      rerender({ a: 1, b: 2 });
      expect(effect).not.toHaveBeenCalled();

      rerender({ a: 2, b: 2 });
      expect(effect).toHaveBeenCalledTimes(1);

      rerender({ a: 2, b: 3 });
      expect(effect).toHaveBeenCalledTimes(2);
    });

    it('应该在每次更新时调用清理函数', () => {
      const cleanup = jest.fn();
      const effect = jest.fn(() => cleanup);
      const { rerender } = renderHook(({ value }) => useUpdateEffect(effect, [value]), {
        initialProps: { value: 1 },
      });

      rerender({ value: 2 });
      expect(cleanup).toHaveBeenCalledTimes(0);

      rerender({ value: 3 });
      expect(cleanup).toHaveBeenCalledTimes(1);
    });

    it('应该处理对象依赖', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ data }) => useUpdateEffect(effect, [data]), {
        initialProps: { data: { id: 1 } },
      });

      expect(effect).not.toHaveBeenCalled();

      rerender({ data: { id: 1 } });
      expect(effect).not.toHaveBeenCalled();

      rerender({ data: { id: 2 } });
      expect(effect).toHaveBeenCalledTimes(1);
    });

    it('应该处理数组依赖', () => {
      const effect = jest.fn() as any;
      const { rerender } = renderHook(({ items }) => useUpdateEffect(effect, [items]), {
        initialProps: { items: [1, 2, 3] },
      });

      expect(effect).not.toHaveBeenCalled();

      rerender({ items: [1, 2, 3] });
      expect(effect).not.toHaveBeenCalled();

      rerender({ items: [4, 5, 6] });
      expect(effect).toHaveBeenCalledTimes(1);
    });
  });
});
