/**
 * @file 优化的动画工具
 * @description 提供高性能的动画工具函数，使用 requestAnimationFrame 和 CSS 硬件加速
 * @module utils/optimized-animations
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React from 'react';
import { AnimationConfig, AnimationDuration, AnimationEasing, AnimationKeyframe } from '../../types/animations';

export const animationDurations: Record<AnimationDuration, string> = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
};

export const animationEasings: Record<AnimationEasing, string> = {
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
  back: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
};

const animationKeyframes: Record<AnimationKeyframe, string> = {
  'fade-in': 'fadeIn 0.3s ease-in-out',
  'fade-out': 'fadeOut 0.3s ease-in-out',
  'slide-in-up': 'slideInUp 0.3s ease-out',
  'slide-in-down': 'slideInDown 0.3s ease-out',
  'slide-in-left': 'slideInLeft 0.3s ease-out',
  'slide-in-right': 'slideInRight 0.3s ease-out',
  'scale-in': 'scaleIn 0.3s ease-out',
  'scale-out': 'scaleOut 0.3s ease-in',
  'rotate-in': 'rotateIn 0.5s ease-out',
  'bounce-in': 'bounceIn 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
};

export const getAnimationString = (
  keyframe: AnimationKeyframe,
  config?: AnimationConfig
): string => {
  const duration = config?.duration ? animationDurations[config.duration] : '300ms';
  const easing = config?.easing ? animationEasings[config.easing] : 'ease-in-out';
  const delay = config?.delay || '0ms';
  const fillMode = config?.fillMode || 'forwards';

  return `${keyframe} ${duration} ${easing} ${delay} ${fillMode}`;
};

export const fadeIn = (config?: AnimationConfig): string => {
  return getAnimationString('fade-in', config);
};

export const fadeOut = (config?: AnimationConfig): string => {
  return getAnimationString('fade-out', config);
};

export const slideInUp = (config?: AnimationConfig): string => {
  return getAnimationString('slide-in-up', config);
};

export const slideInDown = (config?: AnimationConfig): string => {
  return getAnimationString('slide-in-down', config);
};

export const slideInLeft = (config?: AnimationConfig): string => {
  return getAnimationString('slide-in-left', config);
};

export const slideInRight = (config?: AnimationConfig): string => {
  return getAnimationString('slide-in-right', config);
};

export const scaleIn = (config?: AnimationConfig): string => {
  return getAnimationString('scale-in', config);
};

export const scaleOut = (config?: AnimationConfig): string => {
  return getAnimationString('scale-out', config);
};

export const rotateIn = (config?: AnimationConfig): string => {
  return getAnimationString('rotate-in', config);
};

export const bounceIn = (config?: AnimationConfig): string => {
  return getAnimationString('bounce-in', config);
};

export const createTransition = (
  properties: string,
  config?: AnimationConfig
): string => {
  const duration = config?.duration ? animationDurations[config.duration] : '300ms';
  const easing = config?.easing ? animationEasings[config.easing] : 'ease-in-out';
  const delay = config?.delay || '0ms';

  return `${properties} ${duration} ${easing} ${delay}`;
};

export const getHardwareAcceleratedStyle = (): React.CSSProperties => {
  return {
    transform: 'translateZ(0)',
    backfaceVisibility: 'hidden',
    perspective: '1000px',
  };
};

export const getWillChangeProperties = (properties: string[]): React.CSSProperties => {
  return {
    willChange: properties.join(', '),
  };
};

export const useAnimationFrame = (
  callback: () => void,
  deps: React.DependencyList = []
) => {
  const requestRef = React.useRef<number>(0);
  const previousDeps = React.useRef(deps);

  React.useEffect(() => {
    const hasChanged = deps.some((dep, i) => dep !== previousDeps.current[i]);
    if (hasChanged) {
      previousDeps.current = deps;
      
      const animate = () => {
        callback();
        requestRef.current = requestAnimationFrame(animate);
      };
      
      requestRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, deps);
};

export const useThrottledAnimationFrame = (
  callback: () => void,
  delay: number = 16
) => {
  const lastRunRef = React.useRef<number>(0);
  const requestRef = React.useRef<number>(0);

  return React.useCallback(() => {
    const now = performance.now();
    const timeSinceLastRun = now - lastRunRef.current;

    if (timeSinceLastRun >= delay) {
      lastRunRef.current = now;
      
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      
      requestRef.current = requestAnimationFrame(() => {
        callback();
      });
    }
  }, [callback, delay]);
};

export const createSpringAnimation = (
  from: number,
  to: number,
  duration: number,
  onUpdate: (value: number) => void
): { cancel: () => void } => {
  let startTime: number | null = null;
  let animationFrameId: number | null = null;

  const animate = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = from + (to - from) * easeProgress;
    
    onUpdate(currentValue);

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return {
    cancel: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
  };
};

export const createScrollAnimation = (
  element: HTMLElement,
  to: number,
  duration: number = 300
): { cancel: () => void } => {
  let startTime: number | null = null;
  let animationFrameId: number | null = null;
  const from = element.scrollTop;

  const animate = (timestamp: number) => {
    if (!startTime) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    const currentValue = from + (to - from) * easeProgress;
    
    element.scrollTop = currentValue;

    if (progress < 1) {
      animationFrameId = requestAnimationFrame(animate);
    }
  };

  animationFrameId = requestAnimationFrame(animate);

  return {
    cancel: () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    },
  };
};

export const prefersReducedMotion = (): boolean => {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

export const createOptimizedTransition = (
  properties: string[],
  config?: AnimationConfig
): React.CSSProperties => {
  const duration = config?.duration ? animationDurations[config.duration] : '300ms';
  const easing = config?.easing ? animationEasings[config.easing] : 'ease-in-out';
  const delay = config?.delay || '0ms';

  return {
    transition: properties.map(prop => `${prop} ${duration} ${easing} ${delay}`).join(', '),
    ...getHardwareAcceleratedStyle(),
  };
};

export default {
  fadeIn,
  fadeOut,
  slideInUp,
  slideInDown,
  slideInLeft,
  slideInRight,
  scaleIn,
  scaleOut,
  rotateIn,
  bounceIn,
  createTransition,
  getHardwareAcceleratedStyle,
  getWillChangeProperties,
  useAnimationFrame,
  useThrottledAnimationFrame,
  createSpringAnimation,
  createScrollAnimation,
  prefersReducedMotion,
  createOptimizedTransition,
};
