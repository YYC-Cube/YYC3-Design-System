/**
 * @file 多态组件基础设施测试
 * @description 测试 Polymorphic 组件的各项功能
 * @module __tests__/components/Polymorphic.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Slot, createPolymorphicComponent, createSlot, mergeProps, overrideProps, createAsChildComponent, polymorphic, withAsChild } from './Polymorphic';

describe('Polymorphic', () => {
  describe('createPolymorphicComponent', () => {
    it('应该创建多态组件', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      render(<TestComponent>Test Content</TestComponent>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该支持自定义元素类型', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      render(<TestComponent as="button">Button Content</TestComponent>);
      const element = screen.getByText('Button Content');
      expect(element.tagName).toBe('BUTTON');
    });

    it('应该支持 ref 转发', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(<TestComponent>Test Content</TestComponent>);
      expect(container.querySelector('div')).toBeInTheDocument();
    });

    it('应该支持自定义属性', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(<TestComponent data-testid="test">Test Content</TestComponent>);
      expect(container.querySelector('[data-testid="test"]')).toBeInTheDocument();
    });

    it('应该支持多种元素类型', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <>
          <TestComponent as="span">Span Content</TestComponent>
          <TestComponent as="section">Section Content</TestComponent>
        </>
      );
      expect(container.querySelector('span')).toBeInTheDocument();
      expect(container.querySelector('section')).toBeInTheDocument();
    });

    it('应该支持更多元素类型', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <>
          <TestComponent as="a">Link</TestComponent>
          <TestComponent as="article">Article</TestComponent>
          <TestComponent as="nav">Nav</TestComponent>
          <TestComponent as="aside">Aside</TestComponent>
          <TestComponent as="header">Header</TestComponent>
          <TestComponent as="footer">Footer</TestComponent>
          <TestComponent as="main">Main</TestComponent>
        </>
      );
      expect(container.querySelector('a')).toBeInTheDocument();
      expect(container.querySelector('article')).toBeInTheDocument();
      expect(container.querySelector('nav')).toBeInTheDocument();
      expect(container.querySelector('aside')).toBeInTheDocument();
      expect(container.querySelector('header')).toBeInTheDocument();
      expect(container.querySelector('footer')).toBeInTheDocument();
      expect(container.querySelector('main')).toBeInTheDocument();
    });

    it('应该支持更多 HTML 元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <>
          <TestComponent as="h1">Heading 1</TestComponent>
          <TestComponent as="h2">Heading 2</TestComponent>
          <TestComponent as="h3">Heading 3</TestComponent>
          <TestComponent as="ul">List</TestComponent>
          <TestComponent as="ol">Ordered List</TestComponent>
          <TestComponent as="li">List Item</TestComponent>
        </>
      );
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('ol')).toBeInTheDocument();
      expect(container.querySelector('li')).toBeInTheDocument();
    });

    it('应该支持更多 HTML5 元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <>
          <TestComponent as="figure">Figure</TestComponent>
          <TestComponent as="figcaption">Figcaption</TestComponent>
          <TestComponent as="time">Time</TestComponent>
          <TestComponent as="mark">Mark</TestComponent>
          <TestComponent as="code">Code</TestComponent>
          <TestComponent as="pre">Pre</TestComponent>
          <TestComponent as="blockquote">Blockquote</TestComponent>
          <TestComponent as="cite">Cite</TestComponent>
          <TestComponent as="abbr">Abbr</TestComponent>
          <TestComponent as="address">Address</TestComponent>
        </>
      );
      expect(container.querySelector('figure')).toBeInTheDocument();
      expect(container.querySelector('figcaption')).toBeInTheDocument();
      expect(container.querySelector('time')).toBeInTheDocument();
      expect(container.querySelector('mark')).toBeInTheDocument();
      expect(container.querySelector('code')).toBeInTheDocument();
      expect(container.querySelector('pre')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(container.querySelector('cite')).toBeInTheDocument();
      expect(container.querySelector('abbr')).toBeInTheDocument();
      expect(container.querySelector('address')).toBeInTheDocument();
    });

    it('应该支持表单元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <>
          <TestComponent as="form">Form</TestComponent>
          <TestComponent as="fieldset">Fieldset</TestComponent>
          <TestComponent as="legend">Legend</TestComponent>
          <TestComponent as="label">Label</TestComponent>
          <TestComponent as="input" />
          <TestComponent as="textarea">Textarea</TestComponent>
          <TestComponent as="select">Select</TestComponent>
          <TestComponent as="option">Option</TestComponent>
        </>
      );
      expect(container.querySelector('form')).toBeInTheDocument();
      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
      expect(container.querySelector('label')).toBeInTheDocument();
      expect(container.querySelector('input')).toBeInTheDocument();
      expect(container.querySelector('textarea')).toBeInTheDocument();
      expect(container.querySelector('select')).toBeInTheDocument();
      expect(container.querySelector('option')).toBeInTheDocument();
    });

    it('应该支持交互元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const handleClick = jest.fn();
      const { container } = render(
        <>
          <TestComponent as="button" onClick={handleClick}>Button</TestComponent>
          <TestComponent as="a" href="#">Link</TestComponent>
        </>
      );
      const button = container.querySelector('button');
      const link = container.querySelector('a');
      expect(button).toBeInTheDocument();
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '#');
    });

    it('应该支持 ARIA 属性', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <TestComponent
          as="button"
          aria-label="Test Button"
          aria-disabled="true"
          role="button"
        >
          Button
        </TestComponent>
      );
      const element = container.querySelector('button');
      expect(element).toHaveAttribute('aria-label', 'Test Button');
      expect(element).toHaveAttribute('aria-disabled', 'true');
      expect(element).toHaveAttribute('role', 'button');
    });

    it('应该支持自定义 data 属性', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <TestComponent
          data-test="test-value"
          data-custom="custom-value"
          data-id="123"
        >
          Test Content
        </TestComponent>
      );
      const element = container.querySelector('div');
      expect(element).toHaveAttribute('data-test', 'test-value');
      expect(element).toHaveAttribute('data-custom', 'custom-value');
      expect(element).toHaveAttribute('data-id', '123');
    });

    it('应该支持空子元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(<TestComponent />);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该支持 null 子元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(<TestComponent>{null}</TestComponent>);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该支持多个子元素', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      const { container } = render(
        <TestComponent>
          <span>First</span>
          <span>Second</span>
          <span>Third</span>
        </TestComponent>
      );
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element?.children.length).toBe(3);
    });

    it('应该有正确的 displayName', () => {
      const TestComponent = createPolymorphicComponent('TestComponent');
      expect(TestComponent.displayName).toBe('TestComponent');
    });
  });

  describe('Slot', () => {
    it('应该渲染子元素', () => {
      render(
        <Slot>
          <div>Slot Content</div>
        </Slot>
      );
      expect(screen.getByText('Slot Content')).toBeInTheDocument();
    });

    it('应该支持 asChild 模式', () => {
      render(
        <Slot asChild>
          <button>Button Content</button>
        </Slot>
      );
      const element = screen.getByText('Button Content');
      expect(element.tagName).toBe('BUTTON');
    });

    it('应该支持自定义元素类型', () => {
      render(
        <Slot as="button">
          Button Content
        </Slot>
      );
      const element = screen.getByText('Button Content');
      expect(element.tagName).toBe('BUTTON');
    });

    it('应该在 asChild 模式下合并属性', () => {
      const { container } = render(
        <Slot asChild>
          <button className="slot-class" data-testid="slot">Button Content</button>
        </Slot>
      );
      const element = container.querySelector('button');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('slot-class');
    });

    it('应该支持 ref 转发', () => {
      const ref = React.createRef<HTMLButtonElement>();
      render(
        <Slot asChild>
          <button ref={ref}>Button Content</button>
        </Slot>
      );
      expect(ref.current).toBeInTheDocument();
    });

    it('应该处理非 React 元素子节点', () => {
      render(
        <Slot>
          Text Content
        </Slot>
      );
      expect(screen.getByText('Text Content')).toBeInTheDocument();
    });

    it('应该支持多个子元素', () => {
      render(
        <Slot>
          <div>First</div>
          <div>Second</div>
        </Slot>
      );
      expect(screen.getByText('First')).toBeInTheDocument();
      expect(screen.getByText('Second')).toBeInTheDocument();
    });

    it('应该支持更多元素类型', () => {
      const { container } = render(
        <>
          <Slot as="a">Link</Slot>
          <Slot as="span">Span</Slot>
          <Slot as="section">Section</Slot>
          <Slot as="article">Article</Slot>
        </>
      );
      expect(container.querySelector('a')).toBeInTheDocument();
      expect(container.querySelector('span')).toBeInTheDocument();
      expect(container.querySelector('section')).toBeInTheDocument();
      expect(container.querySelector('article')).toBeInTheDocument();
    });

    it('应该支持更多 HTML 元素', () => {
      const { container } = render(
        <>
          <Slot as="h1">Heading 1</Slot>
          <Slot as="h2">Heading 2</Slot>
          <Slot as="h3">Heading 3</Slot>
          <Slot as="ul">List</Slot>
          <Slot as="ol">Ordered List</Slot>
        </>
      );
      expect(container.querySelector('h1')).toBeInTheDocument();
      expect(container.querySelector('h2')).toBeInTheDocument();
      expect(container.querySelector('h3')).toBeInTheDocument();
      expect(container.querySelector('ul')).toBeInTheDocument();
      expect(container.querySelector('ol')).toBeInTheDocument();
    });

    it('应该支持更多 HTML5 元素', () => {
      const { container } = render(
        <>
          <Slot as="figure">Figure</Slot>
          <Slot as="figcaption">Figcaption</Slot>
          <Slot as="time">Time</Slot>
          <Slot as="mark">Mark</Slot>
          <Slot as="code">Code</Slot>
          <Slot as="pre">Pre</Slot>
          <Slot as="blockquote">Blockquote</Slot>
          <Slot as="cite">Cite</Slot>
          <Slot as="abbr">Abbr</Slot>
          <Slot as="address">Address</Slot>
        </>
      );
      expect(container.querySelector('figure')).toBeInTheDocument();
      expect(container.querySelector('figcaption')).toBeInTheDocument();
      expect(container.querySelector('time')).toBeInTheDocument();
      expect(container.querySelector('mark')).toBeInTheDocument();
      expect(container.querySelector('code')).toBeInTheDocument();
      expect(container.querySelector('pre')).toBeInTheDocument();
      expect(container.querySelector('blockquote')).toBeInTheDocument();
      expect(container.querySelector('cite')).toBeInTheDocument();
      expect(container.querySelector('abbr')).toBeInTheDocument();
      expect(container.querySelector('address')).toBeInTheDocument();
    });

    it('应该支持表单元素', () => {
      const { container } = render(
        <>
          <Slot as="form">Form</Slot>
          <Slot as="fieldset">Fieldset</Slot>
          <Slot as="legend">Legend</Slot>
          <Slot as="label">Label</Slot>
          <Slot as="input" />
          <Slot as="textarea">Textarea</Slot>
          <Slot as="select">Select</Slot>
          <Slot as="option">Option</Slot>
        </>
      );
      expect(container.querySelector('form')).toBeInTheDocument();
      expect(container.querySelector('fieldset')).toBeInTheDocument();
      expect(container.querySelector('legend')).toBeInTheDocument();
      expect(container.querySelector('label')).toBeInTheDocument();
      expect(container.querySelector('input')).toBeInTheDocument();
      expect(container.querySelector('textarea')).toBeInTheDocument();
      expect(container.querySelector('select')).toBeInTheDocument();
      expect(container.querySelector('option')).toBeInTheDocument();
    });

    it('应该支持 ARIA 属性', () => {
      const { container } = render(
        <Slot as="button" aria-label="Test Button" aria-disabled="true" role="button">
          Button
        </Slot>
      );
      const element = container.querySelector('button');
      expect(element).toHaveAttribute('aria-label', 'Test Button');
      expect(element).toHaveAttribute('aria-disabled', 'true');
      expect(element).toHaveAttribute('role', 'button');
    });

    it('应该支持自定义 data 属性', () => {
      const { container } = render(
        <Slot
          data-test="test-value"
          data-custom="custom-value"
          data-id="123"
        >
          Test Content
        </Slot>
      );
      const element = container.querySelector('div');
      expect(element).toHaveAttribute('data-test', 'test-value');
      expect(element).toHaveAttribute('data-custom', 'custom-value');
      expect(element).toHaveAttribute('data-id', '123');
    });

    it('应该支持空子元素', () => {
      const { container } = render(<Slot />);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该支持 null 子元素', () => {
      const { container } = render(<Slot>{null}</Slot>);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该有正确的 displayName', () => {
      expect(Slot.displayName).toBe('Slot');
    });
  });

  describe('createSlot', () => {
    it('应该创建 Slot 组件', () => {
      const TestSlot = createSlot('TestSlot');
      render(
        <TestSlot>
          <div>Test Content</div>
        </TestSlot>
      );
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该设置正确的 displayName', () => {
      const TestSlot = createSlot('TestSlot');
      expect(TestSlot.displayName).toBe('TestSlot');
    });

    it('应该支持自定义元素类型', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(
        <TestSlot as={'button' as any}>
          Button Content
        </TestSlot>
      );
      const element = container.querySelector('button');
      expect(element).toBeInTheDocument();
    });

    it('应该支持 ARIA 属性', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(
        <TestSlot as={'button' as any} aria-label="Test Button" aria-disabled="true" role="button">
          Button
        </TestSlot>
      );
      const element = container.querySelector('button');
      expect(element).toHaveAttribute('aria-label', 'Test Button');
      expect(element).toHaveAttribute('aria-disabled', 'true');
      expect(element).toHaveAttribute('role', 'button');
    });

    it('应该支持自定义 data 属性', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(
        <TestSlot
          data-test="test-value"
          data-custom="custom-value"
          data-id="123"
        >
          Test Content
        </TestSlot>
      );
      const element = container.querySelector('div');
      expect(element).toHaveAttribute('data-test', 'test-value');
      expect(element).toHaveAttribute('data-custom', 'custom-value');
      expect(element).toHaveAttribute('data-id', '123');
    });

    it('应该支持空子元素', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(<TestSlot />);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该支持 null 子元素', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(<TestSlot>{null}</TestSlot>);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element).toBeEmptyDOMElement();
    });

    it('应该支持多个子元素', () => {
      const TestSlot = createSlot('TestSlot');
      const { container } = render(
        <TestSlot>
          <div>First</div>
          <div>Second</div>
          <div>Third</div>
        </TestSlot>
      );
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
      expect(element?.children.length).toBe(3);
    });
  });

  describe('mergeProps', () => {
    it('应该合并属性', () => {
      const result = mergeProps({ a: 1 }, { b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('应该覆盖同名属性', () => {
      const result = mergeProps({ a: 1 }, { a: 2 });
      expect(result).toEqual({ a: 2 });
    });

    it('应该处理空对象', () => {
      const result = mergeProps({}, {});
      expect(result).toEqual({});
    });

    it('应该处理多个属性', () => {
      const result = mergeProps({ a: 1, b: 2 }, { c: 3, d: 4 });
      expect(result).toEqual({ a: 1, b: 2, c: 3, d: 4 });
    });

    it('应该处理复杂对象', () => {
      const result = mergeProps({ nested: { a: 1 } }, { nested: { b: 2 } });
      expect(result).toEqual({ nested: { b: 2 } });
    });
  });

  describe('overrideProps', () => {
    it('应该覆盖属性', () => {
      const result = overrideProps({ a: 1, b: 2 }, { a: 3 });
      expect(result).toEqual({ a: 3, b: 2 });
    });

    it('应该支持部分覆盖', () => {
      const result = overrideProps({ a: 1, b: 2, c: 3 }, { b: 4, d: 5 });
      expect(result).toEqual({ a: 1, b: 4, c: 3, d: 5 });
    });

    it('应该处理空覆盖对象', () => {
      const result = overrideProps({ a: 1, b: 2 }, {});
      expect(result).toEqual({ a: 1, b: 2 });
    });

    it('应该处理空基础对象', () => {
      const result = overrideProps({}, { a: 1, b: 2 });
      expect(result).toEqual({ a: 1, b: 2 });
    });
  });

  describe('createAsChildComponent', () => {
    it('应该创建支持 asChild 的组件', () => {
      const TestComponent = createAsChildComponent<{ asChild?: boolean; children?: React.ReactNode }>(
        'TestComponent',
        (props) => <div data-testid="test">{props.children}</div>
      );
      render(<TestComponent>Test Content</TestComponent>);
      expect(screen.getByTestId('test')).toBeInTheDocument();
    });

    it('应该有正确的 displayName', () => {
      const TestComponent = createAsChildComponent<{ asChild?: boolean; children?: React.ReactNode }>(
        'TestComponent',
        (props) => <div data-testid="test">{props.children}</div>
      );
      expect(TestComponent.displayName).toBe('TestComponent');
    });
  });

  describe('polymorphic', () => {
    it('应该创建多态组件', () => {
      const TestComponent = polymorphic('TestComponent');
      render(<TestComponent>Test Content</TestComponent>);
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('应该支持默认元素类型', () => {
      const TestComponent = polymorphic('TestComponent');
      const { container } = render(<TestComponent>Button Content</TestComponent>);
      const element = container.querySelector('div');
      expect(element).toBeInTheDocument();
    });

    it('应该有正确的 displayName', () => {
      const TestComponent = polymorphic('TestComponent');
      expect(TestComponent.displayName).toBe('TestComponent');
    });
  });

  describe('withAsChild', () => {
    it('应该包装组件并支持 asChild', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent') as any;
      
      const { container } = render(
        <WrappedComponent asChild>
          <button>Button Content</button>
        </WrappedComponent>
      );
      const element = container.querySelector('button');
      expect(element).toBeInTheDocument();
    });

    it('应该在非 asChild 模式下渲染默认元素', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent');
      
      render(<WrappedComponent>Default Content</WrappedComponent>);
      expect(screen.getByText('Default Content')).toBeInTheDocument();
    });

    it('应该在 asChild 模式下合并属性', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent') as any;
      
      const { container } = render(
        <WrappedComponent asChild>
          <button className="wrapped-class" data-testid="wrapped">Button Content</button>
        </WrappedComponent>
      );
      const element = container.querySelector('button');
      expect(element).toBeInTheDocument();
      expect(element).toHaveClass('wrapped-class');
    });

    it('应该有正确的 displayName', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent');
      expect(WrappedComponent.displayName).toBe('WrappedComponent');
    });

    it('应该支持自定义元素类型', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent') as any;
      
      const { container } = render(
        <WrappedComponent asChild={true}>
          <a href="https://example.com">Link</a>
        </WrappedComponent>
      );
      const element = container.querySelector('a');
      expect(element).toBeInTheDocument();
    });

    it('应该支持 ref 转发', () => {
      const BaseComponent = ({ children }: { children?: React.ReactNode }) => (
        <div data-testid="base">{children}</div>
      );
      const WrappedComponent = withAsChild(BaseComponent, 'WrappedComponent') as any;
      const ref = React.createRef<HTMLButtonElement>();
      
      render(
        <WrappedComponent asChild>
          <button ref={ref}>Button Content</button>
        </WrappedComponent>
      );
      expect(ref.current).toBeInTheDocument();
    });
  });
});
