/**
 * @file 性能监控仪表板组件
 * @description 实时性能指标展示和可视化
 * @module components/PerformanceDashboard
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './Card';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  good: number;
  status: 'good' | 'warning' | 'poor';
  trend?: 'up' | 'down' | 'stable';
}

export interface PerformanceDashboardProps {
  className?: string;
  refreshInterval?: number;
  onRefresh?: () => void;
}

const CORE_METRICS = [
  { name: 'FCP', label: 'First Contentful Paint', unit: 'ms', threshold: 1500, good: 1000 },
  { name: 'LCP', label: 'Largest Contentful Paint', unit: 'ms', threshold: 2500, good: 2500 },
  { name: 'FID', label: 'First Input Delay', unit: 'ms', threshold: 100, good: 100 },
  { name: 'CLS', label: 'Cumulative Layout Shift', unit: '', threshold: 0.1, good: 0.1 },
  { name: 'TTFB', label: 'Time to First Byte', unit: 'ms', threshold: 800, good: 600 },
];

const BUILD_METRICS = [
  { name: 'Bundle Size', label: 'Bundle Size (gzip)', unit: 'KB', threshold: 244, good: 200 },
  { name: 'Initial Load', label: 'Initial Load Time', unit: 's', threshold: 3, good: 2 },
  { name: 'TTI', label: 'Time to Interactive', unit: 's', threshold: 5, good: 3 },
];

const RUNTIME_METRICS = [
  { name: 'Render Time', label: 'Component Render Time', unit: 'ms', threshold: 50, good: 30 },
  { name: 'Interaction', label: 'Interaction Response', unit: 'ms', threshold: 100, good: 50 },
  { name: 'Frame Time', label: 'Animation Frame Time', unit: 'ms', threshold: 16.67, good: 16.67 },
];

const calculateStatus = (value: number, threshold: number, good: number): 'good' | 'warning' | 'poor' => {
  if (value <= good) return 'good';
  if (value <= threshold) return 'warning';
  return 'poor';
};

const getTrend = (current: number, previous?: number): 'up' | 'down' | 'stable' => {
  if (!previous) return 'stable';
  const diff = current - previous;
  if (Math.abs(diff) < 0.05 * previous) return 'stable';
  return diff > 0 ? 'up' : 'down';
};

const MetricCard: React.FC<{ metric: PerformanceMetric; previousValue?: number }> = ({ metric, previousValue }) => {
  const { tokens } = useTheme();
  const status = calculateStatus(metric.value, metric.threshold, metric.good);
  const trend = getTrend(metric.value, previousValue);

  const statusColors = {
    good: tokens['color.success'] || '#22c55e',
    warning: tokens['color.warning'] || '#f59e0b',
    poor: tokens['color.destructive'] || '#ef4444',
  };

  const trendIcon = {
    up: '↑',
    down: '↓',
    stable: '→',
  };

  return (
    <div
      style={{
        padding: '1rem',
        border: `1px solid ${tokens['color.border'] || '#e5e7eb'}`,
        borderRadius: tokens['radius.md'] || '0.25rem',
        backgroundColor: tokens['color.card'] || '#ffffff',
        marginBottom: '1rem',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
        <h4 style={{ margin: 0, fontSize: '0.875rem', fontWeight: 600 }}>{metric.label}</h4>
        <Badge
          variant={status === 'good' ? 'default' : status === 'warning' ? 'secondary' : 'destructive'}
        >
          {status.toUpperCase()}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
        <span style={{ fontSize: '2rem', fontWeight: 700, color: statusColors[status] }}>
          {metric.value.toFixed(metric.unit === '' ? 2 : 0)}
        </span>
        <span style={{ fontSize: '1rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
          {metric.unit}
        </span>
        {previousValue && (
          <span style={{ fontSize: '0.875rem', color: trend === 'up' ? '#ef4444' : trend === 'down' ? '#22c55e' : '#64748b' }}>
            {trendIcon[trend]} {Math.abs(((metric.value - previousValue) / previousValue) * 100).toFixed(1)}%
          </span>
        )}
      </div>
      <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
        目标: &lt; {metric.good}{metric.unit} | 阈值: {metric.threshold}{metric.unit}
      </div>
    </div>
  );
};

export const PerformanceDashboard: React.FC<PerformanceDashboardProps> = ({
  className = '',
  refreshInterval = 60000,
  onRefresh,
}) => {
  const { tokens } = useTheme();
  const [coreMetrics, setCoreMetrics] = useState<PerformanceMetric[]>([]);
  const [buildMetrics, setBuildMetrics] = useState<PerformanceMetric[]>([]);
  const [runtimeMetrics, setRuntimeMetrics] = useState<PerformanceMetric[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const generateMockMetrics = useCallback(() => {
    const generateMetric = (config: typeof CORE_METRICS[0]): PerformanceMetric => {
      const value = config.good + Math.random() * (config.threshold - config.good);
      const status = calculateStatus(value, config.threshold, config.good);
      return {
        name: config.name,
        value,
        unit: config.unit,
        threshold: config.threshold,
        good: config.good,
        status,
      };
    };

    setCoreMetrics(CORE_METRICS.map(generateMetric));
    setBuildMetrics(BUILD_METRICS.map(generateMetric));
    setRuntimeMetrics(RUNTIME_METRICS.map(generateMetric));
    setLastUpdated(new Date());
    setIsLoading(false);
  }, []);

  useEffect(() => {
    generateMockMetrics();
    const interval = setInterval(() => {
      generateMockMetrics();
      onRefresh?.();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval, generateMockMetrics, onRefresh]);

  const overallScore = useMemo(() => {
    const allMetrics = [...coreMetrics, ...buildMetrics, ...runtimeMetrics];
    const goodCount = allMetrics.filter(m => m.status === 'good').length;
    const warningCount = allMetrics.filter(m => m.status === 'warning').length;
    const score = Math.round((goodCount / allMetrics.length) * 100);
    return { score, goodCount, warningCount, total: allMetrics.length };
  }, [coreMetrics, buildMetrics, runtimeMetrics]);

  const handleRefresh = useCallback(() => {
    setIsLoading(true);
    generateMockMetrics();
    onRefresh?.();
  }, [generateMockMetrics, onRefresh]);

  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          <p style={{ color: tokens['color.mutedForeground'] || '#64748b' }}>加载性能数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className} style={{ padding: '1.5rem' }}>
      <Card>
        <CardHeader>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <CardTitle>性能监控仪表板</CardTitle>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <Badge variant="outline">
                总分: {overallScore.score}/100
              </Badge>
              <span style={{ fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
                最后更新: {lastUpdated.toLocaleTimeString()}
              </span>
              <button
                onClick={handleRefresh}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: tokens['color.primary'] || '#d45a5f',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: tokens['radius.md'] || '0.25rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                刷新
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: tokens['color.foreground'] || '#0f172a' }}>
              核心指标 (Core Web Vitals)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {coreMetrics.map(metric => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: tokens['color.foreground'] || '#0f172a' }}>
              构建指标 (Build Metrics)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {buildMetrics.map(metric => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '2rem' }}>
            <h3 style={{ marginBottom: '1rem', color: tokens['color.foreground'] || '#0f172a' }}>
              运行时指标 (Runtime Metrics)
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {runtimeMetrics.map(metric => (
                <MetricCard key={metric.name} metric={metric} />
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '1rem',
              backgroundColor: tokens['color.muted'] || '#f1f5f9',
              borderRadius: tokens['radius.md'] || '0.25rem',
              marginTop: '1rem',
            }}
          >
            <h4 style={{ marginBottom: '0.5rem', color: tokens['color.foreground'] || '#0f172a' }}>
              性能摘要
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
                  优秀:
                </span>
                <strong style={{ color: tokens['color.success'] || '#22c55e' }}>
                  {overallScore.goodCount}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
                  警告:
                </span>
                <strong style={{ color: tokens['color.warning'] || '#f59e0b' }}>
                  {overallScore.warningCount}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
                  总计:
                </span>
                <strong>{overallScore.total}</strong>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: tokens['color.mutedForeground'] || '#64748b' }}>
                  得分:
                </span>
                <strong style={{ fontSize: '1.5rem', color: tokens['color.primary'] || '#d45a5f' }}>
                  {overallScore.score}
                </strong>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceDashboard;
