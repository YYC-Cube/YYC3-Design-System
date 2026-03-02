#!/usr/bin/env node

/**
 * @file 智能远程提交前检测脚本
 * @description 多维度智能检测，确保代码质量和项目标准符合 YYC³ 五高五标五化要求
 * @module smart-pre-push-check
 * @author YYC³
 * @version 2.0.0
 * @created 2026-03-03
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const COLORS = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

const SYMBOLS = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  processing: '⏳',
  check: '✓',
  cross: '✗',
};

function log(message, color = 'reset') {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function header(message) {
  console.log('\n' + '='.repeat(60));
  log(message, 'cyan');
  console.log('='.repeat(60));
}

function subHeader(message) {
  console.log('\n' + '-'.repeat(50));
  log(message, 'bright');
  console.log('-'.repeat(50));
}

class SmartPrePushChecker {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
    };
    this.startTime = Date.now();
    this.options = {
      fastMode: process.argv.includes('--fast'),
      skipTests: process.argv.includes('--skip-tests'),
      skipCoverage: process.argv.includes('--skip-coverage'),
      skipE2E: process.argv.includes('--skip-e2e'),
    };
  }

  async run() {
    log('\n' + '╔══════════════════════════════════════════════════════════╗', 'cyan');
    log('║           YYC³ 智能远程提交前检测系统                    ║', 'cyan');
    log('║        Five-High/Five-Standard/Five-Implementation         ║', 'cyan');
    log('╚══════════════════════════════════════════════════════════╝', 'cyan');

    log(`\n${SYMBOLS.info} 检测模式: ${this.options.fastMode ? '快速模式' : '完整模式'}`);
    log(`${SYMBOLS.info} 开始时间: ${new Date().toLocaleString('zh-CN')}\n`);

    try {
      await this.checkEnvironment();
      await this.checkGitStatus();
      await this.checkCodeQuality();
      await this.checkTesting();
      await this.checkPerformance();
      await this.checkSecurity();
      await this.checkDocumentation();
      await this.checkYYC3Standards();
      await this.generateReport();
    } catch (error) {
      log(`\n${SYMBOLS.error} 检测过程中发生错误: ${error.message}`, 'red');
      process.exit(1);
    }
  }

  async checkEnvironment() {
    header('1️⃣ 环境检查');

    log(`${SYMBOLS.processing} 检查 Node.js 版本...`, 'dim');
    const nodeVersion = process.version;
    log(`${SYMBOLS.check} Node.js 版本: ${nodeVersion}`, 'green');

    log(`${SYMBOLS.processing} 检查依赖项...`, 'dim');
    try {
      execSync('pnpm list --depth=0', { stdio: 'pipe' });
      this.addResult('environment', '依赖项检查', true);
    } catch (error) {
      this.addResult('environment', '依赖项检查', false, error.message);
    }

    log(`${SYMBOLS.processing} 检查必要文件...`, 'dim');
    const requiredFiles = ['package.json', 'tsconfig.json', 'vite.config.ts', 'README.md'];
    for (const file of requiredFiles) {
      if (existsSync(join(__dirname, '..', file))) {
        log(`${SYMBOLS.check} ${file} 存在`, 'green');
      } else {
        log(`${SYMBOLS.cross} ${file} 不存在`, 'red');
        this.addResult('environment', `${file} 检查`, false);
      }
    }
  }

  async checkGitStatus() {
    header('2️⃣ Git 状态检查');

    try {
      const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim();
      log(`${SYMBOLS.info} 当前分支: ${branch}`, 'cyan');

      const status = execSync('git status --porcelain', { encoding: 'utf-8' }).trim();
      if (status) {
        log(`${SYMBOLS.warning} 存在未提交的更改`, 'yellow');
        this.addResult('git', 'Git 状态', true, '存在未提交更改', 'warning');
      } else {
        log(`${SYMBOLS.check} 工作区干净`, 'green');
        this.addResult('git', 'Git 状态', true);
      }

      const ahead = execSync('git rev-list --count HEAD...@{u}', { encoding: 'utf-8' }).trim();
      if (ahead !== '0') {
        log(`${SYMBOLS.info} 领先远程 ${ahead} 个提交`, 'cyan');
      }
    } catch (error) {
      log(`${SYMBOLS.warning} Git 检查失败: ${error.message}`, 'yellow');
    }
  }

  async checkCodeQuality() {
    header('3️⃣ 代码质量检查');

    subHeader('TypeScript 类型检查');
    try {
      execSync('pnpm typecheck', { stdio: 'pipe' });
      log(`${SYMBOLS.success} TypeScript 类型检查通过`, 'green');
      this.addResult('code', 'TypeScript 类型检查', true);
    } catch (error) {
      log(`${SYMBOLS.error} TypeScript 类型检查失败`, 'red');
      this.addResult('code', 'TypeScript 类型检查', false, '类型错误');
    }

    subHeader('ESLint 代码规范检查');
    try {
      execSync('pnpm lint', { stdio: 'pipe' });
      log(`${SYMBOLS.success} ESLint 检查通过`, 'green');
      this.addResult('code', 'ESLint 检查', true);
    } catch (error) {
      log(`${SYMBOLS.error} ESLint 检查失败`, 'red');
      this.addResult('code', 'ESLint 检查', false, '代码规范问题');
    }

    subHeader('Prettier 代码格式检查');
    try {
      execSync('pnpm format:check', { stdio: 'pipe' });
      log(`${SYMBOLS.success} Prettier 检查通过`, 'green');
      this.addResult('code', 'Prettier 检查', true);
    } catch (error) {
      log(`${SYMBOLS.warning} 代码格式不一致，建议运行 pnpm format`, 'yellow');
      this.addResult('code', 'Prettier 检查', false, '格式问题', 'warning');
    }
  }

  async checkTesting() {
    header('4️⃣ 测试检查');

    if (this.options.skipTests) {
      log(`${SYMBOLS.warning} 测试检查已跳过 (--skip-tests)`, 'yellow');
      return;
    }

    subHeader('单元测试');
    try {
      execSync('pnpm test -- --passWithNoTests', { stdio: 'pipe' });
      log(`${SYMBOLS.success} 单元测试通过`, 'green');
      this.addResult('testing', '单元测试', true);
    } catch (error) {
      log(`${SYMBOLS.error} 单元测试失败`, 'red');
      this.addResult('testing', '单元测试', false, '测试失败');
    }

    if (!this.options.fastMode && !this.options.skipCoverage) {
      subHeader('测试覆盖率');
      try {
        execSync('pnpm test:coverage -- --passWithNoTests', { stdio: 'pipe' });
        log(`${SYMBOLS.success} 测试覆盖率检查通过`, 'green');
        this.addResult('testing', '测试覆盖率', true);
      } catch (error) {
        log(`${SYMBOLS.warning} 测试覆盖率低于阈值`, 'yellow');
        this.addResult('testing', '测试覆盖率', false, '覆盖率不足', 'warning');
      }
    }

    if (!this.options.fastMode && !this.options.skipE2E) {
      subHeader('E2E 测试');
      try {
        execSync('pnpm test:e2e', { stdio: 'pipe' });
        log(`${SYMBOLS.success} E2E 测试通过`, 'green');
        this.addResult('testing', 'E2E 测试', true);
      } catch (error) {
        log(`${SYMBOLS.warning} E2E 测试失败，建议检查`, 'yellow');
        this.addResult('testing', 'E2E 测试', false, 'E2E 测试失败', 'warning');
      }
    }
  }

  async checkPerformance() {
    header('5️⃣ 性能检查');

    if (this.options.fastMode) {
      log(`${SYMBOLS.info} 性能检查在快速模式下跳过`, 'dim');
      return;
    }

    subHeader('构建性能');
    try {
      const buildStart = Date.now();
      execSync('pnpm build', { stdio: 'pipe' });
      const buildTime = (Date.now() - buildStart) / 1000;
      log(`${SYMBOLS.check} 构建时间: ${buildTime.toFixed(2)}s`, 'green');

      if (buildTime > 120) {
        log(`${SYMBOLS.warning} 构建时间较长，建议优化`, 'yellow');
        this.addResult('performance', '构建性能', true, `构建时间: ${buildTime.toFixed(2)}s`, 'warning');
      } else {
        this.addResult('performance', '构建性能', true, `构建时间: ${buildTime.toFixed(2)}s`);
      }
    } catch (error) {
      log(`${SYMBOLS.error} 构建失败`, 'red');
      this.addResult('performance', '构建性能', false, '构建失败');
    }

    subHeader('包大小检查');
    try {
      const distPath = join(__dirname, '..', 'dist');
      if (existsSync(distPath)) {
        execSync(`du -sh ${distPath}`, { stdio: 'pipe' });
        log(`${SYMBOLS.check} 包大小检查完成`, 'green');
        this.addResult('performance', '包大小', true);
      }
    } catch (error) {
      log(`${SYMBOLS.warning} 包大小检查失败`, 'yellow');
      this.addResult('performance', '包大小', false, '检查失败', 'warning');
    }
  }

  async checkSecurity() {
    header('6️⃣ 安全检查');

    subHeader('依赖漏洞扫描');
    try {
      execSync('pnpm audit', { stdio: 'pipe' });
      log(`${SYMBOLS.success} 无已知安全漏洞`, 'green');
      this.addResult('security', '依赖漏洞扫描', true);
    } catch (error) {
      const errorMessage = error.message || '';
      if (errorMessage.includes('AUDIT_ENDPOINT_NOT_EXISTS') || errorMessage.includes("doesn't exist")) {
        log(`${SYMBOLS.info} 当前镜像不支持安全审计，跳过检查`, 'dim');
        log(`${SYMBOLS.info} 如需安全审计，请切换到官方 npm 源`, 'dim');
        this.addResult('security', '依赖漏洞扫描', true, '镜像不支持审计', 'info');
      } else {
        log(`${SYMBOLS.warning} 发现安全漏洞，建议修复`, 'yellow');
        this.addResult('security', '依赖漏洞扫描', false, '存在漏洞', 'warning');
      }
    }

    subHeader('敏感信息检查');
    try {
      const gitOutput = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
      const files = gitOutput.trim().split('\n').filter(f => f);

      const sensitivePatterns = [
        /password\s*=\s*['"][\w]+['"]/i,
        /api[_-]?key\s*=\s*['"][\w-]+['"]/i,
        /secret\s*=\s*['"][\w-]+['"]/i,
        /token\s*=\s*['"][\w-]+['"]/i,
      ];

      for (const file of files) {
        if (!file) continue;
        const filePath = join(__dirname, '..', file);
        if (!existsSync(filePath)) continue;

        const content = readFileSync(filePath, 'utf-8');
        for (const pattern of sensitivePatterns) {
          if (pattern.test(content)) {
            log(`${SYMBOLS.error} ${file} 可能包含敏感信息`, 'red');
            this.addResult('security', '敏感信息检查', false, `${file} 包含敏感信息`);
          }
        }
      }

      if (!this.results.failed.some(r => r.category === 'security' && r.name === '敏感信息检查')) {
        log(`${SYMBOLS.success} 未发现敏感信息`, 'green');
        this.addResult('security', '敏感信息检查', true);
      }
    } catch (error) {
      log(`${SYMBOLS.info} 敏感信息检查跳过`, 'dim');
    }
  }

  async checkDocumentation() {
    header('7️⃣ 文档检查');

    subHeader('README 文档');
    try {
      const readmePath = join(__dirname, '..', 'README.md');
      if (existsSync(readmePath)) {
        const readme = readFileSync(readmePath, 'utf-8');
        const requiredSections = ['# 概述', '## 功能特性', '## 快速开始', '## 技术栈'];

        for (const section of requiredSections) {
          if (readme.includes(section)) {
            log(`${SYMBOLS.check} 包含 "${section}"`, 'green');
          } else {
            log(`${SYMBOLS.warning} 缺少 "${section}"`, 'yellow');
          }
        }
        this.addResult('documentation', 'README 文档', true);
      } else {
        log(`${SYMBOLS.error} README.md 不存在`, 'red');
        this.addResult('documentation', 'README 文档', false);
      }
    } catch (error) {
      this.addResult('documentation', 'README 文档', false, error.message);
    }

    subHeader('多语言文档一致性');
    try {
      execSync('pnpm validate:locales', { stdio: 'pipe' });
      log(`${SYMBOLS.success} 多语言文档一致`, 'green');
      this.addResult('documentation', '多语言文档', true);
    } catch (error) {
      log(`${SYMBOLS.warning} 多语言文档存在不一致`, 'yellow');
      this.addResult('documentation', '多语言文档', false, '文档不一致', 'warning');
    }
  }

  async checkYYC3Standards() {
    header('8️⃣ YYC³ 标准检查');

    subHeader('项目命名规范');
    try {
      const packageJson = JSON.parse(readFileSync(join(__dirname, '..', 'package.json'), 'utf-8'));
      const projectName = packageJson.name;

      if (projectName.startsWith('yyc3-')) {
        log(`${SYMBOLS.success} 项目命名符合 YYC³ 规范: ${projectName}`, 'green');
        this.addResult('yyc3', '项目命名规范', true);
      } else {
        log(`${SYMBOLS.warning} 项目命名建议使用 "yyc3-" 前缀`, 'yellow');
        this.addResult('yyc3', '项目命名规范', false, '命名不符合规范', 'warning');
      }
    } catch (error) {
      this.addResult('yyc3', '项目命名规范', false, error.message);
    }

    subHeader('端口配置检查');
    try {
      const viteConfig = readFileSync(join(__dirname, '..', 'vite.config.ts'), 'utf-8');
      const portMatch = viteConfig.match(/port:\s*(\d+)/);

      if (portMatch) {
        const port = parseInt(portMatch[1]);
        if (port >= 3200 && port <= 3500) {
          log(`${SYMBOLS.success} 端口配置符合 YYC³ 规范: ${port}`, 'green');
          this.addResult('yyc3', '端口配置检查', true);
        } else if (port >= 3000 && port <= 3199) {
          log(`${SYMBOLS.warning} 端口 ${port} 属于限用范围`, 'yellow');
          this.addResult('yyc3', '端口配置检查', false, '端口限用', 'warning');
        } else {
          log(`${SYMBOLS.info} 端口配置: ${port}`, 'cyan');
        }
      }
    } catch (error) {
      log(`${SYMBOLS.info} 端口配置检查跳过`, 'dim');
    }

    subHeader('文件头注释检查');
    try {
      const gitOutput = execSync('git diff --cached --name-only', { encoding: 'utf-8' });
      const files = gitOutput.trim().split('\n').filter(f => f && (f.endsWith('.ts') || f.endsWith('.tsx')));

      let filesWithHeader = 0;
      for (const file of files) {
        const filePath = join(__dirname, '..', file);
        if (!existsSync(filePath)) continue;

        const content = readFileSync(filePath, 'utf-8');
        if (content.includes('@file') && content.includes('@description') && content.includes('@author')) {
          filesWithHeader++;
        }
      }

      if (files.length > 0) {
        const percentage = (filesWithHeader / files.length) * 100;
        log(`${SYMBOLS.info} 文件头注释覆盖率: ${percentage.toFixed(0)}%`, 'cyan');

        if (percentage >= 80) {
          this.addResult('yyc3', '文件头注释检查', true, `覆盖率: ${percentage.toFixed(0)}%`);
        } else {
          this.addResult('yyc3', '文件头注释检查', false, `覆盖率: ${percentage.toFixed(0)}%`, 'warning');
        }
      }
    } catch (error) {
      log(`${SYMBOLS.info} 文件头注释检查跳过`, 'dim');
    }
  }

  addResult(category, name, passed, message = '', type = 'normal') {
    const result = { category, name, passed, message, type };
    if (passed || type === 'info') {
      this.results.passed.push(result);
    } else if (type === 'warning') {
      this.results.warnings.push(result);
    } else {
      this.results.failed.push(result);
    }
  }

  generateReport() {
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(2);

    header('📊 检测报告');

    subHeader('📈 统计信息');
    log(`${SYMBOLS.success} 通过: ${this.results.passed.length}`, 'green');
    log(`${SYMBOLS.warning} 警告: ${this.results.warnings.length}`, 'yellow');
    log(`${SYMBOLS.error} 失败: ${this.results.failed.length}`, 'red');
    log(`${SYMBOLS.info} 总耗时: ${duration}s`, 'cyan');

    if (this.results.warnings.length > 0) {
      subHeader('⚠️ 警告详情');
      for (const warning of this.results.warnings) {
        log(`${SYMBOLS.warning} [${warning.category}] ${warning.name}`, 'yellow');
        if (warning.message) {
          log(`  ${warning.message}`, 'dim');
        }
      }
    }

    if (this.results.failed.length > 0) {
      subHeader('❌ 失败详情');
      for (const failure of this.results.failed) {
        log(`${SYMBOLS.error} [${failure.category}] ${failure.name}`, 'red');
        if (failure.message) {
          log(`  ${failure.message}`, 'dim');
        }
      }
    }

    header('🎯 最终结果');

    if (this.results.failed.length === 0) {
      log(`\n${SYMBOLS.success} 所有检测通过！可以安全推送到远程仓库。`, 'green');
      log('\n' + '╔══════════════════════════════════════════════════════════╗', 'cyan');
      log('║              符合 YYC³ 五高五标五化标准                    ║', 'cyan');
      log('╚══════════════════════════════════════════════════════════╝', 'cyan');
      process.exit(0);
    } else {
      log(`\n${SYMBOLS.error} 检测失败！请修复上述问题后再推送。`, 'red');
      log(`\n💡 提示: 使用 --fast 跳过性能检查`, 'yellow');
      log(`💡 提示: 使用 --skip-tests 跳过测试检查`, 'yellow');
      log(`💡 提示: 使用 --skip-coverage 跳过覆盖率检查`, 'yellow');
      log(`💡 提示: 使用 --skip-e2e 跳过 E2E 测试`, 'yellow');
      process.exit(1);
    }
  }
}

const checker = new SmartPrePushChecker();
checker.run();
