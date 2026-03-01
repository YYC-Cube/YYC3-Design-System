/**
 * @file AI Token 生成器
 * @description 使用 AI 算法自动生成设计令牌
 * @module ai/token-generator
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { DesignTokens, GeneratedColorToken, GeneratedTokens } from '../../types/tokens';
import culori from 'culori';

export interface ColorHarmony {
  name: string;
  generate: (baseColor: string) => string[];
}

export interface TokenGenerationOptions {
  baseColor?: string;
  harmony?: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic';
  scale?: number;
  includeShades?: boolean;
  includeTints?: boolean;
}

export class AITokenGenerator {
  private harmonies: ColorHarmony[] = [
    {
      name: 'complementary',
      generate: (baseColor: string) => this.generateComplementary(baseColor),
    },
    {
      name: 'analogous',
      generate: (baseColor: string) => this.generateAnalogous(baseColor),
    },
    {
      name: 'triadic',
      generate: (baseColor: string) => this.generateTriadic(baseColor),
    },
    {
      name: 'tetradic',
      generate: (baseColor: string) => this.generateTetradic(baseColor),
    },
    {
      name: 'monochromatic',
      generate: (baseColor: string) => this.generateMonochromatic(baseColor),
    },
  ];

  private spacingScales = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256];
  private typeScales = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72];

  generateTokens(options: TokenGenerationOptions = {}): GeneratedTokens {
    const {
      baseColor = '#d45a5f',
      harmony = 'monochromatic',
      scale = 10,
      includeShades = true,
      includeTints = true,
    } = options;

    return {
      colors: this.generateColorTokens(baseColor, harmony, includeShades, includeTints),
      spacing: this.generateSpacingTokens(scale),
      typography: this.generateTypographyTokens(),
    };
  }

  private generateColorTokens(
    baseColor: string,
    harmony: string,
    includeShades: boolean,
    includeTints: boolean
  ): Record<string, GeneratedColorToken> {
    const harmonyFn = this.harmonies.find((h) => h.name === harmony);
    if (!harmonyFn) {
      throw new Error(`Unknown harmony: ${harmony}`);
    }

    const colors = harmonyFn.generate(baseColor);
    const colorTokens: Record<string, GeneratedColorToken> = {};

    colors.forEach((color, index) => {
      const colorName = index === 0 ? 'primary' : `color-${index + 1}`;
      colorTokens[colorName] = {
        name: colorName,
        value: {
          oklch: this.hexToOklch(color),
          hex: color,
          foreground: this.getContrastColor(color),
        },
      };

      if (includeShades) {
        const shades = this.generateShades(color);
        shades.forEach((shade, shadeIndex) => {
          colorTokens[`${colorName}-${shadeIndex * 100}`] = {
            name: `${colorName}-${shadeIndex * 100}`,
            value: {
              oklch: this.hexToOklch(shade),
              hex: shade,
              foreground: this.getContrastColor(shade),
            },
          };
        });
      }

      if (includeTints) {
        const tints = this.generateTints(color);
        tints.forEach((tint, tintIndex) => {
          colorTokens[`${colorName}-${tintIndex * 100 + 50}`] = {
            name: `${colorName}-${tintIndex * 100 + 50}`,
            value: {
              oklch: this.hexToOklch(tint),
              hex: tint,
              foreground: this.getContrastColor(tint),
            },
          };
        });
      }
    });

    return colorTokens;
  }

  private generateComplementary(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [baseColor];
    const complementary: culori.Hsl = { h: (hsl.h || 0) + 180, s: hsl.s, l: hsl.l, mode: 'hsl' };
    return [baseColor, culori.formatter.hex(complementary)];
  }

  private generateAnalogous(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 4; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 30, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateTriadic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 2; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 120, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateTetradic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 3; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 90, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateMonochromatic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [baseColor];
    const colors: string[] = [baseColor];
    for (let i = 1; i <= 10; i++) {
      const lightness = 0.1 + i * 0.08;
      const color: culori.Hsl = { h: hsl.h || 0, s: hsl.s, l: lightness, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateShades(color: string): string[] {
    const hsl = culori.converter('hsl')(color) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [];
    const shades: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const shade: culori.Hsl = {
        h: hsl.h || 0,
        s: hsl.s,
        l: Math.max(0, (hsl.l || 0.5) - i * 0.1),
        mode: 'hsl',
      };
      shades.push(culori.formatter.hex(shade));
    }
    return shades;
  }

  private generateTints(color: string): string[] {
    const hsl = culori.converter('hsl')(color) as {
      h: number;
      s: number;
      l: number;
      mode?: 'hsl';
    } | null;
    if (!hsl) return [];
    const tints: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const tint: culori.Hsl = {
        h: hsl.h || 0,
        s: hsl.s,
        l: Math.min(1, (hsl.l || 0.5) + i * 0.1),
        mode: 'hsl',
      };
      tints.push(culori.formatter.hex(tint));
    }
    return tints;
  }

  private generateSpacingTokens(scale: number): Record<string, string | number> {
    const spacingTokens: Record<string, string | number> = {};
    const scaledValues = this.spacingScales.map((v) => v * (scale / 10));

    scaledValues.forEach((value, index) => {
      const name = this.getSpacingName(index);
      spacingTokens[name] = `${value}px`;
    });

    return spacingTokens;
  }

  private getSpacingName(index: number): string {
    const names = [
      'xs',
      'sm',
      'md',
      'lg',
      'xl',
      '2xl',
      '3xl',
      '4xl',
      '5xl',
      '6xl',
      '7xl',
      '8xl',
      '9xl',
      '10xl',
      '11xl',
      '12xl',
    ];
    return names[index] || `spacing-${index}`;
  }

  private generateTypographyTokens(): Record<string, string> {
    const typographyTokens: Record<string, string> = {};

    this.typeScales.forEach((size, index) => {
      const name = this.getTypeName(index);
      typographyTokens[name] = `${size}px`;
    });

    return typographyTokens;
  }

  private getTypeName(index: number): string {
    const names = ['xs', 'sm', 'base', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl'];
    return names[index] || `text-${index}`;
  }

  private hexToOklch(hex: string): string {
    const oklch = culori.converter('oklch')(hex) as {
      l: number;
      c: number;
      h: number;
      mode?: 'oklch';
    } | null;
    if (!oklch) return hex;
    return `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${(oklch.h || 0).toFixed(4)})`;
  }

  private getContrastColor(hex: string): string {
    const rgb = culori.converter('rgb')(hex) as {
      r: number;
      g: number;
      b: number;
      mode?: 'rgb';
    } | null;
    if (!rgb) return '#000000';
    const luminance = 0.299 * (rgb.r || 0) + 0.587 * (rgb.g || 0) + 0.114 * (rgb.b || 0);
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  analyzeColorHarmony(colors: string[]): string {
    if (colors.length < 2) return 'monochromatic';

    const hsls = colors.map(
      (c) => culori.converter('hsl')(c) as { h: number; s: number; l: number; mode?: 'hsl' } | null
    );
    const hueDifferences = hsls.slice(1).map((hsl, i) => {
      const prevHsl = hsls[i];
      if (!hsl || !prevHsl) return 0;
      const diff = Math.abs((hsl.h || 0) - (prevHsl.h || 0));
      return Math.min(diff, 360 - diff);
    });

    const avgDiff =
      hueDifferences.length > 0
        ? hueDifferences.reduce((a, b) => a + b, 0) / hueDifferences.length
        : 0;

    if (avgDiff > 170 && avgDiff < 190) return 'complementary';
    if (avgDiff > 110 && avgDiff < 130) return 'triadic';
    if (avgDiff > 80 && avgDiff < 100) return 'tetradic';
    if (avgDiff > 20 && avgDiff < 40) return 'analogous';

    return 'monochromatic';
  }

  generateRecommendations(tokens: GeneratedTokens | DesignTokens): string[] {
    const recommendations: string[] = [];

    const colors = Object.values(tokens.colors || {});
    if (colors.length > 0) {
      const colorHexes = colors.map((c) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object' && c !== null && 'hex' in c) return (c as { hex: string }).hex;
        if (typeof c === 'object' && c !== null && 'value' in c) {
          const value = (c as { value: unknown }).value;
          if (typeof value === 'string') return value;
          if (typeof value === 'object' && value !== null && 'hex' in value)
            return (value as { hex: string }).hex;
        }
        return c as string;
      });
      const harmony = this.analyzeColorHarmony(colorHexes);
      recommendations.push(`当前配色方案使用 ${harmony} 色彩和谐`);

      if (harmony === 'monochromatic') {
        recommendations.push('建议尝试 complementary 或 analogous 色彩和谐以增加视觉对比');
      }
    }

    const spacing = Object.values(tokens.spacing || {});
    if (spacing.length > 0) {
      const values = spacing.map((s) => {
        if (typeof s === 'string') return parseInt(s);
        if (typeof s === 'number') return s;
        return 0;
      });
      const ratio = values.length > 1 ? values[1] / values[0] : 0;
      if (ratio > 2.5 || ratio < 1.5) {
        recommendations.push('建议使用 1.5 或 1.618 的间距比例以获得更好的视觉节奏');
      }
    }

    return recommendations;
  }
}

export const tokenGenerator = new AITokenGenerator();
