import { DesignTokens } from '../../types/tokens';

export interface ConsistencyIssue {
  id: string;
  severity: 'error' | 'warning' | 'info';
  category: 'color' | 'spacing' | 'typography' | 'shadow' | 'contrast';
  message: string;
  suggestion: string;
  autoFixable: boolean;
  fixAction?: () => DesignTokens;
  tokens: string[];
}

export interface ConsistencyReport {
  overallScore: number;
  issues: ConsistencyIssue[];
  summary: {
    error: number;
    warning: number;
    info: number;
  };
  recommendations: string[];
  fixedTokens?: DesignTokens;
}

export interface ConsistencyCheckOptions {
  autoFix?: boolean;
  targetContrast?: 'AA' | 'AAA';
  checkAccessibility?: boolean;
  checkNaming?: boolean;
}

export class EnhancedConsistencyChecker {
  private issueCounter = 0;

  private generateIssueId(): string {
    return `issue-${++this.issueCounter}`;
  }

  check(tokens: DesignTokens, options: ConsistencyCheckOptions = {}): ConsistencyReport {
    const {
      autoFix = false,
      targetContrast = 'AA',
      checkAccessibility = true,
      checkNaming = true,
    } = options;

    const issues: ConsistencyIssue[] = [];

    if (checkAccessibility) {
      issues.push(...this.checkColorContrast(tokens, targetContrast));
    }

    issues.push(...this.checkSpacingConsistency(tokens));
    issues.push(...this.checkTypographyConsistency(tokens));
    issues.push(...this.checkColorNaming(tokens));
    issues.push(...this.checkShadowConsistency(tokens));

    const summary = {
      error: issues.filter((i) => i.severity === 'error').length,
      warning: issues.filter((i) => i.severity === 'warning').length,
      info: issues.filter((i) => i.severity === 'info').length,
    };

    const overallScore = this.calculateOverallScore(issues);

    const report: ConsistencyReport = {
      overallScore,
      issues: issues.sort((a, b) => {
        const severityOrder = { error: 0, warning: 1, info: 2 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      summary,
      recommendations: this.generateRecommendations(issues),
    };

    if (autoFix) {
      report.fixedTokens = this.applyAutoFixes(tokens, issues);
    }

    return report;
  }

  private checkColorContrast(
    tokens: DesignTokens,
    targetContrast: 'AA' | 'AAA'
  ): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const targetRatio = targetContrast === 'AAA' ? 7 : 4.5;

    const colorTokens = Object.entries(tokens).filter(([key]) => key.startsWith('color.'));

    colorTokens.forEach(([key, value]) => {
      if (typeof value !== 'string') return;

      const contrastRatio = this.calculateContrastRatio(value, '#ffffff');

      if (contrastRatio < targetRatio) {
        const issue: ConsistencyIssue = {
          id: this.generateIssueId(),
          severity: 'error',
          category: 'contrast',
          message: `颜色 "${key}" 对比度 ${contrastRatio.toFixed(2)}:1 未达到 WCAG ${targetContrast} 标准 (${targetRatio}:1)`,
          suggestion: `调整颜色亮度以提高对比度至 ${targetRatio}:1 以上`,
          autoFixable: true,
          tokens: [key],
          fixAction: () => {
            const fixedTokens = { ...tokens };
            fixedTokens[key] = this.optimizeContrast(value, targetRatio);
            return fixedTokens;
          },
        };
        issues.push(issue);
      }
    });

    return issues;
  }

  private checkSpacingConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const spacingTokens = Object.entries(tokens).filter(([key]) => key.startsWith('radius.'));

    const values = spacingTokens.map(([_, value]) => {
      if (typeof value === 'string') return parseFloat(value);
      if (typeof value === 'number') return value;
      return 0;
    });

    if (values.length < 2) return issues;

    const ratios: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        ratios.push(values[i] / values[i - 1]);
      }
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;
    const expectedRatio = 1.618;

    if (Math.abs(avgRatio - expectedRatio) > 0.3) {
      const issue: ConsistencyIssue = {
        id: this.generateIssueId(),
        severity: 'warning',
        category: 'spacing',
        message: `间距比例 (${avgRatio.toFixed(2)}) 偏离黄金比例 (${expectedRatio})`,
        suggestion: `建议使用黄金比例 ${expectedRatio} 作为间距比例`,
        autoFixable: false,
        tokens: spacingTokens.map(([key]) => key),
      };
      issues.push(issue);
    }

    const inconsistentRatios = ratios.filter((r) => r < 1.4 || r > 1.8);
    if (inconsistentRatios.length > ratios.length * 0.3) {
      const issue: ConsistencyIssue = {
        id: this.generateIssueId(),
        severity: 'warning',
        category: 'spacing',
        message: `发现 ${inconsistentRatios.length} 个不一致的间距比例`,
        suggestion: '建议统一使用一致的间距比例（1.5 或 1.618）',
        autoFixable: false,
        tokens: spacingTokens.map(([key]) => key),
      };
      issues.push(issue);
    }

    return issues;
  }

