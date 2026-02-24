/**
 * @file 修复重复的screen导入
 * @description 移除从@testing-library/react导入的screen，保留@testing-library/dom的导入
 * @module scripts/fix-duplicate-screen-imports
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { readFileSync, writeFileSync, readdirSync } from 'fs';
import { join } from 'path';

// 递归查找所有测试文件
function findTestFiles(dir, files = []) {
  const entries = readdirSync(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    
    if (entry.isDirectory()) {
      if (!entry.name.startsWith('.') && entry.name !== 'node_modules') {
        findTestFiles(fullPath, files);
      }
    } else if (entry.isFile() && (entry.name.endsWith('.test.ts') || entry.name.endsWith('.test.tsx'))) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 查找所有测试文件
const testFiles = findTestFiles('src');

let fixedCount = 0;

testFiles.forEach(file => {
  const content = readFileSync(file, 'utf-8');
  
  // 检查是否有重复导入
  if (content.includes("from '@testing-library/react'") && content.includes("from '@testing-library/dom'")) {
    // 从react导入中移除screen
    const reactImportMatch = content.match(/import \{([^}]+)\} from ['"]@testing-library\/react['"]/);
    if (reactImportMatch) {
      const imports = reactImportMatch[1].split(',').map(s => s.trim());
      const filteredImports = imports.filter(imp => imp !== 'screen').join(', ');
      
      let newContent = content;
      if (filteredImports.trim()) {
        newContent = content.replace(
          /import \{([^}]+)\} from ['"]@testing-library\/react['"]/,
          `import { ${filteredImports} } from '@testing-library/react'`
        );
      } else {
        // 如果没有其他导入，移除整行
        newContent = content.replace(
          /import \{[^}]+\} from ['"]@testing-library\/react['"][\s]*;?/,
          ''
        );
      }
      
      // 移除dom导入中的多余分号
      newContent = newContent.replace("from '@testing-library/dom';;", "from '@testing-library/dom';");
      
      if (newContent !== content) {
        writeFileSync(file, newContent, 'utf-8');
        fixedCount++;
        console.log(`✓ Fixed: ${file}`);
      }
    }
  }
});

console.log(`\nTotal files fixed: ${fixedCount}/${testFiles.length}`);
