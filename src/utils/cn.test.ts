/* eslint-disable no-constant-binary-expression */
import { cn } from '../cn';

describe('cn 工具函数', () => {
  describe('基础功能', () => {
    it('应该正确处理单个字符串', () => {
      expect(cn('class1')).toBe('class1');
    });

    it('应该正确处理多个字符串', () => {
      expect(cn('class1 class2')).toBe('class1 class2');
    });

    it('应该正确处理空字符串', () => {
      expect(cn('')).toBe('');
    });

    it('应该正确处理 undefined', () => {
      expect(cn(undefined)).toBe('');
    });

    it('应该正确处理 null', () => {
      expect(cn(null)).toBe('');
    });
  });

  describe('字符串拼接', () => {
    it('应该拼接多个字符串参数', () => {
      expect(cn('class1', 'class2', 'class3')).toBe('class1 class2 class3');
    });

    it('应该跳过空字符串参数', () => {
      expect(cn('class1', '', 'class2')).toBe('class1 class2');
    });

    it('应该跳过 undefined 参数', () => {
      expect(cn('class1', undefined, 'class2')).toBe('class1 class2');
    });

    it('应该跳过 null 参数', () => {
      expect(cn('class1', null, 'class2')).toBe('class1 class2');
    });

    it('应该处理包含空格的字符串', () => {
      expect(cn('class1  class2')).toBe('class1 class2');
    });
  });

  describe('条件类名', () => {
    it('应该根据布尔值包含或排除类名', () => {
      expect(cn('class1', false && 'class2')).toBe('class1');
      expect(cn('class1', true && 'class2')).toBe('class1 class2');
    });

    it('应该处理三元运算符', () => {
      const isActive = true;
      expect(cn('base', isActive ? 'active' : 'inactive')).toBe('base active');

      const isActive2 = false;
      expect(cn('base', isActive2 ? 'active' : 'inactive')).toBe('base inactive');
    });

    it('应该处理数字0（视为false）', () => {
      expect(cn('class1', 0 && 'class2')).toBe('class1');
    });

    it('应该处理数字1（视为true）', () => {
      expect(cn('class1', 1 && 'class2')).toBe('class1 class2');
    });

    it('应该处理空数组（视为false）', () => {
      expect(cn('class1', [] && 'class2')).toBe('class1');
    });

    it('应该处理空对象（视为true）', () => {
      expect(cn('class1', {} && 'class2')).toBe('class1 class2');
    });
  });

  describe('对象参数', () => {
    it('应该根据对象的布尔值包含或排除类名', () => {
      expect(cn({ class1: true, class2: false })).toBe('class1');
    });

    it('应该处理多个对象参数', () => {
      expect(cn({ class1: true, class2: false }, { class3: true })).toBe('class1 class3');
    });

    it('应该处理混合参数类型', () => {
      expect(cn('base', { class1: true, class2: false }, 'class3')).toBe('base class1 class3');
    });

    it('应该处理对象中的字符串值', () => {
      expect(cn({ class1: 'value1', class2: false })).toBe('class1');
    });
  });

  describe('数组参数', () => {
    it('应该正确处理字符串数组', () => {
      expect(cn(['class1', 'class2', 'class3'])).toBe('class1 class2 class3');
    });

    it('应该跳过数组中的空元素', () => {
      expect(cn(['class1', '', 'class2'])).toBe('class1 class2');
    });

    it('应该处理嵌套数组', () => {
      expect(cn(['class1', ['class2', 'class3']])).toBe('class1 class2 class3');
    });

    it('应该处理对象数组', () => {
      expect(cn([{ class1: true }, { class2: false }, { class3: true }])).toBe('class1 class3');
    });

    it('应该处理混合数组', () => {
      expect(cn(['class1', { class2: true }, 'class3'])).toBe('class1 class2 class3');
    });
  });

  describe('类名去重', () => {
    it('应该去重重复的类名', () => {
      expect(cn('class1 class1 class2')).toBe('class1 class2');
    });

    it('应该去重不同来源的重复类名', () => {
      expect(cn('class1', 'class1', 'class2')).toBe('class1 class2');
    });

    it('应该保留类名的顺序（首次出现）', () => {
      expect(cn('class2 class1', 'class1')).toBe('class2 class1');
    });
  });

  describe('Tailwind CSS 集成', () => {
    it('应该正确处理 Tailwind 类名', () => {
      expect(cn('bg-white text-black')).toBe('bg-white text-black');
    });

    it('应该处理 Tailwind 响应式类名', () => {
      expect(cn('sm:px-4 md:px-6 lg:px-8')).toBe('sm:px-4 md:px-6 lg:px-8');
    });

    it('应该处理 Tailwind 伪类', () => {
      expect(cn('hover:bg-blue-500 focus:ring-2')).toBe('hover:bg-blue-500 focus:ring-2');
    });

    it('应该处理 Tailwind 变体类名', () => {
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-red-500 bg-blue-500');
    });
  });

  describe('特殊字符和空格', () => {
    it('应该正确处理类名中的连字符', () => {
      expect(cn('bg-blue-500', 'text-gray-100')).toBe('bg-blue-500 text-gray-100');
    });

    it('应该正确处理类名中的下划线', () => {
      expect(cn('class_1', 'class_2')).toBe('class_1 class_2');
    });

    it('应该正确处理类名中的冒号', () => {
      expect(cn('hover:bg-white', 'focus:text-black')).toBe('hover:bg-white focus:text-black');
    });

    it('应该正确处理类名中的点', () => {
      expect(cn('w.1/2', 'w.1/4')).toBe('w.1/2 w.1/4');
    });

    it('应该处理前导和尾随空格', () => {
      expect(cn(' class1 ', ' class2 ')).toBe('class1 class2');
    });
  });

  describe('边缘情况', () => {
    it('应该处理大量类名', () => {
      const classes = Array.from({ length: 100 }, (_, i) => `class${i}`);
      const result = cn(...classes);
      expect(result).toBe(classes.join(' '));
    });

    it('应该处理连续的空字符串', () => {
      expect(cn('', '', '')).toBe('');
    });

    it('应该处理连续的 undefined', () => {
      expect(cn(undefined, undefined, undefined)).toBe('');
    });

    it('应该处理连续的 null', () => {
      expect(cn(null, null, null)).toBe('');
    });

    it('应该处理混合的无效值', () => {
      expect(cn('', undefined, null, false, 0, [] as any)).toBe('');
    });

    it('应该处理类名中的换行符', () => {
      expect(cn('class1\nclass2')).toBe('class1 class2');
    });

    it('应该处理类名中的制表符', () => {
      expect(cn('class1\tclass2')).toBe('class1 class2');
    });
  });

  describe('性能', () => {
    it('应该快速处理大量参数', () => {
      const start = Date.now();
      const classes = Array.from({ length: 1000 }, (_, i) => `class${i}`);
      cn(...classes);
      const end = Date.now();

      // 应该在100ms内完成
      expect(end - start).toBeLessThan(100);
    });

    it('应该缓存结果（如果使用了 clsx 的缓存）', () => {
      const result1 = cn('class1 class2');
      const result2 = cn('class1 class2');
      const result3 = cn('class1 class2');

      // 结果应该一致
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });

  describe('与其他库的集成', () => {
    it('应该与 classnames 库兼容（如果使用）', () => {
      const isActive = true;
      expect(
        cn('base', {
          active: isActive,
          inactive: !isActive,
        })
      ).toBe('base active');
    });

    it('应该与 clsx 库兼容（如果使用）', () => {
      expect(cn('base', false && 'hidden', true && 'visible')).toBe('base visible');
    });

    it('应该与 tailwind-merge 库兼容（如果使用）', () => {
      expect(cn('px-4 py-2 bg-white', 'px-2 bg-blue-500')).toContain('px-2');
      expect(cn('px-4 py-2 bg-white', 'px-2 bg-blue-500')).toContain('bg-blue-500');
    });
  });

  describe('实际用例', () => {
    it('应该处理按钮类名', () => {
      const variants = {
        primary: 'bg-blue-500 text-white',
        secondary: 'bg-gray-200 text-black',
      };
      const sizes = {
        sm: 'px-2 py-1 text-sm',
        md: 'px-4 py-2 text-base',
      };

      const buttonClass = cn('font-medium rounded', variants.primary, sizes.md);

      expect(buttonClass).toContain('bg-blue-500');
      expect(buttonClass).toContain('text-white');
      expect(buttonClass).toContain('px-4');
      expect(buttonClass).toContain('py-2');
    });

    it('应该处理条件渲染类名', () => {
      const isLoading = true;
      const isError = false;

      const statusClass = cn(
        'status',
        isLoading && 'loading',
        isError && 'error',
        !isLoading && !isError && 'idle'
      );

      expect(statusClass).toContain('loading');
      expect(statusClass).not.toContain('error');
      expect(statusClass).not.toContain('idle');
    });

    it('应该处理响应式类名', () => {
      const responsiveClass = cn('text-base', 'sm:text-lg', 'md:text-xl', 'lg:text-2xl');

      expect(responsiveClass).toContain('sm:text-lg');
      expect(responsiveClass).toContain('md:text-xl');
      expect(responsiveClass).toContain('lg:text-2xl');
    });
  });
});
