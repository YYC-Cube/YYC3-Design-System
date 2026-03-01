export interface AccessibilityIssue {
  id: string;
  type:
    | 'color-contrast'
    | 'focus-indicator'
    | 'keyboard-nav'
    | 'aria-label'
    | 'alt-text'
    | 'heading-order'
    | 'form-label';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  element: string;
  message: string;
  suggestion: string;
  autoFixable: boolean;
  fixAction?: () => void;
}

export interface AccessibilityReport {
  overallScore: number;
  issues: AccessibilityIssue[];
  summary: {
    critical: number;
    serious: number;
    moderate: number;
    minor: number;
  };
  wcagCompliance: 'A' | 'AA' | 'AAA' | 'fail';
  recommendations: string[];
}

export interface AccessibilityCheckOptions {
  checkContrast?: boolean;
  checkKeyboard?: boolean;
  checkAria?: boolean;
  checkForms?: boolean;
  checkHeadings?: boolean;
  targetLevel?: 'A' | 'AA' | 'AAA';
}

export class AccessibilityChecker {
  private issueCounter = 0;

  private generateIssueId(): string {
    return `a11y-${++this.issueCounter}`;
  }

  check(element: HTMLElement | null, options: AccessibilityCheckOptions = {}): AccessibilityReport {
    if (!element) {
      return {
        overallScore: 0,
        issues: [],
        summary: { critical: 0, serious: 0, moderate: 0, minor: 0 },
        wcagCompliance: 'fail',
        recommendations: ['未找到要检查的元素'],
      };
    }

    const {
      checkContrast = true,
      checkKeyboard = true,
      checkAria = true,
      checkForms = true,
      checkHeadings = true,
      targetLevel = 'AA',
    } = options;

    const issues: AccessibilityIssue[] = [];

    if (checkContrast) {
      issues.push(...this.checkColorContrast(element, targetLevel));
    }

    if (checkKeyboard) {
      issues.push(...this.checkKeyboardNavigation(element));
    }

    if (checkAria) {
      issues.push(...this.checkAriaLabels(element));
    }

    if (checkForms) {
      issues.push(...this.checkFormLabels(element));
    }

    if (checkHeadings) {
      issues.push(...this.checkHeadingOrder(element));
    }

    const summary = {
      critical: issues.filter((i) => i.severity === 'critical').length,
      serious: issues.filter((i) => i.severity === 'serious').length,
      moderate: issues.filter((i) => i.severity === 'moderate').length,
      minor: issues.filter((i) => i.severity === 'minor').length,
    };

    const overallScore = this.calculateOverallScore(issues);
    const wcagCompliance = this.determineWcagCompliance(overallScore, targetLevel);

    const report: AccessibilityReport = {
      overallScore,
      issues: issues.sort((a, b) => {
        const severityOrder = { critical: 0, serious: 1, moderate: 2, minor: 3 };
        return severityOrder[a.severity] - severityOrder[b.severity];
      }),
      summary,
      wcagCompliance,
      recommendations: this.generateRecommendations(issues, targetLevel),
    };

    return report;
  }

  private checkColorContrast(
    element: HTMLElement,
    targetLevel: 'A' | 'AA' | 'AAA'
  ): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const targetRatio = targetLevel === 'AAA' ? 7 : targetLevel === 'AA' ? 4.5 : 3;

    const textElements = element.querySelectorAll('*');
    textElements.forEach((el) => {
      const computedStyle = window.getComputedStyle(el);
      const color = computedStyle.color;
      const backgroundColor = computedStyle.backgroundColor;
      const fontSize = parseFloat(computedStyle.fontSize);
      const fontWeight = parseInt(computedStyle.fontWeight);

      if (el.textContent && el.textContent.trim().length > 0) {
        const contrastRatio = this.calculateContrastRatio(color, backgroundColor);
        const requiredRatio = fontSize >= 18 || fontWeight >= 700 ? targetRatio / 1.5 : targetRatio;

        if (contrastRatio < requiredRatio) {
          const issue: AccessibilityIssue = {
            id: this.generateIssueId(),
            type: 'color-contrast',
            severity: targetLevel === 'AAA' ? 'serious' : 'moderate',
            element: el.tagName.toLowerCase(),
            message: `文本对比度 ${contrastRatio.toFixed(2)}:1 未达到 WCAG ${targetLevel} 标准 (${requiredRatio}:1)`,
            suggestion: `增加前景色与背景色之间的对比度至 ${requiredRatio}:1 以上`,
            autoFixable: true,
            fixAction: () => {
              const newColor = this.optimizeContrast(color, backgroundColor, requiredRatio);
              (el as HTMLElement).style.color = newColor;
            },
          };
          issues.push(issue);
        }
      }
    });

