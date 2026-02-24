#!/usr/bin/env node

/**
 * @file 替换vitest为jest脚本
 * @description 批量替换测试文件中的vitest导入为jest
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-24
 */

import fs from 'fs';
import path from 'path';

const files = [
  'src/components/__tests__/Pagination.test.tsx',
  'src/components/__tests__/Table.test.tsx',
  'src/components/__tests__/Dropdown.test.tsx',
  'src/components/__tests__/Menu.test.tsx',
  'src/components/__tests__/Breadcrumb.test.tsx',
];

files.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  try {
    let content = fs.readFileSync(fullPath, 'utf-8');
    
    // 替换 vitest 导入为空
    content = content.replace(/import\s+{\s*[^}]*}\s+from\s+['"]vitest['"];?\n?/g, '');
    
    // 替换 vi.fn() 为 jest.fn()
    content = content.replace(/vi\.fn\(\)/g, 'jest.fn()');
    
    // 替换 vi.mock() 为 jest.mock()
    content = content.replace(/vi\.mock\(/g, 'jest.mock(');
    
    // 替换 vi.clearAllMocks() 为 jest.clearAllMocks()
    content = content.replace(/vi\.clearAllMocks\(\)/g, 'jest.clearAllMocks()');
    
    // 替换 vi.restoreAllMocks() 为 jest.restoreAllMocks()
    content = content.replace(/vi\.restoreAllMocks\(\)/g, 'jest.restoreAllMocks()');
    
    // 替换 vi.spyOn() 为 jest.spyOn()
    content = content.replace(/vi\.spyOn\(/g, 'jest.spyOn(');
    
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✓ 已修复: ${filePath}`);
  } catch (error) {
    console.error(`✗ 错误: ${filePath}`, error.message);
  }
});

console.log('\n修复完成！');
