/**
 * @file Testing Library 类型定义
 * @description 扩展 Jest 匹配器以支持 @testing-library/jest-dom
 * @module types/testing-library
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

import '@testing-library/jest-dom';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toBeEmpty(): R;
      toBeVisible(): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(html: string): R;
      toHaveAttribute(attr: string, value?: string): R;
      toHaveClass(...classNames: string[]): R;
      toHaveFocus(): R;
      toHaveFormValues(expectedValues: Record<string, unknown>): R;
      toHaveStyle(css: Record<string, unknown>): R;
      toHaveTextContent(text: string | RegExp): R;
      toHaveValue(value: string | string[] | number): R;
      toBeInTheDocument(): R;
      toBeInTheDocument(): R;
    }
  }
}

declare namespace NodeJS {
  interface Global {
    matchMedia: (query: string) => MediaQueryList;
  }
}

interface MediaQueryList {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => any) | null;
  addListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
  removeListener: (listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
  addEventListener: (type: string, listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
  removeEventListener: (type: string, listener: (this: MediaQueryList, ev: MediaQueryListEvent) => any) => void;
  dispatchEvent: (event: Event) => boolean;
}