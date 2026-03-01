export interface ColorScheme {
  id: string;
  name: string;
  primary: string;
  secondary: string;
  accent: string;
  neutrals: {
    light: string;
    medium: string;
    dark: string;
  };
  scale: string[];
  harmony: string;
  accessibility: {
    aa: boolean;
    aaa: boolean;
    contrastRatio: number;
  };
  mood: string;
}

export interface BatchGenerationOptions {
  baseColor?: string;
  harmonyTypes?: string[];
  scaleSteps?: number;
  includeShades?: boolean;
  includeTints?: boolean;
  optimizeForAccessibility?: boolean;
  targetContrast?: 'AA' | 'AAA';
  numberOfSchemes?: number;
  moodFilter?: string[];
}

export class ColorSchemeBatchGenerator {
  private schemeCounter = 0;

  generateSchemes(options: BatchGenerationOptions = {}): ColorScheme[] {
    const {
      baseColor = '#3b82f6',
      harmonyTypes = ['monochromatic', 'analogous', 'complementary', 'triadic', 'tetradic'],
      scaleSteps = 10,
      includeShades = true,
      includeTints = true,
      optimizeForAccessibility = true,
      targetContrast = 'AA',
      numberOfSchemes = 10,
      moodFilter = [],
    } = options;

    const schemes: ColorScheme[] = [];

    for (let i = 0; i < numberOfSchemes; i++) {
      const harmonyType = harmonyTypes[i % harmonyTypes.length];
      const scheme = this.generateScheme({
        baseColor,
        harmonyType,
        scaleSteps,
        includeShades,
        includeTints,
        optimizeForAccessibility,
        targetContrast,
      });

      if (moodFilter.length === 0 || moodFilter.includes(scheme.mood)) {
        schemes.push(scheme);
      }
    }

    return schemes.sort((a, b) => {
      const scoreA = this.calculateSchemeScore(a);
      const scoreB = this.calculateSchemeScore(b);
      return scoreB - scoreA;
    });
  }

  private generateScheme(options: {
    baseColor: string;
    harmonyType: string;
    scaleSteps: number;
    includeShades: boolean;
    includeTints: boolean;
    optimizeForAccessibility: boolean;
    targetContrast: 'AA' | 'AAA';
  }): ColorScheme {
    const { baseColor, harmonyType, scaleSteps, includeShades, includeTints, targetContrast } =
      options;

    const colors = this.generateHarmonyColors(baseColor, harmonyType);
    const primary = colors[0];
    const secondary = colors[1] || colors[0];
    const accent = colors[2] || colors[0];
    const neutrals = this.generateNeutrals(baseColor);
    const scale = this.generateScale(primary, scaleSteps, includeShades, includeTints);
    const accessibility = this.calculateAccessibility(primary, '#ffffff', targetContrast);
    const mood = this.determineMood(primary, secondary, accent);

    return {
      id: `scheme-${++this.schemeCounter}`,
      name: `${this.getHarmonyName(harmonyType)} 方案 ${this.schemeCounter}`,
      primary,
      secondary,
      accent,
      neutrals,
      scale,
      harmony: harmonyType,
      accessibility,
      mood,
    };
  }

