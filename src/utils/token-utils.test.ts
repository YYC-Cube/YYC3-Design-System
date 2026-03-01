/**
 * @file Token 工具函数测试
 * @description 测试 token-utils 模块的各项功能
 * @module __tests__/utils/token-utils.test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-21
 */

import {
  getTokenPath,
  getNestedValue,
  hasToken,
  isTokenColor,
  isTokenSize,
  isTokenSpacing,
  createTokenAccessor,
  createTokenValidator,
  transformColor,
  transformSize,
  transformSpacing,
  createTokenTransformer,
  createTokenCSS,
  createTokenTheme,
  useToken,
  createTokenCache,
  createTokenObserver,
} from './token-utils';

const mockTokens = {
  color: {
    primary: '#d45a5f',
    secondary: '#3d4a5c',
    background: '#ffffff',
    foreground: '#000000',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  radius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
  },
  font: {
    size: {
      sm: '14px',
      base: '16px',
      lg: '18px',
    },
  },
};

describe('token-utils', () => {
  describe('getTokenPath', () => {
    it('应该将字符串路径转换为数组', () => {
      expect(getTokenPath('color.primary')).toEqual(['color', 'primary']);
    });

    it('应该保持数组路径不变', () => {
      expect(getTokenPath(['color', 'primary'])).toEqual(['color', 'primary']);
    });

    it('应该处理空路径', () => {
      expect(getTokenPath('')).toEqual(['']);
    });
  });

  describe('getNestedValue', () => {
    it('应该获取嵌套值', () => {
      expect(getNestedValue(mockTokens, 'color.primary')).toBe('#d45a5f');
    });

    it('应该获取深层嵌套值', () => {
      expect(getNestedValue(mockTokens, 'font.size.base')).toBe('16px');
    });

    it('应该处理数组路径', () => {
      expect(getNestedValue(mockTokens, ['color', 'secondary'])).toBe('#3d4a5c');
    });

    it('应该对不存在的路径返回undefined', () => {
      expect(getNestedValue(mockTokens, 'color.nonexistent')).toBeUndefined();
    });

    it('应该对无效路径返回undefined', () => {
      expect(getNestedValue(mockTokens, 'invalid.path')).toBeUndefined();
    });
  });

  describe('hasToken', () => {
    it('应该对存在的token返回true', () => {
      expect(hasToken(mockTokens, 'color.primary')).toBe(true);
    });

    it('应该对不存在的token返回false', () => {
      expect(hasToken(mockTokens, 'color.nonexistent')).toBe(false);
    });

    it('应该对深层嵌套的token返回true', () => {
      expect(hasToken(mockTokens, 'font.size.base')).toBe(true);
    });
  });

  describe('isTokenColor', () => {
    it('应该识别HEX颜色', () => {
      expect(isTokenColor(mockTokens, 'color.primary')).toBe(true);
    });

    it('应该识别6位HEX颜色', () => {
      expect(isTokenColor(mockTokens, 'color.secondary')).toBe(true);
    });

    it('应该对非颜色返回false', () => {
      expect(isTokenColor(mockTokens, 'spacing.xs')).toBe(false);
    });

    it('应该对不存在的路径返回false', () => {
      expect(isTokenColor(mockTokens, 'color.nonexistent')).toBe(false);
    });
  });

  describe('isTokenSize', () => {
    it('应该识别px尺寸', () => {
      expect(isTokenSize(mockTokens, 'spacing.xs')).toBe(true);
    });

    it('应该识别rem尺寸', () => {
      const tokens = { size: '1rem' };
      expect(isTokenSize(tokens, 'size')).toBe(true);
    });

    it('应该识别数字尺寸', () => {
      const tokens = { size: '16' };
      expect(isTokenSize(tokens, 'size')).toBe(true);
    });

    it('应该对非尺寸返回false', () => {
      expect(isTokenSize(mockTokens, 'color.primary')).toBe(false);
    });
  });

  describe('isTokenSpacing', () => {
    it('应该识别px间距', () => {
      expect(isTokenSpacing(mockTokens, 'spacing.xs')).toBe(true);
    });

    it('应该识别rem间距', () => {
      const tokens = { spacing: '1rem 2rem' };
      expect(isTokenSpacing(tokens, 'spacing')).toBe(true);
    });

    it('应该对非间距返回false', () => {
      expect(isTokenSpacing(mockTokens, 'color.primary')).toBe(false);
    });
  });

  describe('createTokenAccessor', () => {
    it('应该创建token访问器', () => {
      const accessor = createTokenAccessor(mockTokens);
      expect(accessor.get('color')).toEqual(mockTokens.color);
    });

    it('应该支持二级访问', () => {
      const accessor = createTokenAccessor(mockTokens);
      expect(accessor.get2('color', 'primary')).toBe('#d45a5f');
    });

    it('应该支持三级访问', () => {
      const accessor = createTokenAccessor(mockTokens);
      expect(accessor.get3('font', 'size', 'base')).toBe('16px');
    });
  });

  describe('createTokenValidator', () => {
    it('应该创建token验证器', () => {
      const validator = createTokenValidator(mockTokens);
      expect(validator.exists('color.primary')).toBe(true);
    });

    it('应该验证颜色token', () => {
      const validator = createTokenValidator(mockTokens);
      expect(validator.isColor('color.primary')).toBe(true);
    });

    it('应该验证尺寸token', () => {
      const validator = createTokenValidator(mockTokens);
      expect(validator.isSize('spacing.xs')).toBe(true);
    });

    it('应该验证间距token', () => {
      const validator = createTokenValidator(mockTokens);
      expect(validator.isSpacing('spacing.xs')).toBe(true);
    });
  });

  describe('transformColor', () => {
    it('应该转换HEX到RGB', () => {
      expect(transformColor('#ff0000', 'rgb')).toBe('rgb(255, 0, 0)');
    });

    it('应该转换HEX到HSL', () => {
      const result = transformColor('#ff0000', 'hsl');
      expect(result).toMatch(/^hsl\(/);
    });

    it('应该保持HEX格式不变', () => {
      expect(transformColor('#ff0000', 'hex')).toBe('#ff0000');
    });

    it('应该处理oklch颜色', () => {
      const result = transformColor('oklch(50%, 0.1, 0)', 'oklch');
      expect(result).toMatch(/^oklch\(/);
    });
  });

  describe('transformSize', () => {
    it('应该转换数字到px', () => {
      expect(transformSize(16, 'px')).toBe('16px');
    });

    it('应该转换数字到rem', () => {
      expect(transformSize(1, 'rem')).toBe('1rem');
    });

    it('应该转换px到rem', () => {
      expect(transformSize('16px', 'rem')).toBe('16rem');
    });

    it('应该保持相同单位不变', () => {
      expect(transformSize('16px', 'px')).toBe('16px');
    });

    it('应该处理纯数字字符串', () => {
      expect(transformSize('16', 'px')).toBe('16px');
    });
  });

  describe('transformSpacing', () => {
    it('应该转换单个值', () => {
      expect(transformSpacing('16', 'px')).toBe('16px');
    });

    it('应该转换多个值', () => {
      expect(transformSpacing('16 24', 'px')).toBe('16px 24px');
    });

    it('应该转换px值', () => {
      expect(transformSpacing('16px 24px', 'rem')).toBe('16rem 24rem');
    });
  });

  describe('createTokenTransformer', () => {
    it('应该创建token转换器', () => {
      const transformer = createTokenTransformer(mockTokens);
      expect(transformer.transformColor('color.primary', 'hex')).toBe('#d45a5f');
    });

    it('应该转换尺寸', () => {
      const transformer = createTokenTransformer(mockTokens);
      expect(transformer.transformSize('spacing.xs', 'rem')).toBe('4rem');
    });

    it('应该转换间距', () => {
      const transformer = createTokenTransformer(mockTokens);
      expect(transformer.transformSpacing('spacing.xs', 'rem')).toBe('4rem');
    });
  });

  describe('createTokenCSS', () => {
    it('应该创建CSS变量名', () => {
      const css = createTokenCSS(mockTokens);
      expect(css.createCSSVar('color.primary')).toBe('--yyc3-color-primary');
    });

    it('应该创建CSS属性', () => {
      const css = createTokenCSS(mockTokens);
      const props = css.createCSSProperties(['color.primary', 'spacing.xs']);
      expect((props as any)['--yyc3-color-primary']).toBe('#d45a5f');
    });

    it('应该支持自定义前缀', () => {
      const css = createTokenCSS(mockTokens, 'custom');
      expect(css.createCSSVar('color.primary')).toBe('--custom-color-primary');
    });
  });

  describe('createTokenTheme', () => {
    it('应该创建主题', () => {
      const theme = createTokenTheme(mockTokens);
      const overrides = { color: { primary: '#ff0000' } } as Partial<typeof mockTokens>;
      const newTheme = theme.createTheme(mockTokens, overrides);
      expect(newTheme.color.primary).toBe('#ff0000');
    });

    it('应该合并多个主题', () => {
      const theme = createTokenTheme(mockTokens);
      const overrides = [
        { color: { primary: '#ff0000' } } as Partial<typeof mockTokens>,
        { spacing: { xs: '8px' } } as Partial<typeof mockTokens>,
      ];
      const newTheme = theme.mergeThemes(...overrides);
      expect(newTheme.color.primary).toBe('#ff0000');
      expect(newTheme.spacing.xs).toBe('8px');
    });
  });

  describe('useToken', () => {
    it('应该创建token hook', () => {
      const token = useToken(mockTokens);
      expect(token.get('color.primary')).toBe('#d45a5f');
    });

    it('应该检查token存在', () => {
      const token = useToken(mockTokens);
      expect(token.has('color.primary')).toBe(true);
    });

    it('应该验证颜色', () => {
      const token = useToken(mockTokens);
      expect(token.isColor('color.primary')).toBe(true);
    });

    it('应该验证尺寸', () => {
      const token = useToken(mockTokens);
      expect(token.isSize('spacing.xs')).toBe(true);
    });
  });

  describe('createTokenCache', () => {
    it('应该创建token缓存', () => {
      const cache = createTokenCache(mockTokens);
      expect(cache.get('color.primary')).toBe('#d45a5f');
      expect(cache.size()).toBe(1);
    });

    it('应该从缓存返回值', () => {
      const cache = createTokenCache(mockTokens);
      cache.get('color.primary');
      cache.get('color.primary');
      expect(cache.size()).toBe(1);
    });

    it('应该清除缓存', () => {
      const cache = createTokenCache(mockTokens);
      cache.get('color.primary');
      cache.clear();
      expect(cache.size()).toBe(0);
    });

    it('应该限制缓存大小', () => {
      const cache = createTokenCache(mockTokens, 2);
      cache.get('color.primary');
      cache.get('color.secondary');
      cache.get('color.background');
      expect(cache.size()).toBe(2);
    });
  });

  describe('createTokenObserver', () => {
    it('应该创建token观察者', () => {
      const onChange = jest.fn();
      const observer = createTokenObserver({ color: '#ff0000' }, onChange);
      expect(observer.color).toBe('#ff0000');
    });

    it('应该在值改变时触发回调', () => {
      const onChange = jest.fn();
      const observer = createTokenObserver({ color: '#ff0000' }, onChange);
      observer.color = '#00ff00';
      expect(onChange).toHaveBeenCalled();
    });

    it('应该支持嵌套对象', () => {
      const onChange = jest.fn();
      const observer = createTokenObserver({ theme: { color: '#ff0000' } }, onChange);
      observer.theme.color = '#00ff00';
      expect(onChange).toHaveBeenCalled();
    });
  });
});
