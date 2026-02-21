/**
 * @file 设计一致性检查器
 * @description 检查设计令牌和组件的一致性
 * @module ai/consistency-checker
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { DesignTokens } from '../../types/tokens';

export interface ConsistencyIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'color' | 'spacing' | 'typography' | 'accessibility' | 'naming';
  message: string;
  suggestion?: string;
  location?: string;
}

export interface ConsistencyReport {
  overallScore: number;
  issues: ConsistencyIssue[];
  categories: {
    [key: string]: { score: number; issues: number };
    color: { score: number; issues: number };
    spacing: { score: number; issues: number };
    typography: { score: number; issues: number };
    accessibility: { score: number; issues: number };
    naming: { score: number; issues: number };
  };
  recommendations: string[];
}

export class ConsistencyChecker {
  private minContrastRatios = {
    normal: 4.5,
    large: 3,
    graphics: 3,
  };

  private namingPatterns = {
    color: /^(color|bg|text|border|ring|shadow|foreground|background|destructive|primary|secondary|muted|accent|card|popover|input|ring)/,
    spacing: /^(padding|margin|gap|space|width|height|max|min)/,
    typography: /^(font|line|letter|word)/,
    animation: /^(animation|transition|duration|easing|delay|timing|function|keyframes)/,
  };

  check(tokens: DesignTokens): ConsistencyReport {
    const issues: ConsistencyIssue[] = [];

    issues.push(...this.checkColorConsistency(tokens));
    issues.push(...this.checkSpacingConsistency(tokens));
    issues.push(...this.checkTypographyConsistency(tokens));
    issues.push(...this.checkAccessibility(tokens));
    issues.push(...this.checkNamingConvention(tokens));

    const categories = this.calculateCategoryScores(issues);
    const overallScore = this.calculateOverallScore(categories);
    const recommendations = this.generateRecommendations(issues);

    return {
      overallScore,
      issues,
      categories,
      recommendations,
    };
  }

  private checkColorConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const colorKeys = Object.keys(tokens).filter(key => 
      key.includes('color') || key.includes('bg') || key.includes('text')
    );

    if (colorKeys.length === 0) {
      issues.push({
        id: 'color-001',
        severity: 'error',
        category: 'color',
        message: '未找到任何颜色令牌',
        suggestion: '添加基础颜色令牌，如 primary、secondary、accent 等',
      });
    }

    const primaryColor = tokens['color.primary'];
    if (!primaryColor) {
      issues.push({
        id: 'color-002',
        severity: 'error',
        category: 'color',
        message: '缺少主色令牌 (color.primary)',
        suggestion: '定义 color.primary 令牌作为品牌主色',
      });
    }

    const foregroundColor = tokens['color.foreground'] as string;
    const backgroundColor = tokens['color.background'] as string;
    if (foregroundColor && backgroundColor) {
      const contrast = this.calculateContrastRatio(foregroundColor, backgroundColor);
      if (contrast < this.minContrastRatios.normal) {
        issues.push({
          id: 'color-003',
          severity: 'error',
          category: 'accessibility',
          message: `前景色与背景色对比度不足 (${contrast.toFixed(2)} < ${this.minContrastRatios.normal})`,
          suggestion: '调整前景色或背景色以提高对比度',
          location: 'color.foreground, color.background',
        });
      }
    }

    return issues;
  }

  private checkSpacingConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const spacingKeys = Object.keys(tokens).filter(key => 
      key.includes('spacing') || key.includes('gap') || key.includes('padding') || key.includes('margin')
    );

    if (spacingKeys.length === 0) {
      issues.push({
        id: 'spacing-001',
        severity: 'warning',
        category: 'spacing',
        message: '未找到间距令牌',
        suggestion: '添加间距令牌以保持一致的间距系统',
      });
    }

    const spacingValues = spacingKeys.map(key => {
      const value = tokens[key];
      const numValue = typeof value === 'string' ? parseFloat(value) : (typeof value === 'number' ? value : NaN);
      return numValue;
    }).filter(v => !isNaN(v));

    const uniqueValues = new Set(spacingValues);
    if (spacingValues.length > 0 && uniqueValues.size > spacingValues.length * 0.8) {
      issues.push({
        id: 'spacing-002',
        severity: 'warning',
        category: 'spacing',
        message: '间距令牌过于分散，建议使用一致的间距比例',
        suggestion: '使用 4px 或 8px 基础单位的倍数',
      });
    }

    return issues;
  }

  private checkTypographyConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const fontKeys = Object.keys(tokens).filter(key => 
      key.includes('font') || key.includes('line') || key.includes('letter')
    );

    if (fontKeys.length === 0) {
      issues.push({
        id: 'typography-001',
        severity: 'warning',
        category: 'typography',
        message: '未找到排版令牌',
        suggestion: '添加字体大小、行高、字间距等排版令牌',
      });
    }

    const fontSizeKeys = fontKeys.filter(key => key.includes('font-size'));
    if (fontSizeKeys.length === 0) {
      issues.push({
        id: 'typography-002',
        severity: 'warning',
        category: 'typography',
        message: '缺少字体大小令牌',
        suggestion: '定义 font-size 相关令牌',
      });
    }

    return issues;
  }

  private checkAccessibility(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];

    const textColors = Object.keys(tokens).filter(key => key.includes('text'));
    const bgColors = Object.keys(tokens).filter(key => key.includes('bg') || key.includes('background'));

    textColors.forEach(textKey => {
      bgColors.forEach(bgKey => {
        const textColor = tokens[textKey];
        const bgColor = tokens[bgKey];
        
        if (typeof textColor === 'string' && typeof bgColor === 'string') {
          const contrast = this.calculateContrastRatio(textColor, bgColor);
          if (contrast < this.minContrastRatios.normal) {
            issues.push({
              id: 'accessibility-001',
              severity: 'warning',
              category: 'accessibility',
              message: `${textKey} 与 ${bgKey} 对比度不足 (${contrast.toFixed(2)})`,
              suggestion: '调整颜色以提高可读性',
              location: `${textKey}, ${bgKey}`,
            });
          }
        }
      });
    });

    return issues;
  }

  private checkNamingConvention(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];

    Object.keys(tokens).forEach(key => {
      const hasValidPrefix = Object.values(this.namingPatterns).some(pattern => pattern.test(key));
      
      if (!hasValidPrefix) {
        issues.push({
          id: 'naming-001',
          severity: 'info',
          category: 'naming',
          message: `令牌命名不符合约定: ${key}`,
          suggestion: '使用标准前缀，如 color、spacing、font 等',
          location: key,
        });
      }
    });

    const hasCamelCase = Object.keys(tokens).some(key => /[A-Z]/.test(key));
    if (hasCamelCase) {
      issues.push({
        id: 'naming-002',
        severity: 'warning',
        category: 'naming',
        message: '令牌命名应使用 kebab-case',
        suggestion: '将驼峰命名转换为短横线命名，如 fontSize -> font-size',
      });
    }

    return issues;
  }

  private calculateCategoryScores(issues: ConsistencyIssue[]) {
    const categories = {
      color: { score: 100, issues: 0 },
      spacing: { score: 100, issues: 0 },
      typography: { score: 100, issues: 0 },
      accessibility: { score: 100, issues: 0 },
      naming: { score: 100, issues: 0 },
    };

    issues.forEach(issue => {
      const category = categories[issue.category];
      if (category) {
        category.issues++;
        if (issue.severity === 'error') {
          category.score -= 20;
        } else if (issue.severity === 'warning') {
          category.score -= 10;
        } else {
          category.score -= 5;
        }
      }
    });

    Object.keys(categories).forEach(key => {
      const category = categories[key as keyof typeof categories];
      if (category) {
        category.score = Math.max(0, category.score);
      }
    });

    return categories;
  }

  private calculateOverallScore(categories: ConsistencyReport['categories']): number {
    const scores = Object.values(categories).map(c => c.score);
    return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
  }

  private generateRecommendations(issues: ConsistencyIssue[]): string[] {
    const recommendations: string[] = [];

    const errorCount = issues.filter(i => i.severity === 'error').length;
    const warningCount = issues.filter(i => i.severity === 'warning').length;

    if (errorCount > 0) {
      recommendations.push(`优先修复 ${errorCount} 个严重问题以确保设计系统可用性`);
    }

    if (warningCount > 0) {
      recommendations.push(`解决 ${warningCount} 个警告问题以提高设计系统质量`);
    }

    const hasColorIssues = issues.some(i => i.category === 'color');
    if (hasColorIssues) {
      recommendations.push('建立完整的颜色系统，包括主色、辅助色、中性色等');
    }

    const hasSpacingIssues = issues.some(i => i.category === 'spacing');
    if (hasSpacingIssues) {
      recommendations.push('使用一致的间距比例（如 4px、8px、16px 等）');
    }

    const hasAccessibilityIssues = issues.some(i => i.category === 'accessibility');
    if (hasAccessibilityIssues) {
      recommendations.push('确保所有文本颜色与背景色对比度符合 WCAG 标准');
    }

    return recommendations;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16) / 255;
    const g = parseInt(hex.substr(2, 2), 16) / 255;
    const b = parseInt(hex.substr(4, 2), 16) / 255;

    const toLinear = (c: number) => 
      c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);

    const R = toLinear(r);
    const G = toLinear(g);
    const B = toLinear(b);

    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
}

export const consistencyChecker = new ConsistencyChecker();
