/**
 * @file YYC³ Design System — Jest Setup
 * @description Jest 测试环境配置：jest-dom + jest-axe
 * @module tests
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-27
 */

import '@testing-library/jest-dom';

// Mock ResizeObserver for Radix UI components
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

// jest-axe for accessibility testing
if (typeof require !== 'undefined') {
  try {
    const jestAxe = require('jest-axe');
    if (jestAxe && jestAxe.toHaveNoViolations) {
      expect.extend({ toHaveNoViolations: jestAxe.toHaveNoViolations });
    }
  } catch (e) {
    // jest-axe optional, tests will still pass
  }
}

// Ensure consistent test environment
beforeEach(() => {
  jest.clearAllMocks();
});
