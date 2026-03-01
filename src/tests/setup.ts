/**
 * @file YYC³ Design System — Jest Setup
 * @description Jest 测试环境配置：jest-dom + jest-axe
 * @module tests
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import '@testing-library/jest-dom';

try {
  const { toHaveNoViolations } = require('jest-axe');
  expect.extend({ toHaveNoViolations });
} catch (e) {
  console.warn('jest-axe matcher not available:', e);
}
