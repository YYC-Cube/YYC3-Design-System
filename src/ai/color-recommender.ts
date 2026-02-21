/**
 * @file 配色方案推荐系统
 * @description 基于色彩理论和用户体验的配色方案推荐
 * @module ai/color-recommender
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import culori from 'culori';

export interface ColorScheme {
  name: string;
  description: string;
  colors: string[];
  harmony: string;
  mood: string;
  accessibility: 'AA' | 'AAA' | 'fail';
}

export interface ColorRecommendationOptions {
  baseColor?: string;
  purpose?: 'brand' | 'ui' | 'data' | 'marketing';
  mood?: 'professional' | 'playful' | 'calm' | 'energetic' | 'luxury';
  accessibility?: 'AA' | 'AAA';
  maxColors?: number;
}

export class ColorRecommender {
  private moodHarmonies: Record<string, string[]> = {
    professional: ['complementary', 'analogous', 'monochromatic'],
    playful: ['triadic', 'tetradic', 'analogous'],
    calm: ['monochromatic', 'analogous'],
    energetic: ['complementary', 'triadic', 'tetradic'],
    luxury: ['monochromatic', 'complementary'],
  };

  private purposePalettes: Record<string, number> = {
    brand: 5,
    ui: 8,
    data: 6,
    marketing: 7,
  };

  private accessibilityRatios: Record<string, number> = {
    AA: 4.5,
    AAA: 7,
  };

  generateRecommendations(options: ColorRecommendationOptions = {}): ColorScheme[] {
    const {
      baseColor = '#d45a5f',
      purpose = 'ui',
      mood = 'professional',
      accessibility = 'AA',
      maxColors = this.purposePalettes[purpose],
    } = options;

    const harmonies = this.moodHarmonies[mood] || ['complementary', 'analogous'];
    const schemes: ColorScheme[] = [];

    harmonies.forEach(harmony => {
      const scheme = this.generateScheme(baseColor, harmony, purpose, mood, accessibility, maxColors);
      if (scheme) {
        schemes.push(scheme);
      }
    });

    return schemes.sort((a, b) => {
      const aScore = this.calculateSchemeScore(a, options);
      const bScore = this.calculateSchemeScore(b, options);
      return bScore - aScore;
    });
  }

  private generateScheme(
    baseColor: string,
    harmony: string,
    purpose: string,
    mood: string,
    accessibility: string,
    maxColors: number
  ): ColorScheme | null {
    const colors = this.generateHarmonyColors(baseColor, harmony, maxColors);
    const scheme: ColorScheme = {
      name: `${mood} ${harmony}`,
      description: this.getSchemeDescription(harmony, mood, purpose),
      colors,
      harmony,
      mood,
      accessibility: this.checkAccessibility(colors, this.accessibilityRatios[accessibility as keyof typeof this.accessibilityRatios]),
    };

    return scheme;
  }

  private generateHarmonyColors(baseColor: string, harmony: string, count: number): string[] {
    const colors: string[] = [baseColor];

    switch (harmony) {
      case 'complementary':
        colors.push(this.adjustHue(baseColor, 180));
        if (count > 2) {
          colors.push(this.adjustLightness(baseColor, 0.3));
          colors.push(this.adjustLightness(colors[1], 0.3));
        }
        if (count > 4) {
          colors.push(this.adjustLightness(baseColor, -0.2));
        }
        break;

      case 'analogous':
        for (let i = 1; i < Math.min(count, 5); i++) {
          colors.push(this.adjustHue(baseColor, i * 30));
        }
        break;

      case 'triadic':
        colors.push(this.adjustHue(baseColor, 120));
        colors.push(this.adjustHue(baseColor, 240));
        if (count > 3) {
          colors.push(this.adjustLightness(baseColor, 0.3));
          colors.push(this.adjustLightness(colors[1], 0.3));
        }
        break;

      case 'tetradic':
        for (let i = 1; i < Math.min(count, 4); i++) {
          colors.push(this.adjustHue(baseColor, i * 90));
        }
        if (count > 4) {
          colors.push(this.adjustLightness(baseColor, 0.3));
        }
        break;

      case 'monochromatic':
        for (let i = 1; i < count; i++) {
          const lightness = 0.2 + (i * 0.6 / count);
          colors.push(this.adjustLightness(baseColor, lightness - 0.5));
        }
        break;
    }

    return colors.slice(0, count);
  }

  private adjustHue(color: string, degrees: number): string {
    const hsl = culori.converter('hsl')(color) as { h: number; s: number; l: number; mode?: 'hsl' } | null;
    if (!hsl) return color;
    const adjusted = { ...hsl, h: ((hsl.h || 0) + degrees + 360) % 360, mode: 'hsl' as const };
    return culori.formatter.hex(adjusted);
  }

  private adjustLightness(color: string, delta: number): string {
    const hsl = culori.converter('hsl')(color) as { h: number; s: number; l: number; mode?: 'hsl' } | null;
    if (!hsl) return color;
    const adjusted = { ...hsl, l: Math.max(0, Math.min(1, (hsl.l || 0.5) + delta)), mode: 'hsl' as const };
    return culori.formatter.hex(adjusted);
  }

  private getSchemeDescription(harmony: string, mood: string, purpose: string): string {
    const harmonyDesc: Record<string, string> = {
      complementary: '互补色方案，提供强烈的视觉对比',
      analogous: '类似色方案，营造和谐统一的氛围',
      triadic: '三色方案，平衡且富有活力',
      tetradic: '四色方案，丰富且多样',
      monochromatic: '单色方案，简洁专业',
    };

    const moodDesc: Record<string, string> = {
      professional: '适合专业场景',
      playful: '适合活泼场景',
      calm: '适合平静场景',
      energetic: '适合活力场景',
      luxury: '适合高端场景',
    };

    const purposeDesc: Record<string, string> = {
      brand: '品牌配色',
      ui: 'UI 界面配色',
      data: '数据可视化配色',
      marketing: '营销活动配色',
    };

    return `${harmonyDesc[harmony]}，${moodDesc[mood]}，${purposeDesc[purpose]}`;
  }

  private checkAccessibility(colors: string[], minRatio: number): 'AA' | 'AAA' | 'fail' {
    let allAA = true;
    let allAAA = true;

    for (let i = 0; i < colors.length; i++) {
      for (let j = i + 1; j < colors.length; j++) {
        const ratio = this.calculateContrastRatio(colors[i], colors[j]);
        if (ratio < minRatio) {
          allAA = false;
        }
        if (ratio < 7) {
          allAAA = false;
        }
      }
    }

    if (allAAA) return 'AAA';
    if (allAA) return 'AA';
    return 'fail';
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const l1 = this.getLuminance(color1);
    const l2 = this.getLuminance(color2);
    const lighter = Math.max(l1, l2);
    const darker = Math.min(l1, l2);
    return (lighter + 0.05) / (darker + 0.05);
  }

  private getLuminance(color: string): number {
    const rgb = culori.converter('rgb')(color) as { r: number; g: number; b: number; mode?: 'rgb' } | null;
    if (!rgb) return 0;
    const r = this.sRGBToLinear(rgb.r || 0);
    const g = this.sRGBToLinear(rgb.g || 0);
    const b = this.sRGBToLinear(rgb.b || 0);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private sRGBToLinear(c: number): number {
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }

  private calculateSchemeScore(scheme: ColorScheme, options: ColorRecommendationOptions): number {
    let score = 0;

    if (scheme.accessibility === 'AAA') score += 10;
    else if (scheme.accessibility === 'AA') score += 5;

    if (scheme.mood === options.mood) score += 5;

    const colorVariance = this.calculateColorVariance(scheme.colors);
    score += colorVariance * 2;

    return score;
  }

  private calculateColorVariance(colors: string[]): number {
    if (colors.length < 2) return 0;

    const hsls = colors.map(c => culori.converter('hsl')(c) as { h: number; s: number; l: number; mode?: 'hsl' } | null);
    const hues = hsls.map(h => h?.h || 0);
    const avgHue = hues.reduce((a, b) => a + b, 0) / hues.length;
    const hueVariance = hues.reduce((sum, h) => sum + Math.pow(h - avgHue, 2), 0) / hues.length;

    return Math.min(hueVariance / 10000, 1);
  }

  analyzeColorMood(color: string): string {
    const hsl = culori.converter('hsl')(color) as { h: number; s: number; l: number; mode?: 'hsl' } | null;
    if (!hsl) return 'professional';
    const hue = hsl.h || 0;
    const saturation = hsl.s || 0;
    const lightness = hsl.l || 0.5;

    if (saturation < 0.2) {
      return lightness > 0.7 ? 'calm' : 'professional';
    }

    if (lightness > 0.8) {
      return 'playful';
    }

    if (lightness < 0.2) {
      return 'luxury';
    }

    if ((hue >= 0 && hue < 30) || (hue >= 330 && hue < 360)) {
      return saturation > 0.6 ? 'energetic' : 'luxury';
    }

    if (hue >= 30 && hue < 90) {
      return 'playful';
    }

    if (hue >= 90 && hue < 150) {
      return 'calm';
    }

    if (hue >= 150 && hue < 210) {
      return 'professional';
    }

    if (hue >= 210 && hue < 270) {
      return 'luxury';
    }

    if (hue >= 270 && hue < 330) {
      return 'playful';
    }

    return 'professional';
  }

  getBestContrastColor(baseColor: string, candidateColors: string[]): string {
    let bestColor = candidateColors[0];
    let bestRatio = 0;

    candidateColors.forEach(color => {
      const ratio = this.calculateContrastRatio(baseColor, color);
      if (ratio > bestRatio) {
        bestRatio = ratio;
        bestColor = color;
      }
    });

    return bestColor;
  }
}

export const colorRecommender = new ColorRecommender();
