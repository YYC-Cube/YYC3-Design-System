const fs = require('fs');
const path = require('path');
const culori = require('culori');

const TOKENS_PATH = path.resolve(__dirname, '../design/tokens.json');
const OUT_DIR = path.resolve(__dirname, '../reports');
const TOP_N = parseInt(process.env.TOP_N || '5', 10);

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

function oklchStringToHex(oklchString) {
  try {
    const parsed = culori.parse(oklchString);
    if (!parsed) return { hex: null, parsed: null };
    const srgb = culori.converter('srgb')(parsed);
    const hex = culori.formatHex(srgb);
    return { hex, parsed: srgb };
  } catch (e) {
    return { hex: null, parsed: null, error: e.message };
  }
}

function extractColorTokens(obj, prefix = '') {
  const results = [];
  if (typeof obj !== 'object' || obj === null) return results;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'string') {
      if (val.trim().toLowerCase().startsWith('oklch(') || /^#([0-9a-f]{3,8})$/i.test(val)) {
        results.push({ path: pathKey, value: val });
      }
    } else if (typeof val === 'object' && val !== null) {
      if (val.oklch || val.okLch || val.hex) {
        results.push({ path: pathKey, value: val });
      } else {
        results.push(...extractColorTokens(val, pathKey));
      }
    }
  }
  return results;
}

function classifyFailure(item) {
  const { path, value } = item;
  let reason = 'unknown';
  let score = 0;
  if (typeof value === 'object') {
    if (!value.hex && !(value.oklch || value.okLch)) {
      reason = 'missing_hex';
      score = 100;
      return { reason, score };
    }
    if (value.oklch || value.okLch) {
      const ok = value.oklch || value.okLch;
      const conv = oklchStringToHex(ok);
      if (conv.error || !conv.hex) {
        reason = 'parse_error';
        score = 80;
        return { reason, score };
      }
      const srgb = conv.parsed;
      if (srgb && ([srgb.r, srgb.g, srgb.b].some(c => c < 0 || c > 1))) {
        reason = 'out_of_gamut';
        score = 60;
        return { reason, score };
      }
    }
  } else if (typeof value === 'string') {
    const s = value.trim();
    if (s.toLowerCase().startsWith('oklch(')) {
      const conv = oklchStringToHex(s);
      if (conv.error || !conv.hex) {
        reason = 'parse_error';
        score = 80;
        return { reason, score };
      }
      const srgb = conv.parsed;
      if (srgb && ([srgb.r, srgb.g, srgb.b].some(c => c < 0 || c > 1))) {
        reason = 'out_of_gamut';
        score = 60;
        return { reason, score };
      }
    } else if (s.startsWith('#')) {
      return null;
    } else {
      reason = 'unknown_format';
      score = 50;
      return { reason, score };
    }
  }
  return null;
}

function normalizeHex(hex) {
  if (!hex) return null;
  return hex.toLowerCase();
}

