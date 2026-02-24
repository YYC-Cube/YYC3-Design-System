#!/usr/bin/env node

/**
 * @file 批量修复测试导入脚本
 * @description 批量修复测试文件中的重复导入问题
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

    // 检查是否有重复的导入
    const hasDuplicateReactImport = /import\s+{[^}]*}\s+from\s+['"]@testing-library\/react['"][\s\S]*import\s+{[^}]*}\s+from\s+['"]@testing-library\/react['"]/.test(content);
    const hasDuplicateDomImport = /import\s+{[^}]*}\s+from\s+['"]@testing-library\/dom['"][\s\S]*import\s+{[^}]*}\s+from\s+['"]@testing-library\/dom['"]/.test(content);

    if (!hasDuplicateReactImport && !hasDuplicateDomImport) {
      return;
    }

    console.log(`修复文件: ${filePath}`);

    // 收集所有 @testing-library/react 导入
    const reactImports = [];
    const reactImportRegex = /import\s+{\s*([^}]*)}\s+from\s+['"]@testing-library\/react['"]/g;
    let match;
    while ((match = reactImportRegex.exec(content)) !== null) {
      reactImports.push(...match[1].split(',').map(s => s.trim()));
    }
    
    // 去重
    const uniqueReactImports = [...new Set(reactImports)].filter(Boolean);
    
    // 替换所有 @testing-library/react 导入为单个导入
    content = content.replace(
      /import\s+{[^}]*}\s+from\s+['"]@testing-library\/react['"]/g,
      ''
    );
    
    // 在第一个 import 语句后添加合并的导入
    if (uniqueReactImports.length > 0) {
      const firstImportMatch = content.match(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"]/);
      if (firstImportMatch) {
        content = content.replace(
          firstImportMatch[0],
          firstImportMatch[0] + `\nimport { ${uniqueReactImports.join(', ')} } from '@testing-library/react';`
        );
        modified = true;
      }
    }

    // 收集所有 @testing-library/dom 导入
    const domImports = [];
    const domImportRegex = /import\s+{\s*([^}]*)}\s+from\s+['"]@testing-library\/dom['"]/g;
    while ((match = domImportRegex.exec(content)) !== null) {
      domImports.push(...match[1].split(',').map(s => s.trim()));
    }
    
    // 去重
    const uniqueDomImports = [...new Set(domImports)].filter(Boolean);
    
    // 替换所有 @testing-library/dom 导入为单个导入
    content = content.replace(
      /import\s+{[^}]*}\s+from\s+['"]@testing-library\/dom['"]/g,
      ''
    );
    
    // 添加合并的导入
    if (uniqueDomImports.length > 0) {
      const firstImportMatch = content.match(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"]/);
      if (firstImportMatch) {
        content = content.replace(
          firstImportMatch[0],
          firstImportMatch[0] + `\nimport { ${uniqueDomImports.join(', ')} } from '@testing-library/dom';`
        );
        modified = true;
      }
    }

    // 清理空行
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    if (modified) {
      fs.writeFileSync(fullPath, content, 'utf-8');
      console.log(`  ✓ 已修复: ${filePath}`);
    }
  } catch (error) {
    console.error(`  ✗ 错误: ${filePath}`, error.message);
  }
});

console.log('\n修复完成！');
