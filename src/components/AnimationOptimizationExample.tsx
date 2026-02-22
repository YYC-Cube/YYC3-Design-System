/**
 * @file 动画优化示例组件
 * @description 演示优化的动画性能和最佳实践
 * @component AnimationOptimizationExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback, useRef } from 'react';
import { Card } from './Card';
import { Button } from './Button';
import {
  fadeIn,
  slideInUp,
  scaleIn,
  bounceIn,
  createOptimizedTransition,
  useAnimationFrame,
  useThrottledAnimationFrame,
  createSpringAnimation,
  prefersReducedMotion,
} from '../utils/optimized-animations';

export const AnimationOptimizationExample: React.FC = () => {
  const [showFade, setShowFade] = useState(false);
  const [showSlide, setShowSlide] = useState(false);
  const [showScale, setShowScale] = useState(false);
  const [showBounce, setShowBounce] = useState(false);
  const [springValue, setSpringValue] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleToggleFade = useCallback(() => {
    setShowFade(prev => !prev);
  }, []);

  const handleToggleSlide = useCallback(() => {
    setShowSlide(prev => !prev);
  }, []);

  const handleToggleScale = useCallback(() => {
    setShowScale(prev => !prev);
  }, []);

  const handleToggleBounce = useCallback(() => {
    setShowBounce(prev => !prev);
  }, []);

  const handleSpringStart = useCallback(() => {
    const animation = createSpringAnimation(0, 100, 500, (value) => {
      setSpringValue(value);
    });

    return () => {
      animation.cancel();
    };
  }, []);

  const handleScroll = useCallback(() => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const maxScroll = containerRef.current.scrollHeight - containerRef.current.clientHeight;
      const progress = (scrollTop / maxScroll) * 100;
      setScrollProgress(progress);
    }
  }, []);

  useAnimationFrame(() => {
    if (showBounce) {
      console.log('[AnimationFrame] 动画帧更新');
    }
  }, [showBounce]);

  const throttledScrollHandler = useThrottledAnimationFrame(handleScroll, 16);

  const fadeStyle = showFade ? {
    animation: fadeIn({ duration: 'fast' }),
    ...createOptimizedTransition(['opacity']),
  } : {};

  const slideStyle = showSlide ? {
    animation: slideInUp({ duration: 'normal' }),
    ...createOptimizedTransition(['transform', 'opacity']),
  } : {};

  const scaleStyle = showScale ? {
    animation: scaleIn({ duration: 'slow' }),
    ...createOptimizedTransition(['transform']),
  } : {};

  const bounceStyle = showBounce ? {
    animation: bounceIn({ duration: 'normal' }),
    ...createOptimizedTransition(['transform']),
  } : {};

  const springBarStyle = {
    width: `${springValue}%`,
    height: '20px',
    backgroundColor: '#d45a5f',
    borderRadius: '4px',
    transition: 'width 0.1s ease-out',
  };

  const scrollContainerStyle = {
    height: '200px',
    overflowY: 'auto',
    border: '1px solid #e0e0e0',
    borderRadius: '0.25rem',
    padding: '1rem',
  };

  const scrollContent = Array.from({ length: 50 }, (_, i) => (
    <div
      key={i}
      style={{
        padding: '1rem',
        marginBottom: '0.5rem',
        backgroundColor: i % 2 === 0 ? '#f9f9f9' : '#ffffff',
        border: '1px solid #e0e0e0',
        borderRadius: '0.25rem',
      }}
    >
      滚动内容项 {i + 1}
    </div>
  ));

  const reducedMotion = prefersReducedMotion();

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>动画优化示例</h1>

      {reducedMotion && (
        <Card style={{ marginBottom: '2rem', backgroundColor: '#fff3e0' }}>
          <h2 style={{ marginBottom: '1rem' }}>检测到减少动画偏好</h2>
          <p style={{ fontSize: '0.875rem', lineHeight: '1.6' }}>
            系统检测到用户启用了减少动画偏好设置。为了提供更好的用户体验，
            我们将自动禁用或简化动画效果。
          </p>
        </Card>
      )}

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>CSS 动画优化</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleToggleFade}>
            {showFade ? '隐藏淡入动画' : '显示淡入动画'}
          </Button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...fadeStyle, padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>淡入动画</h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              使用 CSS 动画和硬件加速，性能优于 JavaScript 动画
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleToggleSlide}>
            {showSlide ? '隐藏滑入动画' : '显示滑入动画'}
          </Button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...slideStyle, padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>滑入动画</h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              使用 transform 和 opacity 过渡，GPU 加速渲染
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleToggleScale}>
            {showScale ? '隐藏缩放动画' : '显示缩放动画'}
          </Button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...scaleStyle, padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>缩放动画</h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              使用 scale 变换，硬件加速渲染
            </p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleToggleBounce}>
            {showBounce ? '隐藏弹跳动画' : '显示弹跳动画'}
          </Button>
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <div style={{ ...bounceStyle, padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
            <h3 style={{ marginBottom: '0.5rem' }}>弹跳动画</h3>
            <p style={{ fontSize: '0.875rem', color: '#666' }}>
              使用 requestAnimationFrame 进行帧动画，性能最优
            </p>
          </div>
        </div>
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>requestAnimationFrame 优化</h2>
        <div style={{ marginBottom: '1rem' }}>
          <Button onClick={handleSpringStart}>
            启动弹簧动画
          </Button>
        </div>
        <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>弹簧动画进度</h3>
          <div style={{ marginBottom: '0.5rem', height: '20px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <div style={springBarStyle} />
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            当前值: {springValue.toFixed(1)}%
          </p>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            使用 requestAnimationFrame 实现平滑动画，避免卡顿
          </p>
        </div>
      </Card>

      <Card style={{ marginBottom: '2rem' }}>
        <h2 style={{ marginBottom: '1rem' }}>滚动动画优化</h2>
        <div style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #e0e0e0', borderRadius: '0.25rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>滚动进度</h3>
          <div style={{ marginBottom: '0.5rem', height: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
            <div
              style={{
                width: `${scrollProgress}%`,
                height: '100%',
                backgroundColor: '#d45a5f',
                borderRadius: '4px',
                transition: 'width 0.1s ease-out',
              }}
            />
          </div>
          <p style={{ fontSize: '0.875rem', color: '#666' }}>
            滚动进度: {scrollProgress.toFixed(1)}%
          </p>
        </div>
        <div
          ref={containerRef}
          style={scrollContainerStyle}
          onScroll={throttledScrollHandler}
        >
          {scrollContent}
        </div>
        <p style={{ fontSize: '0.875rem', color: '#666', marginTop: '1rem' }}>
          使用节流的 requestAnimationFrame 处理滚动事件，提升性能
        </p>
      </Card>

      <Card>
        <h2 style={{ marginBottom: '1rem' }}>动画性能优化技巧</h2>
        <ul style={{ lineHeight: '1.8' }}>
          <li>
            <strong>使用 CSS 动画而非 JavaScript 动画：</strong> CSS 动画由浏览器优化，
            通常在合成线程上运行，不会阻塞主线程
          </li>
          <li>
            <strong>使用 transform 和 opacity：</strong> 这些属性可以触发硬件加速，
            在 GPU 上渲染，性能更优
          </li>
          <li>
            <strong>使用 requestAnimationFrame：</strong> 与浏览器的刷新率同步，
            避免不必要的重绘和布局计算
          </li>
          <li>
            <strong>节流和防抖：</strong> 减少事件处理频率，
            避免过多的计算和渲染
          </li>
          <li>
            <strong>避免布局抖动：</strong> 使用 transform 而非 top/left，
            避免触发布局和重绘
          </li>
          <li>
            <strong>使用 will-change：</strong> 提前告知浏览器元素将要变化，
            浏览器可以提前优化
          </li>
          <li>
            <strong>减少动画复杂度：</strong> 简化动画效果，
            减少需要计算的属性数量
          </li>
          <li>
            <strong>考虑减少动画偏好：</strong> 尊重用户的系统设置，
            为偏好减少动画的用户提供简化体验
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default AnimationOptimizationExample;
