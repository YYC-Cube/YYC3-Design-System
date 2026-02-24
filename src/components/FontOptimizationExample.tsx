/**
 * @file 字体优化示例组件
 * @description 演示字体预加载、子集化和显示优化的使用
 * @module components/FontOptimizationExample
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-22
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { Card, CardHeader, CardContent } from './Card';
import { Button } from './Button';
import {
  preloadFont,
  preloadFontBatch,
  preloadFontsWithProgress,
  clearFontCache,
  getFontPreloaderStats,
  isFontLoaded,
  waitForFontLoad,
  getAvailableFonts,
  type FontInfo,
} from '../utils/font-preloader';
import {
  analyzeCharacters,
  extractCharactersFromDOM,
  generateFontSubsetReport,
  type CharacterAnalysis,
} from '../utils/font-subsetter';
import {
  getSystemFontStack,
  getMonospaceFontStack,
  analyzeFontPerformance,
} from '../utils/font-display-optimizer';

interface FontSubsetReport {
  originalSize: number;
  subsetSize: number;
  reduction: number;
  charCount: number;
  categories?: CharacterAnalysis['charCategories'];
  recommendations: string[];
}

export interface FontOptimizationExampleProps {
  className?: string;
}

export const FontOptimizationExample: React.FC<FontOptimizationExampleProps> = ({ className = '' }) => {
  const [preloading, setPreloading] = useState(false);
  const [preloadProgress, setPreloadProgress] = useState({ loaded: 0, total: 0 });
  const [fontStats, setFontStats] = useState({
    cacheSize: 0,
    loadingCount: 0,
    cacheEntries: [] as FontInfo[],
  });
  const [charAnalysis, setCharAnalysis] = useState<CharacterAnalysis | null>(null);
  const [fontPerformance, setFontPerformance] = useState<ReturnType<typeof analyzeFontPerformance> | null>(null);
  const [availableFonts, setAvailableFonts] = useState<string[]>([]);
  const [subsetReport, setSubsetReport] = useState<FontSubsetReport | null>(null);

  const sampleFonts = [
    {
      fontFamily: 'Inter',
      fontSrc: 'https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff2',
      fontWeight: '400',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Roboto',
      fontSrc: 'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxM.woff2',
      fontWeight: '400',
      fontStyle: 'normal',
    },
    {
      fontFamily: 'Open Sans',
      fontSrc: 'https://fonts.gstatic.com/s/opensans/v35/memSYaGs126MiZpBA-UvWbX2vVnXBbObj2OVTS-muw.woff2',
      fontWeight: '400',
      fontStyle: 'normal',
    },
  ];

  const sampleText = `
    YYC³ Design System 是一个现代化的设计系统，提供完整的组件库和设计令牌。
    它支持多种框架，包括 React、Vue 和 Svelte，并且具有出色的性能优化。
    The YYC³ Design System is a modern design system providing a complete component library and design tokens.
    It supports multiple frameworks including React, Vue, and Svelte, with excellent performance optimization.
  `;

  useEffect(() => {
    const stats = getFontPreloaderStats();
    setFontStats(stats);

    const performance = analyzeFontPerformance();
    setFontPerformance(performance);

    const fonts = getAvailableFonts();
    setAvailableFonts(fonts);

    const analysis = analyzeCharacters(sampleText);
    setCharAnalysis(analysis);

    const report = generateFontSubsetReport(100000, extractCharactersFromDOM(), analysis);
    setSubsetReport(report);
  }, [sampleText]);

  const handlePreloadSingle = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadFont(sampleFonts[0].fontFamily, sampleFonts[0].fontSrc, {
        fontWeight: sampleFonts[0].fontWeight,
        fontStyle: sampleFonts[0].fontStyle,
        timeout: 10000,
      });
      const stats = getFontPreloaderStats();
      setFontStats(stats);
    } catch (error) {
      console.error('字体预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, [sampleFonts]);

  const handlePreloadBatch = useCallback(async () => {
    setPreloading(true);
    try {
      await preloadFontBatch(
        sampleFonts.map((font) => ({
          fontFamily: font.fontFamily,
          fontSrc: font.fontSrc,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
        }))
      );
      const stats = getFontPreloaderStats();
      setFontStats(stats);
    } catch (error) {
      console.error('批量字体预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, [sampleFonts]);

  const handlePreloadWithProgress = useCallback(async () => {
    setPreloading(true);
    setPreloadProgress({ loaded: 0, total: sampleFonts.length });
    try {
      await preloadFontsWithProgress(
        sampleFonts.map((font) => ({
          fontFamily: font.fontFamily,
          fontSrc: font.fontSrc,
          fontWeight: font.fontWeight,
          fontStyle: font.fontStyle,
        })),
        (loaded, total) => {
          setPreloadProgress({ loaded, total });
        }
      );
      const stats = getFontPreloaderStats();
      setFontStats(stats);
    } catch (error) {
      console.error('带进度字体预加载失败:', error);
    } finally {
      setPreloading(false);
    }
  }, []);

  const handleClearCache = useCallback(() => {
    clearFontCache();
    const stats = getFontPreloaderStats();
    setFontStats(stats);
  }, []);

  const handleRefreshStats = useCallback(() => {
    const stats = getFontPreloaderStats();
    setFontStats(stats);

    const performance = analyzeFontPerformance();
    setFontPerformance(performance);

    const fonts = getAvailableFonts();
    setAvailableFonts(fonts);
  }, []);

  const handleCheckFontLoaded = useCallback(async () => {
    const loaded = isFontLoaded('Inter');
    console.warn('Inter 字体是否已加载:', loaded);

    if (!loaded) {
      await waitForFontLoad('Inter', 5000);
      console.warn('Inter 字体加载完成');
    }
  }, []);

  return (
    <div className={className} style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>字体优化统计</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>字体缓存统计</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>缓存数量: {fontStats.cacheSize}</li>
                  <li>加载中数量: {fontStats.loadingCount}</li>
                  <li>已加载字体: {fontStats.cacheEntries.length}</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>字体性能分析</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>总字体数: {fontPerformance?.totalFonts || 0}</li>
                  <li>已加载字体: {fontPerformance?.loadedFonts || 0}</li>
                  <li>失败字体: {fontPerformance?.failedFonts || 0}</li>
                  <li>平均加载时间: {Math.round(fontPerformance?.averageLoadTime || 0)}ms</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>可用字体</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem', maxHeight: '200px', overflow: 'auto' }}>
                  {availableFonts.map((font) => (
                    <li key={font}>{font}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div style={{ marginTop: '1rem' }}>
              <Button onClick={handleRefreshStats}>刷新统计</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>字体预加载</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>单张预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载单张高优先级字体，适用于关键内容
                </p>
                <Button onClick={handlePreloadSingle} disabled={preloading}>
                  {preloading ? '预加载中...' : '预加载单张字体'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>批量预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  批量预加载多张字体，适用于页面初始化
                </p>
                <Button onClick={handlePreloadBatch} disabled={preloading}>
                  {preloading ? '预加载中...' : '批量预加载'}
                </Button>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>带进度预加载</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  预加载并显示进度，适用于大量字体
                </p>
                <Button onClick={handlePreloadWithProgress} disabled={preloading}>
                  {preloading ? '预加载中...' : '带进度预加载'}
                </Button>
                {preloading && (
                  <div style={{ marginTop: '0.5rem', fontSize: '0.875rem' }}>
                    进度: {preloadProgress.loaded} / {preloadProgress.total}
                  </div>
                )}
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>缓存管理</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  清理字体缓存，释放内存
                </p>
                <Button onClick={handleClearCache}>清空缓存</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>字体子集化</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>字符分析</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>总字符数: {charAnalysis?.totalChars || 0}</li>
                  <li>唯一字符数: {charAnalysis?.uniqueChars || 0}</li>
                  <li>拉丁字符: {charAnalysis?.charCategories?.latin || 0}</li>
                  <li>扩展拉丁字符: {charAnalysis?.charCategories?.latinExtended || 0}</li>
                  <li>西里尔字符: {charAnalysis?.charCategories?.cyrillic || 0}</li>
                  <li>希腊字符: {charAnalysis?.charCategories?.greek || 0}</li>
                  <li>CJK 字符: {charAnalysis?.charCategories?.cjk || 0}</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>子集化报告</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  <li>原始大小: {subsetReport?.originalSize || 0} bytes</li>
                  <li>子集大小: {subsetReport?.subsetSize || 0} bytes</li>
                  <li>减少比例: {Math.round(subsetReport?.reduction || 0)}%</li>
                  <li>字符数量: {subsetReport?.charCount || 0}</li>
                </ul>
              </div>
              <div>
                <h3 style={{ marginBottom: '0.5rem', fontSize: '1rem' }}>优化建议</h3>
                <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8', fontSize: '0.875rem' }}>
                  {subsetReport?.recommendations?.map((rec: string, index: number) => (
                    <li key={index}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>字体显示优化</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>系统字体栈</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  使用系统字体栈，提供最佳性能和兼容性
                </p>
                <div style={{ padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                  <strong>无衬线字体:</strong><br />
                  {getSystemFontStack()}
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f0f0f0', borderRadius: '0.25rem', fontSize: '0.875rem' }}>
                  <strong>等宽字体:</strong><br />
                  {getMonospaceFontStack()}
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>字体检测</h3>
                <p style={{ marginBottom: '1rem', fontSize: '0.875rem', color: '#64748b' }}>
                  检测字体是否已加载
                </p>
                <Button onClick={handleCheckFontLoaded}>检查 Inter 字体</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <Card>
          <CardHeader>
            <h2 style={{ margin: 0, fontSize: '1.5rem' }}>字体示例</h2>
          </CardHeader>
          <CardContent>
            <div style={{ display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Inter 字体</h3>
                <div style={{ fontFamily: 'Inter, sans-serif', fontSize: '1.5rem', lineHeight: '1.6' }}>
                  {sampleText}
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Roboto 字体</h3>
                <div style={{ fontFamily: 'Roboto, sans-serif', fontSize: '1.5rem', lineHeight: '1.6' }}>
                  {sampleText}
                </div>
              </div>
              <div>
                <h3 style={{ marginBottom: '1rem', fontSize: '1rem' }}>Open Sans 字体</h3>
                <div style={{ fontFamily: 'Open Sans, sans-serif', fontSize: '1.5rem', lineHeight: '1.6' }}>
                  {sampleText}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <h2 style={{ margin: 0, fontSize: '1.5rem' }}>性能优化建议</h2>
        </CardHeader>
        <CardContent>
          <ul style={{ paddingLeft: '1.5rem', lineHeight: '1.8' }}>
            <li>
              <strong>字体预加载</strong>：预加载关键字体，减少首次内容绘制（FCP）时间
            </li>
            <li>
              <strong>字体子集化</strong>：只包含实际使用的字符，显著减少字体文件大小
            </li>
            <li>
              <strong>字体显示策略</strong>：使用 font-display: swap 提供更好的用户体验
            </li>
            <li>
              <strong>系统字体栈</strong>：优先使用系统字体，提升加载速度
            </li>
            <li>
              <strong>字体格式</strong>：使用 WOFF2 格式，提供更好的压缩率
            </li>
            <li>
              <strong>缓存管理</strong>：合理使用字体缓存，避免重复加载
            </li>
            <li>
              <strong>FOUT/FOIT 预防</strong>：使用适当的字体显示策略防止闪烁
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
};

export default FontOptimizationExample;
