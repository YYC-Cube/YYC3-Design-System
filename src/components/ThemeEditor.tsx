/**
 * @file 主题编辑器组件
 * @description 可视化主题编辑器，支持实时预览和自定义主题创建
 * @component ThemeEditor
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import React, { useState, useCallback, useEffect, useMemo, ChangeEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Input } from './Input';
import { Button } from './Button';
import { Grid } from './Grid';
import { themePresets, type ThemePreset, createCustomPreset, mergePresetTokens } from '../theme/ThemePresets';
import { useTheme } from '../theme/useTheme';
import type { DesignTokens } from '../../types/tokens';

export interface ThemeEditorProps {
  onSave?: (theme: ThemePreset) => void;
  onExport?: (theme: ThemePreset) => void;
  onImport?: (themeData: string) => void;
  initialPresetId?: string;
  showPreview?: boolean;
}

interface TokenGroup {
  category: string;
  tokens: Array<{
    key: keyof DesignTokens;
    label: string;
    type: 'color' | 'text' | 'select';
    options?: string[];
  }>;
}

const tokenGroups: TokenGroup[] = [
  {
    category: '主色调',
    tokens: [
      { key: 'color.background', label: '背景色', type: 'color' },
      { key: 'color.foreground', label: '前景色', type: 'color' },
      { key: 'color.primary', label: '主色', type: 'color' },
      { key: 'color.primary-light', label: '主色浅', type: 'color' },
      { key: 'color.primary-dark', label: '主色深', type: 'color' },
      { key: 'color.secondary', label: '次色', type: 'color' },
      { key: 'color.success', label: '成功色', type: 'color' },
      { key: 'color.warning', label: '警告色', type: 'color' },
      { key: 'color.error', label: '错误色', type: 'color' },
      { key: 'color.border', label: '边框色', type: 'color' },
      { key: 'color.muted', label: '静默色', type: 'color' },
      { key: 'color.muted-foreground', label: '静默前景色', type: 'color' },
    ],
  },
  {
    category: '圆角',
    tokens: [
      { key: 'radius.sm', label: '小圆角', type: 'text' },
      { key: 'radius.md', label: '中圆角', type: 'text' },
      { key: 'radius.lg', label: '大圆角', type: 'text' },
    ],
  },
  {
    category: '阴影',
    tokens: [
      { key: 'shadow.sm', label: '小阴影', type: 'text' },
      { key: 'shadow.md', label: '中阴影', type: 'text' },
      { key: 'shadow.lg', label: '大阴影', type: 'text' },
    ],
  },
  {
    category: '字体大小',
    tokens: [
      { key: 'font-size.small', label: '小字体', type: 'text' },
      { key: 'font-size.body', label: '正文字体', type: 'text' },
      { key: 'font-size.large', label: '大字体', type: 'text' },
      { key: 'font-size.h1', label: 'H1字体', type: 'text' },
      { key: 'font-size.h2', label: 'H2字体', type: 'text' },
      { key: 'font-size.h3', label: 'H3字体', type: 'text' },
    ],
  },
  {
    category: '字体族',
    tokens: [
      { key: 'typography.font-sans', label: '无衬线字体', type: 'text' },
      { key: 'typography.font-serif', label: '衬线字体', type: 'text' },
      { key: 'typography.font-mono', label: '等宽字体', type: 'text' },
    ],
  },
];

const getTokenValue = (tokens: Partial<DesignTokens>, key: keyof DesignTokens): string => {
  const value = tokens[key];
  return typeof value === 'string' ? value : String(value || '');
};

export const ThemeEditor: React.FC<ThemeEditorProps> = ({
  onSave,
  onExport,
  onImport,
  initialPresetId = 'light',
  showPreview = true,
}) => {
  const { tokens: themeTokens, setTokens: setTheme } = useTheme();
  const [selectedPreset, setSelectedPreset] = useState<ThemePreset | null>(null);
  const [customTokens, setCustomTokens] = useState<Partial<DesignTokens>>({});
  const [themeName, setThemeName] = useState('');
  const [themeDescription, setThemeDescription] = useState('');
  const [activeCategory, setActiveCategory] = useState(tokenGroups[0].category);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  useEffect(() => {
    const preset = themePresets.find(p => p.id === initialPresetId);
    if (preset) {
      setSelectedPreset(preset);
      setCustomTokens({});
      setThemeName(`${preset.name} (自定义)`);
      setThemeDescription(`${preset.description} - 自定义版本`);
    }
  }, [initialPresetId]);

  const handlePresetChange = useCallback((e: ChangeEvent<HTMLSelectElement>) => {
    const presetId = e.target.value;
    const preset = themePresets.find(p => p.id === presetId);
    if (preset) {
      setSelectedPreset(preset);
      setCustomTokens({});
      setThemeName(`${preset.name} (自定义)`);
      setThemeDescription(`${preset.description} - 自定义版本`);
    }
  }, []);

  const handleTokenChange = useCallback((key: keyof DesignTokens, value: string) => {
    setCustomTokens(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const currentTokens = useMemo(() => {
    if (!selectedPreset) return {};
    return mergePresetTokens(selectedPreset, customTokens);
  }, [selectedPreset, customTokens]);

  const handleApplyTheme = useCallback(() => {
    if (themeName && selectedPreset) {
      const customPreset = createCustomPreset(
        `custom-${Date.now()}`,
        themeName,
        themeDescription,
        selectedPreset
      );
      customPreset.tokens = mergePresetTokens(selectedPreset, customTokens);
      setTheme(customPreset.tokens as DesignTokens);
      onSave?.(customPreset);
    }
  }, [themeName, themeDescription, selectedPreset, customTokens, setTheme, onSave]);

  const handleExport = useCallback(() => {
    if (selectedPreset) {
      const exportPreset = createCustomPreset(
        `custom-${Date.now()}`,
        themeName,
        themeDescription,
        selectedPreset
      );
      exportPreset.tokens = mergePresetTokens(selectedPreset, customTokens);
      const exportData = JSON.stringify(exportPreset, null, 2);
      onExport?.(exportPreset);
      
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${themeName.replace(/\s+/g, '-').toLowerCase()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [selectedPreset, themeName, themeDescription, customTokens, onExport]);

  const handleImport = useCallback(() => {
    try {
      const parsed = JSON.parse(importData);
      if (parsed.tokens && parsed.name) {
        const importedPreset: ThemePreset = {
          id: `imported-${Date.now()}`,
          name: parsed.name,
          description: parsed.description || '导入的主题',
          tokens: parsed.tokens,
        };
        setSelectedPreset(importedPreset);
        setCustomTokens({});
        setThemeName(importedPreset.name);
        setThemeDescription(importedPreset.description);
        setTheme(importedPreset.tokens as DesignTokens);
        onImport?.(importData);
        setShowImportModal(false);
        setImportData('');
      }
    } catch (error) {
      console.error('导入主题失败:', error);
      alert('导入主题失败，请检查JSON格式');
    }
  }, [importData, onImport, setTheme]);

  const activeGroup = tokenGroups.find(g => g.category === activeCategory);

  return (
    <div className="theme-editor">
      <Grid cols={showPreview ? 2 : 1} gap={6}>
        <Card>
          <CardHeader>
            <CardTitle>主题编辑器</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">基础主题</label>
                <select
                  className="w-full p-2 border rounded"
                  value={selectedPreset?.id || ''}
                  onChange={handlePresetChange}
                >
                  {themePresets.map(preset => (
                    <option key={preset.id} value={preset.id}>
                      {preset.name} - {preset.description}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">主题名称</label>
                <Input
                  value={themeName}
                  onChange={(value) => setThemeName(value)}
                  placeholder="输入主题名称"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">主题描述</label>
                <Input
                  value={themeDescription}
                  onChange={(value) => setThemeDescription(value)}
                  placeholder="输入主题描述"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">令牌类别</label>
              <div className="flex flex-wrap gap-2">
                {tokenGroups.map(group => (
                  <button
                    key={group.category}
                    className={`px-4 py-2 rounded transition-colors ${
                      activeCategory === group.category
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                    onClick={() => setActiveCategory(group.category)}
                  >
                    {group.category}
                  </button>
                ))}
              </div>
            </div>

            {activeGroup && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{activeGroup.category}</h3>
                {activeGroup.tokens.map(token => (
                  <div key={token.key} className="space-y-1">
                    <label className="block text-sm font-medium">
                      {token.label}
                    </label>
                    {token.type === 'color' ? (
                      <div className="flex gap-2">
                        <input
                          type="color"
                          value={getTokenValue(currentTokens, token.key)}
                          onChange={(e) => handleTokenChange(token.key, e.target.value)}
                          className="w-12 h-10 rounded cursor-pointer"
                        />
                        <Input
                          value={getTokenValue(currentTokens, token.key)}
                          onChange={(value) => handleTokenChange(token.key, value)}
                          placeholder="输入颜色值"
                          className="flex-1"
                        />
                      </div>
                    ) : (
                      <Input
                        value={getTokenValue(currentTokens, token.key)}
                        onChange={(value) => handleTokenChange(token.key, value)}
                        placeholder={`输入${token.label}`}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}

            <div className="flex gap-2">
              <Button onClick={handleApplyTheme} className="flex-1">
                应用主题
              </Button>
              <Button onClick={handleExport} variant="outline" className="flex-1">
                导出主题
              </Button>
              <Button
                onClick={() => setShowImportModal(true)}
                variant="outline"
                className="flex-1"
              >
                导入主题
              </Button>
            </div>
          </CardContent>
        </Card>

        {showPreview && (
          <Card>
            <CardHeader>
              <CardTitle>主题预览</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                style={{
                  backgroundColor: getTokenValue(currentTokens, 'color.background'),
                  color: getTokenValue(currentTokens, 'color.foreground'),
                  padding: '16px',
                  borderRadius: getTokenValue(currentTokens, 'radius.md'),
                  border: `1px solid ${getTokenValue(currentTokens, 'color.border')}`,
                }}
              >
                <h2 style={{ fontSize: getTokenValue(currentTokens, 'font-size.h1'), marginBottom: '16px' }}>
                  {themeName || '主题预览'}
                </h2>
                <p style={{ fontSize: getTokenValue(currentTokens, 'font-size.body'), marginBottom: '16px' }}>
                  {themeDescription || '这是主题预览区域'}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <div
                    style={{
                      backgroundColor: getTokenValue(currentTokens, 'color.primary'),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: getTokenValue(currentTokens, 'radius.md'),
                      boxShadow: getTokenValue(currentTokens, 'shadow.md'),
                      cursor: 'pointer',
                    }}
                  >
                    主色按钮
                  </div>
                  <div
                    style={{
                      backgroundColor: 'transparent',
                      color: getTokenValue(currentTokens, 'color.primary'),
                      border: `1px solid ${getTokenValue(currentTokens, 'color.primary')}`,
                      padding: '8px 16px',
                      borderRadius: getTokenValue(currentTokens, 'radius.md'),
                      cursor: 'pointer',
                    }}
                  >
                    边框按钮
                  </div>
                  <div
                    style={{
                      backgroundColor: getTokenValue(currentTokens, 'color.success'),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: getTokenValue(currentTokens, 'radius.md'),
                    }}
                  >
                    成功
                  </div>
                  <div
                    style={{
                      backgroundColor: getTokenValue(currentTokens, 'color.warning'),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: getTokenValue(currentTokens, 'radius.md'),
                    }}
                  >
                    警告
                  </div>
                  <div
                    style={{
                      backgroundColor: getTokenValue(currentTokens, 'color.error'),
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: getTokenValue(currentTokens, 'radius.md'),
                    }}
                  >
                    错误
                  </div>
                </div>
              </div>

              <div
                style={{
                  backgroundColor: getTokenValue(currentTokens, 'color.muted'),
                  color: getTokenValue(currentTokens, 'color.muted-foreground'),
                  padding: '16px',
                  borderRadius: getTokenValue(currentTokens, 'radius.md'),
                }}
              >
                <h3 style={{ fontSize: getTokenValue(currentTokens, 'font-size.h2'), marginBottom: '12px' }}>
                  静默区域
                </h3>
                <p style={{ fontSize: getTokenValue(currentTokens, 'font-size.body') }}>
                  这是使用静默色的区域示例
                </p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[
                  getTokenValue(currentTokens, 'color.primary'),
                  getTokenValue(currentTokens, 'color.secondary'),
                  getTokenValue(currentTokens, 'color.success'),
                  getTokenValue(currentTokens, 'color.warning'),
                  getTokenValue(currentTokens, 'color.error'),
                  getTokenValue(currentTokens, 'color.muted'),
                ].map((color, index) => (
                  <div
                    key={index}
                    style={{
                      backgroundColor: color,
                      height: '60px',
                      borderRadius: getTokenValue(currentTokens, 'radius.sm'),
                      boxShadow: getTokenValue(currentTokens, 'shadow.sm'),
                    }}
                  />
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </Grid>

      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>导入主题</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  主题JSON数据
                </label>
                <textarea
                  value={importData}
                  onChange={(e) => setImportData(e.target.value)}
                  placeholder='{"name": "My Theme", "description": "...", "tokens": {...}}'
                  className="w-full p-2 border rounded h-48"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleImport} className="flex-1">
                  导入
                </Button>
                <Button
                  onClick={() => {
                    setShowImportModal(false);
                    setImportData('');
                  }}
                  variant="outline"
                  className="flex-1"
                >
                  取消
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

ThemeEditor.displayName = 'ThemeEditor';

export default ThemeEditor;
