const fs = require('fs');
const path = require('path');
const culori = require('culori');

global.culori = culori;

const TOKENS_PATH = path.resolve(__dirname, '../design/tokens.json');

function oklchStringToHex(oklchString) {
  const parsed = culori.parse(oklchString);
  if (!parsed) return null;
  const srgb = culori.converter('srgb')(parsed);
  return culori.formatHex(srgb);
}

function findColorTokens(obj, prefix = '') {
  const results = [];
  if (typeof obj !== 'object' || obj === null) return results;
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    const pathKey = prefix ? `${prefix}.${key}` : key;
    if (typeof val === 'string') {
      if (val.trim().toLowerCase().startsWith('oklch(') || val.trim().startsWith('#')) {
        results.push({ path: pathKey, value: val });
      }
    } else if (typeof val === 'object') {
      if (val.hex || val.oklch || val.okLch) {
        results.push({ path: pathKey, value: val });
      } else {
        results.push(...findColorTokens(val, pathKey));
      }
    }
  }
  return results;
}

describe('OKLCH to HEX conversion', () => {
  let tokens;
  beforeAll(() => {
    const raw = fs.readFileSync(TOKENS_PATH, 'utf8');
    tokens = JSON.parse(raw);
  });

  const colorTokens = findColorTokens(tokens);

  test('tokens.json should contain color tokens', () => {
    expect(colorTokens.length).toBeGreaterThan(0);
  });

  colorTokens.forEach(ct => {
    test(`convert ${ct.path}`, () => {
      const v = ct.value;
      if (typeof v === 'string') {
        if (v.trim().toLowerCase().startsWith('oklch(')) {
          const hex = oklchStringToHex(v);
          expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
        } else if (v.trim().startsWith('#')) {
          expect(v).toMatch(/^#[0-9a-f]{6,8}$/i);
        }
      } else if (typeof v === 'object') {
        if (v.hex) {
          expect(v.hex).toMatch(/^#[0-9a-f]{6,8}$/i);
        } else if (v.oklch || v.okLch) {
          const hex = oklchStringToHex(v.oklch || v.okLch);
          expect(hex).toMatch(/^#[0-9a-f]{6}$/i);
        } else {
          const nested = Object.values(v).find(val => typeof val === 'string' && (val.startsWith('#') || val.toLowerCase().startsWith('oklch(')));
          expect(nested).toBeDefined();
        }
      }
    });
  });
});
