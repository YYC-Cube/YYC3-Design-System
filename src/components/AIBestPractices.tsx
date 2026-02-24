/**
 * @file AI 最佳实践建议组件
 * @description 提供用户界面来查看最佳实践建议
 * @component AIBestPractices
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { Input } from './Input';
import { useTheme } from '../theme/useTheme';
import { bestPracticesGenerator, BestPracticesReport, BestPractice } from '../ai/best-practices-generator';

export interface AIBestPracticesProps {
  className?: string;
}

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export const AIBestPractices: React.FC<AIBestPracticesProps> = ({
  className = '',
}) => {
  const { tokens } = useTheme();
  const [report, setReport] = useState<BestPracticesReport | null>(null);
  const [filter, setFilter] = useState<'all' | 'quick-wins' | 'long-term'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const handleGenerate = useCallback(() => {
    const newReport = bestPracticesGenerator.generateRecommendations();
    setReport(newReport);
  }, []);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f59e0b';
      case 'medium':
        return '#3b82f6';
      case 'low':
        return '#6b7280';
      default:
        return '#6b7280';
    }
  };

  const getPriorityLabel = (priority: string) => {
    switch (priority) {
      case 'critical':
        return '严重';
      case 'high':
        return '高';
      case 'medium':
        return '中';
      case 'low':
        return '低';
      default:
        return '未知';
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      color: '颜色',
      spacing: '间距',
      typography: '排版',
      accessibility: '可访问性',
      performance: '性能',
      maintainability: '可维护性',
    };
    return labels[category] || category;
  };

  const filterPractices = (practices: BestPractice[]) => {
    let filtered = practices;

    if (filter === 'quick-wins') {
      filtered = filtered.filter(p => p.priority === 'critical' || p.priority === 'high');
    } else if (filter === 'long-term') {
      filtered = filtered.filter(p => p.priority === 'medium' || p.priority === 'low');
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter(p => p.category === categoryFilter);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  };

  const categories = ['all', 'color', 'spacing', 'typography', 'accessibility', 'performance', 'maintainability'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 最佳实践建议</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleGenerate} className="w-full">
          生成建议
        </Button>

        {report && (
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-4">
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                  {report.summary.critical}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  严重
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#f59e0b' }}>
                  {report.summary.high}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  高
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#3b82f6' }}>
                  {report.summary.medium}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  中
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#6b7280' }}>
                  {report.summary.low}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  低
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                  搜索
                </label>
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="搜索最佳实践..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                  优先级
                </label>
                <div className="flex gap-2">
                  <Badge
                    variant={filter === 'all' ? 'default' : 'outline'}
                    style={{
                      cursor: 'pointer',
                      background: filter === 'all' ? getTokenValue(tokens, 'color.primary') : 'transparent',
                      color: filter === 'all' ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                      borderColor: getTokenValue(tokens, 'color.primary'),
                    }}
                    onClick={() => setFilter('all')}
                  >
                    全部
                  </Badge>
                  <Badge
                    variant={filter === 'quick-wins' ? 'default' : 'outline'}
                    style={{
                      cursor: 'pointer',
                      background: filter === 'quick-wins' ? getTokenValue(tokens, 'color.primary') : 'transparent',
                      color: filter === 'quick-wins' ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                      borderColor: getTokenValue(tokens, 'color.primary'),
                    }}
                    onClick={() => setFilter('quick-wins')}
                  >
                    快速见效
                  </Badge>
                  <Badge
                    variant={filter === 'long-term' ? 'default' : 'outline'}
                    style={{
                      cursor: 'pointer',
                      background: filter === 'long-term' ? getTokenValue(tokens, 'color.primary') : 'transparent',
                      color: filter === 'long-term' ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                      borderColor: getTokenValue(tokens, 'color.primary'),
                    }}
                    onClick={() => setFilter('long-term')}
                  >
                    长期目标
                  </Badge>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                  类别
                </label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge
                      key={category}
                      variant={categoryFilter === category ? 'default' : 'outline'}
                      style={{
                        cursor: 'pointer',
                        background: categoryFilter === category ? getTokenValue(tokens, 'color.primary') : 'transparent',
                        color: categoryFilter === category ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                        borderColor: getTokenValue(tokens, 'color.primary'),
                      }}
                      onClick={() => setCategoryFilter(category)}
                    >
                      {category === 'all' ? '全部' : getCategoryLabel(category)}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                最佳实践 ({filterPractices(report.practices).length})
              </h3>
              <div className="space-y-4">
                {filterPractices(report.practices).map((practice) => (
                  <div
                    key={practice.id}
                    className="p-4 rounded-lg"
                    style={{
                      background: getTokenValue(tokens, 'color.card'),
                      border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                    }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          style={{
                            background: getPriorityColor(practice.priority),
                            color: '#ffffff',
                          }}
                        >
                          {getPriorityLabel(practice.priority)}
                        </Badge>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: getTokenValue(tokens, 'color.border'),
                            color: getTokenValue(tokens, 'color.muted-foreground'),
                          }}
                        >
                          {getCategoryLabel(practice.category)}
                        </Badge>
                      </div>
                    </div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                      {practice.title}
                    </h4>
                    <p className="text-sm mb-3" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                      {practice.description}
                    </p>
                    <div className="mb-3">
                      <h5 className="text-xs font-medium mb-1" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                        原因
                      </h5>
                      <p className="text-xs" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                        {practice.rationale}
                      </p>
                    </div>
                    <div className="mb-3">
                      <h5 className="text-xs font-medium mb-1" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                        实施方法
                      </h5>
                      <p className="text-xs" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                        {practice.implementation}
                      </p>
                    </div>
                    {practice.examples && practice.examples.length > 0 && (
                      <div>
                        <h5 className="text-xs font-medium mb-1" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                          示例
                        </h5>
                        <ul className="text-xs space-y-1">
                          {practice.examples.map((example, index) => (
                            <li
                              key={index}
                              className="p-2 rounded"
                              style={{
                                background: getTokenValue(tokens, 'color.background'),
                                color: getTokenValue(tokens, 'color.foreground'),
                              }}
                            >
                              {example}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {practice.resources && practice.resources.length > 0 && (
                      <div className="mt-3">
                        <h5 className="text-xs font-medium mb-1" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                          资源
                        </h5>
                        <ul className="text-xs space-y-1">
                          {practice.resources.map((resource, index) => (
                            <li key={index}>
                              <a
                                href={resource}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: getTokenValue(tokens, 'color.primary') }}
                              >
                                {resource}
                              </a>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