    return issues;
  }

  private checkKeyboardNavigation(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const interactiveElements = element.querySelectorAll(
      'a, button, input, select, textarea, [tabindex]'
    );

    interactiveElements.forEach((el) => {
      const htmlElement = el as HTMLElement;
      const computedStyle = window.getComputedStyle(htmlElement);
      const hasFocusStyle = computedStyle.outline !== 'none' || computedStyle.boxShadow !== 'none';

      if (!hasFocusStyle) {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'focus-indicator',
          severity: 'serious',
          element: htmlElement.tagName.toLowerCase(),
          message: '元素缺少明显的焦点指示器',
          suggestion: '添加 outline 或 box-shadow 样式以显示键盘焦点',
          autoFixable: true,
          fixAction: () => {
            htmlElement.style.outline = '2px solid #3b82f6';
            htmlElement.style.outlineOffset = '2px';
          },
        };
        issues.push(issue);
      }

      const tabIndex = htmlElement.getAttribute('tabindex');
      if (tabIndex !== null && tabIndex !== '0' && tabIndex !== '-1') {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'keyboard-nav',
          severity: 'moderate',
          element: htmlElement.tagName.toLowerCase(),
          message: `元素使用了非标准的 tabindex 值: ${tabIndex}`,
          suggestion: '使用 0（按文档顺序）或 -1（不可通过 Tab 访问）',
          autoFixable: false,
        };
        issues.push(issue);
      }
    });

    return issues;
  }

  private checkAriaLabels(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const elementsNeedingLabels = element.querySelectorAll(
      'button:not([aria-label]):not([aria-labelledby]), input:not([aria-label]):not([aria-labelledby]), textarea:not([aria-label]):not([aria-labelledby])'
    );

    elementsNeedingLabels.forEach((el) => {
      const htmlElement = el as HTMLElement;
      const hasVisibleLabel = this.hasVisibleLabel(htmlElement);

      if (!hasVisibleLabel) {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'aria-label',
          severity: 'serious',
          element: htmlElement.tagName.toLowerCase(),
          message: '交互元素缺少可访问的标签',
          suggestion: '添加 aria-label 属性或关联可见的 label 元素',
          autoFixable: false,
        };
        issues.push(issue);
      }
    });

    const iconButtons = element.querySelectorAll('button svg, button i, button .icon');
    iconButtons.forEach((el) => {
      const htmlElement = el as HTMLElement;
      const hasAriaLabel =
        htmlElement.hasAttribute('aria-label') || htmlElement.hasAttribute('aria-labelledby');

      if (!hasAriaLabel) {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'aria-label',
          severity: 'serious',
          element: 'button',
          message: '仅包含图标的按钮缺少可访问的标签',
          suggestion: '添加 aria-label 属性描述按钮功能',
          autoFixable: false,
        };
        issues.push(issue);
      }
    });

    return issues;
  }

  private checkFormLabels(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const inputs = element.querySelectorAll(
      'input[type="text"], input[type="email"], input[type="password"], input[type="number"], textarea, select'
    );

    inputs.forEach((el) => {
      const htmlElement = el as HTMLElement;
      const hasLabel = this.hasFormLabel(htmlElement);
      const hasAriaLabel =
        htmlElement.hasAttribute('aria-label') || htmlElement.hasAttribute('aria-labelledby');

      if (!hasLabel && !hasAriaLabel) {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'form-label',
          severity: 'serious',
          element: htmlElement.tagName.toLowerCase(),
          message: '表单元素缺少标签',
          suggestion: '添加 label 元素或 aria-label 属性',
          autoFixable: false,
        };
        issues.push(issue);
      }
    });

    return issues;
  }

  private checkHeadingOrder(element: HTMLElement): AccessibilityIssue[] {
    const issues: AccessibilityIssue[] = [];
    const headings = element.querySelectorAll('h1, h2, h3, h4, h5, h6');

    let previousLevel = 0;
    headings.forEach((heading, index) => {
      const level = parseInt(heading.tagName.charAt(1));

      if (level > previousLevel + 1 && index > 0) {
        const issue: AccessibilityIssue = {
          id: this.generateIssueId(),
          type: 'heading-order',
          severity: 'moderate',
          element: heading.tagName.toLowerCase(),
          message: `标题级别跳过：从 h${previousLevel} 跳到 h${level}`,
          suggestion: '确保标题级别按顺序递增，不要跳过级别',
          autoFixable: false,
        };
        issues.push(issue);
      }

      previousLevel = level;
    });

    const h1Elements = element.querySelectorAll('h1');
    if (h1Elements.length > 1) {
      const issue: AccessibilityIssue = {
        id: this.generateIssueId(),
        type: 'heading-order',
        severity: 'moderate',
        element: 'h1',
        message: '页面包含多个 h1 标题',
        suggestion: '每页应该只有一个 h1 标题',
        autoFixable: false,
      };
      issues.push(issue);
    }

    return issues;
  }

  private hasVisibleLabel(element: HTMLElement): boolean {
    const id = element.id;
    if (id) {
      const label = element.parentElement?.querySelector(`label[for="${id}"]`);
      if (label && label.parentElement !== null) {
        return true;
      }
    }

    const parent = element.closest('label');
    if (parent && parent.parentElement !== null) {
      return true;
    }

    return false;
  }

  private hasFormLabel(element: HTMLElement): boolean {
    const id = element.id;
    if (id) {
      const label = element.parentElement?.querySelector(`label[for="${id}"]`);
      if (label && label.parentElement !== null) {
        return true;
      }
    }

    const parent = element.closest('label');
    if (parent && parent.parentElement !== null) {
      return true;
    }

    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');

    return !!(ariaLabel || ariaLabelledBy);
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

  private hexToRgb(color: string): { r: number; g: number; b: number } | null {
    if (color.startsWith('#')) {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(color);
      return result
        ? {
            r: parseInt(result[1], 16) / 255,
            g: parseInt(result[2], 16) / 255,
            b: parseInt(result[3], 16) / 255,
          }
        : null;
    }

    if (color.startsWith('rgb')) {
      const match = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (match) {
        return {
          r: parseInt(match[1]) / 255,
          g: parseInt(match[2]) / 255,
          b: parseInt(match[3]) / 255,
        };
      }
    }

    return null;
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      return c;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private optimizeContrast(
    foregroundColor: string,
    backgroundColor: string,
    targetRatio: number
  ): string {
    let optimized = foregroundColor;
    let iterations = 0;
    const maxIterations = 50;

    while (iterations < maxIterations) {
      const currentRatio = this.calculateContrastRatio(optimized, backgroundColor);
      if (currentRatio >= targetRatio) break;

      const rgb = this.hexToRgb(optimized);
      if (!rgb) break;

      const adjustment = currentRatio < targetRatio * 0.5 ? 0.1 : 0.02;
      const luminance = this.calculateLuminance(rgb);
      const newLuminance = luminance > 0.5 ? luminance - adjustment : luminance + adjustment;

      optimized = this.rgbToHex(
        Math.max(0, Math.min(1, newLuminance * 255)),
        Math.max(0, Math.min(1, rgb.g * 255)),
        Math.max(0, Math.min(1, rgb.b * 255))
      );

      iterations++;
    }

    return optimized;
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b]
      .map((x) => {
        const hex = Math.round(x).toString(16);
        return hex.length === 1 ? '0' + hex : hex;
      })
      .join('')}`;
  }

  private calculateOverallScore(issues: AccessibilityIssue[]): number {
    if (issues.length === 0) return 100;

    const severityWeights = {
      critical: -30,
      serious: -20,
      moderate: -10,
      minor: -5,
    };

    const penalty = issues.reduce((total, issue) => {
      return total + severityWeights[issue.severity];
    }, 0);

    return Math.max(0, 100 + penalty);
  }

  private determineWcagCompliance(
    score: number,
    targetLevel: 'A' | 'AA' | 'AAA'
  ): 'A' | 'AA' | 'AAA' | 'fail' {
    if (score >= 95) {
      if (targetLevel === 'AAA') return 'AAA';
      if (targetLevel === 'AA') return 'AA';
      return 'A';
    }
    if (score >= 80) return targetLevel === 'AAA' ? 'AA' : 'A';
    if (score >= 60) return 'A';
    return 'fail';
  }

  private generateRecommendations(
    issues: AccessibilityIssue[],
    targetLevel: 'A' | 'AA' | 'AAA'
  ): string[] {
    const recommendations: string[] = [];

    const criticalCount = issues.filter((i) => i.severity === 'critical').length;
    const seriousCount = issues.filter((i) => i.severity === 'serious').length;

    if (criticalCount > 0) {
      recommendations.push(`发现 ${criticalCount} 个严重问题，必须立即修复`);
    }

    if (seriousCount > 0) {
      recommendations.push(`${seriousCount} 个严重问题会影响用户体验`);
    }

    const autoFixableIssues = issues.filter((i) => i.autoFixable);
    if (autoFixableIssues.length > 0) {
      recommendations.push(`${autoFixableIssues.length} 个问题可以自动修复`);
    }

    const typeCounts = {
      'color-contrast': issues.filter((i) => i.type === 'color-contrast').length,
      'focus-indicator': issues.filter((i) => i.type === 'focus-indicator').length,
      'keyboard-nav': issues.filter((i) => i.type === 'keyboard-nav').length,
      'aria-label': issues.filter((i) => i.type === 'aria-label').length,
      'form-label': issues.filter((i) => i.type === 'form-label').length,
      'heading-order': issues.filter((i) => i.type === 'heading-order').length,
    };

    const topType = Object.entries(typeCounts).sort((a, b) => b[1] - a[1])[0];
    if (topType[1] > 0) {
      const typeNames: Record<string, string> = {
        'color-contrast': '颜色对比度',
        'focus-indicator': '焦点指示器',
        'keyboard-nav': '键盘导航',
        'aria-label': 'ARIA 标签',
        'form-label': '表单标签',
        'heading-order': '标题层级',
      };
      recommendations.push(`${typeNames[topType[0] as keyof typeof typeNames]} 需要重点关注`);
    }

    if (issues.length === 0) {
      recommendations.push('页面完全符合 WCAG 标准，做得很好！');
    }

    return recommendations;
  }
}

export const accessibilityChecker = new AccessibilityChecker();
