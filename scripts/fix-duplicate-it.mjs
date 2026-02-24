#!/usr/bin/env node

/**
 * @file 修复测试文件中重复的it(
 * @description 批量修复重复的it(调用
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

    content = content.replace(/it\('it\('it\('/g, "it('");
    content = content.replace(/it\('it\('/g, "it('");

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