  private checkTypographyConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const fontSizes = Object.entries(tokens).filter(([key]) => key.startsWith('font-size.'));

    const values = fontSizes.map(([_, value]) => {
      if (typeof value === 'string') return parseFloat(value);
      if (typeof value === 'number') return value;
      return 0;
    });

    const typeScale = this.detectTypeScale(values);

    if (!typeScale) {
      const issue: ConsistencyIssue = {
        id: this.generateIssueId(),
        severity: 'info',
        category: 'typography',
        message: '字体大小未遵循标准的排版比例',
        suggestion: '建议使用标准的排版比例（如 1.2、1.25 或 1.5）',
        autoFixable: false,
        tokens: fontSizes.map(([key]) => key),
      };
      issues.push(issue);
    }

    const minSize = Math.min(...values);
    const maxSize = Math.max(...values);

    if (maxSize / minSize > 6) {
      const issue: ConsistencyIssue = {
        id: this.generateIssueId(),
        severity: 'warning',
        category: 'typography',
        message: `字体大小范围过大 (${minSize}px - ${maxSize}px)`,
        suggestion: '建议缩小字体大小范围以提高一致性',
        autoFixable: false,
        tokens: fontSizes.map(([key]) => key),
      };
      issues.push(issue);
    }

    return issues;
  }

  private detectTypeScale(values: number[]): number | null {
    if (values.length < 2) return null;

    const ratios: number[] = [];
    for (let i = 1; i < values.length; i++) {
      if (values[i - 1] > 0) {
        ratios.push(values[i] / values[i - 1]);
      }
    }

    const avgRatio = ratios.reduce((a, b) => a + b, 0) / ratios.length;

    const standardScales = [1.067, 1.125, 1.2, 1.25, 1.333, 1.414, 1.5, 1.618];
    for (const scale of standardScales) {
      if (Math.abs(avgRatio - scale) < 0.05) {
        return scale;
      }
    }

    return null;
  }

  private checkColorNaming(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const colorTokens = Object.keys(tokens).filter((key) => key.startsWith('color.'));

    const namingPatterns = [/^color-\d+$/, /^primary$/, /^secondary$/, /^accent$/];

    const inconsistentNames = colorTokens.filter(
      (name) => !namingPatterns.some((pattern) => pattern.test(name.replace('color.', '')))
    );

    if (inconsistentNames.length > 0) {
      const issue: ConsistencyIssue = {
        id: this.generateIssueId(),
        severity: 'info',
        category: 'color',
        message: `发现 ${inconsistentNames.length} 个非标准命名的颜色令牌`,
        suggestion:
          '建议使用语义化命名（如 primary、secondary）或序列化命名（如 color-1、color-2）',
        autoFixable: false,
        tokens: inconsistentNames,
      };
      issues.push(issue);
    }

    return issues;
  }

  private checkShadowConsistency(tokens: DesignTokens): ConsistencyIssue[] {
    const issues: ConsistencyIssue[] = [];
    const shadowTokens = Object.entries(tokens).filter(([key]) => key.startsWith('shadow.'));

    shadowTokens.forEach(([key, value]) => {
      if (typeof value !== 'string') return;

      const shadowRegex = /(\d+px|\d+rem)/g;
      const matches = value.match(shadowRegex);

      if (!matches || matches.length < 3) {
        const issue: ConsistencyIssue = {
          id: this.generateIssueId(),
          severity: 'warning',
          category: 'shadow',
          message: `阴影 "${key}" 格式不标准或缺少必要参数`,
          suggestion: '阴影应包含 offset-x、offset-y、blur 和 spread 值',
          autoFixable: false,
          tokens: [key],
        };
        issues.push(issue);
      }
    });

    return issues;
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    if (!rgb1 || !rgb2) return 1;

    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16) / 255,
          g: parseInt(result[2], 16) / 255,
          b: parseInt(result[3], 16) / 255,
        }
      : null;
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      return c;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private optimizeContrast(
    color: string,
    targetRatio: number,
    bgColor: string = '#ffffff'
  ): string {
    let optimized = color;
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      const currentRatio = this.calculateContrastRatio(optimized, bgColor);
      if (currentRatio >= targetRatio) break;

      const rgb = this.hexToRgb(optimized);
      if (!rgb) break;

      const hsl = this.rgbToHsl(rgb.r * 255, rgb.g * 255, rgb.b * 255);
      const adjustment = currentRatio < targetRatio * 0.5 ? 0.05 : 0.01;
      const newLightness = Math.max(
        5,
        Math.min(95, hsl.l + (hsl.l > 50 ? -adjustment : adjustment) * 100)
      );

      optimized = this.hslToHex(hsl.h, hsl.s, newLightness);

      iterations++;
    }

    return optimized;
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s: s * 100, l: l * 100 };
  }

  private hslToHex(h: number, s: number, l: number): string {
    s /= 100;
    l /= 100;

    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));

    const r = Math.round(255 * f(0));
    const g = Math.round(255 * f(8));
    const b = Math.round(255 * f(4));

    return `#${[r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')}`;
  }

  private calculateOverallScore(issues: ConsistencyIssue[]): number {
    if (issues.length === 0) return 100;

    const severityWeights = {
      error: -20,
      warning: -10,
      info: -5,
    };

    const penalty = issues.reduce((total, issue) => {
      return total + severityWeights[issue.severity];
    }, 0);

    return Math.max(0, 100 + penalty);
  }

  private generateRecommendations(issues: ConsistencyIssue[]): string[] {
    const recommendations: string[] = [];

    const errorCount = issues.filter((i) => i.severity === 'error').length;
    const warningCount = issues.filter((i) => i.severity === 'warning').length;
    const infoCount = issues.filter((i) => i.severity === 'info').length;

    if (errorCount > 0) {
      recommendations.push(`发现 ${errorCount} 个严重问题，建议优先修复`);
    }

    if (warningCount > 0) {
      recommendations.push(`${warningCount} 个警告可能影响设计一致性`);
    }

    const autoFixableIssues = issues.filter((i) => i.autoFixable);
    if (autoFixableIssues.length > 0) {
      recommendations.push(`${autoFixableIssues.length} 个问题可以自动修复，建议启用自动修复功能`);
    }

    const categoryCounts = {
      color: issues.filter((i) => i.category === 'color').length,
      spacing: issues.filter((i) => i.category === 'spacing').length,
      typography: issues.filter((i) => i.category === 'typography').length,
      shadow: issues.filter((i) => i.category === 'shadow').length,
      contrast: issues.filter((i) => i.category === 'contrast').length,
    };

    const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0];

    if (topCategory[1] > 0) {
      const categoryNames = {
        color: '颜色',
        spacing: '间距',
        typography: '排版',
        shadow: '阴影',
        contrast: '对比度',
      };
      recommendations.push(
        `${categoryNames[topCategory[0] as keyof typeof categoryNames]} 系统需要重点关注`
      );
    }

    return recommendations;
  }

  private applyAutoFixes(tokens: DesignTokens, issues: ConsistencyIssue[]): DesignTokens {
    let fixedTokens = { ...tokens };

    const autoFixableIssues = issues.filter((i) => i.autoFixable);
    autoFixableIssues.forEach((issue) => {
      if (issue.fixAction) {
        fixedTokens = issue.fixAction();
      }
    });

    return fixedTokens;
  }
}

export const enhancedConsistencyChecker = new EnhancedConsistencyChecker();
