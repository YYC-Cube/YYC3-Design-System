/**
 * @file AI 使用模式分析组件
 * @description 提供用户界面来分析设计令牌的使用模式
 * @component AIUsageAnalyzer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React, { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import { usageAnalyzer, UsageReport } from '../ai/usage-analyzer';

export interface AIUsageAnalyzerProps {
  className?: string;
}

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export const AIUsageAnalyzer: React.FC<AIUsageAnalyzerProps> = ({
  className = '',
}) => {
  const { tokens } = useTheme();
  const [report, setReport] = useState<UsageReport | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('color');

  useEffect(() => {
    Object.entries(tokens).forEach(([name, value]) => {
      usageAnalyzer.recordUsage(name, String(value), 'tokens.json', 'ThemeProvider');
    });
  }, [tokens]);

  const handleAnalyze = useCallback(() => {
    setIsAnalyzing(true);
    const newReport = usageAnalyzer.analyzeUsage();
    setReport(newReport);
    setIsAnalyzing(false);
  }, []);

  const categories = ['color', 'spacing', 'typography', 'animation'];

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 使用模式分析</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleAnalyze} disabled={isAnalyzing} className="w-full">
          {isAnalyzing ? '分析中...' : '开始分析'}
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
                <div className="text-2xl font-bold" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                  {report.summary.totalTokens}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  总令牌数
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#10b981' }}>
                  {report.summary.usedTokens}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  已使用
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>
                  {report.summary.unusedTokens}
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  未使用
                </div>
              </div>
              <div
                className="text-center p-4 rounded-lg"
                style={{
                  background: getTokenValue(tokens, 'color.card'),
                  border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                }}
              >
                <div
                  className="text-2xl font-bold"
                  style={{
                    color: report.summary.coverage >= 80 ? '#10b981' : 
                           report.summary.coverage >= 60 ? '#f59e0b' : '#ef4444'
                  }}
                >
                  {report.summary.coverage}%
                </div>
                <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                  使用率
                </div>
              </div>
            </div>

            <div>
              <div className="flex gap-2 mb-4">
                {categories.map(category => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? 'default' : 'outline'}
                    style={{
                      cursor: 'pointer',
                      background: selectedCategory === category ? getTokenValue(tokens, 'color.primary') : 'transparent',
                      color: selectedCategory === category ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                      borderColor: getTokenValue(tokens, 'color.primary'),
                    }}
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>

              {report.patterns[selectedCategory] && (
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                      最常用令牌
                    </h4>
                    <div className="space-y-2">
                      {report.patterns[selectedCategory].mostUsed.map((token, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 rounded"
                          style={{
                            background: getTokenValue(tokens, 'color.card'),
                            border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                          }}
                        >
                          <div>
                            <div className="text-sm font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                              {token.tokenName}
                            </div>
                            <div className="text-xs mt-1" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                              {token.tokenValue}
                            </div>
                          </div>
                          <Badge
                            style={{
                              background: getTokenValue(tokens, 'color.primary'),
                              color: '#ffffff',
                            }}
                          >
                            {token.usageCount} 次
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>

                  {report.patterns[selectedCategory].trends.increasing.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                        使用趋势上升
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.patterns[selectedCategory].trends.increasing.map((token, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            style={{
                              borderColor: '#10b981',
                              color: '#10b981',
                            }}
                          >
                            {token} ↑
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {report.patterns[selectedCategory].trends.decreasing.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                        使用趋势下降
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {report.patterns[selectedCategory].trends.decreasing.map((token, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            style={{
                              borderColor: '#ef4444',
                              color: '#ef4444',
                            }}
                          >
                            {token} ↓
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {report.insights.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                  关键洞察
                </h3>
                <ul className="space-y-2">
                  {report.insights.map((insight, index) => (
                    <li
                      key={index}
                      className="text-sm p-3 rounded"
                      style={{
                        background: getTokenValue(tokens, 'color.card'),
                        border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                        color: getTokenValue(tokens, 'color.foreground'),
                      }}
                    >
                      💡 {insight}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {report.recommendations.length > 0 && (
              <div>
                <h3 className="text-sm font-medium mb-2" style={{ color: tokens['color.foreground'] as string }}>
                  优化建议
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm p-3 rounded"
                      style={{
                        background: tokens['color.card'] as string,
                        border: `1px solid ${tokens['color.border'] as string}`,
                        color: tokens['color.foreground'] as string,
                      }}
                    >
                      📋 {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
