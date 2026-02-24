#!/usr/bin/env node

/**
 * @file 修复 performance.test.tsx screen 类型问题
 * @description 将 screen 调用替换为 typedScreen
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import fs from 'fs';
import path from 'path';

const filePath = path.join(process.cwd(), 'src/components/__tests__/performance.test.tsx');

try {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  const originalScreen = content;
  
  content = content.replace(/screen\./g, 'typedScreen.');
  
  if (content !== originalScreen) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log('✓ 已修复: src/components/__tests__/performance.test.tsx');
  } else {
    console.log('无需修复');
  }
} catch (error) {
  console.error('错误:', error.message);
}
