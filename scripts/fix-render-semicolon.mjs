#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [
  join(__dirname, '../src/components/__tests__/Modal.test.tsx'),
  join(__dirname, '../src/components/__tests__/Pagination.test.tsx'),
  join(__dirname, '../src/components/__tests__/Menu.test.tsx'),
  join(__dirname, '../src/components/__tests__/Input.test.tsx'),
  join(__dirname, '../src/components/__tests__/Dropdown.test.tsx'),
];

testFiles.forEach(filePath => {
  let content = readFileSync(filePath, 'utf-8');

  // 修复 render 语句缺少分号的问题
  // 匹配 render(<ThemeProvider>...</ThemeProvider>) 后面没有分号的情况
  content = content.replace(
    /render\(<ThemeProvider><[^<]*<\/ThemeProvider>\)\s*(\n|$)/g,
    (match) => {
      if (match.endsWith(';') || match.endsWith('\n')) {
        return match;
      }
      return match.slice(0, -1) + ';\n';
    }
  );

  writeFileSync(filePath, content, 'utf-8');
  console.log(`Fixed: ${filePath.split('/').pop()}`);
});

console.log('All test files fixed');
