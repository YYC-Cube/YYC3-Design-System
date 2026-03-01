declare module 'culori' {
  type ColorMode = 'rgb' | 'hsl' | 'lab' | 'lch' | 'oklch' | 'hsv' | 'hwb' | 'cmyk' | 'xyz' | 'yiq';

  type RGBColor = { r: number; g: number; b: number; mode?: 'rgb' };
  type HSLColor = { h: number; s: number; l: number; mode?: 'hsl' };
  type LABColor = { l: number; a: number; b: number; mode?: 'lab' };
  type LCHColor = { l: number; c: number; h: number; mode?: 'lch' };
  type OKLCHColor = { l: number; c: number; h: number; mode?: 'oklch' };

  type Color =
    | RGBColor
    | HSLColor
    | LABColor
    | LCHColor
    | OKLCHColor
    | {
        mode: ColorMode;
        [key: string]: number | string;
      };

  export function converter(mode: ColorMode): (color: Color | string) => Color | null;
  export function formatHex(color: Color): string;
  export function formatHex8(color: Color): string;
  export function lch(color: Color): LCHColor | null;
  export function oklch(color: Color): OKLCHColor | null;
  export function lab(color: Color): LABColor | null;
  export function rgb(color: Color): RGBColor | null;
  export function hsl(color: Color): HSLColor | null;
  export function hue(color: Color): number;
  export function chroma(color: Color): number;
  export function lightness(color: Color): number;
  export function mix(color1: Color, color2: Color, p?: number): Color;
  export function deltaE(color1: Color, color2: Color, mode?: ColorMode): number;
  export function wcagContrast(color1: Color, color2: Color): number;
  export function nearest(color: Color, colors: Color[], mode?: ColorMode): Color;
  export function mode(mode: ColorMode): (color: Color) => Color;
  export const formatter: {
    hex: (color: Color) => string;
  };
  export const minContrast: {
    AA: number;
    AAA: number;
  };
}
