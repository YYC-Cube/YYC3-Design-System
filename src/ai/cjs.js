/**
 * @file AI 模块 CommonJS 导出
 * @description 导出所有 AI 相关功能（CommonJS 版本）
 * @module ai/cjs
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

const { AITokenGenerator } = require('./token-generator');
const { ColorRecommender } = require('./color-recommender');
const { ConsistencyChecker } = require('./consistency-checker');
const { UsageAnalyzer } = require('./usage-analyzer');
const { BestPracticesGenerator } = require('./best-practices-generator');

module.exports = {
  AITokenGenerator,
  tokenGenerator: new AITokenGenerator(),
  ColorRecommender,
  colorRecommender: new ColorRecommender(),
  ConsistencyChecker,
  consistencyChecker: new ConsistencyChecker(),
  UsageAnalyzer,
  usageAnalyzer: new UsageAnalyzer(),
  BestPracticesGenerator,
  bestPracticesGenerator: new BestPracticesGenerator(),
};
