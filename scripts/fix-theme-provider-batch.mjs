#!/usr/bin/env node

/**
 * @file 批量修复测试文件中的ThemeProvider
 * @description 批量修复render语句中的ThemeProvider包装
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import fs from 'fs';
import { execSync } from 'child_process';

function fixTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    const componentsNeedingTheme = ['Table', 'Button', 'Input', 'Card', 'Modal', 'Grid', 'Menu', 'Dropdown', 'Container', 'Breadcrumb', 'Pagination', 'Form', 'FormField'];

    content = content.replace(
      /render\(<ThemeProvider><([A-Z][a-zA-Z]+)([^>]*>)/g,
      (match, componentName, rest) => {
        if (componentsNeedingTheme.includes(componentName)) {
          return `render(<ThemeProvider><${componentName}${rest}`;
        }
        return match;
      }
    );

    content = content.replace(
      /render\(<ThemeProvider><([A-Z][a-zA-Z]+)([^>]*>)\s*<\/\1>\s*\);/g,
      (match, componentName, rest) => {
        if (componentsNeedingTheme.includes(componentName)) {
          return `render(<ThemeProvider><${componentName}${rest}</${componentName}></ThemeProvider>);`;
        }
        return match;
      }
    );

    content = content.replace(
      /render\(\s*<([A-Z][a-zA-Z]+)([^>]*)>\s*<\/\1>\s*\);/g,
      (match, componentName, attrs) => {
        if (componentsNeedingTheme.includes(componentName) && !match.includes('ThemeProvider')) {
          return `render(<ThemeProvider><${componentName}${attrs}</${componentName}></ThemeProvider>);`;
        }
        return match;
      }
    );

    content = content.replace(
      /render\(\s*<([A-Z][a-zA-Z]+)([^>]*>)/g,
      (match, componentName, rest) => {
        if (componentsNeedingTheme.includes(componentName) && !match.includes('ThemeProvider')) {
          return `render(<ThemeProvider><${componentName}${rest}`;
        }
        return match;
      }
    );

    const testBlocks = content.split("it('");
    const fixedBlocks = testBlocks.map((block, index) => {
      if (index === 0) return block;
      
      const fullMatch = `it('${block}`;
      if (!fullMatch.includes('render(<ThemeProvider>')) {
        const renderMatch = fullMatch.match(/render\(\s*<([A-Z][a-zA-Z]+)/);
        if (renderMatch) {
          const componentName = renderMatch[1];
          if (componentsNeedingTheme.includes(componentName)) {
            return fullMatch.replace(/render\(\s*<([A-Z][a-zA-Z]+)/, 'render(<ThemeProvider><$1');
          }
        }
      }
      
      return fullMatch;
    });
    
    content = fixedBlocks.join(`it('`);

    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf-8');
      console.log(`✓ 已修复: ${filePath.replace(process.cwd() + '/', '')}`);
      return true;
    }
  } catch (error) {
    console.error(`✗ 错误: ${filePath.replace(process.cwd() + '/', '')}`, error.message);
    return false;
  }
}

try {
  const testFiles = [
    ...execSync('find src/components/__tests__ -name "*.test.tsx"', { encoding: 'utf-8' }).split('\n').filter(Boolean),
    ...execSync('find src/components -name "*.test.tsx"', { encoding: 'utf-8' }).split('\n').filter(Boolean),
  ].filter(f => !f.includes('Table.test.tsx'));

  console.log(`找到 ${testFiles.length} 个测试文件`);

  let fixedCount = 0;
  for (const testFile of testFiles) {
    if (fixTestFile(testFile)) {
      fixedCount++;
    }
  }

  console.log(`\n修复完成！共修复 ${fixedCount} 个文件`);
} catch (error) {
  console.error('错误:', error.message);
}
