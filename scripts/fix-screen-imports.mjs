/**
 * @file 修复测试文件中的screen导入
 * @description 将screen从@testing-library/dom导入而不是@testing-library/react
 * @module scripts/fix-screen-imports
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// 递归查找所有测试文件
function findTestFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = join(dir, entry.name);

    if (entry.isDirectory()) {
      // 跳过node_modules等目录
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findTestFiles(fullPath, files);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx'))) {
      files.push(fullPath);
    }
  }

  return files;
}

// 查找所有测试文件
const testFiles = findTestFiles('src');

let fixedCount = 0;

testFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');

  // 检查是否需要修复
  if (content.includes("from '@testing-library/react'") && content.includes('screen.')) {
    let newContent = content;

    // 添加@testing-library/dom导入（如果还没有）
    if (!newContent.includes("from '@testing-library/dom'")) {
      const reactImportMatch = newContent.match(/import.*from ['"]@testing-library\/react['"]/);
      if (reactImportMatch) {
        const insertPosition = newContent.indexOf(reactImportMatch[0]) + reactImportMatch[0].length;
        newContent = newContent.slice(0, insertPosition) +
          `\nimport { screen } from '@testing-library/dom';` +
          newContent.slice(insertPosition);
      }
    }

    // 写回文件
    if (newContent !== content) {
      writeFileSync(file, newContent, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  }
});

console.log(`\nTotal files fixed: ${fixedCount}/${testFiles.length}`);
