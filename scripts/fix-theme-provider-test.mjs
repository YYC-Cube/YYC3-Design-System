#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/theme/__tests__/ThemeProvider.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

content = content.replace(/const { theme, setTheme } = useTheme\(\);/g, "const { mode, setMode } = useTheme();");
content = content.replace(/当前主题: {theme}/g, "当前主题: {mode}");
content = content.replace(/主题: {theme}/g, "主题: {mode}");
content = content.replace(/setTheme\(/g, "setMode(");
content = content.replace(/defaultTheme=/g, "initial=");

writeFileSync(testFilePath, content, 'utf-8');

console.log('ThemeProvider.test.tsx 修复完成');
