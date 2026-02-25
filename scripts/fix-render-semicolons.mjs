#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [
  join(__dirname, '../src/components/__tests__/Pagination.test.tsx'),
  join(__dirname, '../src/components/__tests__/Menu.test.tsx'),
  join(__dirname, '../src/components/__tests__/Modal.test.tsx'),
  join(__dirname, '../src/components/__tests__/Input.test.tsx'),
  join(__dirname, '../src/components/__tests__/Dropdown.test.tsx'),
];

testFiles.forEach(filePath => {
  try {
    let content = readFileSync(filePath, 'utf-8');

    // 匹配 render(<ThemeProvider>...</ThemeProvider>) 后面没有分号的情况
    // 修复 render(<ThemeProvider>... 后面没有分号的情况
    content = content.replace(
      /render\(<ThemeProvider><[^<]*<\/ThemeProvider>\)\s*\n/g,
      (match) => {
        // 如果已经以分号结尾，就不修改
        if (match.trim().endsWith(';')) {
          return match;
        }
        return match.trim() + ';\n';
      }
    );

    // 更复杂的匹配：render(<ThemeProvider>... 可能包含嵌套组件
    // 匹配从 render( 开始到 ); 结束的完整语句
    const renderPattern = /render\(\s*<ThemeProvider>([\s\S]*?)<\/ThemeProvider>\s*\)/g;
    content = content.replace(renderPattern, (match) => {
      const trimmed = match.trim();
      if (trimmed.endsWith(';')) {
        return match;
      }
      return trimmed + ';';
    });

    writeFileSync(filePath, content, 'utf-8');
    console.log(`Fixed: ${filePath.split('/').pop()}`);
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
});

console.log('All test files processed');
