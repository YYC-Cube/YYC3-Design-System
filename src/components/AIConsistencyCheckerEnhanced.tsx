import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import {
  enhancedConsistencyChecker,
  ConsistencyReport,
  ConsistencyIssue,
  ConsistencyCheckOptions,
} from '../ai/consistency-checker-enhanced';
import { DesignTokens } from '../../types/tokens';

type TokenValue = string | number | Record<string, string | number>;

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export interface AIConsistencyCheckerEnhancedProps {
  tokens?: DesignTokens;
  onFixIssue?: (issueId: string) => void;
  onAutoFix?: (fixedTokens: DesignTokens) => void;
  className?: string;
  realtimeCheck?: boolean;
}

export const AIConsistencyCheckerEnhanced: React.FC<AIConsistencyCheckerEnhancedProps> = ({
  tokens,
  onFixIssue,
  onAutoFix,
  className = '',
  realtimeCheck = true,
}) => {
  const { tokens: themeTokens } = useTheme();
  const [report, setReport] = useState<ConsistencyReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [autoFix, setAutoFix] = useState(false);
  const [targetContrast, setTargetContrast] = useState<'AA' | 'AAA'>('AA');
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const [checkInterval, setCheckInterval] = useState<number | null>(null);

  const tokensToCheck = tokens || themeTokens;

  const handleCheck = useCallback(() => {
    setIsChecking(true);
    const options: ConsistencyCheckOptions = {
      autoFix,
      targetContrast,
      checkAccessibility: true,
      checkNaming: true,
    };

    setTimeout(() => {
      const newReport = enhancedConsistencyChecker.check(tokensToCheck, options);
      setReport(newReport);
      setIsChecking(false);
    }, 100);
  }, [tokensToCheck, autoFix, targetContrast]);

  const handleFixIssue = useCallback(
    (issue: ConsistencyIssue) => {
      if (issue.fixAction && onFixIssue) {
        const fixedTokens = issue.fixAction();
        onFixIssue(issue.id);
        setReport((prev) =>
          prev
            ? {
                ...prev,
                fixedTokens,
                issues: prev.issues.filter((i) => i.id !== issue.id),
                summary: {
                  error: prev.summary.error - (issue.severity === 'error' ? 1 : 0),
                  warning: prev.summary.warning - (issue.severity === 'warning' ? 1 : 0),
                  info: prev.summary.info - (issue.severity === 'info' ? 1 : 0),
                },
              }
            : null
        );
      }
    },
    [onFixIssue]
  );

  const handleAutoFixAll = useCallback(() => {
    const options: ConsistencyCheckOptions = {
      autoFix: true,
      targetContrast,
      checkAccessibility: true,
      checkNaming: true,
    };

    const newReport = enhancedConsistencyChecker.check(tokensToCheck, options);
    if (newReport.fixedTokens && onAutoFix) {
      onAutoFix(newReport.fixedTokens);
    }
    setReport(newReport);
  }, [tokensToCheck, targetContrast, onAutoFix]);

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

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      color: '颜色',
      spacing: '间距',
      typography: '排版',
      shadow: '阴影',
      contrast: '对比度',
    };
    return labels[category] || category;
  };

  useEffect(() => {
    if (realtimeCheck) {
      handleCheck();
      const interval = window.setInterval(handleCheck, 30000);
      setCheckInterval(interval);
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [realtimeCheck, tokensToCheck, handleCheck]);

  useEffect(() => {
    return () => {
      if (checkInterval) {
        clearInterval(checkInterval);
      }
    };
  }, [checkInterval]);

  const autoFixableIssues = report?.issues.filter((i) => i.autoFixable) || [];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI 设计一致性检查 (增强版)</CardTitle>
          {realtimeCheck && (
            <Badge style={{ background: '#10b981', color: '#ffffff' }}>实时检查</Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center">
          <Button onClick={handleCheck} disabled={isChecking} className="flex-1">
            {isChecking ? '检查中...' : '开始检查'}
          </Button>

          {autoFixableIssues.length > 0 && (
            <Button onClick={handleAutoFixAll} variant="secondary" className="flex-1">
              自动修复 ({autoFixableIssues.length})
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={autoFix}
              onChange={(e) => setAutoFix(e.target.checked)}
              className="w-4 h-4"
            />
            <span
              className="text-sm"
              style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
            >
              启用自动修复
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <span
              className="text-sm"
              style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
            >
              对比度标准:
            </span>
            <select
              value={targetContrast}
              onChange={(e) => setTargetContrast(e.target.value as 'AA' | 'AAA')}
              style={{
                padding: '4px 8px',
                border: `1px solid ${getTokenValue(themeTokens, 'color.border')}`,
                borderRadius: '4px',
                fontSize: '14px',
              }}
            >
              <option value="AA">WCAG AA (4.5:1)</option>
              <option value="AAA">WCAG AAA (7:1)</option>
            </select>
          </label>
        </div>

        {report && (
          <>
            <div
              className="text-center p-6 rounded-lg"
              style={{
                background: getTokenValue(themeTokens, 'color.card'),
                border: `2px solid ${getScoreColor(report.overallScore)}`,
              }}
            >
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: getScoreColor(report.overallScore) }}
              >
                {report.overallScore}
              </div>
              <div
                className="text-sm mb-4"
                style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
              >
                一致性评分
              </div>
              <div className="flex justify-center gap-4">
                <Badge style={{ background: '#ef4444', color: '#ffffff' }}>
                  错误: {report.summary.error}
                </Badge>
                <Badge style={{ background: '#f59e0b', color: '#ffffff' }}>
                  警告: {report.summary.warning}
                </Badge>
                <Badge style={{ background: '#3b82f6', color: '#ffffff' }}>
                  信息: {report.summary.info}
                </Badge>
              </div>
            </div>

            {report.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3
                  className="text-sm font-medium"
                  style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                >
                  AI 推荐
                </h3>
                <div className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg"
                      style={{
                        background: getTokenValue(themeTokens, 'color.card'),
                        border: `1px solid ${getTokenValue(themeTokens, 'color.border')}`,
                      }}
                    >
                      <p
                        className="text-sm"
                        style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                      >
                        💡 {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.issues.length > 0 && (
              <div className="space-y-3">
                <h3
                  className="text-sm font-medium"
                  style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                >
                  检测到的问题 ({report.issues.length})
                </h3>
                <div className="space-y-2">
                  {report.issues.map((issue) => (
                    <div
                      key={issue.id}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedIssue === issue.id ? 'ring-2' : ''
                      }`}
                      style={{
                        background: getTokenValue(themeTokens, 'color.card'),
                        border: `2px solid ${getSeverityColor(issue.severity)}`,
                      }}
                      onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2">
                          <Badge
                            style={{
                              background: getSeverityColor(issue.severity),
                              color: '#ffffff',
                            }}
                          >
                            {getSeverityLabel(issue.severity)}
                          </Badge>
                          <Badge
                            style={{
                              background: getTokenValue(themeTokens, 'color.muted'),
                              color: getTokenValue(themeTokens, 'color.foreground'),
                            }}
                          >
                            {getCategoryLabel(issue.category)}
                          </Badge>
                        </div>
                        {issue.autoFixable && (
                          <Badge style={{ background: '#10b981', color: '#ffffff' }}>
                            可自动修复
                          </Badge>
                        )}
                      </div>

                      <p
                        className="text-sm mb-2"
                        style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                      >
                        {issue.message}
                      </p>

                      <p
                        className="text-xs mb-3"
                        style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                      >
                        建议: {issue.suggestion}
                      </p>

                      {issue.autoFixable && (
                        <Button
                          onClick={() => {
                            handleFixIssue(issue);
                          }}
                          variant="outline"
                          size="sm"
                          className="w-full"
                        >
                          修复此问题
                        </Button>
                      )}

                      {selectedIssue === issue.id && (
                        <div
                          className="mt-3 pt-3 border-t"
                          style={{ borderColor: getTokenValue(themeTokens, 'color.border') }}
                        >
                          <p
                            className="text-xs mb-2"
                            style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                          >
                            影响的令牌:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {issue.tokens.map((token) => (
                              <Badge
                                key={token}
                                variant="outline"
                                style={{
                                  fontSize: '11px',
                                  padding: '2px 6px',
                                }}
                              >
                                {token}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.issues.length === 0 && (
              <div
                className="text-center p-8 rounded-lg"
                style={{
                  background: getTokenValue(themeTokens, 'color.card'),
                  border: `2px solid #10b981`,
                }}
              >
                <div className="text-4xl mb-2">✅</div>
                <p
                  className="text-lg font-medium mb-2"
                  style={{ color: getTokenValue(themeTokens, 'color.foreground') }}
                >
                  完美！
                </p>
                <p
                  className="text-sm"
                  style={{ color: getTokenValue(themeTokens, 'color.muted-foreground') }}
                >
                  未发现一致性问题
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

AIConsistencyCheckerEnhanced.displayName = 'AIConsistencyCheckerEnhanced';
