/**
 * @file 自定义动画组件
 * @description 支持用户定义自定义动画的组件
 * @component CustomAnimation
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 * @updated 2026-02-25
 * @copyright Copyright (c) 2026 YYC³
 * @license MIT
 */

import * as React from 'react';
import { registerCustomAnimation, createCustomAnimation } from '../utils/animations-enhanced';
import type { EnhancedAnimationConfig } from '../../types/animations';

const { useState, useMemo, useCallback, useEffect } = React;

type ReactNode = React.ReactNode;

export interface CustomKeyframeStep {
  percentage: number;
  styles: Record<string, string>;
}

export interface CustomAnimationDefinition {
  name: string;
  keyframes: CustomKeyframeStep[];
  duration?: 'fast' | 'normal' | 'slow';
  easing?: 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'back';
  delay?: number;
}

export interface CustomAnimationProps {
  children: ReactNode;
  definition: CustomAnimationDefinition;
  config?: EnhancedAnimationConfig;
  className?: string;
  trigger?: 'mount' | 'hover' | 'click' | 'manual';
  onAnimationStart?: () => void;
  onAnimationEnd?: () => void;
  onAnimationIteration?: () => void;
  disabled?: boolean;
  shouldRegister?: boolean;
}

const generateKeyframesString = (keyframes: CustomKeyframeStep[]): string => {
  const steps = keyframes.map((step) => {
    const styles = Object.entries(step.styles)
      .map(([prop, value]) => `${prop}: ${value}`)
      .join('; ');
    return `${step.percentage}% { ${styles} }`;
  });

  return steps.join('\n  ');
};

export const CustomAnimation: React.FC<CustomAnimationProps> = ({
  children,
  definition,
  config,
  className = '',
  trigger = 'mount',
  onAnimationStart,
  onAnimationEnd,
  onAnimationIteration,
  disabled = false,
  shouldRegister = true,
}) => {
  const [isAnimating, setIsAnimating] = useState(trigger === 'mount');
  const animationRegisteredRef = React.useRef(false);

  const keyframesString = useMemo(() => {
    return generateKeyframesString(definition.keyframes);
  }, [definition.keyframes]);

  const animationName = definition.name;

  const animationStyle = useMemo(() => {
    if (disabled || (!isAnimating && trigger !== 'mount' && trigger !== 'manual')) {
      return {};
    }

    const duration = config?.duration || definition.duration || 'normal';
    const easing = config?.easing || definition.easing || 'ease-in-out';
    const delay = config?.delay || definition.delay || 0;
    const repeat = config?.repeat || 1;
    const direction = config?.direction || 'normal';
    const fillMode = config?.fillMode || 'both';

    const durationMap: Record<'fast' | 'normal' | 'slow', string> = {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    };

    const easingMap: Record<
      'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'back',
      string
    > = {
      'ease-in': 'cubic-bezier(0.4, 0, 1,1)',
      'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
      'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      elastic: 'cubic-bezier(0.68, -0.6, 0.32, 1.6)',
      back: 'cubic-bezier(0.36, 0, 0.66, -0.56)',
    };

    return {
      animation: `${animationName} ${durationMap[duration]} ${easingMap[easing]} ${delay}ms ${repeat} ${direction} ${fillMode}`,
    };
  }, [isAnimating, trigger, definition, config, animationName]);

  useEffect(() => {
    if (shouldRegister && !animationRegisteredRef.current) {
      const customAnimation = createCustomAnimation(definition.name, keyframesString, {
        duration: definition.duration,
        easing: definition.easing,
        delay: definition.delay,
      });

      registerCustomAnimation(customAnimation);
      animationRegisteredRef.current = true;
    }
  }, [shouldRegister, definition, keyframesString]);

  const handleClick = useCallback(() => {
    if (trigger === 'click' && !disabled) {
      setIsAnimating((prev) => !prev);
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

  const containerStyle = useMemo(
    () => ({
      cursor: trigger === 'click' ? 'pointer' : 'default',
      ...animationStyle,
    }),
    [trigger, disabled, animationStyle]
  );

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            ${keyframesString}
          }
        `}
      </style>
      <div
        style={containerStyle}
        className={className}
        onClick={handleClick}
        onAnimationStart={handleAnimationStart}
        onAnimationEnd={handleAnimationEnd}
        onAnimationIteration={handleAnimationIteration}
      >
        {children}
      </div>
    </>
  );
};

CustomAnimation.displayName = 'CustomAnimation';

export default CustomAnimation;
