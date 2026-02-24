#!/usr/bin/env node

/**
 * @file 批量修复测试导入脚本
 * @description 将@testing-library/dom中的render移到@testing-library/react
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-24
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// 获取所有使用@testing-library/dom的测试文件
const testFiles = execSync(
  'grep -r "from \'@testing-library/dom\'" src --include="*.test.ts" --include="*.test.tsx" -l',
  { encoding: 'utf-8', cwd: process.cwd() }
).split('\n').filter(Boolean);

console.log(`找到 ${testFiles.length} 个需要修复的测试文件`);

testFiles.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    let modified = false;

    // 检查是否有@testing-library/dom的导入
    const domImportMatch = content.match(/import\s+{\s*([^}]*)}\s+from\s+['"]@testing-library\/dom['"]/);
    const reactImportMatch = content.match(/import\s+{\s*([^}]*)}\s+from\s+['"]@testing-library\/react['"]/);

    if (!domImportMatch) return;

    const domImports = domImportMatch[1].split(',').map(s => s.trim()).filter(Boolean);
    const reactImports = reactImportMatch ? reactImportMatch[1].split(',').map(s => s.trim()).filter(Boolean) : [];

    // 如果dom导入中包含render，需要移动到react导入
    if (domImports.includes('render')) {
      console.log(`修复文件: ${filePath}`);
      
      // 从dom导入中移除render
      const newDomImports = domImports.filter(i => i !== 'render');
      
      // 将render添加到react导入
      const newReactImports = [...new Set([...reactImports, 'render'])];
      
      // 移除旧的dom导入
      content = content.replace(
        /import\s+{[^}]*}\s+from\s+['"]@testing-library\/dom['"];?\n?/g,
        ''
      );
      
      // 如果有react导入，更新它；否则创建新的
      if (reactImportMatch) {
        content = content.replace(
          reactImportMatch[0],
          `import { ${newReactImports.join(', ')} } from '@testing-library/react';`
        );
      } else {
        // 在第一个import后添加
        const firstImportMatch = content.match(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"]/);
        if (firstImportMatch) {
          content = content.replace(
            firstImportMatch[0],
            firstImportMatch[0] + `\nimport { ${newReactImports.join(', ')} } from '@testing-library/react';`
          );
        }
      }
      
      // 如果dom导入还有其他内容，重新添加
      if (newDomImports.length > 0) {
        const firstImportMatch = content.match(/import\s+{[^}]*}\s+from\s+['"][^'"]+['"]/);
        if (firstImportMatch) {
          content = content.replace(
            firstImportMatch[0],
            firstImportMatch[0] + `\nimport { ${newDomImports.join(', ')} } from '@testing-library/dom';`
          );
        }
      }
      
      modified = true;
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
