#!/usr/bin/env node

/**
 * YYC³ Design System — 自动版本管理脚本
 * @description 自动更新版本号、生成 CHANGELOG、创建 Git tag
 * @author YYC³
 * @version 1.0.0
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const SEMVER_REGEX = /^(major|minor|patch|premajor|preminor|prepatch|prerelease)$/;

function getCurrentVersion() {
  const packageJson = JSON.parse(readFileSync(join(process.cwd(), 'package.json'), 'utf-8'));
  return packageJson.version;
}

function getCommitType(commitMessage) {
  if (/^feat(\(.+\))?!?:/.test(commitMessage) || /^feat!:/.test(commitMessage)) {
    return 'minor';
  }
  if (/^fix(\(.+\))?!?:/.test(commitMessage) || /^fix!:/.test(commitMessage)) {
    return 'patch';
  }
  if (/^BREAKING CHANGE/.test(commitMessage)) {
    return 'major';
  }
  return 'patch';
}

function bumpVersion(bumpType) {
  const [major, minor, patch, prerelease] = getCurrentVersion().split(/[.-]/);
  
  switch (bumpType) {
    case 'major':
      return `${parseInt(major) + 1}.0.0`;
    case 'minor':
      return `${major}.${parseInt(minor) + 1}.0`;
    case 'patch':
      return `${major}.${minor}.${parseInt(patch) + 1}`;
    case 'prerelease':
      const nextPrerelease = prerelease ? parseInt(prerelease.replace('alpha.', '')) + 1 : 1;
      return `${major}.${minor}.${parseInt(patch) + 1}-alpha.${nextPrerelease}`;
    default:
      return getCurrentVersion();
  }
}

function getChangelogContent(newVersion) {
  const date = new Date().toISOString().split('T')[0];
  const commitLog = execSync('git log --oneline --no-merges HEAD ^$(git describe --tags --abbrev=0 2>/dev/null || echo "4b982ee")', { encoding: 'utf-8' });
  
  const changes = {
    feat: [],
    fix: [],
    docs: [],
    style: [],
    refactor: [],
    test: [],
    chore: [],
    other: []
  };
  
  commitLog.split('\n').filter(Boolean).forEach(commit => {
    const match = commit.match(/^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?!?:\s*(.+)/);
    if (match) {
      changes[match[1]].push(commit);
    } else {
      changes.other.push(commit);
    }
  });
  
  let changelog = `## [${newVersion}] - ${date}\n\n`;
  
  if (changes.feat.length > 0) {
    changelog += '### 🎉 Features\n\n';
    changes.feat.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  if (changes.fix.length > 0) {
    changelog += '### 🐛 Bug Fixes\n\n';
    changes.fix.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  if (changes.docs.length > 0) {
    changelog += '### 📚 Documentation\n\n';
    changes.docs.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  if (changes.refactor.length > 0) {
    changelog += '### ♻️ Code Refactoring\n\n';
    changes.refactor.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  if (changes.test.length > 0) {
    changelog += '### ✅ Tests\n\n';
    changes.test.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  if (changes.other.length > 0) {
    changelog += '### 📝 Other Changes\n\n';
    changes.other.forEach(commit => {
      changelog += `- ${commit}\n`;
    });
    changelog += '\n';
  }
  
  return changelog;
}

function updateChangelog(newVersion) {
  const changelogPath = join(process.cwd(), 'CHANGELOG.md');
  let existingChangelog = '';
  
  try {
    existingChangelog = readFileSync(changelogPath, 'utf-8');
  } catch (e) {
    console.log('Creating new CHANGELOG.md');
  }
  
  const newChangelog = getChangelogContent(newVersion);
  const updatedChangelog = newChangelog + '\n' + existingChangelog;
  
  writeFileSync(changelogPath, updatedChangelog);
  console.log('✅ CHANGELOG.md updated');
}

function createGitTag(version) {
  try {
    execSync(`git tag -a v${version} -m "Release v${version}"`, { stdio: 'inherit' });
    console.log(`✅ Git tag v${version} created`);
  } catch (e) {
    console.error('❌ Failed to create git tag:', e.message);
    process.exit(1);
  }
}

function pushToGit(version) {
  try {
    console.log('Pushing to Git remote...');
    execSync('git push', { stdio: 'inherit' });
    execSync(`git push origin v${version}`, { stdio: 'inherit' });
    console.log('✅ Git push successful');
  } catch (e) {
    console.error('❌ Failed to push to Git:', e.message);
    process.exit(1);
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  let bumpType = args[0] || 'auto';
  
  if (bumpType === 'auto') {
    const lastCommit = execSync('git log -1 --pretty=%B', { encoding: 'utf-8' });
    bumpType = getCommitType(lastCommit);
  }
  
  if (!SEMAPVER_REGEX.test(bumpType)) {
    console.error(`Invalid bump type: ${bumpType}`);
    console.error('Valid types: major, minor, patch, premajor, preminor, prepatch, prerelease, auto');
    process.exit(1);
  }
  
  const currentVersion = getCurrentVersion();
  const newVersion = bumpVersion(bumpType);
  
  console.log(`\n📦 YYC³ Design System — 版本更新\n`);
  console.log(`当前版本：${currentVersion}`);
  console.log(`新版本：${newVersion}`);
  console.log(`更新类型：${bumpType}\n`);
  
  // 更新 package.json
  execSync(`npm version ${newVersion} --no-git-tag-version`, { stdio: 'inherit' });
  
  // 更新 CHANGELOG
  updateChangelog(newVersion);
  
  // 提交更改
  execSync('git add package.json CHANGELOG.md', { stdio: 'inherit' });
  execSync(`git commit -m "chore: release v${newVersion}"`, { stdio: 'inherit' });
  
  // 创建 Git tag
  createGitTag(newVersion);
  
  // 推送到远程
  pushToGit(newVersion);
  
  console.log(`\n🎉 版本 ${newVersion} 发布成功！\n`);
  console.log(`查看 CHANGELOG: https://github.com/YYC-Cube/YYC3-Design-System/blob/main/CHANGELOG.md`);
  console.log(`查看 Release: https://github.com/YYC-Cube/YYC3-Design-System/releases/tag/v${newVersion}\n`);
}

main();
