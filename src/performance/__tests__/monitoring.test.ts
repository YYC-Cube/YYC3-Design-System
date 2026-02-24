/**
 * @file 性能监控测试
 * @description 测试性能监控相关的工具函数和组件
 * @module __tests__/performance/monitoring.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import { renderHook, act } from '@testing-library/react';
import {
  initPerformanceMonitoring,
  getPerformanceMetrics,
  destroyPerformanceMonitoring,
} from '../index';

describe('性能监控测试', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    destroyPerformanceMonitoring();
  });

  describe('性能监控初始化', () => {
    it('应该正确初始化性能监控', () => {
      initPerformanceMonitoring();

      expect(getPerformanceMetrics()).toBeDefined();
    });

    it('应该获取性能指标', () => {
      initPerformanceMonitoring();

      const metrics = getPerformanceMetrics();

      expect(typeof metrics).toBe('object');
    });

    it('应该正确销毁性能监控', () => {
      initPerformanceMonitoring();
      
      expect(() => {
        destroyPerformanceMonitoring();
      }).not.toThrow();
    });
  });

  describe('性能指标收集', () => {
    it('应该返回空对象当监控未初始化时', () => {
      const metrics = getPerformanceMetrics();

      expect(metrics).toEqual({});
    });
  });
});
