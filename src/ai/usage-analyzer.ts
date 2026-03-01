/**
 * @file 使用模式分析器
 * @description 分析设计令牌的使用模式，提供优化建议
 * @module ai/usage-analyzer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

export interface TokenUsage {
  tokenName: string;
  tokenValue: string;
  usageCount: number;
  lastUsed: Date;
  files: string[];
  components: string[];
}

export interface UsagePattern {
  category: string;
  mostUsed: TokenUsage[];
  leastUsed: TokenUsage[];
  unused: string[];
  trends: {
    increasing: string[];
    decreasing: string[];
    stable: string[];
  };
}

export interface UsageReport {
  summary: {
    totalTokens: number;
    usedTokens: number;
    unusedTokens: number;
    coverage: number;
  };
  patterns: {
    [key: string]: UsagePattern;
    color: UsagePattern;
    spacing: UsagePattern;
    typography: UsagePattern;
    animation: UsagePattern;
  };
  recommendations: string[];
  insights: string[];
}

export class UsageAnalyzer {
  private usageData: Map<string, TokenUsage> = new Map();
  private historicalData: Map<string, number[]> = new Map();

  recordUsage(tokenName: string, tokenValue: string, file: string, component?: string): void {
    const existing = this.usageData.get(tokenName);

    if (existing) {
      existing.usageCount++;
      existing.lastUsed = new Date();
      if (!existing.files.includes(file)) {
        existing.files.push(file);
      }
      if (component && !existing.components.includes(component)) {
        existing.components.push(component);
      }
      this.usageData.set(tokenName, existing);
    } else {
      this.usageData.set(tokenName, {
        tokenName,
        tokenValue,
        usageCount: 1,
        lastUsed: new Date(),
        files: [file],
        components: component ? [component] : [],
      });
    }

    this.updateHistoricalData(tokenName);
  }

  private updateHistoricalData(tokenName: string): void {
    const history = this.historicalData.get(tokenName) || [];
    const current = this.usageData.get(tokenName);

    if (current) {
      history.push(current.usageCount);
      if (history.length > 30) {
        history.shift();
      }
      this.historicalData.set(tokenName, history);
    }
  }

  analyzeUsage(): UsageReport {
    const allTokens = Array.from(this.usageData.values());
    const usedTokens = allTokens.filter((t) => t.usageCount > 0);
    const unusedTokens = allTokens.filter((t) => t.usageCount === 0);
    const coverage = (usedTokens.length / Math.max(allTokens.length, 1)) * 100;

    return {
      summary: {
        totalTokens: allTokens.length,
        usedTokens: usedTokens.length,
        unusedTokens: unusedTokens.length,
        coverage: Math.round(coverage),
      },
      patterns: {
        color: this.analyzeCategory('color'),
        spacing: this.analyzeCategory('spacing'),
        typography: this.analyzeCategory('typography'),
        animation: this.analyzeCategory('animation'),
      },
      recommendations: this.generateRecommendations(),
      insights: this.generateInsights(),
    };
  }

  private analyzeCategory(category: string): UsagePattern {
    const categoryTokens = Array.from(this.usageData.values()).filter((t) =>
      t.tokenName.includes(category)
    );

    const sortedByUsage = [...categoryTokens].sort((a, b) => b.usageCount - a.usageCount);
    const mostUsed = sortedByUsage.slice(0, 5);
    const leastUsed = sortedByUsage.slice(-5).reverse();
    const unused = categoryTokens.filter((t) => t.usageCount === 0).map((t) => t.tokenName);

    const trends = {
      increasing: [] as string[],
      decreasing: [] as string[],
      stable: [] as string[],
    };

    categoryTokens.forEach((token) => {
      const history = this.historicalData.get(token.tokenName);
      if (history && history.length >= 3) {
        const recent = history.slice(-3);
        const trend = this.calculateTrend(recent);

        if (trend > 0.5) {
          trends.increasing.push(token.tokenName);
        } else if (trend < -0.5) {
          trends.decreasing.push(token.tokenName);
        } else {
          trends.stable.push(token.tokenName);
        }
      }
    });

    return {
      category,
      mostUsed,
      leastUsed,
      unused,
      trends,
    };
  }

  private calculateTrend(values: number[]): number {
    if (values.length < 2) return 0;

    const n = values.length;
    const sumX = (n * (n - 1)) / 2;
    const sumY = values.reduce((a, b) => a + b, 0);
    const sumXY = values.reduce((sum, y, i) => sum + i * y, 0);
    const sumX2 = (n * (n - 1) * (2 * n - 1)) / 6;

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    return slope;
  }

  private generateRecommendations(): string[] {
    const recommendations: string[] = [];
    const allTokens = Array.from(this.usageData.values());
    const unusedTokens = allTokens.filter((t) => t.usageCount === 0);

    if (unusedTokens.length > 0) {
      recommendations.push(`发现 ${unusedTokens.length} 个未使用的令牌，考虑删除以简化设计系统`);
    }

    const lowUsageTokens = allTokens.filter((t) => t.usageCount > 0 && t.usageCount < 3);
    if (lowUsageTokens.length > 0) {
      recommendations.push(`${lowUsageTokens.length} 个令牌使用频率较低，评估是否需要保留`);
    }

    const highUsageTokens = allTokens.filter((t) => t.usageCount > 50);
    if (highUsageTokens.length > 0) {
      recommendations.push(`${highUsageTokens.length} 个令牌使用频繁，确保它们符合设计规范`);
    }

    const colorTokens = allTokens.filter((t) => t.tokenName.includes('color'));
    if (colorTokens.length > 20) {
      recommendations.push('颜色令牌数量较多，考虑合并相似颜色以简化系统');
    }

    return recommendations;
  }

  private generateInsights(): string[] {
    const insights: string[] = [];
    const allTokens = Array.from(this.usageData.values());

    const avgUsage = allTokens.reduce((sum, t) => sum + t.usageCount, 0) / allTokens.length;
    insights.push(`平均令牌使用次数: ${avgUsage.toFixed(1)}`);

    const mostUsed = allTokens.reduce((max, t) => (t.usageCount > max.usageCount ? t : max));
    insights.push(`最常用的令牌: ${mostUsed.tokenName} (${mostUsed.usageCount} 次)`);

    const componentUsage = new Map<string, number>();
    allTokens.forEach((t) => {
      t.components.forEach((c) => {
        componentUsage.set(c, (componentUsage.get(c) || 0) + t.usageCount);
      });
    });

    const topComponent = Array.from(componentUsage.entries()).sort((a, b) => b[1] - a[1])[0];

    if (topComponent) {
      insights.push(`令牌使用最多的组件: ${topComponent[0]} (${topComponent[1]} 次)`);
    }

    const fileUsage = new Map<string, number>();
    allTokens.forEach((t) => {
      t.files.forEach((f) => {
        fileUsage.set(f, (fileUsage.get(f) || 0) + t.usageCount);
      });
    });

    const topFile = Array.from(fileUsage.entries()).sort((a, b) => b[1] - a[1])[0];

    if (topFile) {
      insights.push(`令牌使用最多的文件: ${topFile[0]} (${topFile[1]} 次)`);
    }

    return insights;
  }

  getTopUsedTokens(limit: number = 10): TokenUsage[] {
    return Array.from(this.usageData.values())
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  }

  getUnusedTokens(): string[] {
    return Array.from(this.usageData.values())
      .filter((t) => t.usageCount === 0)
      .map((t) => t.tokenName);
  }

  getTokenUsage(tokenName: string): TokenUsage | undefined {
    return this.usageData.get(tokenName);
  }

  getComponentUsage(componentName: string): TokenUsage[] {
    return Array.from(this.usageData.values()).filter((t) => t.components.includes(componentName));
  }

  getFileUsage(filePath: string): TokenUsage[] {
    return Array.from(this.usageData.values()).filter((t) => t.files.includes(filePath));
  }

  clearUsageData(): void {
    this.usageData.clear();
    this.historicalData.clear();
  }

  exportUsageData(): Record<string, TokenUsage> {
    return Object.fromEntries(this.usageData);
  }

  importUsageData(data: Record<string, TokenUsage>): void {
    Object.entries(data).forEach(([key, value]) => {
      this.usageData.set(key, value);
    });
  }
}

export const usageAnalyzer = new UsageAnalyzer();
