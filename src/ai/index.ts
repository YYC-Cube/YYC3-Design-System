/**
 * @file AI 模块导出
 * @description 导出所有 AI 相关功能
 * @module ai
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

export { AITokenGenerator, tokenGenerator } from './token-generator';
export { ColorRecommender, colorRecommender } from './color-recommender';
export { ConsistencyChecker, consistencyChecker } from './consistency-checker';
export { UsageAnalyzer, usageAnalyzer } from './usage-analyzer';
export { BestPracticesGenerator, bestPracticesGenerator } from './best-practices-generator';
export { ComponentRecommender, componentRecommender } from './component-recommender';
export { PerformanceOptimizer, performanceOptimizer } from './performance-optimizer';
export type { TokenGenerationOptions, ColorHarmony } from './token-generator';
export type { GeneratedTokens, GeneratedColorToken } from '../../types/tokens';
export type { ColorScheme, ColorRecommendationOptions } from './color-recommender';
export type { ConsistencyIssue, ConsistencyReport } from './consistency-checker';
export type { TokenUsage, UsagePattern, UsageReport } from './usage-analyzer';
export type { BestPractice, BestPracticesReport } from './best-practices-generator';
export type { ComponentType, UIRequirement, ComponentRecommendation, RecommendationOptions } from './component-recommender';
export type { PerformanceMetrics, PerformanceIssue, OptimizationPlan } from './performance-optimizer';
