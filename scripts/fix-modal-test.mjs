#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/components/__tests__/Modal.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

// 替换所有 open={ 为 isOpen={
content = content.replace(/open={/g, "isOpen={");

writeFileSync(testFilePath, content, 'utf-8');

console.log('Modal.test.tsx 修复完成');
