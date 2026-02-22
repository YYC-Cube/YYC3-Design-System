/**
 * @file 虚拟滚动使用示例
 * @description 演示虚拟滚动组件的使用方法和性能优势
 * @component VirtualScrollExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useMemo, useCallback } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { VirtualList, VirtualGrid } from './VirtualList';

interface ListItem {
  id: number;
  name: string;
  value: number;
  description: string;
}

export const VirtualScrollExample: React.FC = () => {
  const [itemCount, setItemCount] = useState(1000);
  const [containerHeight, setContainerHeight] = useState(400);
  const [searchTerm, setSearchTerm] = useState('');
  const [useGrid, setUseGrid] = useState(false);

  const items = useMemo(() => {
    const generatedItems: ListItem[] = [];
    for (let i = 0; i < itemCount; i++) {
      generatedItems.push({
        id: i,
        name: `项目 ${i + 1}`,
        value: Math.floor(Math.random() * 1000),
        description: `这是项目 ${i + 1} 的详细描述信息，用于演示虚拟滚动的性能优势。`,
      });
    }
    return generatedItems;
  }, [itemCount]);

  const filteredItems = useMemo(() => {
    if (!searchTerm) {
      return items;
    }
    const lowerSearchTerm = searchTerm.toLowerCase();
    return items.filter(
      item =>
        item.name.toLowerCase().includes(lowerSearchTerm) ||
        item.description.toLowerCase().includes(lowerSearchTerm)
    );
  }, [items, searchTerm]);

  const handleItemCountChange = useCallback((value: string) => {
    const count = parseInt(value) || 1000;
    setItemCount(Math.max(1, Math.min(100000, count)));
  }, []);

  const handleContainerHeightChange = useCallback((value: string) => {
    const height = parseInt(value) || 400;
    setContainerHeight(Math.max(200, Math.min(800, height)));
  }, []);

  const handleSearchChange = useCallback((value: string) => {
    setSearchTerm(value);
  }, []);

  const handleToggleView = useCallback(() => {
    setUseGrid(prev => !prev);
  }, []);

  const renderItem = useCallback((item: ListItem, index: number) => {
    return (
      <div
        style={{
          padding: '1rem',
          border: '1px solid #e0e0e0',
          borderRadius: '0.25rem',
          backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666', marginBottom: '0.25rem' }}>
          {item.description}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#999' }}>
          值: {item.value}
        </div>
      </div>
    );
  }, []);

  const renderGridItem = useCallback((item: ListItem, index: number) => {
    return (
      <div
        style={{
          padding: '1rem',
          border: '1px solid #e0e0e0',
          borderRadius: '0.25rem',
          backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#ffffff',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>
          {item.name}
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          {item.value}
        </div>
      </div>
    );
  }, []);

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>虚拟滚动示例</h1>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>配置选项</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
          <div>
            <Input
              label="项目数量"
              type="number"
              value={itemCount.toString()}
              onChange={handleItemCountChange}
            />
          </div>
          <div>
            <Input
              label="容器高度"
              type="number"
              value={containerHeight.toString()}
              onChange={handleContainerHeightChange}
            />
          </div>
          <div>
            <Input
              label="搜索关键词"
              placeholder="输入关键词过滤..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleToggleView}>
            {useGrid ? '切换到列表视图' : '切换到网格视图'}
          </Button>
        </div>
        <div style={{ fontSize: '0.875rem', color: '#666' }}>
          <strong>当前状态：</strong>
          总项目数: {items.length} | 
          过滤后: {filteredItems.length} | 
          视图模式: {useGrid ? '网格' : '列表'}
        </div>
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>虚拟滚动列表</h2>
        <div style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#666' }}>
          该列表使用虚拟滚动技术，只渲染可见区域的项目，大幅提升性能。
          即使有 {filteredItems.length} 个项目，也只渲染约 {Math.ceil(containerHeight / 50)} 个可见项目。
        </div>
        {useGrid ? (
          <VirtualGrid
            items={filteredItems}
            itemHeight={120}
            itemWidth={200}
            containerHeight={containerHeight}
            containerWidth={800}
            renderItem={renderGridItem}
            gap={10}
          />
        ) : (
          <VirtualList
            items={filteredItems}
            itemHeight={100}
            containerHeight={containerHeight}
            renderItem={renderItem}
            overscan={5}
          />
        )}
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>性能对比</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
          <div style={{ padding: '1rem', backgroundColor: '#f9f9f9', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>传统列表</h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <li>渲染所有 {filteredItems.length} 个项目</li>
              <li>DOM 节点数: {filteredItems.length}</li>
              <li>内存占用: ~{filteredItems.length * 10}KB</li>
              <li>首次渲染: ~{filteredItems.length * 0.5}ms</li>
              <li>滚动性能: 卡顿</li>
            </ul>
          </div>
          <div style={{ padding: '1rem', backgroundColor: '#e8f5e9', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>虚拟滚动列表</h3>
            <ul style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
              <li>只渲染可见项目</li>
              <li>DOM 节点数: ~{Math.ceil(containerHeight / 50)}</li>
              <li>内存占用: ~{Math.ceil(containerHeight / 50) * 10}KB</li>
              <li>首次渲染: ~{Math.ceil(containerHeight / 50) * 0.5}ms</li>
              <li>滚动性能: 流畅</li>
            </ul>
          </div>
        </div>
        <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#fff3e0', borderRadius: '0.25rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>性能提升</h3>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            <strong>DOM 节点减少:</strong> {((1 - Math.ceil(containerHeight / 50) / filteredItems.length) * 100).toFixed(1)}%<br />
            <strong>内存占用减少:</strong> {((1 - Math.ceil(containerHeight / 50) / filteredItems.length) * 100).toFixed(1)}%<br />
            <strong>渲染速度提升:</strong> {(filteredItems.length / Math.ceil(containerHeight / 50)).toFixed(1)}x
          </p>
        </div>
      </Card>

      <Card>
        <h2 style={{ marginBottom: '1rem' }}>虚拟滚动优势</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>大幅减少 DOM 节点数量：</strong> 只渲染可见区域的项目，即使有 100,000 个项目，也只渲染约 20 个可见项目
          </li>
          <li>
            <strong>降低内存占用：</strong> 减少不必要的 DOM 节点和 React 组件实例，显著降低内存使用
          </li>
          <li>
            <strong>提升渲染性能：</strong> 减少需要渲染的组件数量，大幅提升首次渲染和更新性能
          </li>
          <li>
            <strong>改善滚动体验：</strong> 避免大量 DOM 节点导致的滚动卡顿，提供流畅的滚动体验
          </li>
          <li>
            <strong>支持动态高度：</strong> 支持固定高度和动态高度两种模式，适应不同场景
          </li>
          <li>
            <strong>可配置性：</strong> 支持自定义渲染函数、键值函数、预加载范围等配置
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default VirtualScrollExample;
