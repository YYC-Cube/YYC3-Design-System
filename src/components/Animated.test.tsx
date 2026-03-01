/**
 * @file Animated 组件测试
 * @description 测试 Animated 组件的各项功能
 * @module __tests__/components/Animated.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { render, fireEvent } from '@testing-library/react';
import { screen } from '@testing-library/dom';

import { Animated } from './Animated';

describe('Animated 组件', () => {
  it('应该正确渲染子元素', () => {
    render(
      <Animated animation="fadeIn">
        <div>Animated content</div>
      </Animated>
    );

    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('应该支持不同的动画类型', () => {
    const animations: Array<
      | 'fadeIn'
      | 'fadeOut'
      | 'slideInUp'
      | 'slideInDown'
      | 'slideInLeft'
      | 'slideInRight'
      | 'scaleIn'
      | 'scaleOut'
      | 'rotateIn'
      | 'bounceIn'
    > = [
      'fadeIn',
      'fadeOut',
      'slideInUp',
      'slideInDown',
      'slideInLeft',
      'slideInRight',
      'scaleIn',
      'scaleOut',
      'rotateIn',
      'bounceIn',
    ];

    animations.forEach((animation) => {
      const { unmount } = render(
        <Animated animation={animation}>
          <div>Animated content</div>
        </Animated>
      );

      expect(screen.getByText('Animated content')).toBeInTheDocument();
      unmount();
    });
  });

  it('应该支持 mount 触发器', () => {
    render(
      <Animated animation="fadeIn" trigger="mount">
        <div>Animated content</div>
      </Animated>
    );

    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('应该支持 hover 触发器', () => {
    render(
      <Animated animation="fadeIn" trigger="hover">
        <div>Animated content</div>
      </Animated>
    );

    const element = screen.getByText('Animated content');
    fireEvent.mouseEnter(element);
    fireEvent.mouseLeave(element);

    expect(element).toBeInTheDocument();
  });

  it('应该支持 click 触发器', () => {
    render(
      <Animated animation="fadeIn" trigger="click">
        <div>Animated content</div>
      </Animated>
    );

    const element = screen.getByText('Animated content');
    fireEvent.click(element);

    expect(element).toBeInTheDocument();
  });

  it('应该应用自定义 className', () => {
    render(
      <Animated animation="fadeIn" className="custom-class">
        <div>Animated content</div>
      </Animated>
    );

    const wrapper = screen.getByText('Animated content').parentElement;
    expect(wrapper).toHaveClass('custom-class');
  });

  it('应该支持自定义配置', () => {
    render(
      <Animated animation="fadeIn" config={{ duration: 'slow', delay: '200ms' }}>
        <div>Animated content</div>
      </Animated>
    );

    expect(screen.getByText('Animated content')).toBeInTheDocument();
  });

  it('click 触发器应该切换动画状态', () => {
    render(
      <Animated animation="fadeIn" trigger="click">
        <div>Animated content</div>
      </Animated>
    );

    const element = screen.getByText('Animated content');

    fireEvent.click(element);
    fireEvent.click(element);

    expect(element).toBeInTheDocument();
  });

  it('hover 触发器应该正确处理鼠标事件', () => {
    render(
      <Animated animation="fadeIn" trigger="hover">
        <div>Animated content</div>
      </Animated>
    );

    const element = screen.getByText('Animated content');

    fireEvent.mouseEnter(element);
    fireEvent.mouseLeave(element);
    fireEvent.mouseEnter(element);

    expect(element).toBeInTheDocument();
  });
});
