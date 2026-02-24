/**
 * @file 修复常见测试错误
 * @description 批量修复测试文件中的常见错误
 * @module scripts/fix-common-test-errors
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { readFileSync, writeFileSync } from 'fs';
import { glob } from 'glob';

const testFiles = glob.sync('src/**/*.test.{ts,tsx}');

console.log(`🔍 检查 ${testFiles.length} 个测试文件...\n`);

let fixedCount = 0;

testFiles.forEach(file => {
  let content = readFileSync(file, 'utf-8');
  let hasChanges = false;

  // 1. 修复 React 导入方式
  if (content.includes('import React from') && !content.includes('import * as React')) {
    content = content.replace(/import React from 'react'/g, "import * as React from 'react'");
    hasChanges = true;
  }

  // 2. 移除未使用的 waitFor 导入
  if (content.includes("from '@testing-library/react'") && content.includes('waitFor') && !content.includes('await waitFor')) {
    content = content.replace(/, waitFor/g, '');
    content = content.replace(/waitFor, /g, '');
    hasChanges = true;
  }

  // 3. 添加 ThemeProvider 导入（如果使用了 ThemeProvider 但没有导入）
  if (content.includes('<ThemeProvider>') && !content.includes('ThemeProvider')) {
    const importMatch = content.match(/import.*from ['"]\.\/.*['"]/);
    if (importMatch) {
      const importPosition = content.indexOf(importMatch[0]);
      content = content.slice(0, importPosition) +
        "import { ThemeProvider } from '../theme/ThemeProvider';\n" +
        content.slice(importPosition);
      hasChanges = true;
    }
  }

  // 4. 修复空对象 {} 为 undefined
  if (content.includes("genericComponentFactory.create('CustomButton', {})")) {
    content = content.replace(/genericComponentFactory\.create\('CustomButton', {}\)/g, "genericComponentFactory.create('CustomButton', undefined)");
    hasChanges = true;
  }

  if (hasChanges) {
    writeFileSync(file, content, 'utf-8');
    fixedCount++;
    console.log(`✓ Fixed: ${file}`);
  }
});

console.log(`\n📊 修复完成！`);
console.log(`   - 修复文件数: ${fixedCount}/${testFiles.length}`);
console.log(`   - 未修复文件: ${testFiles.length - fixedCount}`);
