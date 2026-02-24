#!/usr/bin/env node

/**
 * @file 修复测试文件中缺失的ThemeProvider
 * @description 自动为需要ThemeProvider的组件测试添加ThemeProvider包装
 * @author YYC³
 * @version 1.0.0
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
  'ErrorNotification',
  'Avatar',
  'Badge',
  'Alert',
  'Tabs',
  'Checkbox',
  'Divider',
  'Progress',
  'Radio',
  'Select',
  'Spinner',
  'Switch',
  'Tooltip',
];

function needsThemeProvider(content) {
  for (const component of componentsNeedingTheme) {
    if (content.includes(`import { ${component}`) || content.includes(`import ${component}`)) {
      return true;
    }
  }
  return false;
}

function hasThemeProvider(content) {
  return content.includes('<ThemeProvider>') && content.includes('</ThemeProvider>');
}

function hasThemeProviderImport(content) {
  return content.includes("import { ThemeProvider }");
}

function fixTestFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf-8');
    const originalContent = content;

    if (!needsThemeProvider(content)) {
      return false;
    }

    if (hasThemeProvider(content)) {
      return false;
    }

    if (!hasThemeProviderImport(content)) {
      const lastImportMatch = content.match(/import .+ from ['"][^'"]+['"]/g);
      if (lastImportMatch) {
        const lastImport = lastImportMatch[lastImportMatch.length - 1];
        const importIndex = content.lastIndexOf(lastImport);
        const insertPosition = importIndex + lastImport.length;
        content = content.slice(0, insertPosition) + 
          '\nimport { ThemeProvider } from \'../../theme/ThemeProvider\';' +
          content.slice(insertPosition);
      }
    }

    const renderRegex = /render\(\s*<([A-Z][a-zA-Z]+)/g;
    let match;
    let modified = false;
    while ((match = renderRegex.exec(content)) !== null) {
      const fullMatch = match[0];
      const componentName = match[1];
      
      if (componentsNeedingTheme.includes(componentName)) {
        const replacement = fullMatch.replace('render(', 'render(<ThemeProvider>');
        content = content.replace(fullMatch, replacement);
        modified = true;
      }
    }

    const closingTagRegex = /render\(<ThemeProvider><([A-Z][a-zA-Z]+)([^>]*>)/g;
    let closingMatch;
    while ((closingMatch = closingTagRegex.exec(content)) !== null) {
      const fullMatch = closingMatch[0];
      const componentName = closingMatch[1];
      const rest = closingMatch[2];
      
      if (componentsNeedingTheme.includes(componentName)) {
        const closingTag = `</${componentName}>`;
        const replacement = fullMatch.replace(closingTag, `${closingTag}</ThemeProvider>`);
        content = content.replace(fullMatch, replacement);
        modified = true;
      }
    }

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
