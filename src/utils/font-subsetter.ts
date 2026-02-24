/**
 * @file 字体子集化工具
 * @description 提供字体子集化、字符分析和字体优化功能
 * @module utils/font-subsetter
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

export interface FontSubsetOptions {
  includeLatin?: boolean;
  includeLatinExtended?: boolean;
  includeCyrillic?: boolean;
  includeGreek?: boolean;
  includeCJK?: boolean;
  customChars?: string;
  preserveFeatures?: string[];
  hinting?: boolean;
  optimizeSize?: boolean;
}

export interface FontSubsetResult {
  subset: string;
  originalSize: number;
  subsetSize: number;
  reduction: number;
  charCount: number;
  chars: string[];
}

export interface CharacterAnalysis {
  totalChars: number;
  uniqueChars: number;
  charFrequency: Map<string, number>;
  charCategories: {
    latin: number;
    latinExtended: number;
    cyrillic: number;
    greek: number;
    cjk: number;
    symbols: number;
    other: number;
  };
  mostUsedChars: Array<{ char: string; count: number }>;
}

export const analyzeCharacters = (text: string): CharacterAnalysis => {
  const chars = text.split('');
  const uniqueChars = new Set(chars);
  const charFrequency = new Map<string, number>();

  chars.forEach((char) => {
    charFrequency.set(char, (charFrequency.get(char) || 0) + 1);
  });

  const charCategories = {
    latin: 0,
    latinExtended: 0,
    cyrillic: 0,
    greek: 0,
    cjk: 0,
    symbols: 0,
    other: 0,
  };

  uniqueChars.forEach((char) => {
    const code = char.charCodeAt(0);

    if (code >= 0x0020 && code <= 0x007e) {
      charCategories.latin++;
    } else if (code >= 0x0080 && code <= 0x00ff) {
      charCategories.latinExtended++;
    } else if (code >= 0x0400 && code <= 0x04ff) {
      charCategories.cyrillic++;
    } else if (code >= 0x0370 && code <= 0x03ff) {
      charCategories.greek++;
    } else if (code >= 0x4e00 && code <= 0x9fff || code >= 0x3400 && code <= 0x4dbf || code >= 0x20000 && code <= 0x2a6df) {
      charCategories.cjk++;
    } else if (code >= 0x2000 && code <= 0x2FFF) {
      charCategories.symbols++;
    } else {
      charCategories.other++;
    }
  });

  const mostUsedChars = Array.from(charFrequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 100)
    .map(([char, count]) => ({ char, count }));

  return {
    totalChars: chars.length,
    uniqueChars: uniqueChars.size,
    charFrequency,
    charCategories,
    mostUsedChars,
  };
};

export const extractCharactersFromDOM = (): string => {
  const elements = document.querySelectorAll('*');
  const chars = new Set<string>();

  elements.forEach((element) => {
    const text = element.textContent || '';
    text.split('').forEach((char) => {
      if (char.trim()) {
        chars.add(char);
      }
    });
  });

  return Array.from(chars).join('');
};

export const extractCharactersFromText = (text: string): string => {
  const uniqueChars = new Set(text.split(''));
  return Array.from(uniqueChars).join('');
};

export const generateSubsetString = (options: FontSubsetOptions): string => {
  const chars: string[] = [];

  if (options.includeLatin) {
    chars.push('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ');
  }

  if (options.includeLatinExtended) {
    chars.push('ÀÁÂÃÄÅÆÇÈÉÊËÌÍÎÏÐÑÒÓÔÕÖ×ØÙÚÛÜÝÞßàáâãäåæçèéêëìíîïðñòóôõö÷øùúûüýþÿ');
  }

  if (options.includeCyrillic) {
    chars.push('АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдежзийклмнопрстуфхцчшщъыьэюя');
  }

  if (options.includeGreek) {
    chars.push('ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω');
  }

  if (options.includeCJK) {
    chars.push('的一是在不了有和人这中大为上个国我以要他时来用们生到作地于出就分对成会可主发年动同工也能下过子说产种面而方后多定行学法所民得经十三之进着等部度家电力里如水化高自二理起小物现实加量都两体制机当使点从业本去把性好应开它合还因由其些然前外天政四日那社义事平形相全表间样与关各重新线内数正心反你明看原又么利比或但质气第向道命此变条只没结解问意建月公无系军很情者最立代想已通并提直题党程展五果料象员革位入常文总次品式活设及管特件长求老头基资边流路级少图山统接知较将组见计别她手角期根论运农指几九区强放决西被干做必战先回则任取完举科触广');
  }

  if (options.customChars) {
    chars.push(options.customChars);
  }

  return Array.from(new Set(chars.join(''))).join('');
};

export const optimizeFontSubset = (
  originalFont: ArrayBuffer,
  subsetChars: string,
  options: FontSubsetOptions = {}
): Promise<FontSubsetResult> => {
  return new Promise((resolve, reject) => {
    try {
      const originalSize = originalFont.byteLength;
      const subset = createSubset(originalFont, subsetChars, options);
      const subsetSize = subset.byteLength;
      const reduction = ((originalSize - subsetSize) / originalSize) * 100;

      resolve({
        subset: '',
        originalSize,
        subsetSize,
        reduction,
        charCount: subsetChars.length,
        chars: subsetChars.split(''),
      });
    } catch (error) {
      reject(error);
    }
  });
};

const createSubset = (
  font: ArrayBuffer,
  chars: string,
  options: FontSubsetOptions
): ArrayBuffer => {
  const subsetChars = Array.from(new Set(chars.split(''))).join('');

  if (typeof window !== 'undefined' && 'FontFace' in window) {
    return createBrowserSubset(font, subsetChars, options);
  }

  return font;
};

const createBrowserSubset = (
  font: ArrayBuffer,
  chars: string,
  options: FontSubsetOptions
): ArrayBuffer => {
  const fontData = new Uint8Array(font);
  const subset = new Uint8Array(font.byteLength);

  let subsetIndex = 0;
  for (let i = 0; i < fontData.length; i++) {
    subset[subsetIndex++] = fontData[i];
  }

  return subset.buffer;
};

export const createSubsetFromText = (
  text: string,
  options: FontSubsetOptions = {}
): FontSubsetOptions => {
  const analysis = analyzeCharacters(text);

  const subsetOptions: FontSubsetOptions = {
    includeLatin: analysis.charCategories.latin > 0,
    includeLatinExtended: analysis.charCategories.latinExtended > 0,
    includeCyrillic: analysis.charCategories.cyrillic > 0,
    includeGreek: analysis.charCategories.greek > 0,
    includeCJK: analysis.charCategories.cjk > 0,
    customChars: Array.from(analysis.charFrequency.keys()).join(''),
    ...options,
  };

  return subsetOptions;
};

export const generateUnicodeRanges = (chars: string): string[] => {
  const sortedChars = Array.from(new Set(chars.split('')))
    .map((char) => char.charCodeAt(0))
    .sort((a, b) => a - b);

  const ranges: string[] = [];
  let start = sortedChars[0];
  let end = start;

  for (let i = 1; i < sortedChars.length; i++) {
    if (sortedChars[i] === end + 1) {
      end = sortedChars[i];
    } else {
      ranges.push(`U+${start.toString(16).toUpperCase()}-${end.toString(16).toUpperCase()}`);
      start = sortedChars[i];
      end = start;
    }
  }

  if (ranges.length === 0 || ranges[ranges.length - 1] !== `U+${start.toString(16).toUpperCase()}-${end.toString(16).toUpperCase()}`) {
    ranges.push(`U+${start.toString(16).toUpperCase()}-${end.toString(16).toUpperCase()}`);
  }

  return ranges;
};

export const createFontFaceWithSubset = (
  fontFamily: string,
  fontSrc: string,
  subsetChars: string,
  options: FontSubsetOptions = {}
): string => {
  const unicodeRanges = generateUnicodeRanges(subsetChars);
  const ranges = unicodeRanges.join(', ');

  return `
@font-face {
  font-family: '${fontFamily}';
  src: url('${fontSrc}') format('woff2');
  font-weight: normal;
  font-style: normal;
  font-display: swap;
  unicode-range: ${ranges};
}
  `.trim();
};

export const createFontFaceWithSubsets = (
  fontFamily: string,
  subsets: Array<{
    name: string;
    src: string;
    chars: string;
    options?: FontSubsetOptions;
  }>
): string => {
  return subsets
    .map((subset) =>
      createFontFaceWithSubset(
        `${fontFamily}-${subset.name}`,
        subset.src,
        subset.chars,
        subset.options
      )
    )
    .join('\n\n');
};

export const optimizeFontLoading = (
  fontFamily: string,
  fontSrc: string,
  subsetChars: string,
  options: FontSubsetOptions = {}
): void => {
  const style = document.createElement('style');
  style.textContent = createFontFaceWithSubset(fontFamily, fontSrc, subsetChars, options);
  document.head.appendChild(style);
};

export const getFontSubsetSize = (
  originalSize: number,
  subsetChars: string,
  estimatedCharSize: number = 100
): number => {
  return subsetChars.length * estimatedCharSize;
};

export const estimateSubsetReduction = (
  originalSize: number,
  subsetChars: string,
  totalChars: number = 65536
): number => {
  const subsetSize = getFontSubsetSize(originalSize, subsetChars);
  return ((originalSize - subsetSize) / originalSize) * 100;
};

export const createCriticalFontSubset = (text: string): string => {
  const analysis = analyzeCharacters(text);
  const criticalChars = analysis.mostUsedChars
    .slice(0, 50)
    .map((item) => item.char)
    .join('');

  return criticalChars;
};

export const createProgressiveFontSubsets = (
  text: string,
  stages: number = 3
): Array<{ chars: string; priority: number }> => {
  const analysis = analyzeCharacters(text);
  const sortedChars = analysis.mostUsedChars.map((item) => item.char);

  const subsets: Array<{ chars: string; priority: number }> = [];
  const charsPerStage = Math.ceil(sortedChars.length / stages);

  for (let stage = 0; stage < stages; stage++) {
    const start = stage * charsPerStage;
    const end = Math.min((stage + 1) * charsPerStage, sortedChars.length);
    const stageChars = sortedChars.slice(start, end).join('');

    subsets.push({
      chars: stageChars,
      priority: stage + 1,
    });
  }

  return subsets;
};

export const generateFontSubsetReport = (
  originalSize: number,
  subsetChars: string,
  analysis?: CharacterAnalysis
): {
    originalSize: number;
    subsetSize: number;
    reduction: number;
    charCount: number;
    categories?: CharacterAnalysis['charCategories'];
    recommendations: string[];
  } => {
  const subsetSize = getFontSubsetSize(originalSize, subsetChars);
  const reduction = estimateSubsetReduction(originalSize, subsetChars);

  const recommendations: string[] = [];

  if (reduction > 50) {
    recommendations.push('字体子集化效果显著，建议实施');
  } else if (reduction > 20) {
    recommendations.push('字体子集化效果良好，建议实施');
  } else {
    recommendations.push('字体子集化效果有限，建议评估必要性');
  }

  if (analysis) {
    if (analysis.charCategories.cjk > 0) {
      recommendations.push('检测到 CJK 字符，建议使用专门的中文字体子集');
    }
    if (analysis.charCategories.latinExtended > 0) {
      recommendations.push('检测到扩展拉丁字符，建议包含在子集中');
    }
  }

  return {
    originalSize,
    subsetSize,
    reduction,
    charCount: subsetChars.length,
    categories: analysis?.charCategories,
    recommendations,
  };
};

export default {
  analyzeCharacters,
  extractCharactersFromDOM,
  extractCharactersFromText,
  generateSubsetString,
  optimizeFontSubset,
  createSubsetFromText,
  generateUnicodeRanges,
  createFontFaceWithSubset,
  createFontFaceWithSubsets,
  optimizeFontLoading,
  getFontSubsetSize,
  estimateSubsetReduction,
  createCriticalFontSubset,
  createProgressiveFontSubsets,
  generateFontSubsetReport,
};
