import { GeneratedTokens, GeneratedColorToken } from '../../types/tokens';
import culori from 'culori';

export interface ColorSpaceValue {
  hex: string;
  hsl: string;
  lab: string;
  rgb: string;
  oklch: string;
}

export interface EnhancedColorToken extends GeneratedColorToken {
  colorSpaces: ColorSpaceValue;
  contrastRatio: number;
  wcagAA: boolean;
  wcagAAA: boolean;
}

export interface TokenGenerationEnhancedOptions {
  baseColor?: string;
  harmony?: 'complementary' | 'analogous' | 'triadic' | 'tetradic' | 'monochromatic' | 'split-complementary' | 'double-complementary';
  scale?: number;
  includeShades?: boolean;
  includeTints?: boolean;
  targetContrast?: 'AA' | 'AAA';
  optimizeForAccessibility?: boolean;
  colorSpace?: 'hex' | 'hsl' | 'lab' | 'rgb' | 'oklch';
}

export class EnhancedAITokenGenerator {
  private harmonies: Record<string, (baseColor: string) => string[]> = {
    'complementary': (baseColor) => this.generateComplementary(baseColor),
    'analogous': (baseColor) => this.generateAnalogous(baseColor),
    'triadic': (baseColor) => this.generateTriadic(baseColor),
    'tetradic': (baseColor) => this.generateTetradic(baseColor),
    'monochromatic': (baseColor) => this.generateMonochromatic(baseColor),
    'split-complementary': (baseColor) => this.generateSplitComplementary(baseColor),
    'double-complementary': (baseColor) => this.generateDoubleComplementary(baseColor),
  };

  private spacingScales = [4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80, 96, 128, 160, 192, 256];
  private typeScales = [12, 14, 16, 18, 20, 24, 30, 36, 48, 60, 72];

  generateTokens(options: TokenGenerationEnhancedOptions = {}): GeneratedTokens & { enhancedColors: Record<string, EnhancedColorToken> } {
    const {
      baseColor = '#d45a5f',
      harmony = 'monochromatic',
      scale = 10,
      includeShades = true,
      includeTints = true,
      targetContrast = 'AA',
      optimizeForAccessibility = true,
    } = options;

    const colors = this.harmonies[harmony](baseColor);
    const colorTokens: Record<string, EnhancedColorToken> = {};
    const generatedTokens: Record<string, GeneratedColorToken> = {};

    colors.forEach((color, index) => {
      const colorName = index === 0 ? 'primary' : `color-${index + 1}`;
      const colorSpaces = this.getAllColorSpaces(color);
      const contrastRatio = this.calculateContrastRatio(color, '#ffffff');
      const wcagAA = contrastRatio >= 4.5;
      const wcagAAA = contrastRatio >= 7;

      let optimizedColor = color;
      if (optimizeForAccessibility && !wcagAA) {
        optimizedColor = this.optimizeForContrast(color, targetContrast === 'AAA' ? 7 : 4.5);
      }

      const enhancedToken: EnhancedColorToken = {
        name: colorName,
        value: {
          oklch: colorSpaces.oklch,
          hex: optimizedColor,
          foreground: this.getContrastColor(optimizedColor),
        },
        colorSpaces: {
          hex: optimizedColor,
          hsl: colorSpaces.hsl,
          lab: colorSpaces.lab,
          rgb: colorSpaces.rgb,
          oklch: colorSpaces.oklch,
        },
        contrastRatio,
        wcagAA,
        wcagAAA,
      };

      colorTokens[colorName] = enhancedToken;
      generatedTokens[colorName] = enhancedToken;

      if (includeShades) {
        const shades = this.generateShades(optimizedColor);
        shades.forEach((shade, shadeIndex) => {
          const shadeSpaces = this.getAllColorSpaces(shade);
          const shadeContrast = this.calculateContrastRatio(shade, '#ffffff');

          const enhancedShade: EnhancedColorToken = {
            name: `${colorName}-${shadeIndex * 100}`,
            value: {
              oklch: shadeSpaces.oklch,
              hex: shade,
              foreground: this.getContrastColor(shade),
            },
            colorSpaces: shadeSpaces,
            contrastRatio: shadeContrast,
            wcagAA: shadeContrast >= 4.5,
            wcagAAA: shadeContrast >= 7,
          };

          colorTokens[`${colorName}-${shadeIndex * 100}`] = enhancedShade;
          generatedTokens[`${colorName}-${shadeIndex * 100}`] = enhancedShade;
        });
      }

      if (includeTints) {
        const tints = this.generateTints(optimizedColor);
        tints.forEach((tint, tintIndex) => {
          const tintSpaces = this.getAllColorSpaces(tint);
          const tintContrast = this.calculateContrastRatio(tint, '#ffffff');

          const enhancedTint: EnhancedColorToken = {
            name: `${colorName}-${tintIndex * 100 + 50}`,
            value: {
              oklch: tintSpaces.oklch,
              hex: tint,
              foreground: this.getContrastColor(tint),
            },
            colorSpaces: tintSpaces,
            contrastRatio: tintContrast,
            wcagAA: tintContrast >= 4.5,
            wcagAAA: tintContrast >= 7,
          };

          colorTokens[`${colorName}-${tintIndex * 100 + 50}`] = enhancedTint;
          generatedTokens[`${colorName}-${tintIndex * 100 + 50}`] = enhancedTint;
        });
      }
    });

    return {
      colors: generatedTokens,
      spacing: this.generateSpacingTokens(scale),
      typography: this.generateTypographyTokens(),
      enhancedColors: colorTokens,
    };
  }

