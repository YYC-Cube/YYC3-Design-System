/**
 * @file 收集所有测试错误
 * @description 运行测试并收集所有TypeScript错误
 * @module scripts/collect-test-errors
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { execSync } from 'child_process';
import { writeFileSync } from 'fs';
import console from 'console';
import process from 'process';

console.log('🔍 收集所有测试错误...\n');

try {
  const output = execSync('npm test 2>&1', { encoding: 'utf-8' });

  // 提取所有错误行
  const errorLines = output.split('\n').filter(line =>
    line.includes('error TS') && line.includes('src/')
  );

  // 按文件分组
  const errorsByFile = {};
  errorLines.forEach(line => {
    const fileMatch = line.match(/(src\/[^:]+\.tsx?):/);
    if (fileMatch) {
      const file = fileMatch[1];
      if (!errorsByFile[file]) {
        errorsByFile[file] = [];
      }
      errorsByFile[file].push(line);
    }
  });

  // 保存到文件
  const report = `# 测试错误收集报告

## 错误统计

总错误数: ${errorLines.length}
涉及文件数: ${Object.keys(errorsByFile).length}

## 按文件分类的错误

${Object.entries(errorsByFile).map(([file, errors]) => `
### ${file}

\`\`\`
${errors.join('\n')}
\`\`\`
`).join('\n')}
`;

  writeFileSync('test-errors-report.md', report, 'utf-8');

  console.log(`✅ 收集完成！`);
  console.log(`   - 总错误数: ${errorLines.length}`);
  console.log(`   - 涉及文件: ${Object.keys(errorsByFile).length}`);
  console.log(`   - 报告已保存到: test-errors-report.md`);

} catch (error) {
  console.error('❌ 收集失败:', error.message);
  process.exit(1);
}
