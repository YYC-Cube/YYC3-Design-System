/**
 * @file 修复性能测试
 * @description 为所有性能测试添加ThemeProvider包装
 * @module scripts/fix-performance-test
 * @author YYC³
 * @version 1.0.0
 * @created 2026-02-25
 */

import { readFileSync, writeFileSync } from 'fs';

const testFile = 'src/__tests__/performance.test.tsx';
let content = readFileSync(testFile, 'utf-8');

// 修复规则：为所有render调用添加ThemeProvider包装
const rules = [
  {
    pattern: /render\(<Button([^>]*)\>按钮<\/Button>\);/g,
    replacement: 'render(<ThemeProvider><Button$1>按钮</Button></ThemeProvider>);'
  },
  {
    pattern: /render\(<Button([^>]*)>\)/g,
    replacement: 'render(<ThemeProvider><Button$1></ThemeProvider>)'
  },
  {
    pattern: /render\(<Input\s*\/>\);/g,
    replacement: 'render(<ThemeProvider><Input /></ThemeProvider>);'
  },
  {
    pattern: /render\(<Input\s*onChange=\{handleChange\}\s*\/>\);/g,
    replacement: 'render(<ThemeProvider><Input onChange={handleChange} /></ThemeProvider>);'
  },
  {
    pattern: /render\(<Card>([\s\S]*?)<\/Card>\);/g,
    replacement: 'render(<ThemeProvider><Card>$1</Card></ThemeProvider>);'
  },
  {
    pattern: /render\(<div>\{cards\}<\/div>\);/g,
    replacement: 'render(<ThemeProvider><div>{cards}</div></ThemeProvider>);'
  },
  {
    pattern: /render\(<Grid([\s\S]*?)<\/Grid>\);/g,
    replacement: 'render(<ThemeProvider><Grid$1</Grid></ThemeProvider>);'
  },
];

let hasChanges = false;

rules.forEach(rule => {
  const newContent = content.replace(rule.pattern, rule.replacement);
  if (newContent !== content) {
    hasChanges = true;
    content = newContent;
  }
});

// 特殊处理：修复缺少ThemeProvider的TestComponent
content = content.replace(
  /const TestComponent = \(\) => \{\s*const \[count, setCount\] = React\.useState\(0\);[\s\S]*?\};[\s\S]*?render\(<TestComponent\s*\/>\);/g,
  (match) => {
    return match.replace('render(<TestComponent />);', 'render(<ThemeProvider><TestComponent /></ThemeProvider>);');
  }
);

content = content.replace(
  /const TestComponent = \(\) => \{\s*const \[value, setValue\] = React\.useState\(''\);[\s\S]*?\};[\s\S]*?render\(<TestComponent\s*\/>\);/g,
  (match) => {
    return match.replace('render(<TestComponent />);', 'render(<ThemeProvider><TestComponent /></ThemeProvider>);');
  }
);

if (hasChanges || content !== readFileSync(testFile, 'utf-8')) {
  writeFileSync(testFile, content, 'utf-8');
  console.log(`✅ 已修复: ${testFile}`);
} else {
  console.log(`ℹ️  无需修复: ${testFile}`);
}
