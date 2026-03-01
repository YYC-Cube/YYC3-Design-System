import * as React from 'react';
import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import {
  enhancedTokenGenerator,
  TokenGenerationEnhancedOptions,
  EnhancedColorToken,
} from '../ai/token-generator-enhanced';
import { GeneratedTokens } from '../../types/tokens';

const getTokenValue = (tokens: Record<string, unknown>, key: string): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : '#000000';
};

export interface AITokenGeneratorEnhancedProps {
  onGenerate?: (
    tokens: GeneratedTokens & { enhancedColors: Record<string, EnhancedColorToken> }
  ) => void;
  className?: string;
}

export const AITokenGeneratorEnhanced: React.FC<AITokenGeneratorEnhancedProps> = ({
  onGenerate,
  className = '',
}) => {
  const { tokens } = useTheme();
  const [baseColor, setBaseColor] = useState('#d45a5f');
  const [harmony, setHarmony] = useState<
    | 'complementary'
    | 'analogous'
    | 'triadic'
    | 'tetradic'
    | 'monochromatic'
    | 'split-complementary'
    | 'double-complementary'
  >('monochromatic');
  const [scale, setScale] = useState(10);
  const [includeShades, setIncludeShades] = useState(true);
  const [includeTints, setIncludeTints] = useState(true);
  const [targetContrast, setTargetContrast] = useState<'AA' | 'AAA'>('AA');
  const [optimizeForAccessibility, setOptimizeForAccessibility] = useState(true);
  const [selectedColorSpace, setSelectedColorSpace] = useState<
    'hex' | 'hsl' | 'lab' | 'rgb' | 'oklch'
  >('hex');
  const [generatedTokens, setGeneratedTokens] = useState<
    (GeneratedTokens & { enhancedColors: Record<string, EnhancedColorToken> }) | null
  >(null);
  const [recommendations, setRecommendations] = useState<string[]>([]);

  const handleGenerate = useCallback(() => {
    const options: TokenGenerationEnhancedOptions = {
      baseColor,
      harmony,
      scale,
      includeShades,
      includeTints,
      targetContrast,
      optimizeForAccessibility,
      colorSpace: selectedColorSpace,
    };

    const newTokens = enhancedTokenGenerator.generateTokens(options);
    setGeneratedTokens(newTokens);
    const recs = enhancedTokenGenerator.generateRecommendations(newTokens);
    setRecommendations(recs);

    if (onGenerate) {
      onGenerate(newTokens);
    }
  }, [
    baseColor,
    harmony,
    scale,
    includeShades,
    includeTints,
    targetContrast,
    optimizeForAccessibility,
    selectedColorSpace,
    onGenerate,
  ]);

  const harmonies = [
    { value: 'complementary', label: '互补色' },
    { value: 'analogous', label: '类似色' },
    { value: 'triadic', label: '三色' },
    { value: 'tetradic', label: '四色' },
    { value: 'monochromatic', label: '单色' },
    { value: 'split-complementary', label: '分裂互补' },
    { value: 'double-complementary', label: '双重互补' },
  ] as const;

  const colorSpaces = [
    { value: 'hex', label: 'HEX' },
    { value: 'hsl', label: 'HSL' },
    { value: 'lab', label: 'LAB' },
    { value: 'rgb', label: 'RGB' },
    { value: 'oklch', label: 'OKLCH' },
  ] as const;

  const getContrastBadgeColor = (wcagAA: boolean, wcagAAA: boolean) => {
    if (wcagAAA) return '#10b981';
    if (wcagAA) return '#3b82f6';
    return '#ef4444';
  };

  const getContrastBadgeText = (wcagAA: boolean, wcagAAA: boolean) => {
    if (wcagAAA) return 'AAA';
    if (wcagAA) return 'AA';
    return 'Fail';
  };

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI Token 生成器 (增强版)</CardTitle>
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
              色彩和谐
            </label>
            <div className="flex flex-wrap gap-2">
              {harmonies.map((h) => (
                <Badge
                  key={h.value}
                  variant={harmony === h.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      harmony === h.value ? getTokenValue(tokens, 'color.primary') : 'transparent',
                    color:
                      harmony === h.value ? '#ffffff' : getTokenValue(tokens, 'color.foreground'),
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
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              色彩空间
            </label>
            <div className="flex flex-wrap gap-2">
              {colorSpaces.map((cs) => (
                <Badge
                  key={cs.value}
                  variant={selectedColorSpace === cs.value ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      selectedColorSpace === cs.value
                        ? getTokenValue(tokens, 'color.primary')
                        : 'transparent',
                    color:
                      selectedColorSpace === cs.value
                        ? '#ffffff'
                        : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setSelectedColorSpace(cs.value)}
                >
                  {cs.label}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
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

          <div>
            <label
              className="block text-sm font-medium mb-2"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              可访问性标准
            </label>
            <div className="flex gap-2">
              {(['AA', 'AAA'] as const).map((level) => (
                <Badge
                  key={level}
                  variant={targetContrast === level ? 'default' : 'outline'}
                  style={{
                    cursor: 'pointer',
                    background:
                      targetContrast === level
                        ? getTokenValue(tokens, 'color.primary')
                        : 'transparent',
                    color:
                      targetContrast === level
                        ? '#ffffff'
                        : getTokenValue(tokens, 'color.foreground'),
                    borderColor: getTokenValue(tokens, 'color.primary'),
                  }}
                  onClick={() => setTargetContrast(level)}
                >
                  WCAG {level}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeShades}
                onChange={(e) => setIncludeShades(e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className="text-sm"
                style={{ color: getTokenValue(tokens, 'color.foreground') }}
              >
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
              <span
                className="text-sm"
                style={{ color: getTokenValue(tokens, 'color.foreground') }}
              >
                包含色调
              </span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={optimizeForAccessibility}
                onChange={(e) => setOptimizeForAccessibility(e.target.checked)}
                className="w-4 h-4"
              />
              <span
                className="text-sm"
                style={{ color: getTokenValue(tokens, 'color.foreground') }}
              >
                智能对比度优化
              </span>
            </label>
          </div>

          <Button onClick={handleGenerate} className="w-full">
            生成令牌
          </Button>
        </div>

        {recommendations.length > 0 && (
          <div className="space-y-2">
            <h3
              className="text-sm font-medium"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
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
                  <p
                    className="text-sm"
                    style={{ color: getTokenValue(tokens, 'color.foreground') }}
                  >
                    💡 {rec}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {generatedTokens && (
          <div className="space-y-2">
            <h3
              className="text-sm font-medium"
              style={{ color: getTokenValue(tokens, 'color.foreground') }}
            >
              生成的令牌 ({selectedColorSpace.toUpperCase()})
            </h3>
            <div className="space-y-2">
              {Object.entries(generatedTokens.enhancedColors)
                .slice(0, 10)
                .map(([name, color]) => (
                  <div
                    key={name}
                    className="p-3 rounded-lg"
                    style={{
                      background: getTokenValue(tokens, 'color.card'),
                      border: `1px solid ${getTokenValue(tokens, 'color.border')}`,
                    }}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-8 h-8 rounded" style={{ background: color.value.hex }} />
                      <div className="flex-1">
                        <p
                          className="text-sm font-medium"
                          style={{ color: getTokenValue(tokens, 'color.foreground') }}
                        >
                          {name}
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}
                        >
                          {color.colorSpaces[selectedColorSpace]}
                        </p>
                      </div>
                      <Badge
                        style={{
                          background: getContrastBadgeColor(color.wcagAA, color.wcagAAA),
                          color: '#ffffff',
                        }}
                      >
                        {getContrastBadgeText(color.wcagAA, color.wcagAAA)}
                      </Badge>
                    </div>
                    <div className="flex gap-4 text-xs">
                      <span style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                        对比度: {color.contrastRatio.toFixed(2)}:1
                      </span>
                      <span style={{ color: getTokenValue(tokens, 'color.muted-foreground') }}>
                        前景色: {color.value.foreground}
                      </span>
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

AITokenGeneratorEnhanced.displayName = 'AITokenGeneratorEnhanced';
