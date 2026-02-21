/**
 * @file 安全模块类型扩展
 * @description 为安全模块提供完整的类型定义
 * @module types/security
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-20
 */

/**
 * XMLHttpRequest 内部方法接口
 */
export interface XMLHttpRequestWithInternals extends XMLHttpRequest {
  open(
    method: string,
    url: string | URL,
    async?: boolean,
    user?: string | null,
    password?: string | null
  ): void;
  setRequestHeader(name: string, value: string): void;
  send(body?: Document | XMLHttpRequestBodyInit | null): void;
}

/**
 * Document 内部方法接口
 */
export interface DocumentWithInternals extends Document {
  createElement(tagName: string, options?: ElementCreationOptions): HTMLElement;
}

/**
 * Element 内部方法接口
 */
export interface ElementWithInternals extends Element {
  setAttribute(name: string, value: string): void;
}

/**
 * 扩展的安全策略违规事件
 */
export interface ExtendedSecurityPolicyViolationEvent extends SecurityPolicyViolationEvent {
  sourceFile?: string;
  sourceURI?: string;
}

/**
 * DOMPurify 库接口
 */
export interface DOMPurifyInterface {
  sanitize(source: string, options?: unknown): string;
  setConfig(options: unknown): void;
  addHook(hook: string, callback: unknown): void;
}

/**
 * Fetch Mock 接口（用于测试）
 */
export interface FetchMock extends jest.MockedFunction<typeof fetch> {
  mockResolvedValueOnce(value: Response): FetchMock;
  mockRejectedValueOnce(error: Error): FetchMock;
}
