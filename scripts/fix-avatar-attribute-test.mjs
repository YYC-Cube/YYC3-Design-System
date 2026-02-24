/**
 * @file 修复Avatar组件的toHaveAttribute测试
 * @description 修复toHaveAttribute为toHaveAttribute('src', ...)的正确使用
 * @module scripts/fix-avatar-attribute-test
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
  
  // 检查是否有错误的toHaveAttribute使用
  if (content.includes('expect(img).toHaveAttribute(')) {
    let newContent = content;
    
    // 修复toHaveAttribute调用
    newContent = newContent.replace(
      /expect\(img\)\.toHaveAttribute\('src', '([^']+)'\)/g,
      "expect(img).toHaveAttribute('src', '$1')"
    );
    
    // 写回文件
    if (newContent !== content) {
      writeFileSync(file, newContent, 'utf-8');
      fixedCount++;
      console.log(`✓ Fixed: ${file}`);
    }
  }
});

console.log(`\nTotal files fixed: ${fixedCount}/${testFiles.length}`);
