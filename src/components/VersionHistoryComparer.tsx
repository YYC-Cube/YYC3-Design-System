import * as React from 'react';
import { useState, useCallback, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import {
  versionHistoryComparer,
  TokenVersion,
  VersionComparison,
} from '../ai/version-history-comparer';
import { DesignTokens } from '../types/global';

export interface VersionHistoryComparerProps {
  className?: string;
  tokens: DesignTokens;
  onVersionRestore?: (tokens: DesignTokens) => void;
}

export const VersionHistoryComparer: React.FC<VersionHistoryComparerProps> = ({
  className = '',
  tokens,
  onVersionRestore,
}) => {
  const { tokens: themeTokens } = useTheme();
  const [versions, setVersions] = useState<TokenVersion[]>([]);
  const [selectedVersion1, setSelectedVersion1] = useState<string | null>(null);
  const [selectedVersion2, setSelectedVersion2] = useState<string | null>(null);
  const [comparison, setComparison] = useState<VersionComparison | null>(null);
  const [viewMode, setViewMode] = useState<'history' | 'comparison' | 'cross-project'>('history');
  const [newVersionName, setNewVersionName] = useState('');
  const [newVersionDescription, setNewVersionDescription] = useState('');

  const getTokenValue = (key: string): string => {
    const value = themeTokens[key];
    return typeof value === 'string' ? value : '#000000';
  };

  const loadVersions = useCallback(() => {
    const loadedVersions = versionHistoryComparer.getVersions();
    setVersions(loadedVersions);

    if (loadedVersions.length >= 2) {
      setSelectedVersion1(loadedVersions[0].id);
      setSelectedVersion2(loadedVersions[1].id);
    }
  }, []);

  const handleSaveVersion = useCallback(() => {
    if (!newVersionName.trim()) {
      return;
    }

    versionHistoryComparer.saveVersion(tokens, newVersionName, newVersionDescription);
    setNewVersionName('');
    setNewVersionDescription('');
    loadVersions();
  }, [tokens, newVersionName, newVersionDescription, loadVersions]);

  const handleCompare = useCallback(() => {
    if (!selectedVersion1 || !selectedVersion2) {
      return;
    }

    const result = versionHistoryComparer.compareVersions(selectedVersion1, selectedVersion2);
    setComparison(result);
    setViewMode('comparison');
  }, [selectedVersion1, selectedVersion2]);

  const handleRestoreVersion = useCallback(
    (version: TokenVersion) => {
      if (onVersionRestore) {
        onVersionRestore(version.tokens);
      }
    },
    [onVersionRestore]
  );

  const handleDeleteVersion = useCallback(
    (versionId: string) => {
      versionHistoryComparer.deleteVersion(versionId);
      loadVersions();
    },
    [loadVersions]
  );

  const handleExportVersions = useCallback(() => {
    const data = versionHistoryComparer.exportVersions();
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `token-versions-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportVersions = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            try {
              versionHistoryComparer.importVersions(e.target.result as string);
              loadVersions();
            } catch (error) {
              console.error('Failed to import versions:', error);
            }
          }
        };
        reader.readAsText(file);
      }
    },
    [loadVersions]
  );

  useEffect(() => {
    const loadedVersions = versionHistoryComparer.getVersions();
    setVersions(loadedVersions);

    if (loadedVersions.length >= 2) {
      setSelectedVersion1(loadedVersions[0].id);
      setSelectedVersion2(loadedVersions[1].id);
    }
  }, []);

  const renderVersionCard = (version: TokenVersion) => (
    <div
      key={version.id}
      className={`p-4 rounded-lg border-2 transition-all ${
        selectedVersion1 === version.id || selectedVersion2 === version.id ? 'ring-2' : ''
      }`}
      style={{
        background: getTokenValue('color.card'),
        borderColor:
          selectedVersion1 === version.id
            ? getTokenValue('color.primary')
            : selectedVersion2 === version.id
              ? getTokenValue('color.secondary')
              : getTokenValue('color.border'),
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="font-medium mb-1" style={{ color: getTokenValue('color.foreground') }}>
            {version.name}
          </div>
          <div className="text-xs mb-1" style={{ color: getTokenValue('color.muted-foreground') }}>
            {new Date(version.timestamp).toLocaleString()}
          </div>
          {version.description && (
            <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
              {version.description}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setSelectedVersion1(version.id)}
            className="w-6 h-6 rounded text-xs"
            style={{
              background:
                selectedVersion1 === version.id
                  ? getTokenValue('color.primary')
                  : getTokenValue('color.muted'),
              color: '#ffffff',
            }}
          >
            1
          </button>
          <button
            onClick={() => setSelectedVersion2(version.id)}
            className="w-6 h-6 rounded text-xs"
            style={{
              background:
                selectedVersion2 === version.id
                  ? getTokenValue('color.secondary')
                  : getTokenValue('color.muted'),
              color: '#ffffff',
            }}
          >
            2
          </button>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <Button
          onClick={() => handleRestoreVersion(version)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          恢复
        </Button>
        <Button
          onClick={() => handleDeleteVersion(version.id)}
          variant="outline"
          size="sm"
          className="flex-1"
        >
          删除
        </Button>
      </div>
    </div>
  );

  const renderChangeItem = (change: any, index: number) => (
    <div
      key={`${change.key}-${index}`}
      className="p-3 rounded-lg border-2"
      style={{
        background: getTokenValue('color.card'),
        borderColor:
          change.type === 'added' ? '#16a34a' : change.type === 'removed' ? '#dc2626' : '#ea580c',
      }}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex gap-2 flex-wrap">
          <Badge
            style={{
              background:
                change.type === 'added'
                  ? '#16a34a'
                  : change.type === 'removed'
                    ? '#dc2626'
                    : '#ea580c',
              color: '#ffffff',
            }}
          >
            {change.type}
          </Badge>
          <Badge
            style={{
              background: getTokenValue('color.muted'),
              color: getTokenValue('color.foreground'),
            }}
          >
            {change.category}
          </Badge>
        </div>
        <Badge
          style={{
            background:
              change.impact === 'high'
                ? '#dc2626'
                : change.impact === 'medium'
                  ? '#ea580c'
                  : '#65a30d',
            color: '#ffffff',
          }}
        >
          {change.impact}
        </Badge>
      </div>

      <div className="text-xs font-mono mb-1" style={{ color: getTokenValue('color.foreground') }}>
        {change.key}
      </div>

      {change.oldValue !== undefined && (
        <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
          旧值: {JSON.stringify(change.oldValue)}
        </div>
      )}

      {change.newValue !== undefined && (
        <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
          新值: {JSON.stringify(change.newValue)}
        </div>
      )}
    </div>
  );

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>AI 版本历史对比</CardTitle>
          <div className="flex gap-2">
            <Button
              onClick={() => setViewMode('history')}
              variant={viewMode === 'history' ? 'default' : 'outline'}
              size="sm"
            >
              历史
            </Button>
            <Button
              onClick={() => setViewMode('comparison')}
              variant={viewMode === 'comparison' ? 'default' : 'outline'}
              size="sm"
            >
              对比
            </Button>
            <Button
              onClick={() => setViewMode('cross-project')}
              variant={viewMode === 'cross-project' ? 'default' : 'outline'}
              size="sm"
            >
              跨项目
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewMode === 'history' && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: getTokenValue('color.foreground') }}
                >
                  版本名称
                </label>
                <input
                  type="text"
                  value={newVersionName}
                  onChange={(e) => setNewVersionName(e.target.value)}
                  placeholder="输入版本名称"
                  className="w-full p-2 rounded-lg border"
                  style={{
                    borderColor: getTokenValue('color.border'),
                    backgroundColor: getTokenValue('color.card'),
                    color: getTokenValue('color.foreground'),
                  }}
                />
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-2"
                  style={{ color: getTokenValue('color.foreground') }}
                >
                  版本描述
                </label>
                <input
                  type="text"
                  value={newVersionDescription}
                  onChange={(e) => setNewVersionDescription(e.target.value)}
                  placeholder="输入版本描述（可选）"
                  className="w-full p-2 rounded-lg border"
                  style={{
                    borderColor: getTokenValue('color.border'),
                    backgroundColor: getTokenValue('color.card'),
                    color: getTokenValue('color.foreground'),
                  }}
                />
              </div>
            </div>

            <Button
              onClick={handleSaveVersion}
              disabled={!newVersionName.trim()}
              className="w-full"
            >
              保存当前版本
            </Button>

            <div className="flex gap-4">
              <Button onClick={handleExportVersions} variant="secondary" className="flex-1">
                导出所有版本
              </Button>
              <label className="flex-1">
                <Button variant="secondary" className="w-full">
                  导入版本
                </Button>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportVersions}
                  className="hidden"
                />
              </label>
            </div>

            <h3
              className="text-sm font-medium"
              style={{ color: getTokenValue('color.foreground') }}
            >
              版本历史 ({versions.length})
            </h3>

            {versions.length === 0 ? (
              <div
                className="text-center p-8 rounded-lg"
                style={{
                  background: getTokenValue('color.card'),
                  border: `2px solid ${getTokenValue('color.border')}`,
                }}
              >
                <p className="text-sm" style={{ color: getTokenValue('color.muted-foreground') }}>
                  暂无保存的版本
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {versions.map(renderVersionCard)}
              </div>
            )}
          </>
        )}

        {viewMode === 'history' && selectedVersion1 && selectedVersion2 && (
          <Button onClick={handleCompare} className="w-full">
            对比选中的版本
          </Button>
        )}

        {viewMode === 'comparison' && comparison && (
          <div className="space-y-6">
            <div
              className="p-4 rounded-lg"
              style={{
                background: getTokenValue('color.card'),
                border: `2px solid ${getTokenValue('color.border')}`,
              }}
            >
              <h3
                className="text-sm font-medium mb-4"
                style={{ color: getTokenValue('color.foreground') }}
              >
                对比摘要
              </h3>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#16a34a' }}>
                    {comparison.summary.addedCount}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: getTokenValue('color.muted-foreground') }}
                  >
                    新增
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#dc2626' }}>
                    {comparison.summary.removedCount}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: getTokenValue('color.muted-foreground') }}
                  >
                    删除
                  </div>
                </div>

                <div className="text-center">
                  <div className="text-2xl font-bold mb-1" style={{ color: '#ea580c' }}>
                    {comparison.summary.modifiedCount}
                  </div>
                  <div
                    className="text-xs"
                    style={{ color: getTokenValue('color.muted-foreground') }}
                  >
                    修改
                  </div>
                </div>
              </div>

              <div className="text-center mt-4">
                <div
                  className="text-3xl font-bold mb-1"
                  style={{ color: getTokenValue('color.primary') }}
                >
                  {comparison.summary.totalChanges}
                </div>
                <div className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
                  总变更
                </div>
              </div>
            </div>

            {comparison.added.length > 0 && (
              <div className="space-y-2">
                <h4
                  className="text-sm font-medium"
                  style={{ color: getTokenValue('color.foreground') }}
                >
                  新增的令牌 ({comparison.added.length})
                </h4>
                <div className="space-y-2">
                  {comparison.added.map((change, index) => renderChangeItem(change, index))}
                </div>
              </div>
            )}

            {comparison.removed.length > 0 && (
              <div className="space-y-2">
                <h4
                  className="text-sm font-medium"
                  style={{ color: getTokenValue('color.foreground') }}
                >
                  删除的令牌 ({comparison.removed.length})
                </h4>
                <div className="space-y-2">
                  {comparison.removed.map((change, index) => renderChangeItem(change, index))}
                </div>
              </div>
            )}

            {comparison.modified.length > 0 && (
              <div className="space-y-2">
                <h4
                  className="text-sm font-medium"
                  style={{ color: getTokenValue('color.foreground') }}
                >
                  修改的令牌 ({comparison.modified.length})
                </h4>
                <div className="space-y-2">
                  {comparison.modified.map((change, index) => renderChangeItem(change, index))}
                </div>
              </div>
            )}

            <Button onClick={() => setViewMode('history')} variant="secondary" className="w-full">
              返回历史
            </Button>
          </div>
        )}

        {viewMode === 'cross-project' && (
          <div
            className="text-center p-8 rounded-lg"
            style={{
              background: getTokenValue('color.card'),
              border: `2px solid ${getTokenValue('color.border')}`,
            }}
          >
            <p className="text-sm mb-4" style={{ color: getTokenValue('color.muted-foreground') }}>
              跨项目对比功能需要配置其他项目的设计令牌
            </p>
            <p className="text-xs" style={{ color: getTokenValue('color.muted-foreground') }}>
              使用 versionHistoryComparer.compareWithProjects() 方法进行跨项目对比
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

VersionHistoryComparer.displayName = 'VersionHistoryComparer';
