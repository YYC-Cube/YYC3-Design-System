export interface AnimationTokens {
  duration: {
    fast: string;
    normal: string;
    slow: string;
  };
  easing: {
    'ease-in': string;
    'ease-out': string;
    'ease-in-out': string;
    bounce: string;
  };
  keyframes: {
    'fade-in': string;
    'fade-out': string;
    'slide-in-up': string;
    'slide-in-down': string;
    'slide-in-left': string;
    'slide-in-right': string;
    'scale-in': string;
    'scale-out': string;
    'rotate-in': string;
    'bounce-in': string;
  };
}

export type AnimationDuration = 'fast' | 'normal' | 'slow';
export type AnimationEasing = 'ease-in' | 'ease-out' | 'ease-in-out' | 'bounce' | 'elastic' | 'back';
export type AnimationKeyframe = 'fade-in' | 'fade-out' | 'slide-in-up' | 'slide-in-down' | 'slide-in-left' | 'slide-in-right' | 'scale-in' | 'scale-out' | 'rotate-in' | 'bounce-in';

export interface AnimationConfig {
  duration?: AnimationDuration;
  easing?: AnimationEasing;
  delay?: string;
  fillMode?: 'forwards' | 'backwards' | 'both' | 'none';
}

export interface AnimatedProps {
  children: React.ReactNode;
  animation?: 'fadeIn' | 'fadeOut' | 'slideInUp' | 'slideInDown' | 'slideInLeft' | 'slideInRight' | 'scaleIn' | 'scaleOut' | 'rotateIn' | 'bounceIn';
  config?: AnimationConfig;
  className?: string;
  trigger?: 'mount' | 'hover' | 'click';
}

export interface EnhancedAnimationConfig extends Omit<AnimationConfig, 'delay'> {
  stagger?: number;
  delay?: number;
  repeat?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}
