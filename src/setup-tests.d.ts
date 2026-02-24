/**
 * @file 全局测试类型声明
 * @description 扩展Jest和Testing Library类型
 * @module setup-tests
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import '@testing-library/jest-dom';

declare global {
  namespace NodeJS {
    interface Global {
      performance: {
        now: () => number;
        memory: {
          usedJSHeapSize: number;
          totalJSHeapSize: number;
          jsHeapSizeLimit: number;
        };
      };
    }
  }
}
