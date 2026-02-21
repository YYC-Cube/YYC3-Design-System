/**
 * @file JSX类型定义
 * @description 为全局提供JSX命名空间支持
 * @module types/jsx
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-20
 */

/* eslint-disable @typescript-eslint/no-namespace */

/**
 * JSX命名空间定义
 * 用于支持@types/mdx和其他JSX相关类型
 */
declare namespace JSX {
  /**
   * JSX元素类型
   */
  interface Element extends globalThis.React.ReactElement<any, any> {}

  /**
   * JSX元素属性类型
   */
  interface IntrinsicElements {
    [elemName: string]: globalThis.React.DetailedHTMLProps<
      globalThis.React.HTMLAttributes<HTMLElement>,
      HTMLElement
    >;
  }

  /**
   * JSX元素类型属性
   */
  interface ElementAttributesProperty {
    props: {};
  }

  /**
   * JSX元素子元素属性
   */
  interface ElementChildrenAttribute {
    children: {};
  }
}
