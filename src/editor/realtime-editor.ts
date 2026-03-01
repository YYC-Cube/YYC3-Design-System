/**
 * @file 实时编辑器
 * @description 提供实时编辑设计令牌的功能
 * @module editor/realtime-editor
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { DesignTokens, ColorToken, ShadowToken, TypographyTokens } from '../../types/tokens';

export interface TokenChange {
  tokenName: string;
  oldValue:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>
    | undefined;
  newValue:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>
    | undefined;
  timestamp: Date;
  userId?: string;
}

export interface EditorState {
  tokens: DesignTokens;
  changes: TokenChange[];
  isDirty: boolean;
  lastSaved: Date | null;
}

export class RealtimeEditor {
  private state: EditorState = {
    tokens: {},
    changes: [],
    isDirty: false,
    lastSaved: null,
  };

  private listeners: Set<(state: EditorState) => void> = new Set();
  private userId?: string;

  constructor(initialTokens: DesignTokens = {}, userId?: string) {
    this.state.tokens = { ...initialTokens };
    this.userId = userId;
  }

  subscribe(listener: (state: EditorState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  updateToken(
    tokenName: string,
    value:
      | string
      | number
      | ColorToken
      | ShadowToken
      | TypographyTokens
      | Record<string, string | number>
  ): void {
    const oldValue = this.state.tokens[tokenName];

    if (oldValue !== value) {
      const change: TokenChange = {
        tokenName,
        oldValue,
        newValue: value,
        timestamp: new Date(),
        userId: this.userId,
      };

      this.state.tokens[tokenName] = value;
      this.state.changes.push(change);
      this.state.isDirty = true;

      this.notify();
    }
  }

  updateTokens(tokens: Partial<DesignTokens>): void {
    Object.entries(tokens).forEach(([name, value]) => {
      if (typeof value === 'string' || typeof value === 'number') {
        this.updateToken(name, value);
      }
    });
  }

  deleteToken(tokenName: string): void {
    if (this.state.tokens[tokenName] !== undefined) {
      const oldValue = this.state.tokens[tokenName];

      const change: TokenChange = {
        tokenName,
        oldValue,
        newValue: undefined,
        timestamp: new Date(),
        userId: this.userId,
      };

      delete this.state.tokens[tokenName];
      this.state.changes.push(change);
      this.state.isDirty = true;

      this.notify();
    }
  }

  addToken(tokenName: string, value: string | number): void {
    if (this.state.tokens[tokenName] === undefined) {
      const change: TokenChange = {
        tokenName,
        oldValue: undefined,
        newValue: value,
        timestamp: new Date(),
        userId: this.userId,
      };

      this.state.tokens[tokenName] = value;
      this.state.changes.push(change);
      this.state.isDirty = true;

      this.notify();
    }
  }

  undo(): void {
    if (this.state.changes.length === 0) return;

    const lastChange = this.state.changes.pop();
    if (lastChange) {
      if (lastChange.oldValue === undefined) {
        delete this.state.tokens[lastChange.tokenName];
      } else {
        this.state.tokens[lastChange.tokenName] = lastChange.oldValue;
      }

      this.state.isDirty = this.state.changes.length > 0;
      this.notify();
    }
  }

  redo(redoStack: TokenChange[]): void {
    if (redoStack.length === 0) return;

    const change = redoStack.pop();
    if (change) {
      if (change.newValue === undefined) {
        delete this.state.tokens[change.tokenName];
      } else {
        this.state.tokens[change.tokenName] = change.newValue;
      }

      this.state.changes.push(change);
      this.state.isDirty = true;
      this.notify();
    }
  }

  canUndo(): boolean {
    return this.state.changes.length > 0;
  }

  reset(): void {
    this.state.changes = [];
    this.state.isDirty = false;
    this.notify();
  }

  discardChanges(): void {
    while (this.canUndo()) {
      this.undo();
    }
  }

  save(): void {
    this.state.lastSaved = new Date();
    this.state.changes = [];
    this.state.isDirty = false;
    this.notify();
  }

  getState(): EditorState {
    return { ...this.state };
  }

  getTokens(): DesignTokens {
    return { ...this.state.tokens };
  }

  getChanges(): TokenChange[] {
    return [...this.state.changes];
  }

  isDirty(): boolean {
    return this.state.isDirty;
  }

  exportChanges(): string {
    return JSON.stringify(this.state.changes, null, 2);
  }

  importChanges(changesJson: string): void {
    try {
      const changes = JSON.parse(changesJson) as TokenChange[];
      changes.forEach((change) => {
        if (change.newValue === undefined) {
          delete this.state.tokens[change.tokenName];
        } else {
          this.state.tokens[change.tokenName] = change.newValue;
        }
      });

      this.state.changes = [...changes];
      this.state.isDirty = true;
      this.notify();
    } catch (error) {
      console.error('Failed to import changes:', error);
    }
  }

  exportTokens(): string {
    return JSON.stringify(this.state.tokens, null, 2);
  }

  importTokens(tokensJson: string): void {
    try {
      const tokens = JSON.parse(tokensJson) as DesignTokens;
      this.state.tokens = tokens;
      this.state.changes = [];
      this.state.isDirty = true;
      this.notify();
    } catch (error) {
      console.error('Failed to import tokens:', error);
    }
  }

  searchTokens(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    return Object.keys(this.state.tokens).filter((name) => name.toLowerCase().includes(lowerQuery));
  }

  getTokensByCategory(category: string): DesignTokens {
    const result: DesignTokens = {};
    Object.entries(this.state.tokens).forEach(([name, value]) => {
      if (name.includes(category)) {
        result[name] = value;
      }
    });
    return result;
  }

  validateToken(tokenName: string): { valid: boolean; error?: string } {
    if (!tokenName || tokenName.trim() === '') {
      return { valid: false, error: '令牌名称不能为空' };
    }

    if (!/^[a-z][a-z0-9.-]*$/.test(tokenName)) {
      return { valid: false, error: '令牌名称必须使用 kebab-case 格式' };
    }

    return { valid: true };
  }

  validateValue(value: string | number): { valid: boolean; error?: string } {
    if (typeof value === 'string' && value.trim() === '') {
      return { valid: false, error: '令牌值不能为空' };
    }

    return { valid: true };
  }
}

export const createRealtimeEditor = (
  initialTokens?: DesignTokens,
  userId?: string
): RealtimeEditor => {
  return new RealtimeEditor(initialTokens, userId);
};
