// path: src/types/animation.d.ts
/**
 * YYC\u00b3 Design System \u2014 Animation Token Type Definitions
 *
 * All animation values are CSS Custom Properties referenced via var(--*).
 * Components should use these tokens instead of hardcoded values.
 *
 * CSS Variables:
 *   --duration-fast:    120ms
 *   --duration-normal:  200ms
 *   --duration-slow:    350ms
 *   --easing-default:   cubic-bezier(0.25, 0.8, 0.25, 1)
 *   --easing-in:        cubic-bezier(0.4, 0, 1, 1)
 *   --easing-out:       cubic-bezier(0, 0, 0.2, 1)
 *   --easing-in-out:    cubic-bezier(0.4, 0, 0.2, 1)
 */

export type DurationKey = 'fast' | 'normal' | 'slow';
export type EasingKey = 'default' | 'in' | 'out' | 'in-out';

export type AnimationKey = `${DurationKey}`;

export interface AnimationConfig {
  duration: DurationKey;
  easing: EasingKey;
  delay?: number;
  repeat?: number | 'infinite';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  fillMode?: 'none' | 'forwards' | 'backwards' | 'both';
}

/**
 * Predefined animation presets used across the design system.
 * Each preset maps to specific duration + easing token combinations.
 */
export interface AnimationPresets {
  /** Standard hover/focus transitions: duration-fast + easing-default */
  microInteraction: AnimationConfig;
  /** Page transitions, tab switches: duration-normal + easing-out */
  transition: AnimationConfig;
  /** Entry animations, modals: duration-slow + easing-out */
  entrance: AnimationConfig;
  /** Exit animations: duration-fast + easing-in */
  exit: AnimationConfig;
  /** Continuous effects (pulse, glow): duration-slow + easing-in-out, infinite */
  loop: AnimationConfig;
}

export const animationPresets: AnimationPresets;

/**
 * Raw animation token values.
 * These correspond directly to CSS Custom Properties.
 */
export interface AnimationTokenValues {
  duration: {
    fast: '120ms';
    normal: '200ms';
    slow: '350ms';
  };
  easing: {
    default: 'cubic-bezier(0.25, 0.8, 0.25, 1)';
    in: 'cubic-bezier(0.4, 0, 1, 1)';
    out: 'cubic-bezier(0, 0, 0.2, 1)';
    'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)';
  };
}

/**
 * Performance constraint: no animation > 300ms that blocks interaction.
 * All animated components must respect this budget.
 */
export const MAX_BLOCKING_ANIMATION_MS: 300;
