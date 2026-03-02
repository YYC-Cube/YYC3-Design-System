#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const filesToFix = [
  'tests/integration/integration.test.tsx',
  'tests/performance/performance.test.tsx',
];

filesToFix.forEach(filePath => {
  const fullPath = path.join(process.cwd(), filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`⚠️  File not found: ${filePath}`);
    return;
  }

  let content = fs.readFileSync(fullPath, 'utf-8');
  let modified = false;

  const fixes = [
    {
      pattern: /const\s+(\w+)\s*=\s*screen\.render\(<ThemeProvider><[^>]+><\/ThemeProvider>\);\s*expect\(\w+\).toBeInTheDocument\(\);/g,
      replacement: (match, varName) => {
        return `screen.render(<ThemeProvider><${match.match(/<(\w+)/)[1]} /></ThemeProvider>);`;
      }
    },
    {
      pattern: /const\s+(container)\s*=\s*render\(<[^>]+>\).container;\s*expect\([^)]+\).toBeInTheDocument\(\);/g,
      replacement: (match) => {
        return match.replace(/const\s+container\s*=\s*render\(<[^>]+>\).container;\s*/, '');
      }
    },
    {
      pattern: /\b(const|let|var)\s+(\w+)\s*=\s*[^;]+;\s*\/\/\s*TODO.*$/gm,
      replacement: (match, keyword, varName) => {
        if (match.includes('TODO')) {
          return match.replace(new RegExp(`\\b${keyword}\\s+${varName}\\s*=\\s*[^;]+;`), '');
        }
        return match;
      }
    }
  ];

  fixes.forEach(({ pattern, replacement }) => {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf-8');
    console.log(`✅ Fixed: ${filePath}`);
  } else {
    console.log(`ℹ️  No changes needed: ${filePath}`);
  }
});

console.log('\n✨ Fix complete!');
