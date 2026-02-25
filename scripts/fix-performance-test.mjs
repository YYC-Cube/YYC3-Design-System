#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/components/__tests__/performance.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

// 修复所有 renderItem={(item) => 为 renderItem={(item: MockItem) =>
content = content.replace(/renderItem=\{item\} =>/g, "renderItem={(item: MockItem) =>");

writeFileSync(testFilePath, content, 'utf-8');

console.log('performance.test.tsx 修复完成');