  private getAllColorSpaces(hex: string): ColorSpaceValue {
    const hsl = culori.converter('hsl')(hex) as { h: number; s: number; l: number; mode?: 'hsl' } | null;
    const lab = culori.converter('lab')(hex) as { l: number; a: number; b: number; mode?: 'lab' } | null;
    const rgb = culori.converter('rgb')(hex) as { r: number; g: number; b: number; mode?: 'rgb' } | null;
    const oklch = culori.converter('oklch')(hex) as { l: number; c: number; h: number; mode?: 'oklch' } | null;

    return {
      hex,
      hsl: hsl ? `hsl(${Math.round(hsl.h || 0)}, ${Math.round((hsl.s || 0) * 100)}%, ${Math.round((hsl.l || 0) * 100)}%)` : hex,
      lab: lab ? `lab(${lab.l.toFixed(2)}, ${lab.a.toFixed(2)}, ${lab.b.toFixed(2)})` : hex,
      rgb: rgb ? `rgb(${Math.round((rgb.r || 0) * 255)}, ${Math.round((rgb.g || 0) * 255)}, ${Math.round((rgb.b || 0) * 255)})` : hex,
      oklch: oklch ? `oklch(${oklch.l.toFixed(4)} ${oklch.c.toFixed(4)} ${(oklch.h || 0).toFixed(4)})` : hex,
    };
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = culori.converter('rgb')(color1) as { r: number; g: number; b: number } | null;
    const rgb2 = culori.converter('rgb')(color2) as { r: number; g: number; b: number } | null;

    if (!rgb1 || !rgb2) return 1;

    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map(channel => {
      const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      return c;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private optimizeForContrast(color: string, targetRatio: number, bgColor: string = '#ffffff'): string {
    let optimized = color;
    let iterations = 0;
    const maxIterations = 100;

    while (iterations < maxIterations) {
      const currentRatio = this.calculateContrastRatio(optimized, bgColor);
      if (currentRatio >= targetRatio) break;

      const hsl = culori.converter('hsl')(optimized) as { h: number; s: number; l: number } | null;
      if (!hsl) break;

      const adjustment = currentRatio < targetRatio * 0.5 ? 0.05 : 0.01;
      const newLightness = Math.max(0.05, Math.min(0.95, hsl.l + (hsl.l > 0.5 ? -adjustment : adjustment)));

      const newColor: culori.Hsl = { h: hsl.h || 0, s: hsl.s, l: newLightness, mode: 'hsl' };
      optimized = culori.formatter.hex(newColor);

      iterations++;
    }

    return optimized;
  }

  private generateComplementary(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const complementary: culori.Hsl = { h: (hsl.h || 0) + 180, s: hsl.s, l: hsl.l, mode: 'hsl' };
    return [baseColor, culori.formatter.hex(complementary)];
  }

  private generateAnalogous(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 4; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 30, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateTriadic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 2; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 120, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateTetradic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    for (let i = 1; i <= 3; i++) {
      const color: culori.Hsl = { h: (hsl.h || 0) + i * 90, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateMonochromatic(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors: string[] = [baseColor];
    for (let i = 1; i <= 10; i++) {
      const lightness = 0.1 + (i * 0.08);
      const color: culori.Hsl = { h: hsl.h || 0, s: hsl.s, l: lightness, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateSplitComplementary(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    const complement = (hsl.h || 0) + 180;
    for (let i = -1; i <= 1; i += 2) {
      const color: culori.Hsl = { h: complement + i * 30, s: hsl.s, l: hsl.l, mode: 'hsl' };
      colors.push(culori.formatter.hex(color));
    }
    return colors;
  }

  private generateDoubleComplementary(baseColor: string): string[] {
    const hsl = culori.converter('hsl')(baseColor) as { h: number; s: number; l: number } | null;
    if (!hsl) return [baseColor];
    const colors = [baseColor];
    const complement: culori.Hsl = { h: (hsl.h || 0) + 180, s: hsl.s, l: hsl.l, mode: 'hsl' };
    colors.push(culori.formatter.hex(complement));
    const analogous: culori.Hsl = { h: (hsl.h || 0) + 30, s: hsl.s, l: hsl.l, mode: 'hsl' };
    colors.push(culori.formatter.hex(analogous));
    const analogousComplement: culori.Hsl = { h: (hsl.h || 0) + 210, s: hsl.s, l: hsl.l, mode: 'hsl' };
    colors.push(culori.formatter.hex(analogousComplement));
    return colors;
  }

  private generateShades(color: string): string[] {
    const hsl = culori.converter('hsl')(color) as { h: number; s: number; l: number } | null;
    if (!hsl) return [];
    const shades: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const shade: culori.Hsl = { h: hsl.h || 0, s: hsl.s, l: Math.max(0, (hsl.l || 0.5) - i * 0.1), mode: 'hsl' };
      shades.push(culori.formatter.hex(shade));
    }
    return shades;
  }

  private generateTints(color: string): string[] {
    const hsl = culori.converter('hsl')(color) as { h: number; s: number; l: number } | null;
    if (!hsl) return [];
    const tints: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const tint: culori.Hsl = { h: hsl.h || 0, s: hsl.s, l: Math.min(1, (hsl.l || 0.5) + i * 0.1), mode: 'hsl' };
      tints.push(culori.formatter.hex(tint));
    }
    return tints;
  }

  private generateSpacingTokens(scale: number): Record<string, string | number> {
    const spacingTokens: Record<string, string | number> = {};
    const scaledValues = this.spacingScales.map(v => v * (scale / 10));

    scaledValues.forEach((value, index) => {
      const name = this.getSpacingName(index);
      spacingTokens[name] = `${value}px`;
    });

    return spacingTokens;
  }

  private getSpacingName(index: number): string {
    const names = ['xs', 'sm', 'md', 'lg', 'xl', '2xl', '3xl', '4xl', '5xl', '6xl', '7xl', '8xl', '9xl', '10xl', '11xl', '12xl'];
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

  private getContrastColor(hex: string): string {
    const rgb = culori.converter('rgb')(hex) as { r: number; g: number; b: number } | null;
    if (!rgb) return '#000000';
    const luminance = 0.299 * (rgb.r || 0) + 0.587 * (rgb.g || 0) + 0.114 * (rgb.b || 0);
    return luminance > 0.5 ? '#000000' : '#ffffff';
  }

  analyzeColorHarmony(colors: string[]): string {
    if (colors.length < 2) return 'monochromatic';

    const hsls = colors.map(c => culori.converter('hsl')(c) as { h: number; s: number; l: number } | null);
    const hueDifferences = hsls.slice(1).map((hsl, i) => {
      const prevHsl = hsls[i];
      if (!hsl || !prevHsl) return 0;
      const diff = Math.abs((hsl.h || 0) - (prevHsl.h || 0));
      return Math.min(diff, 360 - diff);
    });

    const avgDiff = hueDifferences.length > 0 ? hueDifferences.reduce((a, b) => a + b, 0) / hueDifferences.length : 0;

    if (avgDiff > 170 && avgDiff < 190) return 'complementary';
    if (avgDiff > 110 && avgDiff < 130) return 'triadic';
    if (avgDiff > 80 && avgDiff < 100) return 'tetradic';
    if (avgDiff > 20 && avgDiff < 40) return 'analogous';

    return 'monochromatic';
  }

  generateRecommendations(tokens: GeneratedTokens & { enhancedColors?: Record<string, EnhancedColorToken> }): string[] {
    const recommendations: string[] = [];

    const colors = tokens.colors || {};
    const colorEntries = Object.entries(colors);

    if (colorEntries.length > 0) {
      const colorHexes = colorEntries.map(([_, c]) => {
        if (typeof c === 'string') return c;
        if (typeof c === 'object' && c !== null) {
          const token = c as GeneratedColorToken;
          if ('hex' in token.value) return token.value.hex;
          if ('value' in token && typeof token.value === 'object' && token.value !== null && 'hex' in token.value) {
            return (token.value as { hex: string }).hex;
          }
        }
        return '#000000';
      });

      const harmony = this.analyzeColorHarmony(colorHexes);
      recommendations.push(`当前配色方案使用 ${harmony} 色彩和谐`);

      if (harmony === 'monochromatic') {
        recommendations.push('建议尝试 complementary 或 analogous 色彩和谐以增加视觉对比');
      }

      const enhancedColors = tokens.enhancedColors || {};
      const lowContrastColors = Object.entries(enhancedColors).filter(([_, color]) => !color.wcagAA);

      if (lowContrastColors.length > 0) {
        recommendations.push(`发现 ${lowContrastColors.length} 个颜色未达到 WCAG AA 对比度标准`);
        recommendations.push('建议启用智能对比度优化功能');
      }
    }

    const spacing = tokens.spacing || {};
    const spacingValues = Object.values(spacing);

    if (spacingValues.length > 0) {
      const values = spacingValues.map(s => {
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

export const enhancedTokenGenerator = new EnhancedAITokenGenerator();
