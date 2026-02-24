#!/usr/bin/env node

/**
 * @file 修复测试文件中ThemeProvider闭合标签
 * @description 批量修复缺失的ThemeProvider闭合标签
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

    const components = ['Table', 'Button', 'Input', 'Card', 'Modal', 'Grid', 'Menu', 'Dropdown', 'Container', 'Breadcrumb', 'Pagination', 'Form', 'FormField', 'ErrorNotification', 'Tabs', 'Checkbox', 'Divider', 'Progress', 'Radio', 'Select', 'Spinner', 'Switch', 'Tooltip', 'Avatar', 'Badge', 'Alert'];

    for (const component of components) {
      const openTag = `<${component}`;
      const closeTag = `</${component}>`;
      
      if (content.includes(`<ThemeProvider>${openTag}`) && !content.includes(`${closeTag}</ThemeProvider>`)) {
        content = content.replace(new RegExp(`${closeTag}\\s*\\);`, 'g'), `${closeTag}</ThemeProvider>);`);
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
