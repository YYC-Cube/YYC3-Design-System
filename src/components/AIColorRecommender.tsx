/**
 * @file 配色方案推荐组件
 * @description 提供用户界面来获取配色方案推荐
 * @component AIColorRecommender
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React, { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import { colorRecommender, ColorScheme, ColorRecommendationOptions } from '../ai/color-recommender';

export interface AIColorRecommenderProps {
  onSelectScheme?: (scheme: ColorScheme) => void;
  className?: string;
}

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export const AIColorRecommender: React.FC<AIColorRecommenderProps> = ({
  onSelectScheme,
  className = '',
}) => {
  const { tokens } = useTheme();
  const [baseColor, setBaseColor] = useState('#d45a5f');
  const [purpose, setPurpose] = useState<'brand' | 'ui' | 'data' | 'marketing'>('ui');
  const [mood, setMood] = useState<'professional' | 'playful' | 'calm' | 'energetic' | 'luxury'>(
    'professional'
  );
  const [accessibility, setAccessibility] = useState<'AA' | 'AAA'>('AA');
  const [schemes, setSchemes] = useState<ColorScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme | null>(null);

  const handleGenerate = useCallback(() => {
    const options: ColorRecommendationOptions = {
      baseColor,
      purpose,
      mood,
      accessibility,
    };

    const newSchemes = colorRecommender.generateRecommendations(options);
    setSchemes(newSchemes);
    setSelectedScheme(null);
  }, [baseColor, purpose, mood, accessibility]);

  const handleSelectScheme = useCallback(
    (scheme: ColorScheme) => {
      setSelectedScheme(scheme);
      if (onSelectScheme) {
        onSelectScheme(scheme);
      }
    },
    [onSelectScheme]
  );

  const purposes = [
    { value: 'brand', label: '品牌' },
    { value: 'ui', label: 'UI 界面' },
    { value: 'data', label: '数据可视化' },
    { value: 'marketing', label: '营销活动' },
  ] as const;

  const moods = [
    { value: 'professional', label: '专业' },
    { value: 'playful', label: '活泼' },
    { value: 'calm', label: '平静' },
    { value: 'energetic', label: '活力' },
    { value: 'luxury', label: '高端' },
  ] as const;

  const accessibilityLevels = [
    { value: 'AA', label: 'AA (4.5:1)' },
    { value: 'AAA', label: 'AAA (7:1)' },
  ] as const;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 配色方案推荐</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              基础颜色
            </label>
            <div className="flex gap-2">
              <Input type="color" value={baseColor} onChange={setBaseColor} className="w-16 h-10" />
              <Input type="text" value={baseColor} onChange={setBaseColor} placeholder="#d45a5f" />
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              用途
            </label>
            <div className="flex flex-wrap gap-2">
              {purposes.map((p) => (
                <Badge
                  key={p.value}
                  variant={purpose === p.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      purpose === p.value ? getTokenValue(tokens, 'color.primary') : 'transparent',
                    color:
                      purpose === p.value ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setPurpose(p.value)}
                >
                  {p.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              情绪
            </label>
            <div className="flex flex-wrap gap-2">
              {moods.map((m) => (
                <Badge
                  key={m.value}
                  variant={mood === m.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      mood === m.value ? getTokenValue(tokens, 'color.primary') : 'transparent',
                    color: mood === m.value ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setMood(m.value)}
                >
                  {m.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              可访问性标准
            </label>
            <div className="flex flex-wrap gap-2">
              {accessibilityLevels.map((a) => (
                <Badge
                  key={a.value}
                  variant={accessibility === a.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      accessibility === a.value
                        ? getTokenValue(tokens, 'color.primary')
                        : 'transparent',
                    color:
                      accessibility === a.value
                        ? '#ffffff'
                        : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setAccessibility(a.value)}
                >
                  {a.label}
                </Badge>
              ))}
            </div>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            生成配色方案
          </Button>
        </div>

        {schemes.length > 0 && (
          <div className="space-y-3">
            <h3
              className="text-sm font-medium"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              推荐方案 ({schemes.length})
            </h3>
            <div className="space-y-3">
              {schemes.map((scheme, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg cursor-pointer transition-all ${
                    selectedScheme === scheme ? 'ring-2' : ''
                  }`}
                  style={{
                    background: getTokenValue(tokens, 'color.card'),
                    border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                    outline:
                      selectedScheme === scheme
                        ? `2px solid ${getTokenValue(tokens, 'color.primary')}`
                        : 'none',
                  }}
                  onClick={() => handleSelectScheme(scheme)}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4
                        className="text-sm font-medium"
                        style={{ color: getTokenValue(tokens, 'color.foreground') }}
                      >
                        {scheme.name}
                      </h4>
                      <p
                        className="text-xs mt-1"
                        style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}
                      >
                        {scheme.description}
                      </p>
                    </div>
                    <Badge
                      variant={scheme.accessibility === 'AAA' ? 'default' : 'outline'}
                      style={{
                        background: scheme.accessibility === 'AAA' ? '#10b981' : 'transparent',
                        color:
                          scheme.accessibility === 'AAA'
                            ? '#ffffff'
                            : getTokenValue(tokens, 'color.foreground'),
                        borderColor:
                          scheme.accessibility === 'AAA'
                            ? '#10b981'
                            : getTokenValue(tokens, 'color.border'),
                      }}
                    >
                      {scheme.accessibility}
                    </Badge>
                  </div>
                  <div className="flex gap-1">
                    {scheme.colors.map((color, colorIndex) => (
                      <div
                        key={colorIndex}
                        className="w-8 h-8 rounded"
                        style={{ background: color }}
                        title={color}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
