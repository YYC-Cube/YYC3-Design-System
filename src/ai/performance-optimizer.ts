/**
 * @file AI 性能优化建议器
 * @description 基于性能指标生成智能优化建议
 * @module ai/performance-optimizer
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

export interface PerformanceMetrics {
  FCP?: number;
  LCP?: number;
  FID?: number;
  CLS?: number;
  TTFB?: number;
  bundleSize?: number;
  renderTime?: number;
  memoryUsage?: number;
  apiLatency?: number;
}

export interface PerformanceIssue {
  type: 'critical' | 'warning' | 'info';
  category: 'loading' | 'rendering' | 'interactivity' | 'resources' | 'bundle' | 'network';
  metric: string;
  currentValue: number;
  targetValue: number;
  impact: 'high' | 'medium' | 'low';
  description: string;
  recommendation: string;
  codeExample?: string;
  estimatedImpact: string;
  effort: 'low' | 'medium' | 'high';
  relatedMetrics?: string[];
}

export interface OptimizationPlan {
  overallScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  issues: PerformanceIssue[];
  quickWins: PerformanceIssue[];
  longTermImprovements: PerformanceIssue[];
  summary: {
    criticalCount: number;
    warningCount: number;
    infoCount: number;
    priorityAreas: string[];
  };
}

const performanceThresholds = {
  FCP: { excellent: 1.8, good: 3, needsImprovement: 5, unit: 's', label: '首次内容绘制' },
  LCP: { excellent: 2.5, good: 4, needsImprovement: 6, unit: 's', label: '最大内容绘制' },
  FID: { excellent: 100, good: 300, needsImprovement: 600, unit: 'ms', label: '首次输入延迟' },
  CLS: { excellent: 0.1, good: 0.25, needsImprovement: 0.4, unit: '', label: '累积布局偏移' },
  TTFB: { excellent: 800, good: 1800, needsImprovement: 3000, unit: 'ms', label: '首字节时间' },
  bundleSize: { excellent: 100, good: 200, needsImprovement: 500, unit: 'KB', label: '包大小' },
  renderTime: { excellent: 16, good: 33, needsImprovement: 50, unit: 'ms', label: '渲染时间' },
  memoryUsage: { excellent: 50, good: 100, needsImprovement: 200, unit: 'MB', label: '内存使用' },
  apiLatency: { excellent: 100, good: 300, needsImprovement: 600, unit: 'ms', label: 'API 延迟' },
} as const;

const generateIssue = (
  metric: keyof typeof performanceThresholds,
  value: number,
  _metrics: PerformanceMetrics
): PerformanceIssue | null => {
  const threshold = performanceThresholds[metric];
  if (!threshold) return null;

  let type: PerformanceIssue['type'] = 'info';
  let impact: PerformanceIssue['impact'] = 'low';
  let category: PerformanceIssue['category'] = 'loading';
  let description = '指标表现正常';
  let recommendation = '继续保持当前策略';
  let codeExample = '';
  let estimatedImpact = '无改进需求';
  let effort: PerformanceIssue['effort'] = 'low';

  const needsImprovement = value > threshold.good;

  switch (metric) {
    case 'FCP':
      category = 'loading';
      effort = 'low';
      if (needsImprovement) {
        type = 'critical';
        impact = 'high';
        description = `首次内容绘制时间为 ${value.toFixed(2)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。用户需要等待较长时间才能看到内容。`;
        recommendation = '使用资源预加载、减少关键资源大小、优化关键渲染路径。';
        codeExample = `
<link rel="preload" href="critical.css" as="style">
<link rel="preload" href="main.js" as="script">
<script>
  document.addEventListener('DOMContentLoaded', () => {
    const criticalContent = document.getElementById('critical');
    if (criticalContent) {
      criticalContent.style.display = 'block';
    }
  });
</script>`;
        estimatedImpact = '可改善 30-50% 的加载体验';
      } else {
        type = 'info';
        impact = 'low';
        description = `首次内容绘制时间为 ${value.toFixed(2)}${threshold.unit}，表现良好。`;
        recommendation = '继续保持当前优化策略，监控变化趋势。';
        estimatedImpact = '无直接改进空间';
      }
      break;

    case 'LCP':
      category = 'loading';
      effort = 'medium';
      if (needsImprovement) {
        type = 'critical';
        impact = 'high';
        description = `最大内容绘制时间为 ${value.toFixed(2)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。页面主要内容的渲染速度较慢。`;
        recommendation = '优化图片（使用 WebP、懒加载）、压缩资源、减少 JavaScript 执行时间、使用 HTTP/2。';
        codeExample = `
<img src="image.webp" loading="lazy" alt="...">
<picture>
  <source srcset="image-400w.webp" media="(max-width: 400px)">
  <source srcset="image-800w.webp" media="(max-width: 800px)">
  <img src="image.webp" alt="...">
</picture>`;
        estimatedImpact = '可改善 40-60% 的页面加载体验';
      } else {
        type = 'info';
        impact = 'low';
        description = `最大内容绘制时间为 ${value.toFixed(2)}${threshold.unit}，表现良好。`;
        recommendation = '监控内容变化对 LCP 的影响。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'FID':
      category = 'interactivity';
      effort = 'low';
      if (needsImprovement) {
        type = 'critical';
        impact = 'high';
        description = `首次输入延迟为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。用户感受到明显的输入延迟。`;
        recommendation = '减少主线程阻塞时间、使用代码分割、优化事件处理函数、使用 Web Workers。';
        codeExample = `
// 使用防抖
const debouncedHandle = debounce(handleInput, 100);

// 使用 requestIdleCallback
requestIdleCallback(() => {
  nonCriticalTask();
});

// 使用 Web Workers
const worker = new Worker('worker.js');
worker.postMessage(data);
`;
        estimatedImpact = '可改善 50-70% 的交互响应性';
      } else {
        type = 'info';
        impact = 'low';
        description = `首次输入延迟为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的事件处理优化策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'CLS':
      category = 'rendering';
      effort = 'medium';
      if (needsImprovement) {
        type = 'warning';
        impact = 'medium';
        description = `累积布局偏移为 ${value.toFixed(3)}，超过推荐值 ${threshold.good}。页面存在明显的布局跳动。`;
        recommendation = '为图片和广告预留空间、避免在现有内容上方插入内容、使用 CSS transform 进行动画。';
        codeExample = `
/* 预留图片空间 */
.image-container {
  min-height: 400px;
  aspect-ratio: 16/9;
}

