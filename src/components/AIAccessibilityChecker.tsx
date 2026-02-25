import * as React from 'react';
import { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import { accessibilityChecker, AccessibilityReport, AccessibilityIssue, AccessibilityCheckOptions } from '../ai/accessibility-checker';

export interface AIAccessibilityCheckerProps {
  className?: string;
  targetElement?: HTMLElement | null;
  onFixIssue?: (issue: AccessibilityIssue) => void;
  autoCheck?: boolean;
  checkInterval?: number;
}

export const AIAccessibilityChecker: React.FC<AIAccessibilityCheckerProps> = ({
  className = '',
  targetElement,
  onFixIssue,
  autoCheck = false,
  checkInterval = 5000,
}) => {
  const { tokens } = useTheme();
  const [report, setReport] = useState<AccessibilityReport | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  const [targetLevel, setTargetLevel] = useState<'A' | 'AA' | 'AAA'>('AA');
  const [checkOptions, setCheckOptions] = useState<AccessibilityCheckOptions>({
    checkContrast: true,
    checkKeyboard: true,
    checkAria: true,
    checkForms: true,
    checkHeadings: true,
    targetLevel: 'AA',
  });
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);
  const checkTimerRef = useRef<number | null>(null);

  const getTokenValue = (key: string): string => {
    const value = tokens[key];
    return typeof value === 'string' ? value : '#000000';
  };

  const handleCheck = useCallback(() => {
    setIsChecking(true);
    
    setTimeout(() => {
      const elementToCheck = targetElement || document.body;
      const newReport = accessibilityChecker.check(elementToCheck, checkOptions);
      setReport(newReport);
      setIsChecking(false);
    }, 100);
  }, [targetElement, checkOptions]);

  const handleFixIssue = useCallback((issue: AccessibilityIssue) => {
    if (issue.fixAction) {
      issue.fixAction();
      
      setReport(prev => prev ? {
        ...prev,
        issues: prev.issues.filter(i => i.id !== issue.id),
        summary: {
          ...prev.summary,
          [issue.severity]: prev.summary[issue.severity] - 1,
        },
      } : null);

      if (onFixIssue) {
        onFixIssue(issue);
      }
    }
  }, [onFixIssue]);

  const handleAutoFixAll = useCallback(() => {
    if (!report) return;

    let fixedCount = 0;
    report.issues.forEach(issue => {
      if (issue.autoFixable && issue.fixAction) {
        issue.fixAction();
        fixedCount++;
      }
    });

    setTimeout(() => {
      handleCheck();
    }, 100);
  }, [report, handleCheck]);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return '#dc2626';
      case 'serious':
        return '#ea580c';
      case 'moderate':
        return '#d97706';
      case 'minor':
        return '#65a30d';
      default:
        return '#6b7280';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#16a34a';
    if (score >= 80) return '#16a34a';
    if (score >= 70) return '#65a30d';
    if (score >= 60) return '#ca8a04';
    if (score >= 50) return '#ea580c';
    return '#dc2626';
  };

  const getWcagColor = (level: string) => {
    switch (level) {
      case 'AAA':
        return '#16a34a';
      case 'AA':
        return '#16a34a';
      case 'A':
        return '#ca8a04';
      case 'fail':
        return '#dc2626';
      default:
        return '#6b7280';
    }
  };

  const getSeverityLabel = (severity: string) => {
    const labels: Record<string, string> = {
      critical: '严重',
      serious: '严重',
      moderate: '中等',
      minor: '轻微',
    };
    return labels[severity] || severity;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'color-contrast': '颜色对比度',
      'focus-indicator': '焦点指示器',
      'keyboard-nav': '键盘导航',
      'aria-label': 'ARIA 标签',
      'form-label': '表单标签',
      'heading-order': '标题层级',
    };
    return labels[type] || type;
  };

  useEffect(() => {
    if (autoCheck) {
      handleCheck();
      checkTimerRef.current = window.setInterval(handleCheck, checkInterval);
    }

    return () => {
      if (checkTimerRef.current) {
        clearInterval(checkTimerRef.current);
      }
    };
  }, [autoCheck, checkInterval, handleCheck]);

  const autoFixableIssues = report?.issues.filter(i => i.autoFixable) || [];

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI 可访问性检查器</CardTitle>
          {autoCheck && (
            <Badge style={{ background: '#16a34a', color: '#ffffff' }}>
              自动检查
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-4 items-center flex-wrap">
          <Button onClick={handleCheck} disabled={isChecking} className="flex-1 min-w-[120px]">
            {isChecking ? '检查中...' : '开始检查'}
          </Button>
          
          {autoFixableIssues.length > 0 && (
            <Button 
              onClick={handleAutoFixAll}
              variant="secondary"
              className="flex-1 min-w-[120px]"
            >
              自动修复 ({autoFixableIssues.length})
            </Button>
          )}
        </div>

        <div className="flex gap-4 items-center flex-wrap">
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              WCAG 级别
            </label>
            <select
              value={targetLevel}
              onChange={(e) => {
                const newLevel = e.target.value as 'A' | 'AA' | 'AAA';
                setTargetLevel(newLevel);
                setCheckOptions(prev => ({ ...prev, targetLevel: newLevel }));
              }}
              style={{
                width: '100%',
                padding: '6px 12px',
                border: `1px solid ${getTokenValue('color.border')}`,
                borderRadius: '6px',
                fontSize: '14px',
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            >
              <option value="A">WCAG A (3:1)</option>
              <option value="AA">WCAG AA (4.5:1)</option>
              <option value="AAA">WCAG AAA (7:1)</option>
            </select>
          </div>

          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              检查项目
            </label>
            <div className="flex flex-wrap gap-2">
              {Object.entries(checkOptions).filter(([key]) => key !== 'targetLevel').map(([key, value]) => {
                if (typeof value !== 'boolean') return null;
                const labels: Record<string, string> = {
                  checkContrast: '对比度',
                  checkKeyboard: '键盘',
                  checkAria: 'ARIA',
                  checkForms: '表单',
                  checkHeadings: '标题',
                };
                return (
                  <label key={key} className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={value}
                      onChange={(e) => setCheckOptions(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4"
                    />
                    <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                      {labels[key]}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {report && (
          <>
            <div className="text-center p-6 rounded-lg" style={{
              background: getTokenValue('color.card'),
              border: `2px solid ${getScoreColor(report.overallScore)}`,
            }}>
              <div
                className="text-5xl font-bold mb-2"
                style={{ color: getScoreColor(report.overallScore) }}
              >
                {report.overallScore}
              </div>
              <div className="text-sm mb-4" style={{ color: getTokenValue('color.muted-foreground') }}>
                可访问性评分
              </div>
              <Badge
                style={{
                  background: getWcagColor(report.wcagCompliance),
                  color: '#ffffff',
                }}
              >
                WCAG {report.wcagCompliance}
              </Badge>
            </div>

            {report.summary.critical + report.summary.serious + report.summary.moderate + report.summary.minor > 0 && (
              <div className="flex justify-center gap-4 flex-wrap">
                {report.summary.critical > 0 && (
                  <Badge style={{ background: getSeverityColor('critical'), color: '#ffffff' }}>
                    严重: {report.summary.critical}
                  </Badge>
                )}
                {report.summary.serious > 0 && (
                  <Badge style={{ background: getSeverityColor('serious'), color: '#ffffff' }}>
                    严重: {report.summary.serious}
                  </Badge>
                )}
                {report.summary.moderate > 0 && (
                  <Badge style={{ background: getSeverityColor('moderate'), color: '#ffffff' }}>
                    中等: {report.summary.moderate}
                  </Badge>
                )}
                {report.summary.minor > 0 && (
                  <Badge style={{ background: getSeverityColor('minor'), color: '#ffffff' }}>
                    轻微: {report.summary.minor}
                  </Badge>
                )}
              </div>
            )}

            {report.recommendations.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium" style={{ color: getTokenValue('color.foreground') }}>
                  AI 建议
                </h3>
                <div className="space-y-2">
                  {report.recommendations.map((rec, index) => (
                    <div
                      key={index}
                      className="p-3 rounded-lg"
                      style={{
                        background: getTokenValue('color.card'),
                        border: `1px solid ${getTokenValue('color.border')}`,
                      }}
                    >
                      <p className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                        💡 {rec}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.issues.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-medium" style={{ color: getTokenValue('color.foreground') }}>
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
                        background: getTokenValue('color.card'),
                        border: `2px solid ${getSeverityColor(issue.severity)}`,
                      }}
                      onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex gap-2 flex-wrap">
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
                              background: getTokenValue('color.muted'),
                              color: getTokenValue('color.foreground'),
                            }}
                          >
                            {getTypeLabel(issue.type)}
                          </Badge>
                          <Badge
                            style={{
                              background: getTokenValue('color.muted'),
                              color: getTokenValue('color.foreground'),
                            }}
                          >
                            &lt;{issue.element}&gt;
                          </Badge>
                        </div>
                        {issue.autoFixable && (
                          <Badge style={{ background: '#16a34a', color: '#ffffff' }}>
                            可修复
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm mb-2" style={{ color: getTokenValue('color.foreground') }}>
                        {issue.message}
                      </p>
                      
                      <p className="text-xs mb-3" style={{ color: getTokenValue('color.muted-foreground') }}>
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
                    </div>
                  ))}
                </div>
              </div>
            )}

            {report.issues.length === 0 && (
              <div className="text-center p-8 rounded-lg" style={{
                background: getTokenValue('color.card'),
                border: `2px solid #16a34a`,
              }}>
                <div className="text-4xl mb-2">✅</div>
                <p className="text-lg font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
                  完美！
                </p>
                <p className="text-sm" style={{ color: getTokenValue('color.muted-foreground') }}>
                  页面完全符合 WCAG {targetLevel} 标准
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

AIAccessibilityChecker.displayName = 'AIAccessibilityChecker';
