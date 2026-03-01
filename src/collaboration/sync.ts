/**
 * @file 变更同步机制
 * @description 提供实时变更同步功能，支持多用户协作和冲突检测
 * @module collaboration/sync
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { DesignTokens, ColorToken, ShadowToken, TypographyTokens } from '../../types/tokens';

export interface SyncOperation {
  id: string;
  type: 'create' | 'update' | 'delete';
  tokenName: string;
  oldValue?:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>;
  newValue?:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>;
  userId: string;
  userName: string;
  timestamp: Date;
  version: number;
}

export interface SyncState {
  tokens: DesignTokens;
  operations: SyncOperation[];
  version: number;
  lastSync: Date | null;
}

export interface SyncConflict {
  id: string;
  tokenName: string;
  localOperation: SyncOperation;
  remoteOperation: SyncOperation;
  timestamp: Date;
  resolved: boolean;
}

export type SyncStatus = 'idle' | 'syncing' | 'conflict' | 'error';

export class ChangeSyncManager {
  private state: SyncState = {
    tokens: {},
    operations: [],
    version: 0,
    lastSync: null,
  };

  private conflicts: SyncConflict[] = [];
  private status: SyncStatus = 'idle';
  private listeners: Set<(status: SyncStatus, state: SyncState) => void> = new Set();
  private conflictListeners: Set<(conflict: SyncConflict) => void> = new Set();
  private maxOperations = 1000;

  constructor(initialTokens: DesignTokens = {}) {
    this.state.tokens = { ...initialTokens };
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const stateData = localStorage.getItem('yyc3_sync_state');
      if (stateData) {
        const savedState = JSON.parse(stateData) as SyncState;
        this.state = {
          ...savedState,
          lastSync: savedState.lastSync ? new Date(savedState.lastSync) : null,
        };
      }
    } catch (error) {
      console.error('Failed to load sync state from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem('yyc3_sync_state', JSON.stringify(this.state));
    } catch (error) {
      console.error('Failed to save sync state to storage:', error);
    }
  }

  private setStatus(status: SyncStatus): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status, this.state));
  }

  private generateOperationId(): string {
    return `op_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  subscribe(listener: (status: SyncStatus, state: SyncState) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  subscribeToConflicts(listener: (conflict: SyncConflict) => void): () => void {
    this.conflictListeners.add(listener);
    return () => {
      this.conflictListeners.delete(listener);
    };
  }

  private notifyConflict(conflict: SyncConflict): void {
    this.conflictListeners.forEach((listener) => listener(conflict));
  }

  createOperation(
    type: SyncOperation['type'],
    tokenName: string,
    value: string | number,
    userId: string,
    userName: string
  ): SyncOperation {
    const operation: SyncOperation = {
      id: this.generateOperationId(),
      type,
      tokenName,
      oldValue: this.state.tokens[tokenName],
      newValue: value,
      userId,
      userName,
      timestamp: new Date(),
      version: this.state.version + 1,
    };

    this.applyOperation(operation);
    return operation;
  }

  private applyOperation(operation: SyncOperation): void {
    switch (operation.type) {
      case 'create':
      case 'update': {
        const value = operation.newValue;
        if (value !== undefined) {
          this.state.tokens[operation.tokenName] =
            typeof value === 'number' ? String(value) : value;
        }
        break;
      }
      case 'delete':
        delete this.state.tokens[operation.tokenName];
        break;
    }

    this.state.operations.push(operation);
    this.state.version = operation.version;

    if (this.state.operations.length > this.maxOperations) {
      this.state.operations = this.state.operations.slice(-this.maxOperations);
    }

    this.saveToStorage();
  }

  applyRemoteOperations(operations: SyncOperation[]): SyncConflict[] {
    const newConflicts: SyncConflict[] = [];

    operations.forEach((remoteOp) => {
      const localOp = this.state.operations.find(
        (op) => op.tokenName === remoteOp.tokenName && op.timestamp > remoteOp.timestamp
      );

      if (localOp) {
        const conflict: SyncConflict = {
          id: this.generateOperationId(),
          tokenName: remoteOp.tokenName,
          localOperation: localOp,
          remoteOperation: remoteOp,
          timestamp: new Date(),
          resolved: false,
        };

        this.conflicts.push(conflict);
        newConflicts.push(conflict);
        this.notifyConflict(conflict);
      } else {
        this.applyOperation(remoteOp);
      }
    });

    if (newConflicts.length > 0) {
      this.setStatus('conflict');
    }

    return newConflicts;
  }

  resolveConflict(conflictId: string, resolution: 'local' | 'remote' | 'merge'): void {
    const conflictIndex = this.conflicts.findIndex((c) => c.id === conflictId);
    if (conflictIndex === -1) return;

    const conflict = this.conflicts[conflictIndex];

    switch (resolution) {
      case 'local':
        this.applyOperation(conflict.localOperation);
        break;
      case 'remote':
        this.applyOperation(conflict.remoteOperation);
        break;
      case 'merge':
        this.applyMerge(conflict);
        break;
    }

    conflict.resolved = true;
    this.conflicts.splice(conflictIndex, 1);

    if (this.conflicts.length === 0) {
      this.setStatus('idle');
    }
  }

  private applyMerge(conflict: SyncConflict): void {
    const { localOperation, remoteOperation } = conflict;
    const mergedValue = this.mergeValues(localOperation.newValue, remoteOperation.newValue);

    const mergedOperation: SyncOperation = {
      id: this.generateOperationId(),
      type: 'update',
      tokenName: conflict.tokenName,
      oldValue: localOperation.oldValue,
      newValue: mergedValue,
      userId: 'system',
      userName: 'System',
      timestamp: new Date(),
      version: this.state.version + 1,
    };

    this.applyOperation(mergedOperation);
  }

  private mergeValues(
    local:
      | string
      | number
      | ColorToken
      | ShadowToken
      | TypographyTokens
      | Record<string, string | number>
      | undefined,
    remote:
      | string
      | number
      | ColorToken
      | ShadowToken
      | TypographyTokens
      | Record<string, string | number>
      | undefined
  ):
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>
    | undefined {
    if (typeof local === 'string' && typeof remote === 'string') {
      return local.length > remote.length ? local : remote;
    }

    if (typeof local === 'number' && typeof remote === 'number') {
      return (local + remote) / 2;
    }

    return remote ?? local ?? '';
  }

  getConflicts(): SyncConflict[] {
    return this.conflicts.filter((c) => !c.resolved);
  }

  getAllConflicts(): SyncConflict[] {
    return [...this.conflicts];
  }

  hasConflicts(): boolean {
    return this.conflicts.some((c) => !c.resolved);
  }

  getState(): SyncState {
    return { ...this.state };
  }

  getTokens(): DesignTokens {
    return { ...this.state.tokens };
  }

  getOperations(limit?: number): SyncOperation[] {
    if (limit) {
      return this.state.operations.slice(-limit);
    }
    return [...this.state.operations];
  }

  getOperationsByUser(userId: string): SyncOperation[] {
    return this.state.operations.filter((op) => op.userId === userId);
  }

  getStatus(): SyncStatus {
    return this.status;
  }

  sync(): Promise<void> {
    this.setStatus('syncing');

    return new Promise((resolve) => {
      setTimeout(() => {
        this.state.lastSync = new Date();
        this.saveToStorage();
        this.setStatus('idle');
        resolve();
      }, 1000);
    });
  }

  reset(): void {
    this.state = {
      tokens: {},
      operations: [],
      version: 0,
      lastSync: null,
    };
    this.conflicts = [];
    this.setStatus('idle');
    this.saveToStorage();
  }

  exportState(): string {
    return JSON.stringify(this.state, null, 2);
  }

  importState(stateJson: string): void {
    try {
      const state = JSON.parse(stateJson) as SyncState;
      this.state = {
        ...state,
        lastSync: state.lastSync ? new Date(state.lastSync) : null,
      };
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to import sync state:', error);
      throw new Error('Invalid sync state data');
    }
  }

  exportOperations(): string {
    return JSON.stringify(this.state.operations, null, 2);
  }

  exportConflicts(): string {
    return JSON.stringify(this.conflicts, null, 2);
  }

  getStats() {
    return {
      version: this.state.version,
      operationCount: this.state.operations.length,
      conflictCount: this.conflicts.filter((c) => !c.resolved).length,
      lastSync: this.state.lastSync,
      status: this.status,
      tokenCount: Object.keys(this.state.tokens).length,
    };
  }
}

export const createChangeSyncManager = (initialTokens?: DesignTokens): ChangeSyncManager => {
  return new ChangeSyncManager(initialTokens);
};

export const changeSyncManager = createChangeSyncManager();
