/**
 * @file 性能监控和告警规范
 * @description YYC³ 设计系统性能监控和告警规范，确保系统性能达标
 * @module docs/performance-monitoring
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 * @updated 2026-02-18
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

# YYC³ 设计系统性能监控和告警规范

> ***YanYuCloudCube***
> *言启象限 | 语枢未来*
> ***Words Initiate Quadrants, Language Serves as Core for the Future***
> *万象归元于云枢 | 深栈智启新纪元*
> ***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***

---

**创建日期**：2026-02-18
**作者**：YYC³ Team
**版本**：1.0.0
**更新日期**：2026-02-18

---

## 概述

本规范基于 YYC³ 团队「五高五标五化」核心要求，为设计系统性能监控和告警提供统一标准，确保系统性能达标。

## 核心原则

### 五高原则

#### 高可用
- 实时性能监控
- 自动故障检测
- 优雅降级策略
- 快速恢复机制

#### 高性能
- 低开销监控
- 异步数据收集
- 智能采样策略
- 高效数据传输

#### 高安全
- 数据加密传输
- 访问权限控制
- 敏感数据脱敏
- 安全审计日志

#### 高扩展
- 可插拔监控器
- 自定义指标支持
- 多数据源集成
- 灵活的告警规则

#### 高可维护
- 清晰的指标定义
- 完整的文档说明
- 标准化的告警格式
- 易于配置和管理

## 性能指标

### 核心性能指标

#### 首次内容绘制 (FCP)
```typescript
// src/utils/performance.ts
export function measureFCP(): Promise<number> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fcpEntry = entries.find(
          (entry) => entry.name === 'first-contentful-paint'
        );
        
        if (fcpEntry) {
          observer.disconnect();
          resolve(fcpEntry.startTime);
        }
      });
      
      observer.observe({ type: 'paint', buffered: true });
    } else {
      resolve(0);
    }
  });
}

// 目标：< 1.5秒
export const FCP_THRESHOLD = 1500;
```

#### 最大内容绘制 (LCP)
```typescript
export function measureLCP(): Promise<number> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lcpEntry = entries[entries.length - 1];
        
        observer.disconnect();
        resolve(lcpEntry.startTime);
      });
      
      observer.observe({ type: 'largest-contentful-paint', buffered: true });
    } else {
      resolve(0);
    }
  });
}

// 目标：< 2.5秒
export const LCP_THRESHOLD = 2500;
```

#### 首次输入延迟 (FID)
```typescript
export function measureFID(): Promise<number> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const fidEntry = entries[0];
        
        observer.disconnect();
        resolve(fidEntry.processingStart - fidEntry.startTime);
      });
      
      observer.observe({ type: 'first-input', buffered: true });
    } else {
      resolve(0);
    }
  });
}

// 目标：< 100毫秒
export const FID_THRESHOLD = 100;
```

#### 累积布局偏移 (CLS)
```typescript
export function measureCLS(): Promise<number> {
  return new Promise((resolve) => {
    if ('PerformanceObserver' in window) {
      let clsValue = 0;
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) {
            const value = entry.value;
            clsValue += value;
          }
        }
        
        observer.disconnect();
        resolve(clsValue);
      });
      
      observer.observe({ type: 'layout-shift', buffered: true });
    } else {
      resolve(0);
    }
  });
}

// 目标：< 0.1
export const CLS_THRESHOLD = 0.1;
```

#### 首次字节时间 (TTFB)
```typescript
export function measureTTFB(): Promise<number> {
  return new Promise((resolve) => {
    if ('performance' in window && 'timing' in performance) {
      const timing = performance.timing;
      const ttfb = timing.responseStart - timing.navigationStart;
      resolve(ttfb);
    } else {
      resolve(0);
    }
  });
}

// 目标：< 800毫秒
export const TTFB_THRESHOLD = 800;
```

### 自定义性能指标

#### 组件渲染时间
```typescript
export function measureComponentRender(
  componentName: string,
  renderFn: () => void
): number {
  const startTime = performance.now();
  renderFn();
  const endTime = performance.now();
  
  const renderTime = endTime - startTime;
  
  // 上报到监控系统
  reportMetric('component.render', {
    component: componentName,
    duration: renderTime
  });
  
  return renderTime;
}
```

#### API 响应时间
```typescript
export async function measureAPICall<T>(
  apiName: string,
  apiCall: () => Promise<T>
): Promise<T> {
  const startTime = performance.now();
  
  try {
    const result = await apiCall();
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 上报到监控系统
    reportMetric('api.response', {
      api: apiName,
      duration,
      status: 'success'
    });
    
    return result;
  } catch (error) {
    const endTime = performance.now();
    const duration = endTime - startTime;
    
    // 上报到监控系统
    reportMetric('api.response', {
      api: apiName,
      duration,
      status: 'error',
      error: error.message
    });
    
    throw error;
  }
}
```

## 监控系统

### 性能监控器

```typescript
// src/monitoring/PerformanceMonitor.ts
interface PerformanceMetrics {
  fcp?: number;
  lcp?: number;
  fid?: number;
  cls?: number;
  ttfb?: number;
}

interface PerformanceReport {
  timestamp: number;
  url: string;
  metrics: PerformanceMetrics;
  deviceInfo: DeviceInfo;
}

interface DeviceInfo {
  userAgent: string;
  platform: string;
  language: string;
  screenResolution: string;
  viewportSize: string;
  connectionType?: string;
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

export class PerformanceMonitor {
  private metrics: PerformanceMetrics = {};
  private deviceInfo: DeviceInfo;
  private reportInterval: number = 5 * 60 * 1000; // 5 分钟
  private reportTimer?: NodeJS.Timeout;

  constructor() {
    this.deviceInfo = this.collectDeviceInfo();
    this.init();
  }

  private collectDeviceInfo(): DeviceInfo {
    const connection = (navigator as any).connection;
    
    return {
      userAgent: navigator.userAgent,
      platform: navigator.platform,
      language: navigator.language,
      screenResolution: `${window.screen.width}x${window.screen.height}`,
      viewportSize: `${window.innerWidth}x${window.innerHeight}`,
      connectionType: connection?.effectiveType,
      deviceMemory: (navigator as any).deviceMemory,
      hardwareConcurrency: navigator.hardwareConcurrency
    };
  }

  private async init(): Promise<void> {
    // 收集核心性能指标
    this.metrics.fcp = await measureFCP();
    this.metrics.lcp = await measureLCP();
    this.metrics.fid = await measureFID();
    this.metrics.cls = await measureCLS();
    this.metrics.ttfb = await measureTTFB();

    // 设置定期上报
    this.startReporting();

    // 页面卸载时上报
    window.addEventListener('beforeunload', () => {
      this.report();
    });
  }

  private startReporting(): void {
    this.reportTimer = setInterval(() => {
      this.report();
    }, this.reportInterval);
  }

  private stopReporting(): void {
    if (this.reportTimer) {
      clearInterval(this.reportTimer);
      this.reportTimer = undefined;
    }
  }

  private report(): void {
    const report: PerformanceReport = {
      timestamp: Date.now(),
      url: window.location.href,
      metrics: this.metrics,
      deviceInfo: this.deviceInfo
    };

    // 发送到监控服务
    this.sendReport(report);
  }

  private async sendReport(report: PerformanceReport): Promise<void> {
    try {
      await fetch('/api/monitoring/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Failed to send performance report:', error);
    }
  }

  public destroy(): void {
    this.stopReporting();
    this.report();
  }
}

// 使用示例
let performanceMonitor: PerformanceMonitor;

export function initPerformanceMonitoring(): void {
  if (typeof window !== 'undefined') {
    performanceMonitor = new PerformanceMonitor();
  }
}

export function destroyPerformanceMonitoring(): void {
  if (performanceMonitor) {
    performanceMonitor.destroy();
  }
}
```

### 自定义指标监控

```typescript
// src/monitoring/MetricsCollector.ts
export class MetricsCollector {
  private metrics: Map<string, number[]> = new Map();
  private flushInterval: number = 60 * 1000; // 1 分钟
  private flushTimer?: NodeJS.Timeout;

  constructor() {
    this.startFlushing();
  }

  public recordMetric(name: string, value: number): void {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    const values = this.metrics.get(name)!;
    values.push(value);
    
    // 限制每个指标的样本数量
    if (values.length > 1000) {
      values.shift();
    }
  }

  private startFlushing(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.flushInterval);
  }

  private stopFlushing(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = undefined;
    }
  }

  private flush(): void {
    const report: Record<string, any> = {};
    
    for (const [name, values] of this.metrics.entries()) {
      if (values.length === 0) continue;
      
      report[name] = {
        count: values.length,
        min: Math.min(...values),
        max: Math.max(...values),
        avg: values.reduce((sum, val) => sum + val, 0) / values.length,
        p50: this.percentile(values, 50),
        p95: this.percentile(values, 95),
        p99: this.percentile(values, 99)
      };
      
      // 清空已上报的数据
      values.length = 0;
    }

    if (Object.keys(report).length > 0) {
      this.sendReport(report);
    }
  }

  private percentile(values: number[], p: number): number {
    const sorted = [...values].sort((a, b) => a - b);
    const index = Math.ceil((p / 100) * sorted.length) - 1;
    return sorted[index];
  }

  private async sendReport(report: Record<string, any>): Promise<void> {
    try {
      await fetch('/api/monitoring/metrics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(report)
      });
    } catch (error) {
      console.error('Failed to send metrics report:', error);
    }
  }

  public destroy(): void {
    this.stopFlushing();
    this.flush();
  }
}

// 使用示例
let metricsCollector: MetricsCollector;

export function initMetricsCollection(): void {
  if (typeof window !== 'undefined') {
    metricsCollector = new MetricsCollector();
  }
}

export function recordMetric(name: string, value: number): void {
  if (metricsCollector) {
    metricsCollector.recordMetric(name, value);
  }
}

export function destroyMetricsCollection(): void {
  if (metricsCollector) {
    metricsCollector.destroy();
  }
}
```

## 告警系统

### 告警规则

```typescript
// src/monitoring/AlertManager.ts
interface AlertRule {
  id: string;
  name: string;
  metric: string;
  condition: 'gt' | 'lt' | 'eq' | 'ne';
  threshold: number;
  duration: number; // 持续时间（毫秒）
  severity: 'info' | 'warning' | 'error' | 'critical';
  enabled: boolean;
}

interface Alert {
  id: string;
  ruleId: string;
  metric: string;
  value: number;
  threshold: number;
  severity: string;
  timestamp: number;
  message: string;
}

export class AlertManager {
  private rules: Map<string, AlertRule> = new Map();
  private activeAlerts: Map<string, Alert> = new Map();
  private checkInterval: number = 60 * 1000; // 1 分钟
  private checkTimer?: NodeJS.Timeout;

  constructor() {
    this.initDefaultRules();
    this.startChecking();
  }

  private initDefaultRules(): void {
    const defaultRules: AlertRule[] = [
      {
        id: 'fcp-slow',
        name: 'FCP 过慢',
        metric: 'fcp',
        condition: 'gt',
        threshold: 1500,
        duration: 5 * 60 * 1000,
        severity: 'warning',
        enabled: true
      },
      {
        id: 'lcp-slow',
        name: 'LCP 过慢',
        metric: 'lcp',
        condition: 'gt',
        threshold: 2500,
        duration: 5 * 60 * 1000,
        severity: 'warning',
        enabled: true
      },
      {
        id: 'fid-slow',
        name: 'FID 过慢',
        metric: 'fid',
        condition: 'gt',
        threshold: 100,
        duration: 5 * 60 * 1000,
        severity: 'warning',
        enabled: true
      },
      {
        id: 'cls-high',
        name: 'CLS 过高',
        metric: 'cls',
        condition: 'gt',
        threshold: 0.1,
        duration: 5 * 60 * 1000,
        severity: 'warning',
        enabled: true
      },
      {
        id: 'ttfb-slow',
        name: 'TTFB 过慢',
        metric: 'ttfb',
        condition: 'gt',
        threshold: 800,
        duration: 5 * 60 * 1000,
        severity: 'warning',
        enabled: true
      }
    ];

    defaultRules.forEach(rule => {
      this.rules.set(rule.id, rule);
    });
  }

  public addRule(rule: AlertRule): void {
    this.rules.set(rule.id, rule);
  }

  public removeRule(ruleId: string): void {
    this.rules.delete(ruleId);
  }

  public updateRule(ruleId: string, updates: Partial<AlertRule>): void {
    const rule = this.rules.get(ruleId);
    if (rule) {
      this.rules.set(ruleId, { ...rule, ...updates });
    }
  }

  private startChecking(): void {
    this.checkTimer = setInterval(() => {
      this.checkRules();
    }, this.checkInterval);
  }

  private stopChecking(): void {
    if (this.checkTimer) {
      clearInterval(this.checkTimer);
      this.checkTimer = undefined;
    }
  }

  private async checkRules(): Promise<void> {
    for (const rule of this.rules.values()) {
      if (!rule.enabled) continue;

      const value = await this.getMetricValue(rule.metric);
      if (value === undefined) continue;

      const isViolated = this.checkCondition(value, rule);
      
      if (isViolated) {
        this.triggerAlert(rule, value);
      } else {
        this.resolveAlert(rule.id);
      }
    }
  }

  private checkCondition(value: number, rule: AlertRule): boolean {
    switch (rule.condition) {
      case 'gt':
        return value > rule.threshold;
      case 'lt':
        return value < rule.threshold;
      case 'eq':
        return value === rule.threshold;
      case 'ne':
        return value !== rule.threshold;
      default:
        return false;
    }
  }

  private async getMetricValue(metric: string): Promise<number | undefined> {
    // 从监控系统获取指标值
    try {
      const response = await fetch(`/api/monitoring/metrics/${metric}`);
      const data = await response.json();
      return data.value;
    } catch {
      return undefined;
    }
  }

  private triggerAlert(rule: AlertRule, value: number): void {
    const alert: Alert = {
      id: `${rule.id}-${Date.now()}`,
      ruleId: rule.id,
      metric: rule.metric,
      value,
      threshold: rule.threshold,
      severity: rule.severity,
      timestamp: Date.now(),
      message: `${rule.name}: ${value} ${rule.condition} ${rule.threshold}`
    };

    this.activeAlerts.set(rule.id, alert);
    this.sendAlert(alert);
  }

  private resolveAlert(ruleId: string): void {
    const alert = this.activeAlerts.get(ruleId);
    if (alert) {
      this.activeAlerts.delete(ruleId);
      this.sendResolution(alert);
    }
  }

  private async sendAlert(alert: Alert): Promise<void> {
    try {
      await fetch('/api/monitoring/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(alert)
      });

      // 发送通知
      this.sendNotification(alert);
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  private async sendResolution(alert: Alert): Promise<void> {
    try {
      await fetch('/api/monitoring/alerts/resolve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          alertId: alert.id,
          resolvedAt: Date.now()
        });
      });
    } catch (error) {
      console.error('Failed to send resolution:', error);
    }
  }

  private sendNotification(alert: Alert): void {
    // 根据严重程度发送不同通知
    switch (alert.severity) {
      case 'critical':
        this.sendCriticalNotification(alert);
        break;
      case 'error':
        this.sendErrorNotification(alert);
        break;
      case 'warning':
        this.sendWarningNotification(alert);
        break;
      case 'info':
        this.sendInfoNotification(alert);
        break;
    }
  }

  private sendCriticalNotification(alert: Alert): void {
    // 发送短信、电话等紧急通知
    console.error('CRITICAL ALERT:', alert.message);
  }

  private sendErrorNotification(alert: Alert): void {
    // 发送邮件、Slack 等通知
    console.error('ERROR ALERT:', alert.message);
  }

  private sendWarningNotification(alert: Alert): void {
    // 发送邮件、Slack 等通知
    console.warn('WARNING ALERT:', alert.message);
  }

  private sendInfoNotification(alert: Alert): void {
    // 发送日志等通知
    console.info('INFO ALERT:', alert.message);
  }

  public destroy(): void {
    this.stopChecking();
  }
}

// 使用示例
let alertManager: AlertManager;

export function initAlertManager(): void {
  if (typeof window !== 'undefined') {
    alertManager = new AlertManager();
  }
}

export function destroyAlertManager(): void {
  if (alertManager) {
    alertManager.destroy();
  }
}
```

## 最佳实践

### 1. 监控策略
- 定义清晰的性能目标
- 选择关键性能指标
- 设置合理的告警阈值
- 定期审查和优化

### 2. 数据收集
- 使用智能采样策略
- 保护用户隐私
- 优化数据传输
- 实现数据压缩

### 3. 告警管理
- 设置合理的告警级别
- 避免告警疲劳
- 提供清晰的告警信息
- 实现告警升级机制

### 4. 性能优化
- 基于监控数据优化
- 持续性能测试
- 实施性能预算
- 定期性能审计

### 5. 团队协作
- 共享性能数据
- 建立性能文化
- 定期性能复盘
- 持续改进流程

## 参考资源

- [Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance)
- [RUM 监控](https://web.dev/rum/)
- [YYC³ 标准规范](https://github.com/yyc3/standards)

---

<div align="center">

> 「***YanYuCloudCube***」
> 「***<admin@0379.email>***」
> 「***Words Initiate Quadrants, Language Serves as Core for the Future***」
> 「***All things converge in the cloud pivot; Deep stacks ignite a new era of intelligence***」

*文档最后更新：2026-02-18*

</div>
