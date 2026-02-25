export interface BrandColorPalette {
  primary: string;
  secondary: string;
  accent: string;
  neutrals: {
    light: string;
    medium: string;
    dark: string;
  };
  suggestedScales: string[];
}

export interface ExtractionOptions {
  colorCount?: number;
  minimumSaturation?: number;
  minimumBrightness?: number;
  maximumBrightness?: number;
  excludeWhite?: boolean;
  excludeBlack?: boolean;
  smartSelection?: boolean;
}

export interface ExtractedColor {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  frequency: number;
  percentage: number;
}

export class BrandColorExtractor {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }
  }

  async extractFromImage(
    imageSource: string | HTMLImageElement | File,
    options: ExtractionOptions = {}
  ): Promise<BrandColorPalette> {
    const {
      colorCount = 10,
      minimumSaturation = 0.1,
      minimumBrightness = 0.1,
      maximumBrightness = 0.95,
      excludeWhite = true,
      excludeBlack = true,
      smartSelection = true,
    } = options;

    let imageElement: HTMLImageElement;

    if (typeof imageSource === 'string') {
      imageElement = await this.loadImage(imageSource);
    } else if (imageSource instanceof File) {
      imageElement = await this.loadImageFromFile(imageSource);
    } else {
      imageElement = imageSource;
    }

    const imageData = this.getImageData(imageElement);
    const colors = this.extractColors(imageData, options);
    const filteredColors = this.filterColors(colors, {
      minimumSaturation,
      minimumBrightness,
      maximumBrightness,
      excludeWhite,
      excludeBlack,
    });

    const sortedColors = this.sortColorsByFrequency(filteredColors);
    const topColors = sortedColors.slice(0, colorCount);

    let palette: BrandColorPalette;

    if (smartSelection) {
      palette = this.generateSmartPalette(topColors);
    } else {
      palette = this.generateSimplePalette(topColors);
    }

    palette.suggestedScales = this.generateSuggestedScales(palette);

    return palette;
  }

  private loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = url;
    });
  }

  private loadImageFromFile(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const img = new Image();
          img.onload = () => resolve(img);
          img.onerror = () => reject(new Error('Failed to load image from file'));
          img.src = e.target.result as string;
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  private getImageData(image: HTMLImageElement): ImageData {
    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas context not available');
    }

    const maxSize = 200;
    let width = image.width;
    let height = image.height;

    if (width > maxSize || height > maxSize) {
      const ratio = Math.min(maxSize / width, maxSize / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }

    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(image, 0, 0, width, height);

    return this.ctx.getImageData(0, 0, width, height);
  }

  private extractColors(imageData: ImageData, _options: ExtractionOptions): ExtractedColor[] {
    const { data } = imageData;
    const colorMap = new Map<string, number>();
    const quantization = 8;
    const totalPixels = data.length / 4;

    for (let i = 0; i < data.length; i += 4) {
      const r = Math.round(data[i] / quantization) * quantization;
      const g = Math.round(data[i + 1] / quantization) * quantization;
      const b = Math.round(data[i + 2] / quantization) * quantization;
      const hex = this.rgbToHex(r, g, b);
      const key = hex.toLowerCase();

      colorMap.set(key, (colorMap.get(key) || 0) + 1);
    }

    const colors: ExtractedColor[] = [];
    colorMap.forEach((frequency, hex) => {
      const rgb = this.hexToRgb(hex);
      const hsl = this.rgbToHsl(rgb.r, rgb.g, rgb.b);

      colors.push({
        hex,
        rgb,
        hsl,
        frequency,
        percentage: (frequency / totalPixels) * 100,
      });
    });

    return colors;
  }

  private filterColors(
    colors: ExtractedColor[],
    filters: {
      minimumSaturation: number;
      minimumBrightness: number;
      maximumBrightness: number;
      excludeWhite: boolean;
      excludeBlack: boolean;
    }
  ): ExtractedColor[] {
    return colors.filter((color) => {
      const { s, l } = color.hsl;

      if (s < filters.minimumSaturation) return false;
      if (l < filters.minimumBrightness) return false;
      if (l > filters.maximumBrightness) return false;

      if (filters.excludeBlack && l < 0.1) return false;
      if (filters.excludeWhite && l > 0.9) return false;

      return true;
    });
  }

  private sortColorsByFrequency(colors: ExtractedColor[]): ExtractedColor[] {
    return colors.sort((a, b) => b.frequency - a.frequency);
  }

  private generateSimplePalette(colors: ExtractedColor[]): BrandColorPalette {
    const primary = colors[0]?.hex || '#3b82f6';
    const secondary = colors[1]?.hex || '#10b981';
    const accent = colors[2]?.hex || '#f59e0b';

    return {
      primary,
      secondary,
      accent,
      neutrals: {
        light: '#f3f4f6',
        medium: '#9ca3af',
        dark: '#374151',
      },
      suggestedScales: [],
    };
  }

  private generateSmartPalette(colors: ExtractedColor[]): BrandColorPalette {
    if (colors.length === 0) {
      return {
        primary: '#3b82f6',
        secondary: '#10b981',
        accent: '#f59e0b',
        neutrals: {
          light: '#f3f4f6',
          medium: '#9ca3af',
          dark: '#374151',
        },
        suggestedScales: [],
      };
    }

    const primary = this.selectPrimaryColor(colors);
    const secondary = this.selectSecondaryColor(colors, primary);
    const accent = this.selectAccentColor(colors, primary, secondary);
    const neutrals = this.generateNeutrals(colors);

    return {
      primary: primary.hex,
      secondary: secondary.hex,
      accent: accent.hex,
      neutrals,
      suggestedScales: [],
    };
  }

  private selectPrimaryColor(colors: ExtractedColor[]): ExtractedColor {
    const saturatedColors = colors.filter(c => c.hsl.s > 0.3);
    const candidates = saturatedColors.length > 0 ? saturatedColors : colors;

    candidates.sort((a, b) => {
      const scoreA = this.calculateColorScore(a);
      const scoreB = this.calculateColorScore(b);
      return scoreB - scoreA;
    });

    return candidates[0] || colors[0];
  }

  private selectSecondaryColor(
    colors: ExtractedColor[],
    primary: ExtractedColor
  ): ExtractedColor {
    const primaryHue = primary.hsl.h;
    const candidates = colors
      .filter(c => c.hex !== primary.hex)
      .filter(c => this.getColorDistance(c.hsl, primary.hsl) > 30)
      .filter(c => Math.abs(c.hsl.h - primaryHue) > 60 || Math.abs(c.hsl.h - primaryHue) < 30);

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.percentage - a.percentage);
      return candidates[0];
    }

    return colors[1] || colors[0];
  }

  private selectAccentColor(
    colors: ExtractedColor[],
    primary: ExtractedColor,
    secondary: ExtractedColor
  ): ExtractedColor {
    const candidates = colors
      .filter(c => c.hex !== primary.hex && c.hex !== secondary.hex)
      .filter(c => {
        const distToPrimary = this.getColorDistance(c.hsl, primary.hsl);
        const distToSecondary = this.getColorDistance(c.hsl, secondary.hsl);
        return distToPrimary > 40 && distToSecondary > 40;
      });

    if (candidates.length > 0) {
      candidates.sort((a, b) => b.hsl.s - a.hsl.s);
      return candidates[0];
    }

    return colors[2] || colors[0];
  }

  private generateNeutrals(colors: ExtractedColor[]): {
    light: string;
    medium: string;
    dark: string;
  } {
    const lowSaturationColors = colors.filter(c => c.hsl.s < 0.15);

    if (lowSaturationColors.length >= 3) {
      lowSaturationColors.sort((a, b) => b.hsl.l - a.hsl.l);
      return {
        light: lowSaturationColors[0].hex,
        medium: lowSaturationColors[Math.floor(lowSaturationColors.length / 2)].hex,
        dark: lowSaturationColors[lowSaturationColors.length - 1].hex,
      };
    }

    return {
      light: '#f3f4f6',
      medium: '#9ca3af',
      dark: '#374151',
    };
  }

  private generateSuggestedScales(palette: BrandColorPalette): string[] {
    const scales: string[] = [];

    for (const colorName of ['primary', 'secondary', 'accent']) {
      const color = palette[colorName as keyof BrandColorPalette] as string;
      const scale = this.generateColorScale(color, 10);
      scales.push(...scale);
    }

    return scales;
  }

  private generateColorScale(hex: string, steps: number): string[] {
    const rgb = this.hexToRgb(hex);
    const scale: string[] = [];

    for (let i = 0; i < steps; i++) {
      const factor = i / (steps - 1);
      const r = Math.round(rgb.r + (255 - rgb.r) * factor * 0.9);
      const g = Math.round(rgb.g + (255 - rgb.g) * factor * 0.9);
      const b = Math.round(rgb.b + (255 - rgb.b) * factor * 0.9);
      scale.push(this.rgbToHex(r, g, b));
    }

    return scale;
  }

  private calculateColorScore(color: ExtractedColor): number {
    const frequencyScore = color.percentage * 100;
    const saturationScore = color.hsl.s * 50;
    const brightnessScore = Math.abs(color.hsl.l - 0.5) * 20;

    return frequencyScore + saturationScore + brightnessScore;
  }

  private getColorDistance(
    hsl1: { h: number; s: number; l: number },
    hsl2: { h: number; s: number; l: number }
  ): number {
    const dh = Math.min(Math.abs(hsl1.h - hsl2.h), 360 - Math.abs(hsl1.h - hsl2.h));
    const ds = Math.abs(hsl1.s - hsl2.s) * 100;
    const dl = Math.abs(hsl1.l - hsl2.l) * 100;

    return Math.sqrt(dh * dh + ds * ds + dl * dl);
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : { r: 0, g: 0, b: 0 };
  }

  private rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255;
    g /= 255;
    b /= 255;

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
}

export const brandColorExtractor = new BrandColorExtractor();
