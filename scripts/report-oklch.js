const fs = require('fs');
const path = require('path');
const culori = require('culori');

const TOKENS_PATH = path.resolve(__dirname, '../design/tokens.json');
const REPORTS_DIR = path.resolve(__dirname, '../reports');

function oklchStringToHex(oklchString) {
  try {
    const parsed = culori.parse(oklchString);
    if (!parsed) return null;
    const srgb = culori.converter('srgb')(parsed);
    const hex = culori.formatHex(srgb);
    return hex;
  } catch (e) {
    return null;
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

function generateReport() {
  if (!fs.existsSync(TOKENS_PATH)) {
    console.error(`tokens.json not found at ${TOKENS_PATH}`);
    process.exit(2);
  }

  const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
  const tokens = JSON.parse(raw);
  const colorTokens = extractColorTokens(tokens);

  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: colorTokens.length,
      successful: 0,
      failed: 0
    },
    results: []
  };

  for (const t of colorTokens) {
    const v = t.value;
    let result = {
      path: t.path,
      source: typeof v === 'string' ? v : JSON.stringify(v),
      hex: null,
      status: 'success'
    };

    if (typeof v === 'string') {
      if (v.trim().toLowerCase().startsWith('oklch(')) {
        result.hex = oklchStringToHex(v);
        if (!result.hex) {
          result.status = 'failed';
          result.error = 'conversion_failed';
        }
      } else if (v.trim().startsWith('#')) {
        result.hex = v;
      }
    } else if (typeof v === 'object') {
      if (v.hex) {
        result.hex = v.hex;
      } else if (v.oklch || v.okLch) {
        result.hex = oklchStringToHex(v.oklch || v.okLch);
        if (!result.hex) {
          result.status = 'failed';
          result.error = 'conversion_failed';
        }
      }
    }

    if (result.status === 'success') {
      report.summary.successful++;
    } else {
      report.summary.failed++;
    }

    report.results.push(result);
  }

  return report;
}

function main() {
  if (!fs.existsSync(REPORTS_DIR)) {
    fs.mkdirSync(REPORTS_DIR, { recursive: true });
  }

  const report = generateReport();
  const reportPath = path.join(REPORTS_DIR, 'oklch-report.json');

  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`OKLCH report generated: ${reportPath}`);
  console.log(`Total: ${report.summary.total}, Successful: ${report.summary.successful}, Failed: ${report.summary.failed}`);

  if (report.summary.failed > 0) {
    console.error('\nFailed conversions:');
    report.results.filter(r => r.status === 'failed').forEach(r => {
      console.error(`- ${r.path}: ${r.error}`);
    });
    process.exit(1);
  }

  process.exit(0);
}

if (require.main === module) {
  main();
}

module.exports = { generateReport };