/* 避免布局偏移 */
.animated-element {
  transform: translateZ(0);
  will-change: transform;
}`;
        estimatedImpact = '可改善 80-90% 的视觉稳定性';
      } else {
        type = 'info';
        impact = 'low';
        description = `累积布局偏移为 ${value.toFixed(3)}，表现良好。`;
        recommendation = '继续保持当前布局稳定性。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'TTFB':
      category = 'network';
      effort = 'high';
      if (needsImprovement) {
        type = 'critical';
        impact = 'high';
        description = `首字节时间为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。服务器响应或网络延迟较慢。`;
        recommendation = '优化服务器响应时间、使用 CDN、启用 HTTP 缓存、优化 DNS 查询、减少重定向。';
        codeExample = `
// HTTP 缓存头
Cache-Control: max-age=31536000, public
ETag: "abc123"

// CDN 配置
<script src="https://cdn.example.com/bundle.js"></script>

// 预连接
<link rel="preconnect" href="https://api.example.com">
<link rel="dns-prefetch" href="https://api.example.com">
`;
        estimatedImpact = '可改善 40-60% 的初始加载时间';
      } else {
        type = 'info';
        impact = 'low';
        description = `首字节时间为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的网络优化策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'bundleSize':
      category = 'bundle';
      effort = 'medium';
      if (needsImprovement) {
        type = 'warning';
        impact = 'medium';
        description = `包大小为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。可能影响加载速度。`;
        recommendation = '使用代码分割、Tree Shaking、压缩资源、移除未使用的依赖。';
        codeExample = `
// Vite 代码分割
const routes = {
  '/': () => import('./views/Home'),
  '/about': () => import('./views/About'),
};

// 动态导入
const heavyComponent = React.lazy(() => import('./HeavyComponent'));

// Tree Shaking
export { usedFunction } from './library';
`;
        estimatedImpact = '可减少 30-50% 的初始加载时间';
      } else {
        type = 'info';
        impact = 'low';
        description = `包大小为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的包优化策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'renderTime':
      category = 'rendering';
      effort = 'medium';
      if (needsImprovement) {
        type = 'warning';
        impact = 'medium';
        description = `渲染时间为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。组件渲染性能需要优化。`;
        recommendation = '使用 React.memo、useMemo、useCallback 优化组件、虚拟化长列表、避免不必要的重新渲染。';
        codeExample = `
// 使用 React.memo
const MemoizedComponent = React.memo(({ data }) => {
  return <div>{data}</div>;
});

// 使用 useMemo
const expensiveValue = useMemo(() => {
  return heavyCalculation(data);
}, [data]);

// 虚拟化长列表
<FixedSizeList
  height={600}
  itemCount={1000}
  itemSize={50}
>
  {Row}
</FixedSizeList>`;
        estimatedImpact = '可改善 40-60% 的渲染性能';
      } else {
        type = 'info';
        impact = 'low';
        description = `渲染时间为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的渲染优化策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'memoryUsage':
      category = 'resources';
      effort = 'high';
      if (needsImprovement) {
        type = 'warning';
        impact = 'medium';
        description = `内存使用为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。可能存在内存泄漏或过度分配。`;
        recommendation = '检查内存泄漏、使用对象池、优化大数据结构、及时清理不再使用的引用。';
        codeExample = `
// 清理不再使用的引用
useEffect(() => {
  return () => {
    dataRef.current = null;
    largeArray.length = 0;
  };
}, []);

// 使用 WeakMap 避免内存泄漏
const cache = new WeakMap();

// 优化数据结构
const optimizedSet = new Set(items);
`;
        estimatedImpact = '可改善 30-50% 的内存使用效率';
      } else {
        type = 'info';
        impact = 'low';
        description = `内存使用为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的内存管理策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    case 'apiLatency':
      category = 'network';
      effort = 'high';
      if (needsImprovement) {
        type = 'warning';
        impact = 'medium';
        description = `API 延迟为 ${value.toFixed(0)}${threshold.unit}，超过推荐值 ${threshold.good}${threshold.unit}。网络请求响应较慢。`;
        recommendation = '优化 API 查询、使用缓存策略、实施批量请求、优化数据库查询。';
        codeExample = `
// 使用缓存
const cache = new Map();
async function fetchData(id) {
  if (cache.has(id)) {
    return cache.get(id);
  }
  const data = await api.get(\`/data/\${id}\`);
  cache.set(id, data);
  return data;
}

// 批量请求
const batchData = await Promise.all([
  api.get('/data/1'),
  api.get('/data/2'),
  api.get('/data/3'),
]);
`;
        estimatedImpact = '可改善 40-60% 的数据加载速度';
      } else {
        type = 'info';
        impact = 'low';
        description = `API 延迟为 ${value.toFixed(0)}${threshold.unit}，表现良好。`;
        recommendation = '保持当前的 API 优化策略。';
        estimatedImpact = '保持当前水平';
      }
      break;

    default:
      return null;
  }

  return {
    type,
    category,
    metric: threshold.label,
    currentValue: value,
    targetValue: threshold.good,
    impact,
    description,
    recommendation,
    codeExample,
    estimatedImpact,
    effort,
    relatedMetrics: [],
  };
};

export class PerformanceOptimizer {
  generateOptimizationPlan(metrics: PerformanceMetrics): OptimizationPlan {
    const issues: PerformanceIssue[] = [];

    Object.entries(metrics).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        const issue = generateIssue(key as keyof typeof performanceThresholds, value, metrics);
        if (issue) {
          issues.push(issue);
        }
      }
    });

    const criticalIssues = issues.filter((i) => i.type === 'critical');
    const warningIssues = issues.filter((i) => i.type === 'warning');
    const infoIssues = issues.filter((i) => i.type === 'info');

    const quickWins = issues
      .filter((i) => i.effort === 'low' && i.type !== 'info')
      .sort((a, b) => b.impact === 'high' ? 1 : -1);

    const longTermImprovements = issues
      .filter((i) => i.effort === 'high' || i.effort === 'medium')
      .sort((a, b) => {
        const impactOrder = { high: 3, medium: 2, low: 1 };
        return impactOrder[b.impact] - impactOrder[a.impact];
      });

    const overallScore = this.calculateOverallScore(issues);

    return {
      overallScore,
      grade: this.calculateGrade(overallScore),
      issues: issues,
      quickWins,
      longTermImprovements,
      summary: {
        criticalCount: criticalIssues.length,
        warningCount: warningIssues.length,
        infoCount: infoIssues.length,
        priorityAreas: this.identifyPriorityAreas(issues),
      },
    };
  }

  private calculateOverallScore(issues: PerformanceIssue[]): number {
    if (issues.length === 0) return 100;

    let totalScore = 0;
    let weightSum = 0;

    issues.forEach((issue) => {
      const weight = issue.type === 'critical' ? 3 : issue.type === 'warning' ? 2 : 1;
      const severityMultiplier = issue.impact === 'high' ? 1.5 : issue.impact === 'medium' ? 1 : 0.5;
      totalScore += (100 - (weight * 20)) * severityMultiplier;
      weightSum += weight;
    });

    return Math.max(0, Math.min(100, 100 - (totalScore / weightSum)));
  }

  private calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  }

  private identifyPriorityAreas(issues: PerformanceIssue[]): string[] {
    const categoryCount = issues.reduce((acc, issue) => {
      acc[issue.category] = (acc[issue.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const sortedCategories = Object.entries(categoryCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3)
      .map(([category]) => {
        const categoryNames = {
          loading: '加载性能',
          rendering: '渲染性能',
          interactivity: '交互响应',
          resources: '资源使用',
          bundle: '打包优化',
          network: '网络优化',
        };
        return categoryNames[category as keyof typeof categoryNames] || category;
      });

    return sortedCategories;
  }

  getMetricScore(value: number | undefined, metric: keyof typeof performanceThresholds): number {
    if (value === undefined) return 0;

    const threshold = performanceThresholds[metric];
    if (!threshold) return 0;

    if (value <= threshold.excellent) return 100;
    if (value <= threshold.good) return 85;
    if (value <= threshold.needsImprovement) return 60;
    return 40;
  }

  getMetricGrade(value: number | undefined, metric: keyof typeof performanceThresholds): 'excellent' | 'good' | 'needs improvement' | 'critical' {
    if (value === undefined) return 'needs improvement';

    const threshold = performanceThresholds[metric];
    if (!threshold) return 'needs improvement';

    if (value <= threshold.excellent) return 'excellent';
    if (value <= threshold.good) return 'good';
    if (value <= threshold.needsImprovement) return 'needs improvement';
    return 'critical';
  }
}

export const performanceOptimizer = new PerformanceOptimizer();
