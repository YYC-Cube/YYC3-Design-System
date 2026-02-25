#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import console from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/resource-optimization/__tests__/index.test.ts');

let content = readFileSync(testFilePath, 'utf-8');

// 修复preloadImage的mock实现
content = content.replace(
  /const mockImage = \{[\s\S]*?\};\s*jest\.spyOn\(window, 'Image'\)\.mockImplementation\(\(\) => mockImage\);/g,
  () => {
    return `const mockImage = document.createElement('img') as unknown as jest.Mocked<HTMLImageElement>;
    jest.spyOn(window, 'Image').mockImplementation(() => mockImage as unknown as HTMLImageElement);`;
  }
);

writeFileSync(testFilePath, content, 'utf-8');

console.log('resource-optimization test修复完成');
