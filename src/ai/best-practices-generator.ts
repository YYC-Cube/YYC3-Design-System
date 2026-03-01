/**
 * @file 最佳实践建议生成器
 * @description 基于设计令牌分析和行业最佳实践生成建议
 * @module ai/best-practices-generator
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { ConsistencyReport } from './consistency-checker';
import { UsageReport } from './usage-analyzer';

export interface BestPractice {
  id: string;
  category:
    | 'color'
    | 'spacing'
    | 'typography'
    | 'accessibility'
    | 'performance'
    | 'maintainability';
  priority: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  rationale: string;
  implementation: string;
  examples?: string[];
  resources?: string[];
}

export interface BestPracticesReport {
  summary: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  practices: BestPractice[];
  quickWins: BestPractice[];
  longTermGoals: BestPractice[];
}

export class BestPracticesGenerator {
  private colorBestPractices: BestPractice[] = [
    {
      id: 'color-001',
      category: 'color',
      priority: 'critical',
      title: '使用语义化颜色命名',
      description: '使用描述性名称而非具体颜色值，如 primary、secondary、success 等',
      rationale: '语义化命名使设计系统更易于理解和维护，支持主题切换',
      implementation:
        '定义语义化令牌：color.primary、color.secondary、color.success、color.warning、color.error',
      examples: ['✓ color.primary = #d45a5f', '✗ color.red = #d45a5f'],
    },
    {
      id: 'color-002',
      category: 'color',
      priority: 'high',
      title: '确保颜色对比度符合 WCAG 标准',
      description: '文本与背景的对比度至少达到 4.5:1（AA 级）或 7:1（AAA 级）',
      rationale: '确保所有用户，包括视觉障碍用户，都能清晰阅读内容',
      implementation: '使用对比度检查工具验证所有文本颜色组合',
      resources: ['https://www.w3.org/WAI/WCAG21/quickref/?contrastminimum'],
    },
    {
      id: 'color-003',
      category: 'color',
      priority: 'medium',
      title: '建立颜色调色板',
      description: '为每个语义化颜色创建完整的调色板（50-900）',
      rationale: '提供灵活的颜色变体，支持不同的 UI 场景',
      implementation: '为每个主色创建 9 个变体：50, 100, 200, 300, 400, 500, 600, 700, 800, 900',
      examples: [
        'color.primary-50 到 color.primary-900',
        'color.secondary-50 到 color.secondary-900',
      ],
    },
  ];

  private spacingBestPractices: BestPractice[] = [
    {
      id: 'spacing-001',
      category: 'spacing',
      priority: 'critical',
      title: '使用一致的间距比例',
      description: '基于 4px 或 8px 基础单位创建间距系统',
      rationale: '一致的间距创造视觉韵律，提高设计一致性',
      implementation: '使用 4px 倍数：4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 96px',
      examples: [
        'spacing.1 = 4px',
        'spacing.2 = 8px',
        'spacing.3 = 12px',
        'spacing.4 = 16px',
        'spacing.6 = 24px',
        'spacing.8 = 32px',
      ],
    },
    {
      id: 'spacing-002',
      category: 'spacing',
      priority: 'high',
      title: '限制间距令牌数量',
      description: '保持 8-12 个间距令牌，避免过度复杂',
      rationale: '过多的选项会增加决策负担，降低一致性',
      implementation: '定义核心间距令牌：spacing.1 到 spacing.8',
    },
  ];

  private typographyBestPractices: BestPractice[] = [
    {
      id: 'typography-001',
      category: 'typography',
      priority: 'critical',
      title: '使用模块化比例',
      description: '基于数学比例（如 1.2 或 1.25）创建字体大小系统',
      rationale: '模块化比例创造视觉和谐，提高可读性',
      implementation: '使用 1.25 比例：12px, 15px, 18.75px, 23.44px, 29.3px, 36.62px',
      examples: [
        'font-size.xs = 12px',
        'font-size.sm = 14px',
        'font-size.base = 16px',
        'font-size.lg = 18px',
        'font-size.xl = 20px',
        'font-size.2xl = 24px',
        'font-size.3xl = 30px',
        'font-size.4xl = 36px',
      ],
    },
    {
      id: 'typography-002',
      category: 'typography',
      priority: 'high',
      title: '设置合理的行高',
      description: '行高应为字体大小的 1.2-1.6 倍',
      rationale: '适当的行高提高可读性和视觉舒适度',
      implementation: '根据字体大小设置行高：base=1.5, lg=1.4, xl=1.3',
      examples: [
        'line-height.tight = 1.25',
        'line-height.normal = 1.5',
        'line-height.relaxed = 1.75',
      ],
    },
  ];

  private accessibilityBestPractices: BestPractice[] = [
    {
      id: 'accessibility-001',
      category: 'accessibility',
      priority: 'critical',
      title: '支持键盘导航',
      description: '确保所有交互元素都可以通过键盘访问',
      rationale: '键盘导航对运动障碍用户至关重要',
      implementation: '为所有交互元素添加 focus 状态和键盘事件处理',
    },
    {
      id: 'accessibility-002',
      category: 'accessibility',
      priority: 'high',
      title: '提供 ARIA 标签',
      description: '为交互元素添加适当的 ARIA 属性',
      rationale: 'ARIA 标签帮助屏幕阅读器理解 UI 结构',
      implementation: '使用 aria-label、aria-describedby、aria-expanded 等属性',
    },
  ];

  private performanceBestPractices: BestPractice[] = [
    {
      id: 'performance-001',
      category: 'performance',
      priority: 'high',
      title: '优化 CSS 生成',
      description: '只生成实际使用的令牌，减少 CSS 文件大小',
      rationale: '较小的 CSS 文件提高加载速度',
      implementation: '使用 tree-shaking 和按需加载',
    },
    {
      id: 'performance-002',
      category: 'performance',
      priority: 'medium',
      title: '使用 CSS 变量',
      description: '将令牌转换为 CSS 自定义属性',
      rationale: 'CSS 变量支持动态主题切换，减少 JavaScript 开销',
      implementation: '使用 style-dictionary 生成 CSS 变量',
    },
  ];

  private maintainabilityBestPractices: BestPractice[] = [
    {
      id: 'maintainability-001',
      category: 'maintainability',
      priority: 'critical',
      title: '使用单一数据源',
      description: '令牌定义应存储在单一位置，避免重复',
      rationale: '单一数据源确保一致性，减少维护成本',
      implementation: '使用 JSON 或 YAML 文件存储令牌定义',
    },
    {
      id: 'maintainability-002',
      category: 'maintainability',
      priority: 'high',
      title: '版本控制令牌',
      description: '使用语义化版本管理令牌变更',
      rationale: '版本控制帮助追踪变更和回滚',
      implementation: '遵循 SemVer 规范：MAJOR.MINOR.PATCH',
    },
    {
      id: 'maintainability-003',
      category: 'maintainability',
      priority: 'medium',
      title: '编写令牌文档',
      description: '为每个令牌提供清晰的文档和示例',
      rationale: '文档帮助团队成员正确使用令牌',
      implementation: '使用 JSDoc 或类似工具生成文档',
    },
  ];

  generateRecommendations(
    consistencyReport?: ConsistencyReport,
    usageReport?: UsageReport
  ): BestPracticesReport {
    let practices = [
      ...this.colorBestPractices,
      ...this.spacingBestPractices,
      ...this.typographyBestPractices,
      ...this.accessibilityBestPractices,
      ...this.performanceBestPractices,
      ...this.maintainabilityBestPractices,
    ];

    if (consistencyReport) {
      practices = this.prioritizeBasedOnConsistency(practices, consistencyReport);
    }

    if (usageReport) {
      practices = this.prioritizeBasedOnUsage(practices, usageReport);
    }

    const summary = this.calculateSummary(practices);
    const quickWins = practices.filter((p) => p.priority === 'critical' || p.priority === 'high');
    const longTermGoals = practices.filter((p) => p.priority === 'medium' || p.priority === 'low');

    return {
      summary,
      practices,
      quickWins,
      longTermGoals,
    };
  }

  private prioritizeBasedOnConsistency(
    practices: BestPractice[],
    report: ConsistencyReport
  ): BestPractice[] {
    const prioritized = [...practices];

    if (report.categories.color.score < 80) {
      prioritized.forEach((p) => {
        if (p.category === 'color' && p.priority !== 'critical') {
          p.priority = 'high';
        }
      });
    }

    if (report.categories.accessibility.score < 80) {
      prioritized.forEach((p) => {
        if (p.category === 'accessibility' && p.priority !== 'critical') {
          p.priority = 'high';
        }
      });
    }

    return prioritized;
  }

  private prioritizeBasedOnUsage(practices: BestPractice[], report: UsageReport): BestPractice[] {
    const prioritized = [...practices];

    if (report.summary.coverage < 60) {
      prioritized.forEach((p) => {
        if (p.category === 'maintainability' && p.priority !== 'critical') {
          p.priority = 'high';
        }
      });
    }

    return prioritized;
  }

  private calculateSummary(practices: BestPractice[]) {
    return {
      total: practices.length,
      critical: practices.filter((p) => p.priority === 'critical').length,
      high: practices.filter((p) => p.priority === 'high').length,
      medium: practices.filter((p) => p.priority === 'medium').length,
      low: practices.filter((p) => p.priority === 'low').length,
    };
  }

  getPracticesByCategory(category: BestPractice['category']): BestPractice[] {
    const allPractices = [
      ...this.colorBestPractices,
      ...this.spacingBestPractices,
      ...this.typographyBestPractices,
      ...this.accessibilityBestPractices,
      ...this.performanceBestPractices,
      ...this.maintainabilityBestPractices,
    ];

    return allPractices.filter((p) => p.category === category);
  }

  getPracticesByPriority(priority: BestPractice['priority']): BestPractice[] {
    const allPractices = [
      ...this.colorBestPractices,
      ...this.spacingBestPractices,
      ...this.typographyBestPractices,
      ...this.accessibilityBestPractices,
      ...this.performanceBestPractices,
      ...this.maintainabilityBestPractices,
    ];

    return allPractices.filter((p) => p.priority === priority);
  }

  searchPractices(query: string): BestPractice[] {
    const allPractices = [
      ...this.colorBestPractices,
      ...this.spacingBestPractices,
      ...this.typographyBestPractices,
      ...this.accessibilityBestPractices,
      ...this.performanceBestPractices,
      ...this.maintainabilityBestPractices,
    ];

    const lowerQuery = query.toLowerCase();
    return allPractices.filter(
      (p) =>
        p.title.toLowerCase().includes(lowerQuery) ||
        p.description.toLowerCase().includes(lowerQuery) ||
        p.category.toLowerCase().includes(lowerQuery)
    );
  }
}

export const bestPracticesGenerator = new BestPracticesGenerator();
