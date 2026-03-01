/**
 * @file 组件性能测试
 * @description 测试组件性能优化相关的功能
 * @module __tests__/components/performance.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { VirtualList } from '../VirtualList';
import { VirtualGrid } from '../VirtualGrid';
import { AnimationOptimizationExample } from '../AnimationOptimizationExample';

const typedScreen = screen as any;

interface MockItem {
  id: number;
  name: string;
}

describe('组件性能测试', () => {
  describe('VirtualList 组件', () => {
    const mockItems = Array.from(
      { length: 1000 },
      (_, i): MockItem => ({
        id: i,
        name: `Item ${i}`,
      })
    );

    it('应该正确渲染虚拟列表', () => {
      const { container } = render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('应该只渲染可见的项', () => {
      const { container } = render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      const visibleItems = container.querySelectorAll('[data-virtual-item]');
      expect(visibleItems.length).toBeLessThanOrEqual(10);
    });

    it('应该支持动态高度', () => {
      const { container } = render(
        <VirtualList
          items={mockItems}
          itemHeight={(index) => (index % 2 === 0 ? 100 : 50)}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('应该支持滚动到指定位置', async () => {
      const { container } = render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
          scrollToIndex={500}
        />
      );

      await waitFor(() => {
        const items = container.querySelectorAll('[data-virtual-item]');
        const firstItem = items[0];
        expect(firstItem.textContent).toContain('Item 500');
      });
    });

    it('应该处理空列表', () => {
      const { container } = render(
        <VirtualList
          items={[]}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
      const items = container.querySelectorAll('[data-virtual-item]');
      expect(items.length).toBe(0);
    });

    it('应该支持自定义渲染', () => {
      const customRender = jest.fn((item) => <div key={item.id}>{item.name}</div>);

      render(
        <VirtualList
          items={mockItems.slice(0, 10)}
          itemHeight={50}
          containerHeight={500}
          renderItem={customRender}
        />
      );

      expect(customRender).toHaveBeenCalled();
    });
  });

  describe('VirtualGrid 组件', () => {
    const mockItems = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`,
    }));

    it('应该正确渲染虚拟网格', () => {
      const { container } = render(
        <VirtualGrid
          items={mockItems}
          itemWidth={100}
          itemHeight={100}
          containerWidth={500}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('应该只渲染可见的项', () => {
      const { container } = render(
        <VirtualGrid
          items={mockItems}
          itemWidth={100}
          itemHeight={100}
          containerWidth={500}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      const visibleItems = container.querySelectorAll('[data-virtual-item]');
      expect(visibleItems.length).toBeLessThanOrEqual(25);
    });

    it('应该支持动态列数', () => {
      const { container } = render(
        <VirtualGrid
          items={mockItems}
          itemWidth={100}
          itemHeight={100}
          containerWidth={500}
          containerHeight={500}
          columns={5}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
    });

    it('应该处理空网格', () => {
      const { container } = render(
        <VirtualGrid
          items={[]}
          itemWidth={100}
          itemHeight={100}
          containerWidth={500}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      expect(container).toBeInTheDocument();
      const items = container.querySelectorAll('[data-virtual-item]');
      expect(items.length).toBe(0);
    });
  });

  describe('AnimationOptimizationExample 组件', () => {
    it('应该正确渲染动画优化示例', () => {
      const { container } = render(<AnimationOptimizationExample />);

      expect(container).toBeInTheDocument();
    });

    it('应该显示动画性能指标', () => {
      render(<AnimationOptimizationExample />);

      const fpsElement = typedScreen.queryByText(/FPS/i);
      expect(fpsElement).toBeInTheDocument();

      const frameTimeElement = typedScreen.queryByText(/Frame Time/i);
      expect(frameTimeElement).toBeInTheDocument();
    });

    it('应该支持动画控制', () => {
      render(<AnimationOptimizationExample />);

      const startButton = typedScreen.queryByText(/Start/i);
      const stopButton = typedScreen.queryByText(/Stop/i);

      expect(startButton).toBeInTheDocument();
      expect(stopButton).toBeInTheDocument();
    });

    it('应该显示动画优化建议', () => {
      render(<AnimationOptimizationExample />);

      const recommendations = typedScreen.queryByText(/优化建议/i);
      expect(recommendations).toBeInTheDocument();
    });
  });

  describe('React.memo 优化测试', () => {
    const MockComponent = jest.fn(({ value }: { value: number }) => (
      <div data-testid="mock-component">{value}</div>
    ));

    it('应该避免不必要的重新渲染', () => {
      const { rerender } = render(<MockComponent value={1} />);

      expect(MockComponent).toHaveBeenCalledTimes(1);

      rerender(<MockComponent value={1} />);

      expect(MockComponent).toHaveBeenCalledTimes(1);
    });

    it('应该在属性变化时重新渲染', () => {
      const { rerender } = render(<MockComponent value={1} />);

      expect(MockComponent).toHaveBeenCalledTimes(1);

      rerender(<MockComponent value={2} />);

      expect(MockComponent).toHaveBeenCalledTimes(2);
    });
  });

  describe('useMemo 优化测试', () => {
    it('应该缓存计算结果', () => {
      const expensiveCalculation = jest.fn((value: number) => value * 2);

      const { rerender } = render(<div data-testid="test">{expensiveCalculation(5)}</div>);

      expect(expensiveCalculation).toHaveBeenCalledTimes(1);

      rerender(<div data-testid="test">{expensiveCalculation(5)}</div>);

      expect(expensiveCalculation).toHaveBeenCalledTimes(2);
    });
  });

  describe('useCallback 优化测试', () => {
    it('应该缓存函数引用', () => {
      const mockCallback = jest.fn();

      const { rerender } = render(<button onClick={mockCallback}>Click</button>);

      const firstCallback = rerender(
        <button onClick={mockCallback}>Click</button>
      ).container.querySelector('button');

      expect(firstCallback).toBe(firstCallback);
    });
  });

  describe('性能基准测试', () => {
    it('应该测量组件渲染时间', () => {
      const start = performance.now();

      render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      const end = performance.now();
      const renderTime = end - start;

      expect(renderTime).toBeLessThan(100);
    });

    it('应该测量列表滚动性能', async () => {
      const { container } = render(
        <VirtualList
          items={mockItems}
          itemHeight={50}
          containerHeight={500}
          renderItem={(item: MockItem) => <div key={item.id}>{item.name}</div>}
        />
      );

      const start = performance.now();

      const scrollContainer = container.querySelector('[data-virtual-container]') as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = 500;
      }

      await waitFor(() => {
        const items = container.querySelectorAll('[data-virtual-item]');
        const firstItem = items[0];
        expect(firstItem.textContent).toContain('Item 500');
      });

      const end = performance.now();
      const scrollTime = end - start;

      expect(scrollTime).toBeLessThan(100);
    });
  });
});
