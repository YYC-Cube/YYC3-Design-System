/**
 * @file 修复测试文件导入
 * @description 批量修复测试文件中缺少 jest-dom 导入的问题
 * @module scripts/fix-test-imports
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-19
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

const testFiles = glob.sync('src/**/*.test.{ts,tsx}', {
  cwd: path.join(__dirname, '..'),
});

let fixedCount = 0;

testFiles.forEach(filePath => {
  const fullPath = path.join(__dirname, '..', filePath);
  const content = fs.readFileSync(fullPath, 'utf8');

  if (content.includes('@testing-library/jest-dom')) {
    console.log(`✓ ${filePath} - 已包含 jest-dom 导入`);
    return;
  }

  const importRegex = /import\s+\{[^}]+\}\s+from\s+['"]@jest\/globals['"]\s*;/;
  const importMatch = content.match(importRegex);

  if (importMatch) {
    const newImport = `${importMatch[0]}\nimport '@testing-library/jest-dom';`;
    const newContent = content.replace(importRegex, newImport);
    fs.writeFileSync(fullPath, newContent, 'utf8');
    console.log(`✓ ${filePath} - 已添加 jest-dom 导入`);
    fixedCount++;
  } else {
    console.log(`✗ ${filePath} - 未找到 @jest/globals 导入`);
  }
});

console.log(`\n总共修复了 ${fixedCount} 个文件`);