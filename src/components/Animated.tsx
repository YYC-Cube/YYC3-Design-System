import React, { useState, useMemo, useCallback } from 'react';
import {
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
} from '../utils/animations';
import type { AnimationConfig } from '../../types/animations';

interface AnimatedProps {
  children: React.ReactNode;
  animation?:
    | 'fadeIn'
    | 'fadeOut'
    | 'slideInUp'
    | 'slideInDown'
    | 'slideInLeft'
    | 'slideInRight'
    | 'scaleIn'
    | 'scaleOut'
    | 'rotateIn'
    | 'bounceIn';
  config?: AnimationConfig;
  className?: string;
  trigger?: 'mount' | 'hover' | 'click';
}

const animationMap = {
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
};

export const Animated: React.FC<AnimatedProps> = ({
  children,
  animation = 'fadeIn',
  config,
  className = '',
  trigger = 'mount',
}) => {
  const [isAnimated, setIsAnimated] = useState(trigger === 'mount');
  const [isHovered, setIsHovered] = useState(false);

  const animationStyle = useMemo(() => {
    const animationFunc = animationMap[animation];
    const animationString = animationFunc(config);
    return { animation: animationString };
  }, [animation, config]);

  const transitionStyle = useMemo(() => {
    return { transition: createTransition('transform, opacity', config) };
  }, [config]);

  const handleMouseEnter = useCallback(() => {
    if (trigger === 'hover') {
      setIsHovered(true);
    }
  }, [trigger]);

  const handleMouseLeave = useCallback(() => {
    if (trigger === 'hover') {
      setIsHovered(false);
    }
  }, [trigger]);

  const handleClick = useCallback(() => {
    if (trigger === 'click') {
      setIsAnimated((prev) => !prev);
    }
  }, [trigger]);

  const shouldAnimate = trigger === 'mount' ? true : trigger === 'hover' ? isHovered : isAnimated;

  const containerStyle = useMemo(
    () => ({
      ...transitionStyle,
      cursor: trigger === 'click' ? 'pointer' : 'default',
      ...(shouldAnimate ? animationStyle : {}),
    }),
    [transitionStyle, trigger, shouldAnimate, animationStyle]
  );

  return (
    <div
      style={containerStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      className={className}
    >
      {children}
    </div>
  );
};

export default Animated;