function run() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`tokens.json not found at ${TOKENS_PATH}`);
    process.exit(2);
  }
  const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
  const tokens = JSON.parse(raw);

  const colorTokens = extractColorTokens(tokens);
  const results = [];
  const failures = [];
  const warnings = [];

  for (const t of colorTokens) {
    const v = t.value;
    let hex = null;
    let source = null;
    let parsed = null;
    let parseError = null;

    if (typeof v === 'string') {
      source = v;
      if (v.trim().toLowerCase().startsWith('oklch(')) {
        const conv = oklchStringToHex(v);
        hex = conv.hex;
        parsed = conv.parsed;
        parseError = conv.error || null;
      } else if (v.trim().startsWith('#')) {
        hex = v;
      }
    } else if (typeof v === 'object') {
      source = JSON.stringify(v);
      if (v.hex) hex = v.hex;
      else if (v.oklch || v.okLch) {
        const conv = oklchStringToHex(v.oklch || v.okLch);
        hex = conv.hex;
        parsed = conv.parsed;
        parseError = conv.error || null;
      } else {
        for (const k of Object.keys(v)) {
          const val = v[k];
          if (typeof val === 'string' && val.trim().toLowerCase().startsWith('oklch(')) {
            const conv = oklchStringToHex(val);
            hex = conv.hex;
            parsed = conv.parsed;
            parseError = conv.error || null;
            break;
          }
        }
      }
    }

    const normalized = normalizeHex(hex);
    const item = { path: t.path, source, hex: normalized };
    results.push(item);

    if (parsed) {
      const outOfRange = [parsed.r, parsed.g, parsed.b].some(c => c < 0 || c > 1);
      if (outOfRange) {
        warnings.push({ path: t.path, note: 'converted_color_out_of_srgb_gamut' });
      }
    }

    if (!normalized) {
      const classification = classifyFailure(t);
      const reason = classification ? classification.reason : (parseError ? 'parse_error' : 'missing_hex');
      const priorityScore = classification ? classification.score : 50;
      failures.push({ path: t.path, source, reason, priorityScore });
    }
  }

  failures.sort((a, b) => b.priorityScore - a.priorityScore);

  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      total: results.length,
      failures: failures.length,
      warnings: warnings.length
    },
    results,
    failures,
    warnings
  };

  fs.writeFileSync(path.join(OUT_DIR, 'oklch-report.json'), JSON.stringify(report, null, 2), 'utf8');

  const mdLines = [];
  mdLines.push('# OKLCH -> HEX 转换报告');
  mdLines.push(`**生成时间**: ${report.generatedAt}`);
  mdLines.push(`- 总色值: ${report.summary.total}`);
  mdLines.push(`- 失败: ${report.summary.failures}`);
  mdLines.push(`- 警告: ${report.summary.warnings}`);
  mdLines.push('');
  mdLines.push('---');
  
  if (failures.length > 0) {
    mdLines.push(`## 失败摘要 (按优先级排序，显示 Top ${TOP_N})`);
    const top = failures.slice(0, TOP_N);
    top.forEach((f, i) => {
      mdLines.push(`${i + 1}. **${f.path}**`);
      mdLines.push(`   - 原始值: \`${f.source}\``);
      mdLines.push(`   - 原因: **${f.reason}**`);
      mdLines.push(`   - 优先级分数: ${f.priorityScore}`);
    });
    mdLines.push('');
  } else {
    mdLines.push('## ✅ 所有颜色 token 转换成功 (无失败)');
  }

  if (warnings.length > 0) {
    mdLines.push('---');
    mdLines.push('## 警告 (可能超出 sRGB 色域)');
    warnings.slice(0, TOP_N).forEach(w => {
      mdLines.push(`- **${w.path}**: ${w.note}`);
    });
    mdLines.push('');
  }

  mdLines.push('---');
  mdLines.push('## 修复建议 (示例模板)');
  mdLines.push('当出现 `missing_hex` 或 `parse_error` 时，请按以下步骤修复：');
  mdLines.push('');
  mdLines.push('1. 在 `design/tokens.json` 对应 token 下补充 `hex` 字段：');
  mdLines.push('```json');
  mdLines.push('{');
  mdLines.push('  "color": {');
  mdLines.push('    "example": {');
  mdLines.push('      "oklch": "oklch(0.6209 0.1801 348.1385)",');
  mdLines.push('      "hex": "#d45a5f"');
  mdLines.push('    }');
  mdLines.push('  }');
  mdLines.push('}');
  mdLines.push('```');
  mdLines.push('');
  mdLines.push('2. 若 OKLCH 字符串格式不规范，确保格式为 `oklch(L C H)` 或 `oklch(L C H / a)`，例如：`oklch(0.6209 0.1801 348.1385)`。');
  mdLines.push('3. 若颜色超出 sRGB 色域 (out_of_gamut)，请在设计工具中选择可映射到 sRGB 的近似颜色并补充 `hex`。');
  mdLines.push('4. 提交修改后，CI 会自动重新运行并在 PR 中更新报告。');

  fs.writeFileSync(path.join(OUT_DIR, 'oklch-report.md'), mdLines.join('\n'), 'utf8');

  if (failures.length > 0) {
    console.error(`OKLCH report generated with ${failures.length} failures. See reports/oklch-report.json`);
    process.exit(1);
  } else {
    console.log(`OKLCH report generated. ${results.length} items, ${warnings.length} warnings.`);
    process.exit(0);
  }
}

if (require.main === module) {
  run();
}

module.exports = { run };
