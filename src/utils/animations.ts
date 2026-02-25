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

export const animationKeyframes: Record<AnimationKeyframe, string> = {
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
