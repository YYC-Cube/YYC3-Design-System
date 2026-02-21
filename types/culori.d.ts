/**
 * @file culori类型定义
 * @description 为culori颜色库提供TypeScript类型支持
 * @module types/culori
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

declare module 'culori' {
  export interface Color {
    mode: string;
    [key: string]: number | string;
  }

  export interface Rgb {
    mode: 'rgb';
    r: number;
    g: number;
    b: number;
    alpha?: number;
  }

  export interface Hsl {
    mode: 'hsl';
    h: number;
    s: number;
    l: number;
    alpha?: number;
  }

  export interface Oklch {
    mode: 'oklch';
    l: number;
    c: number;
    h: number;
    alpha?: number;
  }

  export type AnyColor = Rgb | Hsl | Oklch | Color;

  export type ColorType = 'rgb' | 'hsl' | 'oklch' | 'lab' | 'lch' | 'hsv' | 'hsi' | 'hwb';

  export function parse(color: string): AnyColor | undefined;
  export function formatRgb(color: AnyColor): string;
  export function formatHex(color: AnyColor): string;
  export function formatHsl(color: AnyColor): string;
  export function converter(mode: ColorType): (color: AnyColor | string) => AnyColor;
  export function clampRgb(color: AnyColor): Rgb;
  export function displayable(color: AnyColor): boolean;
  export function difference(): (color1: AnyColor, color2: AnyColor) => number;
  export function nearest(colors: AnyColor[]): (color: AnyColor) => AnyColor;
  export function palette(color: AnyColor, options?: unknown): AnyColor[];
  export function samples(n?: number): AnyColor[];
  export function interpolate(colors: AnyColor[]): (t: number) => AnyColor;
  export function mix(color1: AnyColor, color2: AnyColor, t?: number): AnyColor;
  export function average(colors: AnyColor[]): AnyColor;

  export const formatter: {
    hex: (color: Hsl | Rgb | Oklch) => string;
    rgb: (color: AnyColor) => string;
    hsl: (color: AnyColor) => string;
  };
}
