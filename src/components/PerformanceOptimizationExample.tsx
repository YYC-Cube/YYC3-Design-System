/**
 * @file 性能优化示例组件
 * @description 演示 React.memo、useMemo 和 useCallback 的使用
 * @component PerformanceOptimizationExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useMemo, useCallback, memo } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';

interface ExpensiveCalculationProps {
  number: number;
}

const ExpensiveCalculation = memo<ExpensiveCalculationProps>(({ number }) => {
  console.warn('[ExpensiveCalculation] 渲染');

  const result = useMemo(() => {
    console.warn('[ExpensiveCalculation] 执行计算');
    let sum = 0;
    for (let i = 0; i < number; i++) {
      sum += i;
    }
    return sum;
  }, [number]);

  return (
    <div>
      <strong>计算结果：</strong> {result}
    </div>
  );
});

ExpensiveCalculation.displayName = 'ExpensiveCalculation';

interface Item {
  id: number;
  name: string;
  value: number;
}

interface ItemListProps {
  items: Item[];
  onItemClick: (id: number) => void;
}

const ItemList = memo<ItemListProps>(({ items, onItemClick }) => {
  console.warn('[ItemList] 渲染');

  return (
    <ul style={{ listStyle: 'none', padding: 0 }}>
      {items.map((item) => (
        <li
          key={item.id}
          onClick={() => onItemClick(item.id)}
          style={{
            padding: '0.5rem',
            margin: '0.25rem 0',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer',
            borderRadius: '0.25rem',
          }}
        >
          {item.name} - {item.value}
        </li>
      ))}
    </ul>
  );
});

ItemList.displayName = 'ItemList';

export const PerformanceOptimizationExample: React.FC = () => {
  const [count, setCount] = useState(0);
  const [number, setNumber] = useState(1000);
  const [items, setItems] = useState<Item[]>([
    { id: 1, name: '项目 1', value: 100 },
    { id: 2, name: '项目 2', value: 200 },
    { id: 3, name: '项目 3', value: 300 },
  ]);

  const handleIncrement = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const handleDecrement = useCallback(() => {
    setCount((prev) => prev - 1);
  }, []);

  const handleNumberChange = useCallback((value: string) => {
    setNumber(parseInt(value) || 0);
  }, []);

  const handleAddItem = useCallback(() => {
    const newId = items.length + 1;
    setItems((prev) => [...prev, { id: newId, name: `项目 ${newId}`, value: newId * 100 }]);
  }, [items.length]);

  const handleItemClick = useCallback((id: number) => {
    console.warn(`点击项目: ${id}`);
  }, []);

  const filteredItems = useMemo(() => {
    console.warn('[PerformanceOptimizationExample] 过滤项目');
    return items.filter((item) => item.value > 150);
  }, [items]);

  const sortedItems = useMemo(() => {
    console.warn('[PerformanceOptimizationExample] 排序项目');
    return [...filteredItems].sort((a, b) => b.value - a.value);
  }, [filteredItems]);

  const totalValue = useMemo(() => {
    console.warn('[PerformanceOptimizationExample] 计算总值');
    return items.reduce((sum, item) => sum + item.value, 0);
  }, [items]);

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>性能优化示例</h1>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>计数器示例（useCallback）</h2>
          <div style={{ marginBottom: '1rem' }}>
            <strong>当前计数：</strong> {count}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
            <Button onClick={handleIncrement}>增加</Button>
            <Button onClick={handleDecrement} variant="outline">
              减少
            </Button>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            使用 useCallback 避免每次渲染都创建新的函数引用
          </p>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>计算示例（useMemo）</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Input
              label="计算范围"
              type="number"
              value={number.toString()}
              onChange={handleNumberChange}
            />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <ExpensiveCalculation number={number} />
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            使用 useMemo 缓存计算结果，避免不必要的重复计算
          </p>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <h2 style={{ marginBottom: '1rem' }}>列表示例（React.memo + useMemo）</h2>
          <div style={{ marginBottom: '1rem' }}>
            <Button onClick={handleAddItem}>添加项目</Button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <strong>项目总数：</strong> {items.length} |<strong> 过滤后：</strong>{' '}
            {filteredItems.length} |<strong> 总值：</strong> {totalValue}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>原始列表</h3>
              <ItemList items={items} onItemClick={handleItemClick} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>排序后列表</h3>
              <ItemList items={sortedItems} onItemClick={handleItemClick} />
            </div>
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
            使用 React.memo 避免子组件不必要的重新渲染，使用 useMemo 缓存过滤和排序结果
          </p>
        </Card>
      </div>

      <Card>
        <h2 style={{ marginBottom: '1rem' }}>性能优化技巧总结</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>React.memo：</strong> 避免父组件更新时子组件不必要的重新渲染
          </li>
          <li>
            <strong>useMemo：</strong> 缓存计算结果，避免昂贵的重复计算
          </li>
          <li>
            <strong>useCallback：</strong> 缓存函数引用，避免子组件因函数引用变化而重新渲染
          </li>
          <li>
            <strong>合理使用：</strong> 只在必要时使用这些优化，过度使用可能适得其反
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default PerformanceOptimizationExample;
