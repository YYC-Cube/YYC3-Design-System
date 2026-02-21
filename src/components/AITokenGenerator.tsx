/**
 * @file AI Token 生成器组件
 * @description 提供用户界面来生成和管理设计令牌
 * @component AITokenGenerator
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
import { tokenGenerator } from '../ai/token-generator';
import { GeneratedTokens, GeneratedColorToken } from '../../types/tokens';

type TokenValue = string | number | Record<string, string | number>;

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = key.split('.').reduce<TokenValue | undefined>((obj: TokenValue | undefined, k: string) => {
    if (typeof obj === 'object' && obj !== null) {
      return obj[k as keyof TokenValue];
    }
    return undefined;
  }, tokens as TokenValue);
  return typeof value === 'string' ? value : '#000000';
};

export interface AITokenGeneratorProps {
  onGenerate?: (tokens: GeneratedTokens) => void;
  className?: string;
}

export const AITokenGenerator: React.FC<AITokenGeneratorProps> = ({
  onGenerate,
  className = '',
}) => {
  const { tokens } = useTheme();
  const [baseColor, setBaseColor] = useState('#d45a5f');
  const [harmony, setHarmony] = useState<'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic'>('monochromatic');
  const [scale, setScale] = useState(10);
  const [includeShades, setIncludeShades] = useState(true);
  const [includeTints, setIncludeTints] = useState(true);
  const [generatedTokens, setGeneratedTokens] = useState<GeneratedTokens | null>(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const newTokens = tokenGenerator.generateTokens({
      baseColor,
      harmony,
      scale,
      includeShades,
      includeTints,
    });

    setGeneratedTokens(newTokens);
    const recs = tokenGenerator.generateRecommendations(newTokens);
    setRecommendations(recs);

    if (onGenerate) {
      onGenerate(newTokens);
    }
  }, [baseColor, harmony, scale, includeShades, includeTints, onGenerate]);

  const harmonies = [
    { value: 'complementary', label: '互补色' },
    { value: 'analogous', label: '类似色' },
    { value: 'triadic', label: '三色' },
    { value: 'tetradic', label: '四色' },
    { value: 'monochromatic', label: '单色' },
  ] as const;

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Token 生成器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              基础颜色
            </label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={baseColor}
                onChange={(value) => setBaseColor(typeof value === 'string' ? value : value.target.value)}
                className="w-16 h-10"
              />
              <Input
                type="text"
                value={baseColor}
                onChange={(value) => setBaseColor(typeof value === 'string' ? value : value.target.value)}
                placeholder="#d45a5f"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              色彩和谐
            </label>
            <div className="flex flex-wrap gap-2">
              {harmonies.map((h) => (
                <Badge
                  key={h.value}
                  variant={harmony === h.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background: harmony === h.value ? getTokenValue(tokens, 'color.primary') : 'transparent',
                    color: harmony === h.value ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setHarmony(h.value)}
                >
                  {h.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              间距比例: {scale}
            </label>
            <input
              type="range"
              min="8"
              max="16"
              step="1"
              value={scale}
              onChange={(e) => setScale(Number(e.target.value))}
              className="w-full"
              style={{
                accentColor: getTokenValue(tokens, 'color.primary'),
              }}
            />
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeShades}
                onChange={(e) => setIncludeShades(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                包含色相
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTints}
                onChange={(e) => setIncludeTints(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                包含色调
              </span>
            </label>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            生成令牌
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              AI 推荐
            </h3>
            <div className="space-y-2">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg"
                  style={{
                    background: getTokenValue(tokens, 'color.card'),
                    border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                  }}
                >
                  <p className="text-sm" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                    💡 {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedTokens && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
              生成的令牌
            </h3>
            <div className="space-y-2">
              {Object.entries(generatedTokens.colors).slice(0, 8).map(([name, color]: [string, GeneratedColorToken]) => (
                <div
                  key={name}
                  className="flex items-center gap-3 p-2 rounded-lg"
                  style={{
                    background: getTokenValue(tokens, 'color.card'),
                    border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                  }}
                >
                  <div
                    className="w-8 h-8 rounded"
                    style={{ background: color.value.hex }}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: getTokenValue(tokens, 'color.foreground') }}>
                      {name}
                    </p>
                    <p className="text-xs" style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                      {color.value.hex}
                    </p>
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
