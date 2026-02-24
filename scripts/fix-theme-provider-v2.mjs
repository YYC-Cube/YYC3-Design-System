#!/usr/bin/env node

/**
 * @file 修复测试文件中缺失的ThemeProvider v2
 * @description 正确修复ThemeProvider包装问题
 * @author YYC³
 * @version 2.0.0
 * @created 2026-02-25
 */

import fs from 'fs';
import { execSync } from 'child_process';

const componentsNeedingTheme = [
  'Table',
  'Button',
  'Input',
  'Card',
  'Modal',
  'Grid',
  'Menu',
  'Dropdown',
  'Container',
  'Breadcrumb',
  'Pagination',
  'Form',
  'FormField',
];

function fixTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    if (!hasThemeProviderImport(content)) {
      const lastImportMatch = content.match(/import .+ from ['"][^'"]+['"]/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const importIndex = content.lastIndexOf(lastImport);
        const insertPosition = importIndex + lastImport.length;
        
        let themeProviderPath = '../../theme/ThemeProvider';
        if (filePath.includes('components/__tests__')) {
          themeProviderPath = '../../theme/ThemeProvider';
        } else if (filePath.includes('components')) {
          themeProviderPath = '../theme/ThemeProvider';
        } else if (filePath.includes('__tests__')) {
          themeProviderPath = '../theme/ThemeProvider';
        }
        
        content = content.slice(0, insertPosition) + 
          `\nimport { ThemeProvider } from '${themeProviderPath}';` +
          content.slice(insertPosition);
      }
    }

    content = content.replace(
      /render\(\s*<([A-Z][a-zA-Z]+)([^>]*)>\s*<\/\1>\s*\)/g,
      (match, componentName, attrs) => {
        if (componentsNeedingTheme.includes(componentName)) {
          return `render(<ThemeProvider><${componentName}${attrs}></${componentName}></ThemeProvider>)`;
        }
        return match;
      }
    );

    content = content.replace(
      /render\(\s*<([A-Z][a-zA-Z]+)([^>]*>)/g,
      (match, componentName, rest) => {
        if (componentsNeedingTheme.includes(componentName) && !match.includes('<ThemeProvider>')) {
          return `render(<ThemeProvider><${componentName}${rest}`;
        }
        return match;
      }
    );

    const testRegex = /it\(['"]([^'"]+)['"].*?\n.*?render\(<ThemeProvider>(.*?)\);/gs;
    content = content.replace(testRegex, (match, testName, renderContent) => {
      const lines = renderContent.split('\n');
      const closingTagRegex = /<\/([A-Z][a-zA-Z]+)>/;
      let lastClosingTag = '';
      
      for (let i = lines.length - 1; i >= 0; i--) {
        const match = lines[i].match(closingTagRegex);
        if (match) {
          lastClosingTag = match[0];
          break;
        }
      }
      
      if (lastClosingTag && componentsNeedingTheme.some(c => lastClosingTag.includes(`</${c}>`))) {
        const insertIndex = renderContent.lastIndexOf(lastClosingTag);
        const newRenderContent = renderContent.slice(0, insertIndex) + 
          `${lastClosingTag}</ThemeProvider>` + 
          renderContent.slice(insertIndex + lastClosingTag.length);
        
        return match.replace(renderContent, newRenderContent);
      }
      
      return match;
    });

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

function hasThemeProviderImport(content) {
  return content.includes("import { ThemeProvider }");
}

try {
  const testFiles = [
    ...execSync('find src/components/__tests__ -name "*.test.tsx"', { encoding: 'utf-8' }).split('\n').filter(Boolean),
    ...execSync('find src/components -name "*.test.tsx"', { encoding: 'utf-8' }).split('\n').filter(Boolean),
  ];

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
