#!/usr/bin/env node

import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const testFilePath = join(__dirname, '../src/theme/__tests__/ThemeProvider.test.tsx');

let content = readFileSync(testFilePath, 'utf-8');

// 替换所有 { theme, setTheme } 为 { mode, setMode }
content = content.replace(/const { theme, setTheme } = useTheme\(\);/g, "const { mode, setMode } = useTheme();");

// 替换所有 { theme } 为 { mode }
content = content.replace(/const { theme } = useTheme\(\);/g, "const { mode } = useTheme();");

// 替换所有单独的 { theme } 为 { mode }
content = content.replace(/const { theme }/g, "const { mode }");

// 替换所有单独的 { setTheme } 为 { setMode }
content = content.replace(/const { setTheme }/g, "const { setMode }");

// 替换所有 setTheme( 为 setMode(
content = content.replace(/setTheme\(/g, "setMode(");

// 替换所有 defaultTheme=" 为 initial="
content = content.replace(/defaultTheme="/g, "initial=");

writeFileSync(testFilePath, content, 'utf-8');

console.log('ThemeProvider.test.tsx 完全修复完成');
