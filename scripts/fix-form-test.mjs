#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/components/__tests__/Form.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

// 修复 FormError message属性为 errors和name
content = content.replace(
  /<FormError message="([^"]+)" \/>/g,
  '<FormError errors={{ field: "$1" }} name="field" />'
);

// 修复 defaultValue 为 value
content = content.replace(
  /<Input \{\.\.\.field\} defaultValue="([^"]+)" \/>/g,
  '<Input {...{...field, value: "$1"} />'
);

writeFileSync(testFilePath, content, 'utf-8');

console.log('Form.test.tsx 修复完成');
