/**
 * @file 冲突解决策略
 * @description 提供智能冲突检测和解决策略
 * @module collaboration/conflict-resolver
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { SyncConflict } from './sync';
import { ColorToken, ShadowToken, TypographyTokens } from '../../types/tokens';

export interface ConflictResolution {
  conflictId: string;
  strategy: 'local' | 'remote' | 'merge' | 'custom';
  resolvedValue?:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>;
  timestamp: Date;
  userId: string;
  userName: string;
}

export interface ConflictSuggestion {
  strategy: 'local' | 'remote' | 'merge' | 'custom';
  confidence: number;
  reason: string;
  previewValue?:
    | string
    | number
    | ColorToken
    | ShadowToken
    | TypographyTokens
    | Record<string, string | number>;
}

export interface ConflictPattern {
  type: 'value' | 'type' | 'reference' | 'dependency';
  severity: 'low' | 'medium' | 'high';
  description: string;
  autoResolvable: boolean;
}

export class ConflictResolver {
  private resolutions: Map<string, ConflictResolution> = new Map();
  private patterns: ConflictPattern[] = [];

  constructor() {
    this.initPatterns();
    this.loadFromStorage();
  }

  private initPatterns(): void {
    this.patterns = [
      {
        type: 'value',
        severity: 'low',
        description: '值冲突：同一令牌的不同值',
        autoResolvable: true,
      },
      {
        type: 'type',
        severity: 'medium',
        description: '类型冲突：令牌值类型不一致',
        autoResolvable: false,
      },
      {
        type: 'reference',
        severity: 'medium',
        description: '引用冲突：令牌引用的其他令牌不存在',
        autoResolvable: false,
      },
      {
        type: 'dependency',
        severity: 'high',
        description: '依赖冲突：令牌之间的依赖关系被破坏',
        autoResolvable: false,
      },
    ];
  }

  private loadFromStorage(): void {
    try {
      const resolutionsData = localStorage.getItem('yyc3_conflict_resolutions');
      if (resolutionsData) {
        const resolutions = JSON.parse(resolutionsData) as ConflictResolution[];
        resolutions.forEach((resolution) => {
          this.resolutions.set(resolution.conflictId, resolution);
        });
      }
    } catch (error) {
      console.error('Failed to load conflict resolutions from storage:', error);
    }
  }

  private saveToStorage(): void {
    try {
      const resolutions = Array.from(this.resolutions.values());
      localStorage.setItem('yyc3_conflict_resolutions', JSON.stringify(resolutions));
    } catch (error) {
      console.error('Failed to save conflict resolutions to storage:', error);
    }
  }

  analyzeConflict(conflict: SyncConflict): ConflictPattern {
    const { localOperation, remoteOperation } = conflict;

    if (typeof localOperation.newValue !== typeof remoteOperation.newValue) {
      return this.patterns.find((p) => p.type === 'type')!;
    }

    if (this.isReferenceConflict(conflict)) {
      return this.patterns.find((p) => p.type === 'reference')!;
    }

    if (this.isDependencyConflict(conflict)) {
      return this.patterns.find((p) => p.type === 'dependency')!;
    }

    return this.patterns.find((p) => p.type === 'value')!;
  }

  private isReferenceConflict(conflict: SyncConflict): boolean {
    const { localOperation, remoteOperation } = conflict;
    const localValue = String(localOperation.newValue || '');
    const remoteValue = String(remoteOperation.newValue || '');

    const tokenRefPattern = /\{[^}]+\}/;
    return tokenRefPattern.test(localValue) || tokenRefPattern.test(remoteValue);
  }

  private isDependencyConflict(conflict: SyncConflict): boolean {
    const tokenName = conflict.tokenName;
    return (
      tokenName.includes('primary') ||
      tokenName.includes('secondary') ||
      tokenName.includes('accent')
    );
  }

  generateSuggestions(conflict: SyncConflict): ConflictSuggestion[] {
    const suggestions: ConflictSuggestion[] = [];
    const pattern = this.analyzeConflict(conflict);

    if (pattern.autoResolvable) {
      const mergeSuggestion = this.generateMergeSuggestion(conflict);
      if (mergeSuggestion) {
        suggestions.push(mergeSuggestion);
      }
    }

    suggestions.push({
      strategy: 'local',
      confidence: this.calculateLocalConfidence(conflict),
      reason: '保留本地更改',
      previewValue: conflict.localOperation.newValue,
    });

    suggestions.push({
      strategy: 'remote',
      confidence: this.calculateRemoteConfidence(conflict),
      reason: '接受远程更改',
      previewValue: conflict.remoteOperation.newValue,
    });

    suggestions.sort((a, b) => b.confidence - a.confidence);

    return suggestions;
  }

  private generateMergeSuggestion(conflict: SyncConflict): ConflictSuggestion | null {
    const { localOperation, remoteOperation } = conflict;
    const localValue = localOperation.newValue;
    const remoteValue = remoteOperation.newValue;

    if (localValue === undefined || remoteValue === undefined) {
      return null;
    }

    const mergedValue = this.mergeValues(localValue, remoteValue);

    if (mergedValue === undefined) return null;

    return {
      strategy: 'merge',
      confidence: 0.85,
      reason: '智能合并：结合本地和远程更改',
      previewValue: mergedValue,
    };
  }

  private isRecord(value: unknown): value is Record<string, string | number> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
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
    if (local === undefined) return remote;
    if (remote === undefined) return local;
    if (local === remote) return local;

    if (typeof local === 'string' && typeof remote === 'string') {
      return this.mergeStrings(local, remote);
    }

    if (typeof local === 'number' && typeof remote === 'number') {
      return this.mergeNumbers(local, remote);
    }

    if (this.isRecord(local) && this.isRecord(remote)) {
      return { ...local, ...remote };
    }

    return remote ?? local;
  }

  private mergeStrings(local: string, remote: string): string {
    if (local.length === remote.length) {
      return local;
    }

    return local.length > remote.length ? local : remote;
  }

  private mergeNumbers(local: number, remote: number): number {
    return Math.round((local + remote) / 2);
  }

  private calculateLocalConfidence(conflict: SyncConflict): number {
    const { localOperation, remoteOperation } = conflict;

    const timeDiff = localOperation.timestamp.getTime() - remoteOperation.timestamp.getTime();
    if (timeDiff > 0) {
      return 0.7 + Math.min(0.2, timeDiff / 60000);
    }

    return 0.6;
  }

  private calculateRemoteConfidence(conflict: SyncConflict): number {
    const { localOperation, remoteOperation } = conflict;

    const timeDiff = remoteOperation.timestamp.getTime() - localOperation.timestamp.getTime();
    if (timeDiff > 0) {
      return 0.7 + Math.min(0.2, timeDiff / 60000);
    }

    return 0.6;
  }

  resolve(
    conflict: SyncConflict,
    strategy: 'local' | 'remote' | 'merge' | 'custom',
    userId: string,
    userName: string,
    customValue?:
      | string
      | number
      | ColorToken
      | ShadowToken
      | TypographyTokens
      | Record<string, string | number>
  ): ConflictResolution {
    const resolution: ConflictResolution = {
      conflictId: conflict.id,
      strategy,
      timestamp: new Date(),
      userId,
      userName,
    };

    switch (strategy) {
      case 'local':
        resolution.resolvedValue = conflict.localOperation.newValue;
        break;
      case 'remote':
        resolution.resolvedValue = conflict.remoteOperation.newValue;
        break;
      case 'merge': {
        const mergedValue = this.mergeValues(
          conflict.localOperation.newValue,
          conflict.remoteOperation.newValue
        );
        if (mergedValue !== undefined) {
          resolution.resolvedValue = mergedValue;
        }
        break;
      }
      case 'custom':
        resolution.resolvedValue = customValue;
        break;
    }

    this.resolutions.set(conflict.id, resolution);
    this.saveToStorage();

    return resolution;
  }

  getResolution(conflictId: string): ConflictResolution | undefined {
    return this.resolutions.get(conflictId);
  }

  getAllResolutions(): ConflictResolution[] {
    return Array.from(this.resolutions.values());
  }

  getResolutionsByUser(userId: string): ConflictResolution[] {
    return this.getAllResolutions().filter((r) => r.userId === userId);
  }

  getResolutionStats() {
    const resolutions = this.getAllResolutions();
    return {
      total: resolutions.length,
      byStrategy: {
        local: resolutions.filter((r) => r.strategy === 'local').length,
        remote: resolutions.filter((r) => r.strategy === 'remote').length,
        merge: resolutions.filter((r) => r.strategy === 'merge').length,
        custom: resolutions.filter((r) => r.strategy === 'custom').length,
      },
      byUser: this.getResolutionByUserStats(),
    };
  }

  private getResolutionByUserStats(): Record<string, number> {
    const stats: Record<string, number> = {};
    this.getAllResolutions().forEach((resolution) => {
      const key = resolution.userName;
      stats[key] = (stats[key] || 0) + 1;
    });
    return stats;
  }

  exportResolutions(): string {
    return JSON.stringify(this.getAllResolutions(), null, 2);
  }

  importResolutions(resolutionsJson: string): void {
    try {
      const resolutions = JSON.parse(resolutionsJson) as ConflictResolution[];
      this.resolutions.clear();
      resolutions.forEach((resolution) => {
        this.resolutions.set(resolution.conflictId, resolution);
      });
      this.saveToStorage();
    } catch (error) {
      console.error('Failed to import conflict resolutions:', error);
      throw new Error('Invalid conflict resolutions data');
    }
  }

  clearResolutions(): void {
    this.resolutions.clear();
    this.saveToStorage();
  }

  getPatterns(): ConflictPattern[] {
    return [...this.patterns];
  }

  addPattern(pattern: ConflictPattern): void {
    this.patterns.push(pattern);
  }

  removePattern(type: ConflictPattern['type']): void {
    this.patterns = this.patterns.filter((p) => p.type !== type);
  }
}

export const createConflictResolver = (): ConflictResolver => {
  return new ConflictResolver();
};

export const conflictResolver = createConflictResolver();
