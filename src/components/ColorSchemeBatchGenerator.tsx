import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import { colorSchemeBatchGenerator, ColorScheme, BatchGenerationOptions } from '../ai/color-scheme-batch-generator';

export interface ColorSchemeBatchGeneratorProps {
  className?: string;
  onSchemeSelected?: (scheme: ColorScheme) => void;
}

export const ColorSchemeBatchGenerator: React.FC<ColorSchemeBatchGeneratorProps> = ({
  className = '',
  onSchemeSelected,
}) => {
  const { tokens } = useTheme();
  const [generating, setGenerating] = useState(false);
  const [schemes, setSchemes] = useState<ColorScheme[]>([]);
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme | null>(null);
  const [options, setOptions] = useState<BatchGenerationOptions>({
    baseColor: '#3b82f6',
    harmonyTypes: ['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic'],
    scaleSteps: 10,
    includeShades: true,
    includeTints: true,
    optimizeForAccessibility: true,
    targetContrast: 'AA',
    numberOfSchemes: 10,
    moodFilter: [],
  });

  const getTokenValue = (key: string): string => {
    const value = tokens[key];
    return typeof value === 'string' ? value : '#000000';
  };

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    try {
      const newSchemes = colorSchemeBatchGenerator.generateSchemes(options);
      setSchemes(newSchemes);
      setSelectedScheme(newSchemes[0] || null);
    } finally {
      setGenerating(false);
    }
  }, [options]);

  useEffect(() => {
    handleGenerate();
  }, []);

  const handleSchemeClick = useCallback((scheme: ColorScheme) => {
    setSelectedScheme(scheme);
    if (onSchemeSelected) {
      onSchemeSelected(scheme);
    }
  }, [onSchemeSelected]);

  const renderSchemeCard = (scheme: ColorScheme) => (
    <div
      key={scheme.id}
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        selectedScheme?.id === scheme.id ? 'ring-2' : ''
      }`}
      style={{
        background: getTokenValue('color.card'),
        border: `2px solid ${
          selectedScheme?.id === scheme.id
            ? getTokenValue('color.primary')
            : getTokenValue('color.border')
        }`,
      }}
      onClick={() => handleSchemeClick(scheme)}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <Badge
            style={{
              background: getTokenValue('color.primary'),
              color: '#ffffff',
            }}
          >
            {scheme.harmony}
          </Badge>
          <Badge
            style={{
              background: getTokenValue('color.muted'),
              color: getTokenValue('color.foreground'),
            }}
          >
            {scheme.mood}
          </Badge>
        </div>
        {scheme.accessibility.aa && (
          <Badge
            style={{
              background: '#16a34a',
              color: '#ffffff',
            }}
          >
            AA
          </Badge>
        )}
      </div>

      <div className="flex gap-2 mb-3">
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: scheme.primary }}
          title="主色"
        />
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: scheme.secondary }}
          title="次要色"
        />
        <div
          className="w-8 h-8 rounded"
          style={{ backgroundColor: scheme.accent }}
          title="强调色"
        />
      </div>

      <div className="space-y-1">
        <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
          {scheme.primary}
        </div>
        <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
          对比度: {scheme.accessibility.contrastRatio.toFixed(2)}:1
        </div>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 配色方案批量生成器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              基础颜色
            </label>
            <div className="flex gap-2">
              <input
                type="color"
                value={options.baseColor}
                onChange={(e) => setOptions(prev => ({ ...prev, baseColor: e.target.value }))}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.baseColor}
                onChange={(e) => setOptions(prev => ({ ...prev, baseColor: e.target.value }))}
                className="flex-1 p-2 rounded-lg border font-mono"
                style={{
                  borderColor: getTokenValue('color.border'),
                  backgroundColor: getTokenValue('color.card'),
                  color: getTokenValue('color.foreground'),
                }}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              生成数量
            </label>
            <input
              type="number"
              min={1}
              max={50}
              value={options.numberOfSchemes}
              onChange={(e) => setOptions(prev => ({ ...prev, numberOfSchemes: parseInt(e.target.value) || 10 }))}
              className="w-full p-2 rounded-lg border"
              style={{
                borderColor: getTokenValue('color.border'),
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              颜色比例尺步数
            </label>
            <input
              type="number"
              min={3}
              max={20}
              value={options.scaleSteps}
              onChange={(e) => setOptions(prev => ({ ...prev, scaleSteps: parseInt(e.target.value) || 10 }))}
              className="w-full p-2 rounded-lg border"
              style={{
                borderColor: getTokenValue('color.border'),
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              可访问性标准
            </label>
            <select
              value={options.targetContrast}
              onChange={(e) => setOptions(prev => ({ ...prev, targetContrast: e.target.value as 'AA' | 'AAA' }))}
              className="w-full p-2 rounded-lg border"
              style={{
                borderColor: getTokenValue('color.border'),
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            >
              <option value="AA">WCAG AA (4.5:1)</option>
              <option value="AAA">WCAG AAA (7:1)</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
            和谐类型
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              'monochromatic',
              'analogous',
              'complementary',
              'triadic',
              'tetradic',
              'split-complementary',
              'double-complementary',
            ].map((type) => (
              <label key={type} className="flex items-center gap-1 cursor-pointer">
                <input
                  type="checkbox"
                  checked={(options.harmonyTypes || []).includes(type)}
                  onChange={(e) => {
                    const current = options.harmonyTypes || [];
                    const newTypes = e.target.checked
                      ? [...current, type]
                      : current.filter(t => t !== type);
                    setOptions(prev => ({ ...prev, harmonyTypes: newTypes }));
                  }}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                  {type}
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-4 flex-wrap">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeShades}
              onChange={(e) => setOptions(prev => ({ ...prev, includeShades: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
              包含深色
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.includeTints}
              onChange={(e) => setOptions(prev => ({ ...prev, includeTints: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
              包含浅色
            </span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={options.optimizeForAccessibility}
              onChange={(e) => setOptions(prev => ({ ...prev, optimizeForAccessibility: e.target.checked }))}
              className="w-4 h-4"
            />
            <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
              优化可访问性
            </span>
          </label>
        </div>

        <Button onClick={handleGenerate} disabled={generating} className="w-full">
          {generating ? '生成中...' : '生成配色方案'}
        </Button>

        {schemes.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-sm font-medium" style={{ color: getTokenValue('color.foreground') }}>
              生成的配色方案 ({schemes.length})
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {schemes.map(renderSchemeCard)}
            </div>

            {selectedScheme && (
              <div className="space-y-4 p-4 rounded-lg" style={{
                background: getTokenValue('color.card'),
                border: `2px solid ${getTokenValue('color.border')}`,
              }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: getTokenValue('color.foreground') }}>
                  选中的配色方案详情
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.primary,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.primary}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      主色
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.secondary,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.secondary}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      次要色
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.accent,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.accent}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      强调色
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-medium mb-3" style={{ color: getTokenValue('color.muted-foreground') }}>
                  中性色
                </h4>
                <div className="grid grid-cols-3 gap-4 mb-6">
                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.neutrals.light,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.neutrals.light}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      浅色
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.neutrals.medium,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.neutrals.medium}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      中色
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div
                      className="w-full h-16 rounded-lg border-2"
                      style={{
                        backgroundColor: selectedScheme.neutrals.dark,
                        borderColor: getTokenValue('color.border'),
                      }}
                    />
                    <div className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
                      {selectedScheme.neutrals.dark}
                    </div>
                    <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                      深色
                    </div>
                  </div>
                </div>

                <h4 className="text-xs font-medium mb-3" style={{ color: getTokenValue('color.muted-foreground') }}>
                  颜色比例尺
                </h4>
                <div className="flex flex-wrap gap-1 mb-6">
                  {selectedScheme.scale.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>

                <div className="flex gap-4">
                  <Button onClick={() => {
                    if (onSchemeSelected && selectedScheme) {
                      onSchemeSelected(selectedScheme);
                    }
                  }} className="flex-1">
                    使用此配色方案
                  </Button>
                  <Button
                    onClick={() => setSelectedScheme(null)}
                    variant="secondary"
                    className="flex-1"
                  >
                    取消选择
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

ColorSchemeBatchGenerator.displayName = 'ColorSchemeBatchGenerator';
