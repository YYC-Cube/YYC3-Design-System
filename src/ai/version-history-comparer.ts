import { DesignTokens } from '../types/global';

export interface TokenVersion {
  id: string;
  name: string;
  timestamp: number;
  tokens: DesignTokens;
  description?: string;
}

export interface VersionComparison {
  version1: TokenVersion;
  version2: TokenVersion;
  added: TokenChange[];
  removed: TokenChange[];
  modified: TokenChange[];
  summary: {
    totalChanges: number;
    addedCount: number;
    removedCount: number;
    modifiedCount: number;
  };
}

export interface TokenChange {
  key: string;
  type: 'added' | 'removed' | 'modified';
  oldValue?: any;
  newValue?: any;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'other';
  impact: 'high' | 'medium' | 'low';
}

export interface CrossProjectComparison {
  projectName: string;
  projectTokens: DesignTokens;
  commonTokens: string[];
  uniqueToProject: string[];
  uniqueToCurrent: string[];
  valueDifferences: TokenValueDifference[];
  consistencyScore: number;
}

export interface TokenValueDifference {
  key: string;
  currentValue: any;
  projectValue: any;
  difference: number;
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'other';
}

export class VersionHistoryComparer {
  private versions: TokenVersion[] = [];
  private maxVersions = 50;

  saveVersion(tokens: DesignTokens, name?: string, description?: string): TokenVersion {
    const version: TokenVersion = {
      id: `v${Date.now()}`,
      name: name || `Version ${this.versions.length + 1}`,
      timestamp: Date.now(),
      tokens: JSON.parse(JSON.stringify(tokens)),
      description,
    };

    this.versions.push(version);

    if (this.versions.length > this.maxVersions) {
      this.versions.shift();
    }

    this.persistVersions();

    return version;
  }

  getVersions(): TokenVersion[] {
    return [...this.versions].sort((a, b) => b.timestamp - a.timestamp);
  }

  getVersion(id: string): TokenVersion | undefined {
    return this.versions.find(v => v.id === id);
  }

  deleteVersion(id: string): void {
    this.versions = this.versions.filter(v => v.id !== id);
    this.persistVersions();
  }

  compareVersions(versionId1: string, versionId2: string): VersionComparison | null {
    const version1 = this.getVersion(versionId1);
    const version2 = this.getVersion(versionId2);

    if (!version1 || !version2) {
      return null;
    }

    const changes = this.calculateChanges(version1.tokens, version2.tokens);

    return {
      version1,
      version2,
      added: changes.added,
      removed: changes.removed,
      modified: changes.modified,
      summary: {
        totalChanges: changes.added.length + changes.removed.length + changes.modified.length,
        addedCount: changes.added.length,
        removedCount: changes.removed.length,
        modifiedCount: changes.modified.length,
      },
    };
  }

  compareWithLatest(tokens: DesignTokens): VersionComparison | null {
    const latestVersion = this.versions[this.versions.length - 1];

    if (!latestVersion) {
      return null;
    }

    const changes = this.calculateChanges(latestVersion.tokens, tokens);

    return {
      version1: latestVersion,
      version2: {
        id: 'current',
        name: 'Current',
        timestamp: Date.now(),
        tokens,
      },
      added: changes.added,
      removed: changes.removed,
      modified: changes.modified,
      summary: {
        totalChanges: changes.added.length + changes.removed.length + changes.modified.length,
        addedCount: changes.added.length,
        removedCount: changes.removed.length,
        modifiedCount: changes.modified.length,
      },
    };
  }

  compareWithProjects(
    currentTokens: DesignTokens,
    projects: { name: string; tokens: DesignTokens }[]
  ): CrossProjectComparison[] {
    return projects.map(project => {
      const commonTokens: string[] = [];
      const uniqueToProject: string[] = [];
      const uniqueToCurrent: string[] = [];
      const valueDifferences: TokenValueDifference[] = [];

      const allKeys = new Set([
        ...Object.keys(currentTokens),
        ...Object.keys(project.tokens),
      ]);

      allKeys.forEach(key => {
        const existsInCurrent = key in currentTokens;
        const existsInProject = key in project.tokens;

        if (existsInCurrent && existsInProject) {
          commonTokens.push(key);

          const currentValue = currentTokens[key];
          const projectValue = project.tokens[key];

          if (currentValue !== projectValue) {
            const difference = this.calculateValueDifference(currentValue, projectValue);
            if (difference !== null) {
              valueDifferences.push({
                key,
                currentValue,
                projectValue,
                difference,
                category: this.categorizeToken(key),
              });
            }
          }
        } else if (existsInCurrent) {
          uniqueToCurrent.push(key);
        } else {
          uniqueToProject.push(key);
        }
      });

      const consistencyScore = this.calculateConsistencyScore(
        commonTokens.length,
        uniqueToCurrent.length,
        uniqueToProject.length,
        valueDifferences.length
      );

      return {
        projectName: project.name,
        projectTokens: project.tokens,
        commonTokens,
        uniqueToProject,
        uniqueToCurrent,
        valueDifferences,
        consistencyScore,
      };
    });
  }

