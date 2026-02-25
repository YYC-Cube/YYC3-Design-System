/**
 * @file 分析测试失败原因
 * @description 分析所有失败测试的具体错误
 * @module scripts/analyze-test-failures
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';

console.log('🔍 分析测试失败原因...\n');

const failedTests = [
  'src/__tests__/performance.test.tsx',
  'src/__tests__/integration.test.tsx',
  'src/components/__tests__/Card.test.tsx',
  'src/components/__tests__/Modal.test.tsx',
  'src/components/__tests__/Menu.test.tsx',
  'src/components/__tests__/Input.test.tsx',
  'src/components/__tests__/Grid.test.tsx',
  'src/components/__tests__/Form.test.tsx',
  'src/components/__tests__/Dropdown.test.tsx',
  'src/components/__tests__/Container.test.tsx',
  'src/components/__tests__/Pagination.test.tsx',
  'src/components/__tests__/performance.test.tsx',
  'src/components/__tests__/Table.test.tsx',
  'src/components/GenericComponent.test.tsx',
  'src/components/Tooltip.test.tsx',
  'src/performance/__tests__/monitoring.test.ts',
  'src/resource-optimization/__tests__/index.test.ts',
  'src/security/__tests__/CSPProvider.test.tsx',
  'src/security/__tests__/CSRFProtection.test.tsx',
  'src/theme/__tests__/ThemeProvider.test.tsx',
];

const errorSummary = {};

failedTests.forEach(testFile => {
  try {
    console.log(`分析: ${testFile}`);
    const output = execSync(`npm test ${testFile} 2>&1`, { 
      encoding: 'utf-8',
      timeout: 30000
    });
    
    // 提取错误信息
    const errors = [];
    const lines = output.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // 提取TypeScript错误
      if (line.includes('error TS')) {
        const match = line.match(/error TS\d+:(.+)/);
        if (match) {
          errors.push({
            type: 'TypeScript',
            message: match[1].trim(),
            line: line.match(/:(\d+):(\d+) -/) ? `${line.match(/:(\d+):(\d+) -/)[1]}:${line.match(/:(\d+):(\d+) -/)[2]}` : 'unknown'
          });
        }
      }
      
      // 提取测试失败信息
      if (line.includes('●') && !line.includes('Test suite failed')) {
        const testName = line.replace('●', '').trim();
        errors.push({
          type: 'Test Failure',
          message: testName
        });
      }
    }
    
    if (errors.length > 0) {
      errorSummary[testFile] = errors;
    }
    
  } catch (error) {
    console.error(`  ❌ 分析失败: ${error.message}`);
    errorSummary[testFile] = [{
      type: 'Analysis Error',
      message: error.message
    }];
  }
});

const report = `# 测试失败分析报告

## 总体统计

- 分析测试文件数: ${failedTests.length}
- 有错误的文件数: ${Object.keys(errorSummary).length}
- 无错误的文件数: ${failedTests.length - Object.keys(errorSummary).length}

## 详细错误列表

${Object.entries(errorSummary).map(([file, errors]) => `
### ${file}

\`\`\`
${errors.map(e => `- [${e.type}] ${e.message}`).join('\n')}
\`\`\`
`).join('\n')}
`;

writeFileSync('test-failures-analysis.md', report, 'utf-8');

console.log(`\n📊 分析完成！`);
console.log(`   - 分析文件数: ${failedTests.length}`);
console.log(`   - 有错误文件: ${Object.keys(errorSummary).length}`);
console.log(`   - 报告已保存到: test-failures-analysis.md`);
