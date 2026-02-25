import { AnimationDuration, AnimationEasing, EnhancedAnimationConfig } from '../../types/animations';

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

export interface KeyframeAnimation {
  name: string;
  keyframes: string;
  duration?: AnimationDuration;
  easing?: AnimationEasing;
  delay?: number;
}

export const enhancedAnimations: Record<string, KeyframeAnimation> = {
  fadeIn: {
    name: 'fadeIn',
    keyframes: `
      @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  fadeOut: {
    name: 'fadeOut',
    keyframes: `
      @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
      }
    `,
    duration: 'normal',
    easing: 'ease-in',
  },
  slideInUp: {
    name: 'slideInUp',
    keyframes: `
      @keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  slideInDown: {
    name: 'slideInDown',
    keyframes: `
      @keyframes slideInDown {
        from {
          transform: translateY(-100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  slideInLeft: {
    name: 'slideInLeft',
    keyframes: `
      @keyframes slideInLeft {
        from {
          transform: translateX(-100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  slideInRight: {
    name: 'slideInRight',
    keyframes: `
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  scaleIn: {
    name: 'scaleIn',
    keyframes: `
      @keyframes scaleIn {
        from {
          transform: scale(0);
          opacity: 0;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  scaleOut: {
    name: 'scaleOut',
    keyframes: `
      @keyframes scaleOut {
        from {
          transform: scale(1);
          opacity: 1;
        }
        to {
          transform: scale(0);
          opacity: 0;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-in',
  },
  rotateIn: {
    name: 'rotateIn',
    keyframes: `
      @keyframes rotateIn {
        from {
          transform: rotate(-180deg);
          opacity: 0;
        }
        to {
          transform: rotate(0);
          opacity: 1;
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-out',
  },
  bounceIn: {
    name: 'bounceIn',
    keyframes: `
      @keyframes bounceIn {
        0%, 20%, 40%, 60%, 80%, 100% {
          transform: scale(0);
        }
        50% {
          transform: scale(1.1);
        }
        70% {
          transform: scale(0.95);
        }
        90% {
          transform: scale(1.02);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
    duration: 'slow',
    easing: 'bounce',
  },
  elasticIn: {
    name: 'elasticIn',
    keyframes: `
      @keyframes elasticIn {
        from {
          transform: scale(0);
        }
        to {
          transform: scale(1);
        }
      }
    `,
    duration: 'slow',
    easing: 'elastic',
  },
  flipInX: {
    name: 'flipInX',
    keyframes: `
      @keyframes flipInX {
        from {
          transform: perspective(400px) rotateX(90deg);
          opacity: 0;
        }
        to {
          transform: perspective(400px) rotateX(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  flipInY: {
    name: 'flipInY',
    keyframes: `
      @keyframes flipInY {
        from {
          transform: perspective(400px) rotateY(90deg);
          opacity: 0;
        }
        to {
          transform: perspective(400px) rotateY(0);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  zoomIn: {
    name: 'zoomIn',
    keyframes: `
      @keyframes zoomIn {
        from {
          transform: scale(0.3);
          opacity: 0;
        }
        50% {
          opacity: 1;
        }
        to {
          transform: scale(1);
          opacity: 1;
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-out',
  },
  rollIn: {
    name: 'rollIn',
    keyframes: `
      @keyframes rollIn {
        from {
          transform: translateX(-100%) rotate(-120deg);
          opacity: 0;
        }
        to {
          transform: translateX(0) rotate(0);
          opacity: 1;
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-out',
  },
  lightSpeedIn: {
    name: 'lightSpeedIn',
    keyframes: `
      @keyframes lightSpeedIn {
        from {
          transform: translateX(100%) skewX(-30deg);
          opacity: 0;
        }
        60% {
          transform: translateX(-20%) skewX(30deg);
          opacity: 1;
        }
        80% {
          transform: translateX(0) skewX(-15deg);
          opacity: 1;
        }
        to {
          transform: translateX(0) skewX(0);
          opacity: 1;
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-out',
  },
  pulse: {
    name: 'pulse',
    keyframes: `
      @keyframes pulse {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.05);
        }
        100% {
          transform: scale(1);
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-in-out',
  },
  shake: {
    name: 'shake',
    keyframes: `
      @keyframes shake {
        0%, 100% {
          transform: translateX(0);
        }
        10%, 30%, 50%, 70%, 90% {
          transform: translateX(-10px);
        }
        20%, 40%, 60%, 80% {
          transform: translateX(10px);
        }
      }
    `,
    duration: 'normal',
    easing: 'ease-in-out',
  },
  swing: {
    name: 'swing',
    keyframes: `
      @keyframes swing {
        20% {
          transform: rotate3d(0, 0, 1, 15deg);
        }
        40% {
          transform: rotate3d(0, 0, 1, -10deg);
        }
        60% {
          transform: rotate3d(0, 0, 1, 5deg);
        }
        80% {
          transform: rotate3d(0, 0, 1, -5deg);
        }
        100% {
          transform: rotate3d(0, 0, 1, 0deg);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
  tada: {
    name: 'tada',
    keyframes: `
      @keyframes tada {
        0% {
          transform: scale(1) rotate(0deg);
        }
        10%, 20% {
          transform: scale(0.9) rotate(-3deg);
        }
        30%, 50%, 70%, 90% {
          transform: scale(1.1) rotate(3deg);
        }
        40%, 60%, 80% {
          transform: scale(1.1) rotate(-3deg);
        }
        100% {
          transform: scale(1) rotate(0deg);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
  wobble: {
    name: 'wobble',
    keyframes: `
      @keyframes wobble {
        0% {
          transform: translateX(0);
        }
        15% {
          transform: translateX(-25%) rotate(-5deg);
        }
        30% {
          transform: translateX(20%) rotate(3deg);
        }
        45% {
          transform: translateX(-15%) rotate(-3deg);
        }
        60% {
          transform: translateX(10%) rotate(2deg);
        }
        75% {
          transform: translateX(-5%) rotate(-1deg);
        }
        100% {
          transform: translateX(0) rotate(0);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
  jelly: {
    name: 'jelly',
    keyframes: `
      @keyframes jelly {
        0%, 11.1%, 100% {
          transform: translateX(0);
        }
        22.2% {
          transform: translateX(-12.5px) skewX(-12.5deg);
        }
        33.3% {
          transform: translateX(6.25px) skewX(6.25deg);
        }
        44.4% {
          transform: translateX(-3.125px) skewX(-3.125deg);
        }
        55.5% {
          transform: translateX(1.5625px) skewX(1.5625deg);
        }
        66.6% {
          transform: translateX(-0.78125px) skewX(-0.78125deg);
        }
        77.7% {
          transform: translateX(0.390625px) skewX(0.390625deg);
        }
        88.8% {
          transform: translateX(-0.1953125px) skewX(-0.1953125deg);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
  glitch: {
    name: 'glitch',
    keyframes: `
      @keyframes glitch {
        0% {
          transform: translate(0);
        }
        20% {
          transform: translate(-2px, 2px);
        }
        40% {
          transform: translate(-2px, -2px);
        }
        60% {
          transform: translate(2px, 2px);
        }
        80% {
          transform: translate(2px, -2px);
        }
        100% {
          transform: translate(0);
        }
      }
    `,
    duration: 'fast',
    easing: 'ease-in-out',
  },
  heartbeat: {
    name: 'heartbeat',
    keyframes: `
      @keyframes heartbeat {
        0% {
          transform: scale(1);
        }
        14% {
          transform: scale(1.3);
        }
        28% {
          transform: scale(1);
        }
        42% {
          transform: scale(1.3);
        }
        70% {
          transform: scale(1);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
  rubberBand: {
    name: 'rubberBand',
    keyframes: `
      @keyframes rubberBand {
        0% {
          transform: scale3d(1, 1, 1);
        }
        30% {
          transform: scale3d(1.25, 0.75, 1);
        }
        40% {
          transform: scale3d(0.75, 1.25, 1);
        }
        50% {
          transform: scale3d(1.15, 0.85, 1);
        }
        65% {
          transform: scale3d(0.95, 1.05, 1);
        }
        75% {
          transform: scale3d(1.05, 0.95, 1);
        }
        100% {
          transform: scale3d(1, 1, 1);
        }
      }
    `,
    duration: 'slow',
    easing: 'ease-in-out',
  },
};

export const getAnimationString = (
  animationName: string,
  config?: EnhancedAnimationConfig
): string => {
  const animation = enhancedAnimations[animationName];
  if (!animation) {
    return 'none';
  }

  const duration = config?.duration ? animationDurations[config.duration] : animationDurations[animation.duration || 'normal'];
  const easing = config?.easing ? animationEasings[config.easing] : animationEasings[animation.easing || 'ease-in-out'];
  const delay = config?.delay !== undefined ? `${config.delay}ms` : (animation.delay !== undefined ? `${animation.delay}ms` : '0ms');
  const repeat = config?.repeat || 1;
  const direction = config?.direction || 'normal';
  const fillMode = config?.fillMode || 'both';

  return `${animationName} ${duration} ${easing} ${delay} ${repeat} ${direction} ${fillMode}`;
};

export const createStaggeredAnimation = (
  baseAnimation: string,
  count: number,
  staggerDelay: number = 50
): string[] => {
  return Array.from({ length: count }, (_, index) => {
    return `${baseAnimation} ${index * staggerDelay}ms`;
  });
};

export const applyAnimationToElement = (
  element: HTMLElement,
  animationName: string,
  config?: EnhancedAnimationConfig
): void => {
  element.style.animation = getAnimationString(animationName, config);
};

export const injectGlobalKeyframes = (): void => {
  if (typeof document === 'undefined') return;

  const existingStyle = document.getElementById('enhanced-animations');
  if (existingStyle) return;

  const style = document.createElement('style');
  style.id = 'enhanced-animations';
  style.textContent = Object.values(enhancedAnimations)
    .map(anim => anim.keyframes)
    .join('\n');

  document.head.appendChild(style);
};

export const createCustomAnimation = (
  name: string,
  keyframes: string,
  config?: Pick<EnhancedAnimationConfig, 'duration' | 'easing' | 'delay'>
): KeyframeAnimation => {
  return {
    name,
    keyframes: `@keyframes ${name} {\n${keyframes}\n}`,
    duration: config?.duration || 'normal',
    easing: config?.easing || 'ease-in-out',
    delay: config?.delay,
  };
};

export const registerCustomAnimation = (animation: KeyframeAnimation): void => {
  enhancedAnimations[animation.name] = animation;

  if (typeof document !== 'undefined') {
    const existingStyle = document.getElementById('enhanced-animations');
    if (existingStyle) {
      existingStyle.textContent += '\n' + animation.keyframes;
    } else {
      injectGlobalKeyframes();
    }
  }
};

export const getAvailableAnimations = (): string[] => {
  return Object.keys(enhancedAnimations);
};

export const getAnimationByName = (name: string): KeyframeAnimation | undefined => {
  return enhancedAnimations[name];
};
