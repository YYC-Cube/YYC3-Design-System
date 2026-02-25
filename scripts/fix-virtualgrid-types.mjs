#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/components/__tests__/performance.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

// 替换所有 renderItem={(item) => 为 renderItem={(item: any) =>
content = content.replace(/renderItem=\{item\} =>/g, "renderItem={(item: any) =>");

writeFileSync(testFilePath, content, 'utf-8');

console.log('VirtualGrid 类型修复完成');
