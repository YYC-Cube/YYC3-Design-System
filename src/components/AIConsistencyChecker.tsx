/**
 * @file AI 一致性检查组件
 * @description 提供用户界面来检查设计令牌的一致性
 * @component AIConsistencyChecker
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import { consistencyChecker, ConsistencyReport } from '../ai/consistency-checker';
import { DesignTokens } from '../../types/tokens';

export interface AIConsistencyCheckerProps {
  tokens?: DesignTokens;
  onFixIssue?: (issueId: string) => void;
  className?: string;
}

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export const AIConsistencyChecker: React.FC<AIConsistencyCheckerProps> = ({
  tokens,
  onFixIssue,
  className = '',
}) => {
  const { tokens: themeTokens } = useTheme();
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);

  const handleCheck = useCallback(() => {
    setIsChecking(true);
    const tokensToCheck = tokens || themeTokens;
    const newReport = consistencyChecker.check(tokensToCheck);
    setReport(newReport);
    setIsChecking(false);
  }, [tokens, themeTokens]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error':
        return '#ef4444';
      case 'warning':
        return '#f59e0b';
      case 'info':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981';
    if (score >= 60) return '#f59e0b';
    return '#ef4444';
  };

  const getSeverityLabel = (severity: string) => {
    switch (severity) {
      case 'error':
        return '错误';
      case 'warning':
        return '警告';
      case 'info':
        return '信息';
      default:
        return '未知';
    }
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 设计一致性检查</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Button onClick={handleCheck} disabled={isChecking} className="w-full">
          {isChecking ? '检查中...' : '开始检查'}
        </Button>

        {report && (
          <div className="space-y-6">
            <div className="text-center">
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: getScoreColor(report.overallScore) }}
              >
                {report.overallScore}
              </div>
              <div
                className="text-sm"
                style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
              >
                一致性评分
              </div>
            </div>

            <div className="grid grid-cols-5 gap-2">
              {Object.entries(report.categories).map(([key, value]) => (
                <div
                  key={key}
                  className="text-center p-3 rounded-lg"
                  style={{
                    background: getTokenValue(themeTokens, 'color.card'),
                    border: `1px solid ${getTokenValue(themeTokens, 'color.border')}`,
                  }}
                >
                  <div className="text-lg font-bold" style={{ color: getScoreColor(value.score) }}>
                    {value.score}
                  </div>
                  <div
                    className="text-xs mt-1"
                    style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                  >
                    {key}
                  </div>
                  <div className="text-xs mt-1" style={{ color: getSeverityColor('error') }}>
                    {value.issues} 问题
                  </div>
                </div>
              ))}
            </div>

            {report.issues.length > 0 && (
              <div className="space-y-3">
                <h3
                  className="text-sm font-medium"
                  style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                >
                  发现的问题 ({report.issues.length})
                </h3>
                <div className="space-y-2">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className="p-4 rounded-lg"
                      style={{
                        background: getTokenValue(themeTokens, 'color.card'),
                        border: `1px solid ${getTokenValue(themeTokens, 'color.border')}`,
                      }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            style={{
                              background: getSeverityColor(issue.severity),
                              color: '#ffffff',
                            }}
                          >
                            {getSeverityLabel(issue.severity)}
                          </Badge>
                          <Badge
                            variant="outline"
                            style={{
                              borderColor: getTokenValue(themeTokens, 'color.border'),
                              color: getTokenValue(themeTokens, 'color.muted-foreground'),
                            }}
                          >
                            {issue.category}
                          </Badge>
                        </div>
                        {issue.location && (
                          <span
                            className="text-xs"
                            style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                          >
                            {issue.location}
                          </span>
                        )}
                      </div>
                      <p
                        className="text-sm mb-2"
                        style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                      >
                        {issue.message}
                      </p>
                      {issue.suggestion && (
                        <p
                          className="text-xs"
                          style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                        >
                          建议: {issue.suggestion}
                        </p>
                      )}
                      {onFixIssue && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="mt-2"
                          onClick={() => onFixIssue(issue.id)}
                        >
                          修复
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3
                  className="text-sm font-medium"
                  style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                >
                  改进建议
                </h3>
                <ul className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <li
                      key={index}
                      className="text-sm p-3 rounded"
                      style={{
                        background: getTokenValue(themeTokens, 'color.card'),
                        border: `1px solid ${getTokenValue(themeTokens, 'color.border')}`,
                        color: getTokenValue(themeTokens, 'color.foreground'),
                      }}
                    >
                      • {rec}
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
