/**
 * @file 实时编辑器组件
 * @description 提供用户界面来实时编辑设计令牌
 * @component RealtimeEditor
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './Card';
import { Button } from './Button';
import { Input } from './Input';
import { Badge } from './Badge';
import { useTheme } from '../theme/useTheme';
import {
  createRealtimeEditor,
  EditorState,
} from '../editor/realtime-editor';
import { DesignTokens } from '../../types/tokens';

interface RealtimeEditorProps {
  initialTokens?: DesignTokens;
  onSave?: (tokens: DesignTokens) => void;
  userId?: string;
  className?: string;
}

export const RealtimeEditor: React.FC<RealtimeEditorProps> = ({
  initialTokens = {},
  onSave,
  userId,
  className = '',
}) => {
  const { tokens: themeTokens } = useTheme();
  const [editor] = useState(() => createRealtimeEditor(initialTokens, userId));
  const [state, setState] = useState<EditorState>(editor.getState());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingToken, setEditingToken] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState('');
  const [newTokenName, setNewTokenName] = useState('');
  const [newTokenValue, setNewTokenValue] = useState('');

  useEffect(() => {
    const unsubscribe = editor.subscribe(setState);
    return unsubscribe;
  }, [editor]);

  const handleUpdateToken = useCallback((tokenName: string, value: string | number) => {
    const validation = editor.validateToken(tokenName);
    const valueValidation = editor.validateValue(value);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (!valueValidation.valid) {
      alert(valueValidation.error);
      return;
    }

    editor.updateToken(tokenName, value);
  }, [editor]);

  const handleDeleteToken = useCallback((tokenName: string) => {
    if (confirm(`确定要删除令牌 ${tokenName} 吗？`)) {
      editor.deleteToken(tokenName);
    }
  }, [editor]);

  const handleAddToken = useCallback(() => {
    const validation = editor.validateToken(newTokenName);
    const valueValidation = editor.validateValue(newTokenValue);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    if (!valueValidation.valid) {
      alert(valueValidation.error);
      return;
    }

    editor.addToken(newTokenName, newTokenValue);
    setNewTokenName('');
    setNewTokenValue('');
  }, [editor, newTokenName, newTokenValue]);

  const handleUndo = useCallback(() => {
    editor.undo();
  }, [editor]);

  const handleSave = useCallback(() => {
    editor.save();
    if (onSave) {
      onSave(editor.getTokens());
    }
  }, [editor, onSave]);

  const handleDiscard = useCallback(() => {
    if (confirm('确定要放弃所有更改吗？')) {
      editor.discardChanges();
    }
  }, [editor]);

  const categories = ['all', 'color', 'spacing', 'font', 'animation', 'transition'];

  const filterTokens = () => {
    let filtered = Object.entries(state.tokens);

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(([name]) => name.includes(selectedCategory));
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(([name]) => name.toLowerCase().includes(query));
    }

    return filtered;
  };

  const filteredTokens = filterTokens();

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>实时编辑器</CardTitle>
          <div className="flex gap-2">
            {state.isDirty && (
              <Badge style={{ background: '#f59e0b', color: '#ffffff' }}>
                未保存
              </Badge>
            )}
            {state.lastSaved && (
              <Badge variant="outline" style={{ borderColor: themeTokens['color.border'] as string }}>
                已保存 {new Date(state.lastSaved).toLocaleTimeString()}
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex gap-2">
          <Button onClick={handleUndo} disabled={!editor.canUndo()}>
            撤销
          </Button>
          <Button onClick={handleSave} disabled={!state.isDirty}>
            保存
          </Button>
          <Button variant="outline" onClick={handleDiscard} disabled={!state.isDirty}>
            放弃更改
          </Button>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: themeTokens['color.foreground'] as string }}>
            搜索
          </label>
          <Input
            type="text"
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="搜索令牌..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: themeTokens['color.foreground'] as string }}>
            类别
          </label>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <Badge
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                style={{
                  cursor: 'pointer',
                  background: selectedCategory === category ? themeTokens['color.primary'] as string : 'transparent',
                  color: selectedCategory === category ? '#ffffff' : themeTokens['color.foreground'] as string,
                  borderColor: themeTokens['color.primary'] as string,
                }}
                onClick={() => setSelectedCategory(category)}
              >
                {category === 'all' ? '全部' : category}
              </Badge>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: themeTokens['color.foreground'] as string }}>
            添加新令牌
          </label>
          <div className="flex gap-2">
            <Input
              type="text"
              value={newTokenName}
              onChange={setNewTokenName}
              placeholder="令牌名称 (如: color.primary)"
              className="flex-1"
            />
            <Input
              type="text"
              value={newTokenValue}
              onChange={setNewTokenValue}
              placeholder="令牌值 (如: #d45a5f)"
              className="flex-1"
            />
            <Button onClick={handleAddToken} disabled={!newTokenName || !newTokenValue}>
              添加
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium" style={{ color: themeTokens['color.foreground'] as string }}>
            令牌 ({filteredTokens.length})
          </h3>
          <div className="space-y-2">
            {filteredTokens.map(([name, value]) => (
              <div
                key={name}
                className="p-4 rounded-lg"
                style={{
                  background: themeTokens['color.card'] as string,
                  border: `1px solid ${themeTokens['color.border'] as string}`,
                }}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <div className="text-sm font-medium" style={{ color: themeTokens['color.foreground'] as string }}>
                      {name}
                    </div>
                    {name.includes('color') && typeof value === 'string' && value.startsWith('#') && (
                      <div className="flex items-center gap-2 mt-1">
                        <div
                          className="w-4 h-4 rounded"
                          style={{ background: value }}
                        />
                        <span className="text-xs" style={{ color: themeTokens['color.muted-foreground'] as string }}>
                          {value}
                        </span>
                      </div>
                    )}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteToken(name)}
                  >
                    删除
                  </Button>
                </div>
                {editingToken === name ? (
                  <div className="flex gap-2">
                    <Input
                      type="text"
                      value={editingValue}
                      onChange={setEditingValue}
                      onBlur={() => {
                        handleUpdateToken(name, editingValue);
                        setEditingToken(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleUpdateToken(name, editingValue);
                          setEditingToken(null);
                        } else if (e.key === 'Escape') {
                          setEditingToken(null);
                        }
                      }}
                      autoFocus
                      className="flex-1"
                    />
                  </div>
                ) : (
                  <div
                    className="p-2 rounded cursor-pointer"
                    style={{
                      background: themeTokens['color.background'] as string,
                      color: themeTokens['color.foreground'] as string,
                    }}
                    onClick={() => setEditingToken(name)}
                  >
                    {String(value)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {state.changes.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-2" style={{ color: themeTokens['color.foreground'] as string }}>
              更改历史 ({state.changes.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {state.changes.slice().reverse().map((change, index) => (
                <div
                  key={index}
                  className="p-3 rounded"
                  style={{
                    background: themeTokens['color.card'] as string,
                    border: `1px solid ${themeTokens['color.border'] as string}`,
                  }}
                >
                  <div className="text-sm font-medium" style={{ color: themeTokens['color.foreground'] as string }}>
                    {change.tokenName}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span
                      className="text-xs"
                      style={{ color: themeTokens['color.muted-foreground'] as string }}
                    >
                      {change.oldValue !== undefined ? String(change.oldValue) : '(空)'}
                    </span>
                    <span style={{ color: themeTokens['color.foreground'] as string }}>→</span>
                    <span
                      className="text-xs"
                      style={{ color: themeTokens['color.muted-foreground'] as string }}
                    >
                      {change.newValue !== undefined ? String(change.newValue) : '(删除)'}
                    </span>
                  </div>
                  <div className="text-xs mt-1" style={{ color: themeTokens['color.muted-foreground'] as string }}>
                    {new Date(change.timestamp).toLocaleString()}
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
