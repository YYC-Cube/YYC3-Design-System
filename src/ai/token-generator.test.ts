/**
 * @file AI Token 生成器测试
 * @description 测试 AI Token 生成器的功能
 * @module __tests__/unit/ai/token-generator.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-18
 */

import { AITokenGenerator } from '@/ai/token-generator';

describe('AITokenGenerator', () => {
  let generator: AITokenGenerator;

  beforeEach(() => {
    generator = new AITokenGenerator();
  });

  describe('generateTokens', () => {
    it('应该生成基本的令牌', () => {
      const tokens = generator.generateTokens();

      expect(tokens.colors).toBeDefined();
      expect(tokens.spacing).toBeDefined();
      expect(tokens.typography).toBeDefined();
    });

    it('应该使用自定义基础颜色', () => {
      const tokens = generator.generateTokens({ baseColor: '#3b82f6' });

      expect(tokens.colors.primary).toBeDefined();
      expect(tokens.colors.primary.value.hex).toBe('#3b82f6');
    });

    it('应该支持不同的色彩和谐', () => {
      const complementary = generator.generateTokens({ harmony: 'complementary' });
      const analogous = generator.generateTokens({ harmony: 'analogous' });

      expect(complementary.colors).toBeDefined();
      expect(analogous.colors).toBeDefined();
    });

    it('应该支持自定义间距比例', () => {
      const tokens = generator.generateTokens({ scale: 12 });

      expect(tokens.spacing).toBeDefined();
      expect(tokens.spacing?.xs).toBeDefined();
    });

    it('应该支持生成色相和色调', () => {
      const tokens = generator.generateTokens({
        includeShades: true,
        includeTints: true,
      });

      expect(tokens.colors['primary-100']).toBeDefined();
      expect(tokens.colors['primary-200']).toBeDefined();
    });
  });

  describe('generateColorTokens', () => {
    it('应该生成互补色', () => {
      const colors = generator['generateColorTokens']('#ff0000', 'complementary', false, false);

      expect(colors.primary).toBeDefined();
      expect(colors['color-2']).toBeDefined();
    });

    it('应该生成类似色', () => {
      const colors = generator['generateColorTokens']('#ff0000', 'analogous', false, false);

      expect(colors.primary).toBeDefined();
      expect(colors['color-2']).toBeDefined();
      expect(colors['color-3']).toBeDefined();
    });

    it('应该生成三色', () => {
      const colors = generator['generateColorTokens']('#ff0000', 'triadic', false, false);

      expect(colors.primary).toBeDefined();
      expect(colors['color-2']).toBeDefined();
      expect(colors['color-3']).toBeDefined();
    });

    it('应该生成四色', () => {
      const colors = generator['generateColorTokens']('#ff0000', 'tetradic', false, false);

      expect(colors.primary).toBeDefined();
      expect(colors['color-2']).toBeDefined();
      expect(colors['color-3']).toBeDefined();
      expect(colors['color-4']).toBeDefined();
    });

    it('应该生成单色', () => {
      const colors = generator['generateColorTokens']('#ff0000', 'monochromatic', false, false);

      expect(colors.primary).toBeDefined();
      expect(colors['color-2']).toBeDefined();
    });
  });

  describe('generateSpacingTokens', () => {
    it('应该生成间距令牌', () => {
      const spacing = generator['generateSpacingTokens'](10);

      expect(spacing.xs).toBeDefined();
      expect(spacing.sm).toBeDefined();
      expect(spacing.md).toBeDefined();
      expect(spacing.lg).toBeDefined();
    });

    it('应该支持自定义比例', () => {
      const spacing = generator['generateSpacingTokens'](12);
      const spacing2 = generator['generateSpacingTokens'](10);

      expect(spacing.xs).not.toBe(spacing2.xs);
    });
  });

  describe('generateTypographyTokens', () => {
    it('应该生成排版令牌', () => {
      const typography = generator['generateTypographyTokens']();

      expect(typography.xs).toBeDefined();
      expect(typography.sm).toBeDefined();
      expect(typography.base).toBeDefined();
      expect(typography.lg).toBeDefined();
    });

    it('应该包含正确的字体大小', () => {
      const typography = generator['generateTypographyTokens']();

      expect(typography.xs).toBe('12px');
      expect(typography.base).toBe('16px');
      expect(typography.lg).toBe('20px');
    });
  });

  describe('analyzeColorHarmony', () => {
    it('应该识别单色和谐', () => {
      const harmony = generator.analyzeColorHarmony(['#ff0000']);

      expect(harmony).toBe('monochromatic');
    });

    it('应该识别三色和谐', () => {
      const harmony = generator.analyzeColorHarmony(['#ff0000', '#00ff00']);

      expect(harmony).toBe('triadic');
    });

    it('应该识别单色和谐（多个颜色）', () => {
      const harmony = generator.analyzeColorHarmony(['#ff0000', '#ff3300', '#ff6600']);

      expect(harmony).toBe('monochromatic');
    });
  });

  describe('generateRecommendations', () => {
    it('应该生成推荐', () => {
      const tokens = {
        colors: {
          primary: { name: 'primary', value: { hex: '#ff0000', oklch: 'oklch(0.5 0.2 0)' } },
        },
      };

      const recommendations = generator.generateRecommendations(tokens);

      expect(Array.isArray(recommendations)).toBe(true);
      expect(recommendations.length).toBeGreaterThan(0);
    });

    it('应该推荐其他色彩和谐', () => {
      const tokens = {
        colors: {
          primary: { name: 'primary', value: { hex: '#ff0000', oklch: 'oklch(0.5 0.2 0)' } },
          'color-2': { name: 'color-2', value: { hex: '#ff3300', oklch: 'oklch(0.5 0.2 10)' } },
        },
      };

      const recommendations = generator.generateRecommendations(tokens);

      expect(
        recommendations.some((r) => r.includes('complementary') || r.includes('analogous'))
      ).toBe(true);
    });

    it('应该推荐间距比例', () => {
      const tokens = {
        spacing: {
          xs: '4px',
          sm: '20px',
        },
      };

      const recommendations = generator.generateRecommendations(tokens);

      expect(recommendations.some((r) => r.includes('间距比例'))).toBe(true);
    });
  });
});
