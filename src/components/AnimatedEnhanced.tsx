/**
 * @file 增强动画组件
 * @description 支持更多预设动画的增强版动画组件
 * @component AnimatedEnhanced
 * @author YYC³
 * @version 2.0.0
 * @created 2026-02-25
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import React, { useState, useMemo, useCallback, ReactNode } from 'react';
import { getAnimationString } from '../utils/animations-enhanced';
import type { EnhancedAnimationConfig } from '../../types/animations';

export type AnimationPreset =
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
  | 'elasticIn'
  | 'flipInX'
  | 'flipInY'
  | 'zoomIn'
  | 'rollIn'
  | 'lightSpeedIn'
  | 'pulse'
  | 'shake'
  | 'swing'
  | 'tada'
  | 'wobble'
  | 'jelly'
  | 'glitch'
  | 'heartbeat'
  | 'rubberBand';

export interface AnimatedEnhancedProps {
  children: ReactNode;
  animation?: AnimationPreset;
  config?: EnhancedAnimationConfig;
  className?: string;
  trigger?: 'mount' | 'hover' | 'click' | 'manual';
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onAnimationIteration?: () => void;
  disabled?: boolean;
}

export const AnimatedEnhanced: React.FC<AnimatedEnhancedProps> = ({
  children,
  animation = 'fadeIn',
  config,
  className = '',
  trigger = 'mount',
  onAnimationStart,
  onAnimationEnd,
  onAnimationIteration,
  disabled = false,
}) => {
  const [isAnimating, setIsAnimating] = useState(trigger === 'mount');
  const elementRef = React.useRef<HTMLDivElement>(null);

  const animationStyle = useMemo(() => {
    if (disabled || (!isAnimating && trigger !== 'mount' && trigger !== 'manual')) {
      return {};
    }

    const animationString = getAnimationString(animation, config);
    return { animation: animationString };
  }, [animation, config, disabled, isAnimating, trigger]);

  const handleClick = useCallback(() => {
    if (trigger === 'click' && !disabled) {
      setIsAnimating(prev => !prev);
    }
  }, [trigger, disabled]);

  const handleAnimationStart = useCallback(() => {
    onAnimationStart?.();
  }, [onAnimationStart]);

  const handleAnimationEnd = useCallback(() => {
    onAnimationEnd?.();
    if (trigger === 'click') {
      setIsAnimating(false);
    }
  }, [onAnimationEnd, trigger]);

  const handleAnimationIteration = useCallback(() => {
    onAnimationIteration?.();
  }, [onAnimationIteration]);

  const containerStyle = useMemo(() => ({
    cursor: trigger === 'click' ? 'pointer' : 'default',
    ...animationStyle,
  }), [trigger, disabled, animationStyle]);

  return (
    <div
      ref={elementRef}
      style={containerStyle}
      className={className}
      onClick={handleClick}
      onAnimationStart={handleAnimationStart}
      onAnimationEnd={handleAnimationEnd}
      onAnimationIteration={handleAnimationIteration}
    >
      {children}
    </div>
  );
};

AnimatedEnhanced.displayName = 'AnimatedEnhanced';

export default AnimatedEnhanced;
