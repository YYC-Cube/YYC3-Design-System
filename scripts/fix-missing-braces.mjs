#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFiles = [
  join(__dirname, '../src/components/__tests__/Pagination.test.tsx'),
  join(__dirname, '../src/components/__tests__/Menu.test.tsx'),
  join(__dirname, '../src/components/__tests__/performance.test.tsx'),
  join(__dirname, '../src/components/__tests__/Form.test.tsx'),
  join(__dirname, '../src/components/__tests__/Dropdown.test.tsx'),
  join(__dirname, '../src/components/__tests__/Modal.test.tsx'),
  join(__dirname, '../src/components/__tests__/Input.test.tsx'),
  join(__dirname, '../src/components/__tests__/Grid.test.tsx'),
  join(__dirname, '../src/components/__tests__/Container.test.tsx'),
  join(__dirname, '../src/components/__tests__/Card.test.tsx'),
  join(__dirname, '../src/theme/__tests__/ThemeProvider.test.tsx'),
  join(__dirname, '../src/components/Tooltip.test.tsx'),
];

testFiles.forEach(filePath => {
  try {
    let content = readFileSync(filePath, 'utf-8');

    // 检查文件是否以 }); 结尾
    const trimmedContent = content.trim();

    // 统计 { 和 } 的数量
    const openBraces = (trimmedContent.match(/{/g) || []).length;
    const closeBraces = (trimmedContent.match(/}/g) || []).length;

    if (openBraces > closeBraces) {
      const missingBraces = openBraces - closeBraces;
      content += '\n' + '});'.repeat(missingBraces);
      writeFileSync(filePath, content, 'utf-8');
      console.log(`Fixed: ${filePath.split('/').pop()} (added ${missingBraces} closing braces)`);
    } else if (closeBraces > openBraces) {
      const extraBraces = closeBraces - openBraces;
      // 移除多余的 });
 需要从文件末尾开始
      let lines = content.split('\n');
      let removed = 0;
      for (let i = lines.length - 1; i >= 0 && removed < extraBraces; i--) {
        if (lines[i].trim() === '});' || lines[i].trim() === '})' || lines[i].trim() === '}') {
          lines.splice(i, 1);
          removed++;
        }
      }
      content = lines.join('\n');
      writeFileSync(filePath, content, 'utf-8');
      console.log(`Fixed: ${filePath.split('/').pop()} (removed ${removed} extra closing braces)`);
    }
  } catch (error) {
    console.error(`Error processing ${filePath}: ${error.message}`);
  }
});

console.log('All test files processed');
