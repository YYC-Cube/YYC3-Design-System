/**
 * @file AI 组件推荐器组件
 * @description 提供用户界面来获取智能组件推荐
 * @component AIComponentRecommender
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import {
  componentRecommender,
  type ComponentRecommendation,
  type UIRequirement,
  type RecommendationOptions,
  type ComponentType,
} from '../ai/component-recommender';

const { useState, useCallback, useMemo } = React;

export interface AIComponentRecommenderProps {
  onSelectComponent?: (component: ComponentType) => void;
  className?: string;
}

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export const AIComponentRecommender: React.FC<AIComponentRecommenderProps> = ({
  onSelectComponent,
  className = '',
}) => {
  const { tokens } = useTheme();
  const [description, setDescription] = useState('');
  const [actionType, setActionType] = useState<'navigation' | 'input' | 'display' | 'feedback' | 'selection' | 'layout'>('display');
  const [contentType, setContentType] = useState<'text' | 'image' | 'data' | 'mixed'>('text');
  const [interactionLevel, setInteractionLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [complexity, setComplexity] = useState<'simple' | 'medium' | 'complex'>('simple');
  const [accessibilityLevel, setAccessibilityLevel] = useState<'basic' | 'standard' | 'advanced'>('standard');
  const [responsiveRequired, setResponsiveRequired] = useState(true);
  const [themeAdaptation, setThemeAdaptation] = useState(true);
  const [animationRequired, setAnimationRequired] = useState(false);
  const [recommendations, setRecommendations] = useState<ComponentRecommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<ComponentRecommendation | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const actionTypes = [
    { value: 'navigation', label: '导航' },
    { value: 'input', label: '输入' },
    { value: 'display', label: '展示' },
    { value: 'feedback', label: '反馈' },
    { value: 'selection', label: '选择' },
    { value: 'layout', label: '布局' },
  ] as const;

  const contentTypes = [
    { value: 'text', label: '文本' },
    { value: 'image', label: '图片' },
    { value: 'data', label: '数据' },
    { value: 'mixed', label: '混合' },
  ] as const;

  const interactionLevels = [
    { value: 'low', label: '低' },
    { value: 'medium', label: '中' },
    { value: 'high', label: '高' },
  ] as const;

  const complexityLevels = [
    { value: 'simple', label: '简单' },
    { value: 'medium', label: '中等' },
    { value: 'complex', label: '复杂' },
  ] as const;

  const accessibilityLevels = [
    { value: 'basic', label: '基础' },
    { value: 'standard', label: '标准' },
    { value: 'advanced', label: '高级' },
  ] as const;

  const handleGenerate = useCallback(() => {
    const requirements: UIRequirement[] = [{
      description: description || '通用UI组件需求',
      actionType,
      contentType,
      interactionLevel,
      complexity,
      accessibilityLevel,
      responsiveRequired,
      themeAdaptation: themeAdaptation,
      animationRequired,
    }];

    const options: RecommendationOptions = {
      requirements,
      minConfidence: 50,
      maxRecommendations: 10,
    };

    const newRecommendations = componentRecommender.generateRecommendations(options);
    setRecommendations(newRecommendations);
    setSelectedRecommendation(null);
    setShowDetails({});
  }, [description, actionType, contentType, interactionLevel, complexity, accessibilityLevel, responsiveRequired, themeAdaptation, animationRequired]);

  const handleSelectRecommendation = useCallback((rec: ComponentRecommendation) => {
    setSelectedRecommendation(rec);
    if (onSelectComponent) {
      onSelectComponent(rec.component);
    }
  }, [onSelectComponent]);

  const toggleDetails = useCallback((component: ComponentType) => {
    setShowDetails((prev) => ({
      ...prev,
      [component]: !prev[component],
    }));
  }, []);

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 80) return tokens['color.success'] as string || '#10b981';
    if (confidence >= 60) return tokens['color.warning'] as string || '#f59e0b';
    return tokens['color.destructive'] as string || '#ef4444';
  };

  const getComplexityBadgeVariant = (complexity: 'simple' | 'medium' | 'complex'): 'default' | 'secondary' => {
    if (complexity === 'simple') return 'secondary';
    return 'default';
  };

  const getLearningCurveLabel = (curve: 'easy' | 'moderate' | 'steep'): string => {
    const labels = {
      easy: '简单',
      moderate: '中等',
      steep: '困难',
    };
    return labels[curve];
  };

  const sortedRecommendations = useMemo(() => {
    return [...recommendations].sort((a, b) => b.confidence - a.confidence);
  }, [recommendations]);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 组件推荐器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              需求描述
            </label>
            <Input
              type="text"
              value={description}
              onChange={setDescription}
              placeholder="描述您的UI需求，例如：需要一个用户登录表单"
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                操作类型
              </label>
              <select
                value={actionType}
                onChange={(e) => setActionType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                  backgroundColor: getTokenValue(tokens, 'color.card'),
                  color: getTokenValue(tokens, 'color.foreground'),
                }}
              >
                {actionTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                内容类型
              </label>
              <select
                value={contentType}
                onChange={(e) => setContentType(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                  backgroundColor: getTokenValue(tokens, 'color.card'),
                  color: getTokenValue(tokens, 'color.foreground'),
                }}
              >
                {contentTypes.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                交互级别
              </label>
              <select
                value={interactionLevel}
                onChange={(e) => setInteractionLevel(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                  backgroundColor: getTokenValue(tokens, 'color.card'),
                  color: getTokenValue(tokens, 'color.foreground'),
                }}
              >
                {interactionLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                复杂度
              </label>
              <select
                value={complexity}
                onChange={(e) => setComplexity(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                  backgroundColor: getTokenValue(tokens, 'color.card'),
                  color: getTokenValue(tokens, 'color.foreground'),
                }}
              >
                {complexityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                可访问性级别
              </label>
              <select
                value={accessibilityLevel}
                onChange={(e) => setAccessibilityLevel(e.target.value as any)}
                className="w-full px-3 py-2 border rounded"
                style={{
                  borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                  backgroundColor: getTokenValue(tokens, 'color.card'),
                  color: getTokenValue(tokens, 'color.foreground'),
                }}
              >
                {accessibilityLevels.map((level) => (
                  <option key={level.value} value={level.value}>
                    {level.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={responsiveRequired}
                onChange={(e) => setResponsiveRequired(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                需要响应式
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={themeAdaptation}
                onChange={(e) => setThemeAdaptation(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                主题适配
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={animationRequired}
                onChange={(e) => setAnimationRequired(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                需要动画
              </span>
            </label>
          </div>

          <Button
            onClick={handleGenerate}
            className="w-full"
          >
            生成推荐
          </Button>
        </div>

        {sortedRecommendations.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              推荐组件 ({sortedRecommendations.length})
            </h3>

            <div className="space-y-3">
              {sortedRecommendations.map((rec) => (
                <div
                  key={rec.component}
                  className="border rounded-lg p-4 transition-all hover:shadow-md"
                  style={{
                    borderColor: getTokenValue(tokens, 'color.muted-foreground'),
                    backgroundColor: getTokenValue(tokens, 'color.card'),
                    borderLeftWidth: selectedRecommendation?.component === rec.component ? '4px' : '1px',
                    borderLeftColor: selectedRecommendation?.component === rec.component ? getTokenValue(tokens, 'color.primary') : getTokenValue(tokens, 'color.muted-foreground'),
                  }}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-lg font-semibold" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                          {rec.component}
                        </h4>
                        <Badge
                          variant={getComplexityBadgeVariant(rec.complexity)}
                          style={{
                            backgroundColor: getConfidenceColor(rec.confidence),
                            color: '#ffffff',
                          }}
                        >
                          {Math.round(rec.confidence)}% 匹配
                        </Badge>
                      </div>

                      <p className="text-sm mb-3" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                        {rec.reason}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {rec.features.slice(0, 4).map((feature) => (
                          <Badge key={feature} variant="secondary">
                            {feature}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-sm">
                        <span style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                          复杂度: <strong>{rec.complexity}</strong>
                        </span>
                        <span style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                          学习曲线: <strong>{getLearningCurveLabel(rec.learningCurve)}</strong>
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleSelectRecommendation(rec)}
                      >
                        选择
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => toggleDetails(rec.component)}
                      >
                        {showDetails[rec.component] ? '收起' : '详情'}
                      </Button>
                    </div>
                  </div>

                  {showDetails[rec.component] && (
                    <div className="mt-4 pt-4 border-t" style={{ borderColor: getTokenValue(tokens, 'color.muted-foreground') }}>
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                            适用场景
                          </h5>
                          <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                            {rec.useCases.map((useCase) => (
                              <li key={useCase}>{useCase}</li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <h5 className="font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                            最佳实践
                          </h5>
                          <ul className="list-disc list-inside space-y-1 text-sm" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                            {rec.bestPractices.map((practice) => (
                              <li key={practice}>{practice}</li>
                            ))}
                          </ul>
                        </div>

                        {rec.alternatives.length > 0 && (
                          <div>
                            <h5 className="font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                              替代方案
                            </h5>
                            <div className="flex flex-wrap gap-2">
                              {rec.alternatives.map((alt) => (
                                <Badge key={alt} variant="secondary">
                                  {alt}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {sortedRecommendations.length === 0 && recommendations.length === 0 && (
          <div className="text-center py-8" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
            <p>点击「生成推荐」按钮开始获取AI组件建议</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

AIComponentRecommender.displayName = 'AIComponentRecommender';

export default AIComponentRecommender;
