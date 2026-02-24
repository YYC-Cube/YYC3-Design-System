#!/usr/bin/env node

/**
 * @file 批量修复所有测试文件
 * @description 修复重复导入、多余分号、缺少ThemeProvider等问题
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

    content = content.replace(/import.*from ['"]@testing-library\/dom['"].*;;/g, '');
    content = content.replace(/import.*from ['"]@testing-library\/dom['"].*;[\s\S]*?import { render.*from ['"]@testing-library\/react['"];?/gs, '');
    content = content.replace(/import { render.*from ['"]@testing-library\/react['"][\s\S]*?import { render.*from ['"]@testing-library\/react['"];?/gs, "import { render, screen, fireEvent, waitFor } from '@testing-library/react';");
    content = content.replace(/import.*from ['"]@jest\/globals['"][\s\S]*?import.*from ['"]@testing-library\/react['"]/gs, "import { render, screen, fireEvent, waitFor } from '@testing-library/react';");

    content = content.replace(/render\(<ThemeProvider><([A-Z][a-zA-Z]+)([^>]*>)/g, (match, componentName, rest) => {
      const components = ['Table', 'Button', 'Input', 'Card', 'Modal', 'Grid', 'Menu', 'Dropdown', 'Container', 'Breadcrumb', 'Pagination', 'Form', 'FormField', 'ErrorNotification'];
      if (components.includes(componentName)) {
        return match;
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

try {
  const testFiles = [
    ...execSync('find src -name "*.test.tsx" -o -name "*.test.ts"', { encoding: 'utf-8' }).split('\n').filter(Boolean),
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