  private calculateChanges(tokens1: DesignTokens, tokens2: DesignTokens): {
    added: TokenChange[];
    removed: TokenChange[];
    modified: TokenChange[];
  } {
    const keys1 = new Set(Object.keys(tokens1));
    const keys2 = new Set(Object.keys(tokens2));

    const added: TokenChange[] = [];
    const removed: TokenChange[] = [];
    const modified: TokenChange[] = [];

    keys2.forEach(key => {
      if (!keys1.has(key)) {
        added.push({
          key,
          type: 'added',
          newValue: tokens2[key],
          category: this.categorizeToken(key),
          impact: this.calculateImpact(tokens2[key]),
        });
      } else if (tokens1[key] !== tokens2[key]) {
        modified.push({
          key,
          type: 'modified',
          oldValue: tokens1[key],
          newValue: tokens2[key],
          category: this.categorizeToken(key),
          impact: this.calculateImpact(tokens2[key]),
        });
      }
    });

    keys1.forEach(key => {
      if (!keys2.has(key)) {
        removed.push({
          key,
          type: 'removed',
          oldValue: tokens1[key],
          category: this.categorizeToken(key),
          impact: this.calculateImpact(tokens1[key]),
        });
      }
    });

    return { added, removed, modified };
  }

  private categorizeToken(key: string): 'color' | 'spacing' | 'typography' | 'shadow' | 'other' {
    if (key.startsWith('color.')) return 'color';
    if (key.startsWith('spacing.') || key.startsWith('gap.')) return 'spacing';
    if (key.startsWith('typography.') || key.startsWith('font.')) return 'typography';
    if (key.startsWith('shadow.') || key.startsWith('elevation.')) return 'shadow';
    return 'other';
  }

  private calculateImpact(value: any): 'high' | 'medium' | 'low' {
    if (typeof value === 'string' && value.startsWith('#')) {
      return 'high';
    }
    if (typeof value === 'object' && value !== null) {
      return 'high';
    }
    return 'medium';
  }

  private calculateValueDifference(value1: any, value2: any): number | null {
    if (typeof value1 === 'number' && typeof value2 === 'number') {
      return Math.abs(value1 - value2) / Math.max(value1, value2, 1);
    }

    if (typeof value1 === 'string' && typeof value2 === 'string') {
      if (value1.startsWith('#') && value2.startsWith('#')) {
        return this.calculateColorDifference(value1, value2);
      }
      return value1 === value2 ? 0 : 1;
    }

    if (typeof value1 === 'object' && typeof value2 === 'object') {
      return JSON.stringify(value1) === JSON.stringify(value2) ? 0 : 1;
    }

    return value1 === value2 ? 0 : 1;
  }

  private calculateColorDifference(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const dr = rgb1.r - rgb2.r;
    const dg = rgb1.g - rgb2.g;
    const db = rgb1.b - rgb2.b;

    return Math.sqrt(dr * dr + dg * dg + db * db) / (255 * Math.sqrt(3));
  }

  private calculateConsistencyScore(
    commonCount: number,
    uniqueToCurrent: number,
    uniqueToProject: number,
    valueDifferences: number
  ): number {
    const totalTokens = commonCount + uniqueToCurrent + uniqueToProject;

    if (totalTokens === 0) return 0;

    const commonRatio = commonCount / totalTokens;
    const uniquePenalty = (uniqueToCurrent + uniqueToProject) / totalTokens;
    const differencePenalty = valueDifferences / Math.max(commonCount, 1);

    const score = commonRatio * 100 - uniquePenalty * 50 - differencePenalty * 30;

    return Math.max(0, Math.min(100, score));
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  private persistVersions(): void {
    try {
      localStorage.setItem('yyc3-token-versions', JSON.stringify(this.versions));
    } catch {
      console.warn('Failed to persist versions');
    }
  }

  private loadPersistedVersions(): void {
    try {
      const stored = localStorage.getItem('yyc3-token-versions');
      if (stored) {
        this.versions = JSON.parse(stored);
      }
    } catch (error) {
      console.warn('Failed to load persisted versions:', error);
    }
  }

  clearVersions(): void {
    this.versions = [];
    localStorage.removeItem('yyc3-token-versions');
  }

  exportVersions(): string {
    return JSON.stringify(this.versions, null, 2);
  }

  importVersions(json: string): void {
    try {
      const versions = JSON.parse(json) as TokenVersion[];
      this.versions = versions;
      this.persistVersions();
    } catch {
      throw new Error('Invalid version data');
    }
  }
}

export const versionHistoryComparer = new VersionHistoryComparer();
