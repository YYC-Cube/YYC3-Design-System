#!/usr/bin/env node

/**
 * @file 测试导入修复脚本
 * @description 批量修复测试文件中的导入问题
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-24
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 获取所有测试文件
const testFiles = execSync('find src -name "*.test.ts" -o -name "*.test.tsx"', {
  encoding: 'utf-8',
  cwd: process.cwd()
}).split('\n').filter(Boolean);

console.log(`找到 ${testFiles.length} 个测试文件`);

// 修复每个文件
testFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 检查是否需要修复
    const hasScreenFromReact = /import\s+{[^}]*screen[^}]*}\s+from\s+['"]@testing-library\/react['"]/.test(content);
    const hasFireEventFromReact = /import\s+{[^}]*fireEvent[^}]*}\s+from\s+['"]@testing-library\/react['"]/.test(content);
    const hasWaitForFromReact = /import\s+{[^}]*waitFor[^}]*}\s+from\s+['"]@testing-library\/react['"]/.test(content);

    if (!hasScreenFromReact && !hasFireEventFromReact && !hasWaitForFromReact) {
      return;
    }

    console.log(`修复文件: ${filePath}`);

    // 第一步：从 @testing-library/react 的导入中移除 screen, fireEvent, waitFor
    content = content.replace(
      /import\s+{\s*([^}]*screen[^}]*fireEvent[^}]*waitFor[^}]*)}\s+from\s+['"]@testing-library\/react['"]/g,
      (match, imports) => {
        // 移除 screen, fireEvent, waitFor
        const cleanImports = imports
          .replace(/\bscreen\b/g, '')
          .replace(/\bfireEvent\b/g, '')
          .replace(/\bwaitFor\b/g, '')
          .replace(/,\s*,\s*/g, ', ')
          .replace(/^\s*,\s*/, '')
          .replace(/\s*,\s*$/, '');
        
        if (cleanImports.trim()) {
          return `import { ${cleanImports} } from '@testing-library/react';`;
        }
        return '';
      }
    );

    // 第二步：添加 @testing-library/dom 的导入
    const domImports = [];
    if (hasScreenFromReact) domImports.push('screen');
    if (hasFireEventFromReact) domImports.push('fireEvent');
    if (hasWaitForFromReact) domImports.push('waitFor');

    if (domImports.length > 0) {
      // 检查是否已经有 @testing-library/dom 导入
      if (!content.includes("from '@testing-library/dom'")) {
        // 在第一个 import 语句后添加
        content = content.replace(
          /(@testing-library\/react['"])/,
          `@testing-library/react';\nimport { ${domImports.join(', ')} } from '@testing-library/dom';`
        );
      } else {
        // 添加到现有的 @testing-library/dom 导入中
        content = content.replace(
          /import\s+{\s*([^}]*)}\s+from\s+['"]@testing-library\/dom['"]/,
          (match, existingImports) => {
            const allImports = [...existingImports.split(',').map(s => s.trim()), ...domImports];
            const uniqueImports = [...new Set(allImports)].filter(Boolean);
            return `import { ${uniqueImports.join(', ')} } from '@testing-library/dom';`;
          }
        );
      }
      modified = true;
    }

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`  ✓ 已修复: ${filePath}`);
    }
  } catch (error) {
    console.error(`  ✗ 错误: ${filePath}`, error.message);
  }
});

console.log('\n修复完成！');
