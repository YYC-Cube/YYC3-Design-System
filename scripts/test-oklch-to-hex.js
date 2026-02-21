const fs = require('fs');
const path = require('path');
const culori = require('culori');

const TOKENS_PATH = path.resolve(__dirname, '../design/tokens.json');

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
  const failures = [];
  const results = [];

  for (const t of colorTokens) {
    const v = t.value;
    let expectedHex = null;
    let source = null;

    if (typeof v === 'string') {
      source = v;
      if (v.trim().toLowerCase().startsWith('oklch(')) {
        expectedHex = oklchStringToHex(v);
      } else if (v.trim().startsWith('#')) {
        expectedHex = v;
      }
    } else if (typeof v === 'object') {
      source = JSON.stringify(v);
      if (v.hex) expectedHex = v.hex;
      else if (v.oklch || v.okLch) {
        expectedHex = oklchStringToHex(v.oklch || v.okLch);
      } else {
        for (const k of Object.keys(v)) {
          if (typeof v[k] === 'string' && v[k].trim().toLowerCase().startsWith('oklch(')) {
            expectedHex = oklchStringToHex(v[k]);
            break;
          }
        }
      }
    }

    const normalized = normalizeHex(expectedHex);
    results.push({ path: t.path, source, hex: normalized });

    if (!normalized) {
      failures.push({ path: t.path, source, reason: 'conversion_failed_or_missing_hex' });
    }
  }

  console.log('OKLCH to HEX conversion results:');
  results.forEach(r => {
    console.log(`- ${r.path}: ${r.hex || '<<FAILED>>'}  source: ${r.source}`);
  });

  if (failures.length > 0) {
    console.error('\nConversion failures:');
    failures.forEach(f => {
      console.error(`- ${f.path}: ${f.reason}  source: ${f.source}`);
    });
    process.exit(1);
  } else {
    console.log('\nAll color tokens converted successfully.');
    process.exit(0);
  }
}

if (require.main === module) run();
