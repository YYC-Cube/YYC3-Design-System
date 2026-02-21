/**
 * @file jest-axe类型定义
 * @description 为jest-axe提供TypeScript类型支持
 * @module types/jest-axe
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

declare module 'jest-axe' {
  import { Result } from 'axe-core';

  interface AxeResults {
    violations: Result[];
    passes: Result[];
    incomplete: Result[];
    inapplicable: Result[];
  }

  interface ToHaveNoViolationsResult {
    pass: boolean;
    message: () => string;
  }

  function toHaveNoViolations(): ToHaveNoViolationsResult;
  function axe(element: Element | string, options?: any): Promise<AxeResults>;

  const jestAxe: {
    axe: typeof axe;
    toHaveNoViolations: typeof toHaveNoViolations;
  };

  export default jestAxe;
  export { axe, toHaveNoViolations };
}

declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}

declare module '@jest/globals' {
  namespace jest {
    interface Matchers<R> {
      toHaveNoViolations(): R;
    }
  }
}
