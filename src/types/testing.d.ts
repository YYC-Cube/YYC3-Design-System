/**
 * @file 测试类型扩展
 * @description 扩展@testing-library/react的screen对象类型
 * @module types/testing
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import '@testing-library/jest-dom';

declare module '@testing-library/react' {
  export interface Queries extends jest.DomLibQueries {}
}