  private generateHarmonyColors(baseColor: string, harmonyType: string): string[] {
    const hsl = this.hexToHsl(baseColor);
    const colors: string[] = [baseColor];

    switch (harmonyType) {
      case 'monochromatic':
        colors.push(
          this.hslToHex({ h: hsl.h, s: hsl.s * 0.6, l: Math.min(hsl.l + 0.2, 1) }),
          this.hslToHex({ h: hsl.h, s: hsl.s * 0.4, l: Math.min(hsl.l + 0.4, 1) })
        );
        break;

      case 'analogous':
        colors.push(
          this.hslToHex({ h: (hsl.h + 30) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h - 30 + 360) % 360, s: hsl.s, l: hsl.l })
        );
        break;

      case 'complementary':
        colors.push(this.hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }));
        break;

      case 'triadic':
        colors.push(
          this.hslToHex({ h: (hsl.h + 120) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 240) % 360, s: hsl.s, l: hsl.l })
        );
        break;

      case 'tetradic':
        colors.push(
          this.hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l })
        );
        break;

      case 'split-complementary':
        colors.push(
          this.hslToHex({ h: (hsl.h + 150) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 210) % 360, s: hsl.s, l: hsl.l })
        );
        break;

      case 'double-complementary':
        colors.push(
          this.hslToHex({ h: (hsl.h + 90) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 180) % 360, s: hsl.s, l: hsl.l }),
          this.hslToHex({ h: (hsl.h + 270) % 360, s: hsl.s, l: hsl.l })
        );
        break;

      default:
        colors.push(baseColor);
    }

    return colors;
  }

  private generateNeutrals(_baseColor: string): {
    light: string;
    medium: string;
    dark: string;
  } {
    return {
      light: '#f3f4f6',
      medium: '#9ca3af',
      dark: '#374151',
    };
  }

  private generateScale(
    baseColor: string,
    steps: number,
    includeShades: boolean,
    includeTints: boolean
  ): string[] {
    const scale: string[] = [];
    const hsl = this.hexToHsl(baseColor);

    if (includeTints) {
      for (let i = 1; i <= steps / 2; i++) {
        const newL = Math.min(hsl.l + (i / (steps / 2)) * 0.4, 1);
        scale.push(this.hslToHex({ h: hsl.h, s: hsl.s, l: newL }));
      }
    }

    scale.push(baseColor);

    if (includeShades) {
      for (let i = 1; i <= steps / 2; i++) {
        const newL = Math.max(hsl.l - (i / (steps / 2)) * 0.4, 0);
        scale.push(this.hslToHex({ h: hsl.h, s: hsl.s, l: newL }));
      }
    }

    return scale;
  }

  private calculateAccessibility(
    color1: string,
    color2: string,
    _targetContrast: 'AA' | 'AAA'
  ): {
    aa: boolean;
    aaa: boolean;
    contrastRatio: number;
  } {
    const contrastRatio = this.calculateContrastRatio(color1, color2);

    return {
      aa: contrastRatio >= 4.5,
      aaa: contrastRatio >= 7,
      contrastRatio,
    };
  }

  private calculateContrastRatio(color1: string, color2: string): number {
    const rgb1 = this.hexToRgb(color1);
    const rgb2 = this.hexToRgb(color2);

    const luminance1 = this.calculateLuminance(rgb1);
    const luminance2 = this.calculateLuminance(rgb2);

    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);

    return (lighter + 0.05) / (darker + 0.05);
  }

  private calculateLuminance(rgb: { r: number; g: number; b: number }): number {
    const [r, g, b] = [rgb.r, rgb.g, rgb.b].map((channel) => {
      const c = channel <= 0.03928 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
      return c;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  private determineMood(primary: string, secondary: string, accent: string): string {
    const primaryHsl = this.hexToHsl(primary);
    const avgSaturation = (primaryHsl.s + this.hexToHsl(secondary).s + this.hexToHsl(accent).s) / 3;
    const avgLightness = (primaryHsl.l + this.hexToHsl(secondary).l + this.hexToHsl(accent).l) / 3;

    if (avgLightness > 0.7) {
      return 'light';
    } else if (avgLightness < 0.3) {
      return 'dark';
    } else if (avgSaturation > 0.7) {
      return 'vibrant';
    } else if (avgSaturation < 0.3) {
      return 'muted';
    } else {
      return 'balanced';
    }
  }

  private calculateSchemeScore(scheme: ColorScheme): number {
    const accessibilityScore = scheme.accessibility.aa ? 30 : 0;
    const accessibilityScoreAAA = scheme.accessibility.aaa ? 20 : 0;
    const contrastScore = Math.min(scheme.accessibility.contrastRatio * 10, 20);
    const harmonyScore = this.getHarmonyScore(scheme.harmony);
    const moodScore = this.getMoodScore(scheme.mood);

    return accessibilityScore + accessibilityScoreAAA + contrastScore + harmonyScore + moodScore;
  }

  private getHarmonyScore(harmony: string): number {
    const scores: Record<string, number> = {
      monochromatic: 25,
      analogous: 20,
      complementary: 20,
      triadic: 18,
      tetradic: 15,
      'split-complementary': 17,
      'double-complementary': 15,
    };
    return scores[harmony] || 10;
  }

  private getMoodScore(mood: string): number {
    const scores: Record<string, number> = {
      balanced: 15,
      vibrant: 12,
      muted: 10,
      light: 8,
      dark: 8,
    };
    return scores[mood] || 5;
  }

  private getHarmonyName(harmony: string): string {
    const names: Record<string, string> = {
      monochromatic: '单色',
      analogous: '类比',
      complementary: '互补',
      triadic: '三色',
      tetradic: '四色',
      'split-complementary': '分裂互补',
      'double-complementary': '双重互补',
    };
    return names[harmony] || harmony;
  }

  private hexToHsl(hex: string): { h: number; s: number; l: number } {
    const rgb = this.hexToRgb(hex);
    let r = rgb.r / 255;
    let g = rgb.g / 255;
    let b = rgb.b / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0;
    let s = 0;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

      switch (max) {
        case r:
          h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
          break;
        case g:
          h = ((b - r) / d + 2) / 6;
          break;
        case b:
          h = ((r - g) / d + 4) / 6;
          break;
      }
    }

    return { h: h * 360, s, l };
  }

  private hslToHex(hsl: { h: number; s: number; l: number }): string {
    let r: number, g: number, b: number;

    if (hsl.s === 0) {
      r = g = b = hsl.l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 1 / 6) return p + (q - p) * 6 * t;
        if (t < 1 / 2) return q;
        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
        return p;
      };

      const q = hsl.l < 0.5 ? hsl.l * (1 + hsl.s) : hsl.l + hsl.s - hsl.l * hsl.s;
      const p = 2 * hsl.l - q;

      r = hue2rgb(p, q, hsl.h / 360 + 1 / 3);
      g = hue2rgb(p, q, hsl.h / 360);
      b = hue2rgb(p, q, hsl.h / 360 - 1 / 3);
    }

    const toHex = (x: number) => {
      const hex = Math.round(x * 255).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };

    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 0, g: 0, b: 0 };
  }
}

export const colorSchemeBatchGenerator = new ColorSchemeBatchGenerator();
