/**
 * @file 预提交审核脚本
 * @description 在提交前自动检查代码质量、类型、构建等
 * @author YYC³
 * @version 1.0.0
 * @created 2026-03-02
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logSection(title) {
  console.log(`\n${colors.cyan}═════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.cyan}  ${title}${colors.reset}`);
  console.log(`${colors.cyan}═════════════════════════════════════════${colors.reset}\n`);
}

function runCheck(name, command, description) {
  logSection(name);
  log(`📋 ${description}`, colors.yellow);
  
  try {
    execSync(command, { 
      stdio: 'inherit',
      cwd: path.resolve(__dirname, '..')
    });
    log(`✅ ${name} 通过`, colors.green);
    return true;
  } catch (error) {
    log(`❌ ${name} 失败`, colors.red);
    log(error.message, colors.red);
    return false;
  }
}

function checkFileExists(filePath, description) {
  const fullPath = path.resolve(__dirname, '..', filePath);
  const exists = fs.existsSync(fullPath);
  
  if (exists) {
    log(`✅ ${description}: 存在`, colors.green);
  } else {
    log(`⚠️  ${description}: 不存在`, colors.yellow);
  }
  
  return exists;
}

function checkPackageVersion() {
  logSection('版本检查');
  
  const packageJson = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, '..', 'package.json'), 'utf-8')
  );
  
  log(`📦 版本: ${packageJson.version}`, colors.cyan);
  log(`📦 名称: ${packageJson.name}`, colors.cyan);
  
  if (packageJson.engines) {
    log(`🔧 Node 要求: ${packageJson.engines.node}`, colors.yellow);
    log(`🔧 npm 要求: ${packageJson.engines.npm}`, colors.yellow);
    
    const currentNodeVersion = process.version.substring(1);
    const requiredNodeVersion = packageJson.engines.node.replace('>=', '').split('.')[0];
    
    if (parseInt(currentNodeVersion) < parseInt(requiredNodeVersion)) {
      log(`❌ Node 版本不匹配: 当前 ${currentNodeVersion}, 需要 ${packageJson.engines.node}`, colors.red);
      return false;
    }
  }
  
  return true;
}

function main() {
  log(`${colors.blue}
╔══════════════════════════════════════════════════════════╗
║                    YYC³ Design System                        ║
║                   预提交审核脚本                            ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}`, colors.blue);

  const checks = [
    {
      name: 'Node 版本检查',
      fn: checkPackageVersion,
      required: true
    },
    {
      name: 'TypeScript 类型检查',
      fn: () => runCheck('TypeScript Check', 'pnpm typecheck', '检查 TypeScript 类型错误'),
      required: true
    },
    {
      name: 'ESLint 代码检查',
      fn: () => runCheck('ESLint', 'pnpm lint', '检查代码质量和规范'),
      required: true
    },
    {
      name: 'Prettier 格式检查',
      fn: () => runCheck('Prettier', 'pnpm format:check', '检查代码格式'),
      required: true
    },
    {
      name: 'Locale 验证',
      fn: () => runCheck('Locale Validation', 'pnpm validate:locales', '验证国际化文件完整性'),
      required: false
    },
    {
      name: '项目构建',
      fn: () => runCheck('Build', 'pnpm build', '验证项目可以成功构建'),
      required: true
    },
    {
      name: '文件检查',
      fn: () => {
        logSection('文件检查');
        const requiredFiles = [
          { path: 'package.json', desc: 'package.json' },
          { path: 'README.md', desc: 'README.md' },
          { path: '.gitignore', desc: '.gitignore' },
          { path: 'tsconfig.json', desc: 'tsconfig.json' },
          { path: 'vite.config.ts', desc: 'Vite 配置' },
        ];
        
        let allExist = true;
        requiredFiles.forEach(file => {
          if (!checkFileExists(file.path, file.desc)) {
            allExist = false;
          }
        });
        
        return allExist;
      },
      required: true
    },
  ];

  let passed = 0;
  let failed = 0;
  let criticalFailed = false;

  checks.forEach(check => {
    const result = check.fn();
    if (result) {
      passed++;
    } else {
      failed++;
      if (check.required) {
        criticalFailed = true;
      }
    }
  });

  logSection('审核结果');
  
  console.log(`\n${colors.cyan}通过: ${passed}${colors.reset}`);
  console.log(`${colors.cyan}失败: ${failed}${colors.reset}\n`);

  if (criticalFailed) {
    log(`\n❌ 预提交审核失败！存在必需检查未通过。`, colors.red);
    log(`请修复上述问题后再提交代码。\n`, colors.yellow);
    process.exit(1);
  } else {
    log(`\n✅ 预提交审核通过！可以安全提交代码。`, colors.green);
    log(`\n${colors.green}
╔══════════════════════════════════════════════════════════╗
║                   符合 YYC³ 五高五标五化标准                    ║
╚══════════════════════════════════════════════════════════╝
${colors.reset}\n`, colors.green);
    process.exit(0);
  }
}

main();
