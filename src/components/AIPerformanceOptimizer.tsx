/**
 * @file AI 性能优化建议组件
 * @description 基于性能指标提供智能优化建议的UI组件
 * @component AIPerformanceOptimizer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Grid } from './Grid';
import { performanceOptimizer } from '../ai/performance-optimizer';
import type { PerformanceMetrics, OptimizationPlan, PerformanceIssue } from '../ai/performance-optimizer';
import { useTheme } from '../theme/useTheme';

const { useState, useCallback, useMemo } = React;

export interface AIPerformanceOptimizerProps {
  onApplyOptimization?: (recommendation: PerformanceIssue) => void;
  onExportPlan?: (plan: OptimizationPlan) => void;
  initialMetrics?: PerformanceMetrics;
  showDetails?: boolean;
  className?: string;
}

const getTokenValue = (tokens: Record<string, any>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : String(value || '');
};

export const AIPerformanceOptimizer: React.FC<AIPerformanceOptimizerProps> = ({
  onApplyOptimization,
  onExportPlan,
  initialMetrics,
  showDetails: _showDetails = true,
  className = '',
}) => {
  const { tokens } = useTheme();

  const [metrics, setMetrics] = useState<PerformanceMetrics>(
    initialMetrics || {
      FCP: 2.5,
      LCP: 4.0,
      FID: 200,
      CLS: 0.15,
      TTFB: 1200,
      bundleSize: 250,
      renderTime: 40,
      memoryUsage: 120,
      apiLatency: 350,
    }
  );

  const [optimizationPlan, setOptimizationPlan] = useState<OptimizationPlan | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<PerformanceIssue | null>(null);
  const [showCodeExample, setShowCodeExample] = useState<Record<string, boolean>>({});

  const handleMetricChange = useCallback((key: keyof PerformanceMetrics, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMetrics((prev) => ({ ...prev, [key]: numValue }));
  }, []);

  const handleGeneratePlan = useCallback(() => {
    const plan = performanceOptimizer.generateOptimizationPlan(metrics);
    setOptimizationPlan(plan);
    setSelectedIssue(null);
  }, [metrics]);

  const handleSelectIssue = useCallback((issue: PerformanceIssue) => {
    setSelectedIssue(issue);
  }, []);

  const toggleCodeExample = useCallback((issueKey: string) => {
    setShowCodeExample((prev) => ({ ...prev, [issueKey]: !prev[issueKey] }));
  }, []);

  const getIssueIcon = (type: PerformanceIssue['type']) => {
    switch (type) {
      case 'critical':
        return '🔴';
      case 'warning':
        return '🟡';
      case 'info':
        return '✅';
    }
  };

  const getIssueColor = (type: PerformanceIssue['type']) => {
    switch (type) {
      case 'critical':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#10b981';
    }
  };

  const getGradeColor = (grade: OptimizationPlan['grade']) => {
    switch (grade) {
      case 'A':
        return '#10b981';
      case 'B':
        return '#3b82f6';
      case 'C':
        return '#f59e0b';
      case 'D':
        return '#f97316';
      case 'F':
        return '#ef4444';
    }
  };

  const metricLabels: Record<keyof PerformanceMetrics, string> = {
    FCP: '首次内容绘制 (FCP)',
    LCP: '最大内容绘制 (LCP)',
    FID: '首次输入延迟 (FID)',
    CLS: '累积布局偏移 (CLS)',
    TTFB: '首字节时间 (TTFB)',
    bundleSize: '包大小 (KB)',
    renderTime: '渲染时间 (ms)',
    memoryUsage: '内存使用 (MB)',
    apiLatency: 'API 延迟 (ms)',
  };

  const overallScore = useMemo(() => {
    if (!optimizationPlan) return 0;
    return optimizationPlan.overallScore;
  }, [optimizationPlan]);

  return (
    <div className={`ai-performance-optimizer ${className}`}>
      <Card>
        <CardHeader>
          <CardTitle>AI 性能优化建议</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                性能指标输入
              </h3>
              <Grid cols={2} gap={4}>
                {Object.entries(metricLabels).map(([key, label]) => (
                  <div key={key}>
                    <label
                      className="block text-sm font-medium mb-2"
                      style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}
                    >
                      {label}
                    </label>
                    <Input
                      type="number"
                      value={metrics[key as keyof PerformanceMetrics]?.toString() || ''}
                      onChange={(value) => handleMetricChange(key as keyof PerformanceMetrics, value)}
                      placeholder="输入数值"
                    />
                  </div>
                ))}
              </Grid>
              <Button
                onClick={handleGeneratePlan}
                className="w-full mt-4"
              >
                生成优化建议
              </Button>
            </div>

            {optimizationPlan && (
              <div className="space-y-6">
                <div className="text-center p-6 rounded-lg" style={{ backgroundColor: getTokenValue(tokens, 'color.muted') }}>
                  <div className="mb-2" style={{ fontSize: '48px', fontWeight: 'bold', color: getGradeColor(optimizationPlan.grade) }}>
                    {optimizationPlan.grade}
                  </div>
                  <div className="text-lg" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                    综合评分: {overallScore.toFixed(0)}/100
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 text-sm">
                    <div>
                      <div className="font-bold" style={{ color: '#ef4444' }}>
                        {optimizationPlan.summary.criticalCount} 严重
                      </div>
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: '#f59e0b' }}>
                        {optimizationPlan.summary.warningCount} 警告
                      </div>
                    </div>
                    <div>
                      <div className="font-bold" style={{ color: '#10b981' }}>
                        {optimizationPlan.summary.infoCount} 信息
                      </div>
                    </div>
                  </div>
                </div>

                {optimizationPlan.quickWins.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                      快速改进 ({optimizationPlan.quickWins.length})
                    </h3>
                    <div className="space-y-3">
                      {optimizationPlan.quickWins.map((issue, index) => (
                        <div
                          key={`${issue.metric}-${index}`}
                          className="p-4 rounded-lg border"
                          style={{
                            backgroundColor: getTokenValue(tokens, 'color.card'),
                            borderColor: getTokenValue(tokens, 'color.border'),
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getIssueIcon(issue.type)}</span>
                              <span className="font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                                {issue.metric}
                              </span>
                            </div>
                            <div className="text-sm" style={{ color: getIssueColor(issue.type) }}>
                              {issue.currentValue.toFixed(2)} / {issue.targetValue.toFixed(2)}
                            </div>
                          </div>
                          <p className="text-sm mb-3" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                            {issue.description}
                          </p>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleSelectIssue(issue)}
                            >
                              详情
                            </Button>
                            {issue.codeExample && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => toggleCodeExample(`${issue.metric}-${index}`)}
                              >
                                {showCodeExample[`${issue.metric}-${index}`] ? '隐藏代码' : '查看代码'}
                              </Button>
                            )}
                          </div>
                          {showCodeExample[`${issue.metric}-${index}`] && issue.codeExample && (
                            <pre className="mt-3 p-3 rounded text-xs overflow-x-auto" style={{
                              backgroundColor: getTokenValue(tokens, 'color.muted'),
                              color: getTokenValue(tokens, 'color.foreground'),
                            }}>
                              {issue.codeExample}
                            </pre>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {optimizationPlan.longTermImprovements.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-4" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                      长期优化 ({optimizationPlan.longTermImprovements.length})
                    </h3>
                    <div className="space-y-3">
                      {optimizationPlan.longTermImprovements.map((issue, index) => (
                        <div
                          key={`long-${issue.metric}-${index}`}
                          className="p-4 rounded-lg border"
                          style={{
                            backgroundColor: getTokenValue(tokens, 'color.card'),
                            borderColor: getTokenValue(tokens, 'color.border'),
                          }}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xl">{getIssueIcon(issue.type)}</span>
                              <span className="font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                                {issue.metric}
                              </span>
                            </div>
                            <div className="text-sm" style={{ color: getIssueColor(issue.type) }}>
                              {issue.currentValue.toFixed(2)} / {issue.targetValue.toFixed(2)}
                            </div>
                          </div>
                          <p className="text-sm mb-2" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                            {issue.description}
                          </p>
                          <div className="text-xs" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                            预计影响: {issue.estimatedImpact} | 难度: {issue.effort === 'low' ? '低' : issue.effort === 'medium' ? '中' : '高'}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {onExportPlan && (
                  <Button
                    variant="outline"
                    onClick={() => onExportPlan(optimizationPlan)}
                    className="w-full"
                  >
                    导出优化计划
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {selectedIssue && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 rounded-lg" style={{
            backgroundColor: getTokenValue(tokens, 'color.background'),
            color: getTokenValue(tokens, 'color.foreground'),
          }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">{selectedIssue.metric}</h2>
              <Button size="sm" variant="outline" onClick={() => setSelectedIssue(null)}>
                关闭
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">问题描述</h3>
                <p>{selectedIssue.description}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">优化建议</h3>
                <p>{selectedIssue.recommendation}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">当前值 / 目标值</h3>
                <p>{selectedIssue.currentValue.toFixed(2)} / {selectedIssue.targetValue.toFixed(2)}</p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">预计影响</h3>
                <p>{selectedIssue.estimatedImpact}</p>
              </div>
              {selectedIssue.codeExample && (
                <div>
                  <h3 className="font-semibold mb-2">代码示例</h3>
                  <pre className="p-3 rounded text-xs overflow-x-auto" style={{
                    backgroundColor: getTokenValue(tokens, 'color.muted'),
                  }}>
                    {selectedIssue.codeExample}
                  </pre>
                </div>
              )}
              {onApplyOptimization && (
                <Button onClick={() => onApplyOptimization(selectedIssue)} className="w-full">
                  应用此优化
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
