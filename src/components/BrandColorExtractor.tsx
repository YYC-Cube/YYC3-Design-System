import * as React from 'react';
import { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { useTheme } from '../theme/useTheme';
import { brandColorExtractor, BrandColorPalette, ExtractionOptions } from '../ai/brand-color-extractor';

export interface BrandColorExtractorProps {
  className?: string;
  onPaletteGenerated?: (palette: BrandColorPalette) => void;
}

export const BrandColorExtractor: React.FC<BrandColorExtractorProps> = ({
  className = '',
  onPaletteGenerated,
}) => {
  const { tokens } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const urlInputRef = useRef<HTMLInputElement>(null);
  const [extracting, setExtracting] = useState(false);
  const [palette, setPalette] = useState<BrandColorPalette | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [options, setOptions] = useState<ExtractionOptions>({
    colorCount: 10,
    minimumSaturation: 0.1,
    minimumBrightness: 0.1,
    maximumBrightness: 0.95,
    excludeWhite: true,
    excludeBlack: true,
    smartSelection: true,
  });

  const getTokenValue = (key: string): string => {
    const value = tokens[key];
    return typeof value === 'string' ? value : '#000000';
  };

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        setError('请选择图片文件');
        return;
      }

      setError(null);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleUrlInput = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const url = event.target.value;
    if (url) {
      try {
        new URL(url);
        setError(null);
        setImagePreview(url);
      } catch {
        setError('请输入有效的图片 URL');
      }
    }
  }, []);

  const handleExtract = useCallback(async () => {
    if (!imagePreview) {
      setError('请先选择或输入图片');
      return;
    }

    setExtracting(true);
    setError(null);

    try {
      const extractedPalette = await brandColorExtractor.extractFromImage(imagePreview, options);
      setPalette(extractedPalette);

      if (onPaletteGenerated) {
        onPaletteGenerated(extractedPalette);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : '提取失败，请重试');
      setPalette(null);
    } finally {
      setExtracting(false);
    }
  }, [imagePreview, options, onPaletteGenerated]);

  const handleUsePalette = useCallback(() => {
    if (palette && onPaletteGenerated) {
      onPaletteGenerated(palette);
    }
  }, [palette, onPaletteGenerated]);

  const handleClear = useCallback(() => {
    setImagePreview(null);
    setPalette(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (urlInputRef.current) {
      urlInputRef.current.value = '';
    }
  }, []);

  const renderColorSwatch = (color: string, label: string) => (
    <div className="space-y-1">
      <div
        className="w-full h-16 rounded-lg border-2"
        style={{
          backgroundColor: color,
          borderColor: getTokenValue('color.border'),
        }}
      />
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono" style={{ color: getTokenValue('color.foreground') }}>
          {color}
        </span>
        <span className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
          {label}
        </span>
      </div>
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>AI 品牌色提取器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              上传图片
            </label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              className="w-full p-2 rounded-lg border"
              style={{
                borderColor: getTokenValue('color.border'),
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            />
          </div>

          <div className="text-center" style={{ color: getTokenValue('color.muted-foreground') }}>
            或
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
              输入图片 URL
            </label>
            <input
              ref={urlInputRef}
              type="url"
              placeholder="https://example.com/image.jpg"
              onChange={handleUrlInput}
              className="w-full p-2 rounded-lg border"
              style={{
                borderColor: getTokenValue('color.border'),
                backgroundColor: getTokenValue('color.card'),
                color: getTokenValue('color.foreground'),
              }}
            />
          </div>
        </div>

        {imagePreview && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
                图片预览
              </label>
              <div className="rounded-lg overflow-hidden border-2" style={{ borderColor: getTokenValue('color.border') }}>
                <img src={imagePreview} alt="Preview" className="w-full h-auto" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: getTokenValue('color.foreground') }}>
                  提取颜色数量
                </label>
                <input
                  type="number"
                  min={3}
                  max={20}
                  value={options.colorCount}
                  onChange={(e) => setOptions(prev => ({ ...prev, colorCount: parseInt(e.target.value) || 10 }))}
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
                  最小饱和度
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={options.minimumSaturation}
                  onChange={(e) => setOptions(prev => ({ ...prev, minimumSaturation: parseFloat(e.target.value) || 0.1 }))}
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
                  最小亮度
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={options.minimumBrightness}
                  onChange={(e) => setOptions(prev => ({ ...prev, minimumBrightness: parseFloat(e.target.value) || 0.1 }))}
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
                  最大亮度
                </label>
                <input
                  type="number"
                  min={0}
                  max={1}
                  step={0.05}
                  value={options.maximumBrightness}
                  onChange={(e) => setOptions(prev => ({ ...prev, maximumBrightness: parseFloat(e.target.value) || 0.95 }))}
                  className="w-full p-2 rounded-lg border"
                  style={{
                    borderColor: getTokenValue('color.border'),
                    backgroundColor: getTokenValue('color.card'),
                    color: getTokenValue('color.foreground'),
                  }}
                />
              </div>
            </div>

            <div className="flex gap-4 flex-wrap">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeWhite}
                  onChange={(e) => setOptions(prev => ({ ...prev, excludeWhite: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                  排除白色
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.excludeBlack}
                  onChange={(e) => setOptions(prev => ({ ...prev, excludeBlack: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                  排除黑色
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.smartSelection}
                  onChange={(e) => setOptions(prev => ({ ...prev, smartSelection: e.target.checked }))}
                  className="w-4 h-4"
                />
                <span className="text-sm" style={{ color: getTokenValue('color.foreground') }}>
                  智能选择
                </span>
              </label>
            </div>

            <div className="flex gap-4">
              <Button onClick={handleExtract} disabled={extracting} className="flex-1">
                {extracting ? '提取中...' : '提取品牌色'}
              </Button>
              <Button onClick={handleClear} variant="secondary" className="flex-1">
                清除
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 rounded-lg" style={{
            background: '#fee2e2',
            border: '2px solid #dc2626',
          }}>
            <p className="text-sm" style={{ color: '#991b1b' }}>
              ⚠️ {error}
            </p>
          </div>
        )}

        {palette && (
          <div className="space-y-6">
            <div className="p-4 rounded-lg" style={{
              background: getTokenValue('color.card'),
              border: `2px solid ${getTokenValue('color.border')}`,
            }}>
              <h3 className="text-sm font-medium mb-4" style={{ color: getTokenValue('color.foreground') }}>
                提取的品牌色
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {renderColorSwatch(palette.primary, '主色')}
                {renderColorSwatch(palette.secondary, '次要色')}
                {renderColorSwatch(palette.accent, '强调色')}
              </div>

              <h4 className="text-xs font-medium mb-3" style={{ color: getTokenValue('color.muted-foreground') }}>
                中性色
              </h4>
              <div className="grid grid-cols-3 gap-4">
                {renderColorSwatch(palette.neutrals.light, '浅色')}
                {renderColorSwatch(palette.neutrals.medium, '中色')}
                {renderColorSwatch(palette.neutrals.dark, '深色')}
              </div>
            </div>

            {palette.suggestedScales.length > 0 && (
              <div className="p-4 rounded-lg" style={{
                background: getTokenValue('color.card'),
                border: `2px solid ${getTokenValue('color.border')}`,
              }}>
                <h3 className="text-sm font-medium mb-4" style={{ color: getTokenValue('color.foreground') }}>
                  建议的颜色比例尺
                </h3>
                <div className="flex flex-wrap gap-1">
                  {palette.suggestedScales.map((color, index) => (
                    <div
                      key={index}
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <Button onClick={handleUsePalette} className="flex-1">
                使用此配色方案
              </Button>
              <Button onClick={handleClear} variant="secondary" className="flex-1">
                重新提取
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

BrandColorExtractor.displayName = 'BrandColorExtractor';
